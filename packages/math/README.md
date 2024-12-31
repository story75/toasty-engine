# @toasty-engine/math
    
<!-- automd:badges color="yellow" name="@toasty-engine/math" license codecov no-npmDownloads -->
<!-- /automd -->

A utility package for game mathematics and calculations. This package provides essential mathematical operations and utilities commonly used in game development, with a focus on performance and ease of use.

## Features

- 📐 Vector operations (Vec2, Vec3) for 2D and 3D calculations
- 🔢 Matrix operations (Mat4) for transformations
- 🎲 Random number generation utilities
- 📊 Mathematical functions (lerp, clamp, decay)
- ⚡ Optimized for performance
- 🎮 TypeScript-first design
- 🛠️ Simple and intuitive API

## Why should I use this?

When developing games, efficient mathematical operations are crucial for:
- Handling game physics and movement
- Calculating positions and transformations
- Implementing smooth animations and transitions
- Managing game state and calculations
- Generating random values for game mechanics

This package provides a streamlined solution for game mathematics, offering optimized implementations of common mathematical operations used in game development.

## Installation

```sh
bun add @toasty-engine/math
```

## Usage

### Vector Operations

```typescript
import { vec2_add, vec2_multiply, vec3_cross, vec3_normalize } from '@toasty-engine/math';

// 2D Vector operations
const position = { x: 10, y: 20 };
const velocity = { x: 1, y: 1 };
const newPosition = vec2_add(position, velocity);

// 3D Vector operations
const direction = { x: 1, y: 0, z: 0 };
const up = { x: 0, y: 1, z: 0 };
const right = vec3_cross(direction, up);
const normalizedDir = vec3_normalize(direction);
```

### Matrix Operations

```typescript
import { mat4_identity, mat4_translate, mat4_scale, mat4_orthographic } from '@toasty-engine/math';

// Create and manipulate 4x4 matrices
const matrix = mat4_identity();
const translated = mat4_translate(matrix, { x: 0, y: 1, z: 0 });
const transformed = mat4_scale(translated, { x: 2, y: 2, z: 2 });

// Create an orthographic projection
const projection = mat4_orthographic(0, context.canvas.width, context.canvas.height, 0, -1, 1);
```

### Random Number Generation

```typescript
import { random, randomInRange } from '@toasty-engine/math';

// Create a seeded random number generator
const rng = random("my-seed");

// Generate random numbers between 0 and 1
const value1 = rng(); // 0.197884141234681
const value2 = rng(); // 0.2134937138762325

// Generate random integers in a specific range
const diceRoll = randomInRange(rng, 1, 6); // Random integer between 1 and 6
const damage = randomInRange(rng, 10, 20); // Random integer between 10 and 20
```

### Utility Functions

```typescript
import { lerp, clamp, decay } from '@toasty-engine/math';

// Interpolate between values
const smoothValue = lerp(0, 100, 0.5); // 50

// Clamp values within range
const health = clamp(150, 0, 100); // 100

// Calculate decay over time
const volume = decay(100, 200, 0.1, 1); // Exponential decay
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
