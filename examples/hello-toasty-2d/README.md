# Hello Toasty 2D Example

A simple example demonstrating the basic usage of Toasty Engine for 2D game development. This example shows how to create a basic 2D application with a moving sprite using WebGPU.

## What it demonstrates

- Setting up a basic Toasty Engine 2D application
- Loading and displaying textures
- Creating and manipulating sprites
- Basic game loop with update and render logic
- Simple sprite movement with edge detection

## Features

- A bouncing Toasty logo sprite that moves horizontally across the screen
- Automatic direction reversal when hitting screen boundaries
- Smooth WebGPU-accelerated rendering

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun dev
```

3. Open your browser and navigate to the local development server (usually `http://localhost:5173`)

## How it Works

The example demonstrates these key concepts:

1. **Application Setup**: Creates a 2D WebGPU context using `createApplication2d`
2. **Asset Loading**: Loads the Toasty logo texture
3. **Sprite Creation**: Creates a sprite with initial position and velocity
4. **Game Loop**: Implements basic update and render logic:
   - Update: Moves the sprite and handles boundary collisions
   - Render: Draws the sprite to the screen

## Code Structure

- `src/main.ts`: Main application code
- `src/style.css`: Basic styling for fullscreen canvas
- `index.html`: HTML template with canvas element

## Requirements

- A WebGPU-capable browser
- Bun or Node.js installed

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.
