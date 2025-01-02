# @toasty-engine/engine
    
<!-- automd:badges color="yellow" name="@toasty-engine/engine" license codecov no-npmDownloads -->
<!-- /automd -->

The main engine package for the Toasty game engine. This package provides a high-level, easy-to-use API for creating 2D WebGPU games, integrating all the core Toasty engine features into a simple, unified interface.

## Features

- 🎮 Simple, high-level API for 2D game development
- 🎨 WebGPU-powered rendering with automatic setup
- 📸 Built-in camera system with scaling and movement
- ⏱️ Frame-rate independent timing and game loop
- 🖼️ Efficient texture loading and caching
- 🎯 Sprite-based rendering with batching
- 🎨 Flexible background color support via CSS colors
- ⚡ Hardware-accelerated rendering
- 🛠️ Zero configuration required

## Why should I use this?

Creating a WebGPU game from scratch requires managing many complex systems:

- Setting up WebGPU context and device
- Implementing a game loop with proper timing
- Managing camera transformations and projections
- Handling texture loading and caching
- Coordinating sprite rendering and batching
- Implementing frame-rate independent updates

This package handles all of this complexity for you, reducing what would be hundreds of lines of setup code into a few simple method calls:

```typescript
// Raw WebGPU: 200+ lines of setup code
// With @toasty-engine/engine:
const context = await createApplication2d({
  canvas
});
context.start();
```

## Installation

```sh
bun add @toasty-engine/engine
```

## Usage

```typescript
import { createApplication2d } from '@toasty-engine/engine';
import { vec2_add } from '@toasty-engine/math';

// Get your canvas element
const canvas = document.querySelector('canvas');

// Create your game application
const context = await createApplication2d({
  canvas,
  // Optional: Set background color (any CSS color)
  backgroundColor: '#336699',
  // Optional: Set initial camera position
  cameraPosition: { x: 42, y: 42 },
  // Optional: Set initial camera scale
  cameraScale: { x: 4, y: 4 },
});

// Load a texture
const texture = await context.loadTexture('assets/player.png');

// Create a sprite
const playerSprite = {
    ...context.createSprite(texture, {
    x: 100,
    y: 100,
  }),
  velocity: { x: 10, y: 0 },
};

// Camera controls
context.setCameraScale({ x: 2, y: 2 }); // Zoom in
context.moveCameraAnchorTo({ x: 50, y: 50 }); // Move camera
context.translateCamera({ x: 10, y: 0 }); // Pan camera

// Provide your custom update logic
context.provideUpdateLogic(() => {
  // Update your game logic here
  const {x, y} = vec2_add(playerSprite, playerSprite.velocity);
  playerSprite.x = x;
  playerSprite.y = y;

  if (playerSprite.x > 300 || playerSprite.x < 0) {
      playerSprite.velocity.x = -playerSprite.velocity.x;
    }
});

// Provide your custom render logic
context.provideRenderLogic(() => [playerSprite]);

// Start the game
context.start();
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
