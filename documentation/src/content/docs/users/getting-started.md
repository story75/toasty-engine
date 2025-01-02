---
title: Getting started
---

This guide will walk you through the initial steps of using the game engine. It's designed to help you quickly understand how to set up and start building your own games.

Please note that this project is still under active development. As such, certain features, APIs, and workflows may change significantly between releases until the engine reaches a stable version. I appreciate your patience and feedback as I continue to improve the engine.

With that said, let's get started!

## Project Setup

While a dedicated Toasty CLI is in development, I recommend using [Vite](https://vitejs.dev/) to create and run your projects. Here's how to get started:

1. Create a new Vite project with TypeScript:
```bash
bun create vite@latest my-toasty-game -- --template typescript
```

2. Navigate to your project directory and install dependencies:
```bash
cd my-toasty-game
bun install
```

3. Install the Toasty Engine:
```bash
bun add @toasty-engine/engine
```

4. Start the development server:
```bash
bun run dev
```

You can also use any other build tool you're comfortable with e.g. esbuild.

## Installation

To install the engine in an existing project, you can use the following command:

```bash
bun add @toasty-engine/engine
```

## Usage

### Creating a Basic 2D Application

First, create a new index.html file with a canvas element:

:::note
If you use Vite the index.html and main.ts files are already created for you. They will look a little different, but you can just replace the contents with the following code or adapt it to your needs.
:::

```html title="index.html" ins={8-19,23}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First Toasty Game</title>
    <style>
       html,
       body {
          margin: 0;
          padding: 0;
          width: 100dvw;
          height: 100dvh;
          overflow: hidden;
       }

       * {
          box-sizing: border-box;
       }
    </style>
  </head>
  <body>
    <canvas></canvas>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Then create your main application file (`src/main.ts`):

```typescript title="src/main.ts" ins="createApplication2d" ins="context.provideRenderLogic" ins="context.provideUpdateLogic" ins="context.start"
import { createApplication2d } from '@toasty-engine/engine';

// Get the canvas element
const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found');
}

// Create your game application
const context = await createApplication2d({
  canvas,
  backgroundColor: 'rebeccapurple', // Optional: Set a background color
});

// Load a texture
const texture = await context.loadTexture('/path/to/your/texture.png');

// Create a sprite
const sprite = context.createSprite(texture, {
  x: 100, // Position the sprite at x=100
  y: 100, // Position the sprite at y=100
});

// Provide your game update logic
context.provideUpdateLogic(() => {
  // This function runs every frame before rendering
  // Update your game state here
});

// Provide your render logic
context.provideRenderLogic(() => {
  // Return an array of sprites to render
  return [sprite];
});

// Start the game loop
context.start();
```

### Key Concepts

1. **Application Context**: The `createApplication2d` function creates a new 2D WebGPU context with the following features:
   - Texture loading and management
   - Sprite creation and rendering
   - Camera controls
   - Game loop with update and render hooks

2. **Textures**: Load textures using `context.loadTexture()`. The function is memoized for URLs, meaning the same texture won't be loaded twice if requested with the same URL.

3. **Sprites**: Create sprites from textures using `context.createSprite()`. Sprites are the basic building blocks for 2D graphics.

4. **Game Loop**: The engine provides two main hooks for your game logic:
   - `provideUpdateLogic`: Called every frame before rendering, use it for game state updates
   - `provideRenderLogic`: Called every frame after updates, returns the sprites to render

### Next Steps

Now that you have a basic application running, you might want to:

1. Add movement to your sprites
2. Handle user input (not yet implemented)
3. Add collision detection (not yet implemented)
4. Create animations (not yet implemented)
5. Add sound effects and music (not yet implemented)

Check out the examples directory in the repository for more advanced usage examples.

