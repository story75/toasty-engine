# @toasty-engine/canvas-context
    
<!-- automd:badges color="yellow" name="@toasty-engine/canvas-context" license codecov no-npmDownloads -->
<!-- /automd -->

A utility package to setup up a canvas for WebGPU rendering.

## Features

- 🎨 Easy canvas setup for WebGPU rendering
- 📏 Automatic canvas sizing
- 🖥️ High DPI display support
- 🎮 WebGPU context configuration
- 🛠️ Simple and intuitive API
- 🌈 Optional HDR support

## Why should I use this?

When developing WebGPU games, proper canvas setup is crucial for:
- Creating a properly sized and configured canvas
- Handling high DPI displays and device pixel ratios
- Setting up WebGPU context with appropriate configuration
- Managing HDR color spaces and tone mapping

This package provides a streamlined solution for canvas setup in WebGPU games, handling the complexities of canvas configuration and management.

## Installation

```sh
bun add @toasty-engine/canvas-context
```

## Usage

```typescript
import { configureCanvas } from '@toasty-engine/canvas-context';

// Configure a canvas for WebGPU rendering with default options
// By default, the canvas will be sized to the window dimensions
const canvas = document.createElement('canvas');
const { context, device, presentationFormat, supportsHDR } = await configureCanvas(canvas);

// The canvas is now ready for WebGPU rendering with:
// - context: GPUCanvasContext for rendering
// - device: GPUDevice for creating resources
// - presentationFormat: The configured GPUTextureFormat
// - supportsHDR: Whether the device supports HDR

// You can also provide custom configuration
const customConfig = await configureCanvas(canvas, {
  // Custom dimensions (defaults to window size)
  width: 800,
  height: 600,
  // Enable HDR color space and tone mapping
  hdr: true
});
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
