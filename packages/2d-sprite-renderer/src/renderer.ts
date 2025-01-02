import { uniformBufferAllocator } from '@toasty-engine/gpu-buffer';
import shader from './shader.wgsl';
import type { Sprite } from './sprite';

export type SpriteRendererOptions = {
  /**
   * The GPU device to use for creating the sprite renderer.
   */
  device: GPUDevice;

  /**
   * The WebGPU context
   */
  context: GPUCanvasContext;

  /**
   * The configured format of the canvas
   */
  presentationFormat: GPUTextureFormat;

  /**
   * The projection view matrix to use for rendering the sprites
   */
  projectionViewMatrixUniformBuffer: GPUBuffer;

  /**
   * The maximum number of sprites that can be rendered in a single draw call.
   */
  maximumSpriteCount?: number;

  /**
   * The clear value to use for the render pass.
   */
  clearValue?: GPUColor;
};

/**
 * A function that can be used to render sprites
 */
export type RenderSprites = (sprites: Sprite[]) => void;

/**
 * Create a 2D sprite renderer
 *
 * @remarks
 * This function is purposefully designed to be as simple as possible, without any fancy features.
 * It should render sprites as fast as possible, without any overhead.
 *
 * @param options - The options for the sprite renderer
 */
export function create2dSpriteRenderer(options: SpriteRendererOptions): RenderSprites {
  const {
    device,
    context,
    presentationFormat,
    projectionViewMatrixUniformBuffer,
    maximumSpriteCount = 10000,
    clearValue = { r: 0.13, g: 0.13, b: 0.13, a: 1.0 },
  } = options;

  const uniformBufferAlloc = uniformBufferAllocator(device);

  // 12 floats per sprite: x, y, width, height, textureFrame x, y, width, height, z, padding, padding, padding
  // Beware of padding when adding new fields to the sprite struct
  const instanceStorageBuffer = device.createBuffer({
    size: maximumSpriteCount * 12 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const writeInstanceBuffer = (sprites: Sprite[]) => {
    device.queue.writeBuffer(
      instanceStorageBuffer,
      0,
      new Float32Array(
        sprites.flatMap((sprite) => [
          sprite.x,
          sprite.y,
          sprite.width,
          sprite.height,
          sprite.textureFrame.x,
          sprite.textureFrame.y,
          sprite.textureFrame.width,
          sprite.textureFrame.height,
          sprite.z,
          0, // padding
          0, // padding
          0, // padding
        ]),
      ),
    );
  };

  // Use a nearest filter for "pixel" sprites, other textures may require a linear filter like text or other images
  const sampler = device.createSampler({
    magFilter: 'nearest',
    minFilter: 'nearest',
  });

  // Create shader module with vertex and fragment shaders
  // The vertex shader handles sprite positioning and UV mapping
  // The fragment shader handles texture sampling and transparency
  const shaderModule = device.createShaderModule({
    code: shader,
  });

  const depthTexture = device.createTexture({
    size: {
      width: context.canvas.width,
      height: context.canvas.height,
    },
    format: 'depth24plus-stencil8',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const textureDimensions = new Float32Array([0, 0]);
  const textureDimensionsUniformBuffer = uniformBufferAlloc(textureDimensions);
  device.queue.writeBuffer(textureDimensionsUniformBuffer, 0, textureDimensions);

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
      {
        binding: 2,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: 'uniform',
        },
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
      depthCompare: 'greater',
    },
  });

  return (sprites: Sprite[]): void => {
    const batches = new Map<GPUTexture, Sprite[]>();

    for (const sprite of sprites) {
      const texture = sprite.texture;
      const batch = batches.get(texture) ?? [];
      batch.push(sprite);
      batches.set(texture, batch);
    }

    const commandEncoder = device.createCommandEncoder();
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
        depthClearValue: 0.0,
        stencilClearValue: 0.0,
        stencilLoadOp: 'clear',
        stencilStoreOp: 'store',
      },
    };

    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

    for (const [texture, batch] of batches) {
      writeInstanceBuffer(batch);

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
          {
            binding: 2,
            resource: {
              buffer: textureDimensionsUniformBuffer,
            },
          },
        ],
      });

      textureDimensions[0] = texture.width;
      textureDimensions[1] = texture.height;
      device.queue.writeBuffer(textureDimensionsUniformBuffer, 0, textureDimensions);

      renderPass.setPipeline(pipeline);
      renderPass.setBindGroup(0, projectionViewMatrixBindGroup);
      renderPass.setBindGroup(1, textureBindGroup);
      renderPass.setBindGroup(2, instanceStorageBufferBindGroup);
      renderPass.draw(6, batch.length);
    }

    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
  };
}
