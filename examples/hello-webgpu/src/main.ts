/// <reference types="@webgpu/types" />
import './style.css';

const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found');
}
const context = canvas.getContext('webgpu');
if (!context) {
  throw new Error('WebGPU context not found');
}

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error('Could not request WebGPU adapter!');
}

const device = await adapter.requestDevice();

const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({
  device,
  format: presentationFormat,
  alphaMode: 'premultiplied',
});

const devicePixelRatio = window.devicePixelRatio;
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;

const render = () => {
  const shaderModule = device.createShaderModule({
    code: `
      @vertex
      fn vs_main(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4f {
        const pos = array(
          vec2(-0.5, -0.5), vec2(0.5, -0.5), vec2(-0.5, 0.5),
          vec2(-0.5, 0.5), vec2(0.5, -0.5), vec2(0.5, 0.5),
        );
      
        return vec4f(pos[vertex_index], 0.0, 1.0);
      }

      @fragment
      fn fs_main() -> @location(0) vec4f {
        return vec4f(1.0, 0.0, 0.0, 1.0);
      }
    `,
  });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [],
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
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: 'triangle-list',
    },
  });

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
  };

  const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
  renderPass.setPipeline(pipeline);
  renderPass.draw(6);
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
};

render();
