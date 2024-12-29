# @toasty-engine/gpu-buffer
    
<!-- automd:badges color="yellow" name="@toasty-engine/gpu-buffer" license codecov no-npmDownloads -->

[![npm version](https://img.shields.io/npm/v/@toasty-engine/gpu-buffer?color=yellow)](https://npmjs.com/package/@toasty-engine/gpu-buffer)
[![codecov](https://img.shields.io/codecov/c/gh/story75/toasty-engine?color=yellow)](https://codecov.io/gh/story75/toasty-engine)
[![license](https://img.shields.io/github/license/story75/toasty-engine?color=yellow)](https://github.com/story75/toasty-engine/blob/main/LICENSE)

<!-- /automd -->

A utility package for creating and managing WebGPU buffers with TypeScript. This package provides a set of helper functions to simplify buffer creation in WebGPU applications.

## Features

- 🚀 Type-safe buffer creation and management via `@webgpu/types`
- 💾 Support for various buffer types (vertex, index, uniform, storage, texture)

## Why should I use this?

The creation of buffers is a common task in WebGPU applications, but the parameters are often the same except for minor differences. 
This package provides a set of helpers to make this process easier and more consistent, especially the texture buffer creation.

## Installation

```sh
bun add @toasty-engine/gpu-buffer
```

## Usage

```typescript
import { indexBufferAllocator, vertexBufferAllocator, storageBufferAllocator, uniformBufferAllocator, textureAllocator } from '@toasty-engine/gpu-buffer';

// Create a device in your application

const vertexBufferAlloc = vertexBufferAllocator(device);
const indexBufferAlloc = indexBufferAllocator(device);
const storageBufferAlloc = storageBufferAllocator(device);
const uniformBufferAlloc = uniformBufferAllocator(device);
const textureAlloc = textureAllocator(device);

// e.g. create indices and vertex buffers for a batch of 2d sprites
const INDICES_PER_SPRITE = 6;
const FLOATS_PER_SPRITE = 12;
const MAX_SPRITES_PER_BATCH = 1000;

const indices = new Uint16Array(MAX_SPRITES_PER_BATCH * INDICES_PER_SPRITE);
const indexBuffer = indexBufferAlloc(indices);

const vertexBuffers = [
  vertexBufferAlloc(new Float32Array(MAX_SPRITES_PER_BATCH * FLOATS_PER_SPRITE)),
];

// sometime later, when you want to update the buffers
// assume you have a batch with vertices to update
const vertexBuffer = vertexBuffers[0];
device.queue.writeBuffer(vertexBuffer, 0, batch.vertices);

// storage buffers and uniform buffers are handled in a similar way

// for texture buffers we need texture data first
// assume you fetched some texture data from a server
const response = await fetch('https://example.com/texture.png');
const blob = await response.blob();
const imageBitmap = await createImageBitmap(blob);

// now you can create a texture buffer
const textureBuffer = textureAlloc(imageBitmap);
```


## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->

Made by [@story75](https://github.com/story75) and [community](https://github.com/story75/toasty-engine/graphs/contributors) 💛
<br><br>
<a href="https://github.com/story75/toasty-engine/graphs/contributors">
<img src="https://contrib.rocks/image?repo=story75/toasty-engine" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
