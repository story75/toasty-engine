# @toasty-engine/2d-sprite-renderer
    
<!-- automd:badges color="yellow" name="@toasty-engine/2d-sprite-renderer" license codecov no-npmDownloads -->
<!-- /automd -->

A high-performance WebGPU-based 2D sprite rendering system for web games.

## Features

- 🚀 Optimized batch rendering for sprites
- 🎯 WebGPU-powered rendering pipeline
- 🖼️ Flexible sprite transformation
- 🎨 Support for transparency and blending
- ⚡ Hardware-accelerated rendering
- 🛠️ Simple and intuitive API
- 🔄 Dynamic sprite updates

## Why should I use this?

Implementing sprite rendering directly with WebGPU requires extensive boilerplate and deep graphics knowledge:

- Setting up vertex and index buffers for each sprite
- Managing complex shader pipelines and bind groups
- Implementing sprite batching and draw call optimization
- Handling GPU memory allocation and deallocation
- Writing and maintaining WGSL shaders
- Managing texture uploads and coordinates
- Implementing sprite transformation matrices

This package handles all of this complexity for you, reducing what would be hundreds of lines of WebGPU code into a few simple method calls:

```typescript
// Raw WebGPU: 100+ lines of setup code for pipelines, buffers, and shaders
// With @toasty-engine/2d-sprite-renderer:
const renderSprites = create2dSpriteRenderer({
  device,
  context,
  presentationFormat,
  projectionViewMatrixUniformBuffer
});

const sprite = createSprite(texture, {
  x: 100,
  y: 100,
  width: 32,
  height: 32
});

renderSprites([sprite]);
```

You get:
- Automatic sprite batching for optimal performance
- Pre-optimized WGSL shaders
- Efficient GPU memory management
- Simple sprite transformation API
- Zero-copy updates when possible
- WebGPU best practices out of the box

Focus on building your game, not on graphics programming complexities.

## Installation

```sh
bun add @toasty-engine/2d-sprite-renderer
```

## Usage

```typescript
import { create2dSpriteRenderer, createSprite } from '@toasty-engine/2d-sprite-renderer';

// First, set up your WebGPU context and device
// CAUTION: This is a simplified example. In a real game, you should use a more sophisticated setup.
// e.g. use @toasty-engine/canvas-context to setup a canvas for WebGPU rendering
const canvas = document.querySelector('canvas');
const context = canvas.getContext('webgpu');
const device = await navigator.gpu.requestAdapter().then(adapter => adapter.requestDevice());
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

// Create a projection matrix uniform buffer (required for 2D rendering)
const projectionViewMatrixUniformBuffer = device.createBuffer({
  size: 16 * Float32Array.BYTES_PER_ELEMENT,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
// Create a projection matrix e.g. via @toasty-engine/math you can also use another library like wgpu-matrix
const projectionViewMatrix = mat4_orthographic(
  0,
  context.canvas.width,
  context.canvas.height,
  0,
  100,
  -100,
);
device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);

// Create the sprite renderer
// This will return a function to acctually render the sprites
const renderSprites = create2dSpriteRenderer({
  device,
  context,
  presentationFormat,
  projectionViewMatrixUniformBuffer,
  // Optional: configure maximum sprites per batch
  maximumSpriteCount: 10000,
  // Optional: set clear color
  clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 }
});

// Use createSprite to create and object with all fields needed for rendering (the recommended way)
// Create a sprite from a texture with all optional fields
const sprite1 = createSprite(texture, {
  x: 100,           // Position from top-left
  y: 100,
  width: 32,        // Width on screen, optional
  height: 32,       // Height on screen, optional
  z: 0.5,          // Optional: z-depth for layering
  textureFrame: {   // Optional: use part of the texture e.g. for tilesets
    x: 0,
    y: 0,
    width: 16,
    height: 16
  }
});

// Create a sprite from a texture with default values
const sprite2 = createSprite(texture, {
  x: 200,
  y: 200,
});

// Create a sprite from a texture with a texture frame, width and height will be taken from the texture frame
const sprite3 = createSprite(texture, {
  x: 0,
  y: 0,
  textureFrame: {
    x: 0,
    y: 0,
    width: 16,
    height: 16
  }
});

// You can also use plain objects with x, y, width, height, z, textureFrame, etc as long as they implement the Sprite type
// You should only do this if you have a very good reason, e.g. you are using a library that already provides some of these fields
const sprite4: Sprite = {
  x: 0,
  y: 0,
  width: 16,
  height: 16,
  z: 0.001, // IMPORTANT: this must be a number greater than 0, otherwise the sprite will not be rendered due to the depth buffer
  textureFrame: {
    x: 0,
    y: 0,
    width: 16,
    height: 16
  }
};

// In your render loop
function render() {
  // Render multiple sprites in a single batch
  renderSprites([sprite1, sprite2, sprite3]);
}
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
