/// <reference types="@webgpu/types" />
import './style.css';
import { mat4 } from 'wgpu-matrix';

// Initialize WebGPU context and verify browser support
const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found');
}
const context = canvas.getContext('webgpu');
if (!context) {
  throw new Error('WebGPU context not found');
}

// Request GPU adapter and device - this represents the physical GPU and its capabilities
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error('Could not request WebGPU adapter!');
}

const device = await adapter.requestDevice();

// Configure the canvas format and alpha blending mode for proper transparency handling
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({
  device,
  format: presentationFormat,
  alphaMode: 'premultiplied',
});

// CAUTION: this is not the whole story, because for devices with a high dpi, the canvas size will be larger than the window size
// for those cases you have to shrink the canvas back down to the window size to achieve the correct scaling
// so e.g. if the pixel ratio is 2, you have to set the canvas to width=window.innerWidth * 2 and height=window.innerHeight * 2
// while simultaneously setting the canvas size to width={window.innerWidth}px and height={window.innerHeight}px to achieve the required pixel density
const devicePixelRatio = window.devicePixelRatio;
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;

// Load and create texture from image
const response = await fetch('/toasty-logo.png');
const blob = await response.blob();
const imageBitmap = await createImageBitmap(blob);

// Create texture with specific format and usage flags:
// - TEXTURE_BINDING: allows the texture to be bound to a shader
// - COPY_DST: allows copying data into the texture
// - RENDER_ATTACHMENT: allows the texture to be used as a render target
const texture = device.createTexture({
  size: [imageBitmap.width, imageBitmap.height, 1],
  format: 'rgba8unorm',
  usage:
    GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
});

device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, [
  imageBitmap.width,
  imageBitmap.height,
]);

// This example assumes that all sprites use the same texture
// Depending on your use case you may either create batches in JS according to the requested texture and issue multiple draw calls
// or you may upload all textures into a atlas to avoid re-binding the texture for each sprite at the cost of a larger buffer
//
// VERY IMPORTANT: since we are using exactly 4 floats we do not have to add any padding,
// if the amount of floats per sprite changes, we may need to add padding to the buffer depending on the new layout
const sprites = [
  {
    position: [0, 0],
    size: [100, 100],
    xVelocity: 2,
  },
  {
    position: [200, 200],
    size: [100, 100],
    xVelocity: -5,
  },
];

// We use a fixed size here which matches the amount of sprites, but in a real world scenario you would preallocate a buffer with a larger size
// that can accomodate more sprites. Resizing the buffer is expensive, so it is best to define a maximum amount of sprites you will ever need
// and just pay the cost of the unused space instead of constantly resizing the buffer
const instanceStorageBuffer = device.createBuffer({
  size: sprites.length * 4 * Float32Array.BYTES_PER_ELEMENT,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});

// Helper function to update sprite data in the GPU buffer
// Only transfers position and size data, velocity is handled in JS
const writeInstanceBuffer = () => {
  // not all data is written to the buffer, always keep in mind what you need the gpu to know and what is just for your JS game logic
  device.queue.writeBuffer(
    instanceStorageBuffer,
    0,
    new Float32Array(
      sprites.flatMap((sprite) => [
        sprite.position[0],
        sprite.position[1],
        sprite.size[0],
        sprite.size[1],
      ]),
    ),
  );
};
writeInstanceBuffer();

// Use a nearest filter for "pixel" sprites, other textures may require a linear filter like text or other images
const sampler = device.createSampler({
  magFilter: 'nearest',
  minFilter: 'nearest',
});

// Create shader module with vertex and fragment shaders
// The vertex shader handles sprite positioning and UV mapping
// The fragment shader handles texture sampling and transparency
// The shader is inlined to make the vite setup work without any modifications
// Normally you should change your config to import wgsl files as strings
const shaderModule = device.createShaderModule({
  code: `
    // Define the structure for sprite instance data passed from CPU to GPU
    struct Instance {
        position: vec2f,
        size: vec2f,
    }

    // Define the vertex shader output structure that will be passed to the fragment shader
    struct VertexOutput {
        @builtin(position) position: vec4f,
        @location(0) uv: vec2f,
    }

    // Bind groups define how shader resources are organized and accessed
    // Bind group 0: Camera and view matrices
    @group(0) @binding(0)
    var<uniform> projection_view_matrix: mat4x4f;

    // Bind group 1: Texture resources
    @group(1) @binding(0)
    var texture_sampler: sampler;
    @group(1) @binding(1)
    var texture: texture_2d<f32>;

    // Bind group 2: Instance data
    @group(2) @binding(0)
    var<storage, read> instances: array<Instance>;

      @vertex
      fn vs_main(@builtin(vertex_index) vertex_index: u32, @builtin(instance_index) instance_index: u32) -> VertexOutput {
        // Because we know we are only ever going to draw quads,
        // we can hardcode some data into the shader like the indices, uvs and positions without explicitly passing them in
        // this saves a lot of bandwidth for big batches of sprites
      const indices = array(0, 1, 2, 2, 3, 0);
      
        var index = indices[vertex_index];
        var instance = instances[instance_index];
      
        // Here we assume that we use screen coordiniates, otherwise we need other maps for clipspace or different world coordinate systems
        var positions = array(
          vec2f(instance.position[0], instance.position[1]), // top left
          vec2f(instance.position[0], instance.position[1] + instance.size[1]), // bottom left
          vec2f(instance.position[0] + instance.size[0], instance.position[1] + instance.size[1]), // bottom right
          vec2f(instance.position[0] + instance.size[0], instance.position[1]), // top right
        );

        // The uvs are static in this example, but it makes sense to have them in the shader
        // because calculation rotations will be faster here than in JS land
        const uv = array(
          vec2f(0, 0), // top left
          vec2f(0, 1), // bottom left
          vec2f(1, 1), // bottom right
          vec2f(1, 0), // top right
        );

        var output: VertexOutput;
        output.position = projection_view_matrix * vec4f(positions[index], 0.0, 1.0);
        output.uv = uv[index];
        return output;
      }

      @fragment
      fn fs_main(input: VertexOutput) -> @location(0) vec4f {
        var texture_color = textureSample(texture, texture_sampler, input.uv);

        // If you want tinting, this would be done here before the discard
        // because tints may change the alpha value to be even lower than the alpha of the texture at the current pixel

        // If the sprite is transparent, we discard it
        // this avoids pixels which write to the depth buffer and occlude other sprites
        if (texture_color.a < 0.01) {
          discard;
        }

        return texture_color;
      }
    `,
});

// Altho not necessary for this example, it is a good practice to use a depth texture
// because it simplifies drawing sprites in front of each other, without explicitly sorting everytime and drawing back to front
const depthTexture = device.createTexture({
  size: {
    width: context.canvas.width,
    height: context.canvas.height,
  },
  format: 'depth24plus-stencil8',
  usage: GPUTextureUsage.RENDER_ATTACHMENT,
});

// Since we just want to convert screen space directly to clip space, we can just use the orthographic projection matrix without a lookAt matrix
const projectionViewMatrix = mat4.ortho(0, context.canvas.width, context.canvas.height, 0, -1, 1);
const projectionViewMatrixUniformBuffer = device.createBuffer({
  size: projectionViewMatrix.byteLength,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);

const projectionViewMatrixLayout = device.createBindGroupLayout({
  entries: [
    {
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'uniform',
      },
    },
  ],
});

const projectionViewMatrixBindGroup = device.createBindGroup({
  layout: projectionViewMatrixLayout,
  entries: [
    {
      binding: 0,
      resource: {
        buffer: projectionViewMatrixUniformBuffer,
      },
    },
  ],
});

const textureBindGroupLayout = device.createBindGroupLayout({
  entries: [
    {
      binding: 0,
      visibility: GPUShaderStage.FRAGMENT,
      sampler: {},
    },
    {
      binding: 1,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {},
    },
  ],
});

const textureBindGroup = device.createBindGroup({
  layout: textureBindGroupLayout,
  entries: [
    {
      binding: 0,
      resource: sampler,
    },
    {
      binding: 1,
      resource: texture.createView(),
    },
  ],
});

const instanceStorageBufferLayout = device.createBindGroupLayout({
  entries: [
    {
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'read-only-storage',
      },
    },
  ],
});

const instanceStorageBufferBindGroup = device.createBindGroup({
  layout: instanceStorageBufferLayout,
  entries: [
    {
      binding: 0,
      resource: {
        buffer: instanceStorageBuffer,
      },
    },
  ],
});

const pipelineLayout = device.createPipelineLayout({
  bindGroupLayouts: [
    projectionViewMatrixLayout,
    textureBindGroupLayout,
    instanceStorageBufferLayout,
  ],
});

const pipeline = device.createRenderPipeline({
  layout: pipelineLayout,
  vertex: {
    module: shaderModule,
    entryPoint: 'vs_main',
  },
  fragment: {
    module: shaderModule,
    entryPoint: 'fs_main',
    targets: [
      {
        format: presentationFormat,
        blend: {
          color: {
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
          },
          alpha: {
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
          },
        },
      },
    ],
  },
  primitive: {
    topology: 'triangle-list',
    cullMode: 'back',
  },
  depthStencil: {
    format: 'depth24plus-stencil8',
    depthWriteEnabled: true,
    depthCompare: 'less',
  },
});

let lastFrameTime = performance.now();
const targetFrameRate = 0.06;

const render = (now: number) => {
  const frameTime = now - lastFrameTime;
  const deltaTime = frameTime * targetFrameRate;
  lastFrameTime = now;

  for (const sprite of sprites) {
    sprite.position[0] += sprite.xVelocity * deltaTime;

    if (sprite.position[0] > context.canvas.width - sprite.size[0] || sprite.position[0] < 0) {
      sprite.xVelocity = -sprite.xVelocity;
    }
  }
  writeInstanceBuffer();

  // Since we only ever pass the exact same data to the gpu, we can also use a render bundle to speed up the rendering process even more
  // but this is outside of the scope of this example
  const commandEncoder = device.createCommandEncoder();
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.8, g: 0.8, b: 0.8, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
      depthClearValue: 1.0,
      stencilClearValue: 1.0,
      stencilLoadOp: 'clear',
      stencilStoreOp: 'store',
    },
  };

  const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
  renderPass.setPipeline(pipeline);
  renderPass.setBindGroup(0, projectionViewMatrixBindGroup);
  renderPass.setBindGroup(1, textureBindGroup);
  renderPass.setBindGroup(2, instanceStorageBufferBindGroup);
  renderPass.draw(6, sprites.length);
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);

  requestAnimationFrame(render);
};

// Request animation frame will automatically call the function with the current time,
// but we also need it for the first iteration to avoid calling it inside the loop again
render(performance.now());
