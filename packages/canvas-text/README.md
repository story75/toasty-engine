# @toasty-engine/canvas-text
    
<!-- automd:badges color="yellow" name="@toasty-engine/canvas-text" license codecov no-npmDownloads -->
<!-- /automd -->

A utility package for creating textures from text in game development. This package provides tools for rendering text to canvas elements, which can then be used as textures in games.

## Features

- 📝 Create textures from text with custom fonts
- 📏 Automatic canvas sizing based on text dimensions
- 🎨 High-quality text rendering with proper baseline alignment
- 🎮 WebGPU-compatible canvas output
- 🛠️ Simple and intuitive API

## Why should I use this?

When developing games, text rendering is crucial for:
- Creating dynamic UI elements and labels
- Rendering game text with custom fonts
- Generating text-based textures on the fly
- Ensuring crisp, high-quality text display

This package provides a streamlined solution for text rendering in games, handling the complexities of canvas text rendering and sizing for optimal display quality.

## Installation

```sh
bun add @toasty-engine/canvas-text
```

## Usage

```typescript
import { createTextureFromText } from '@toasty-engine/canvas-text';

// Create a canvas with rendered text
const canvas = createTextureFromText('Game Over', 'Arial', 32);

// The returned canvas can be used to create a WebGPU texture
// or used directly in your rendering code

// You can also provide your own canvas
const existingCanvas = document.createElement('canvas');
const customCanvas = createTextureFromText('Score: 100', 'Arial', 16, existingCanvas);
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
