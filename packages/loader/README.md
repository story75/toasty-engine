# @toasty-engine/loader
    
<!-- automd:badges color="yellow" name="@toasty-engine/loader" license codecov no-npmDownloads -->
<!-- /automd -->

A utility package for loading assets in game development. This package provides simple tools for loading textures and fonts for use in WebGPU games.

## Features

- 🖼️ Load textures from URLs or ImageBitmapSource
- 🔤 Load and register custom fonts
- ⚡ Asynchronous loading with Promise-based API
- 🎮 WebGPU-ready ImageBitmap output
- 🛠️ Simple and intuitive API

## Why should I use this?

When developing games, proper asset loading is crucial for:
- Loading textures for sprites and backgrounds
- Adding custom fonts for UI and text elements
- Handling asynchronous asset loading efficiently
- Preparing assets in WebGPU-compatible formats

This package provides a streamlined solution for asset loading in games, handling the complexities of loading and preparing assets for use in WebGPU applications.

## Installation

```sh
bun add @toasty-engine/loader
```

## Usage

### Loading Textures

```typescript
import { loadTexture } from '@toasty-engine/loader';

// Load a texture from a URL
const texture = await loadTexture('path/to/texture.png');

// Or load from an existing ImageBitmapSource
const customTexture = await loadTexture(existingImageSource);

// The returned ImageBitmap can be used to create a WebGPU texture
// Use the texture in your WebGPU rendering code
```

### Loading Custom Fonts

```typescript
import { loadFont } from '@toasty-engine/loader';

// Load and register a custom font
const font = await loadFont('MyGameFont', 'path/to/font.ttf');

// The font is now available in your CSS and Canvas operations
// Use it in your styles
element.style.fontFamily = 'MyGameFont';

// Or in Canvas context
context.font = '16px MyGameFont';
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
