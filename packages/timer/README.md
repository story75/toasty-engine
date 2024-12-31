# @toasty-engine/timer
    
<!-- automd:badges color="yellow" name="@toasty-engine/timer" license codecov no-npmDownloads -->
<!-- /automd -->

A utility package for managing time and timers in game development. This package provides robust tools for frame-rate independent timing, FPS tracking, and event scheduling.

## Features

- ⏱️ Frame-rate independent timing with delta time calculations
- 🎮 Game-specific Timer class for events, animations, and cooldowns
- 📊 FPS tracking with smoothing for stable display
- ⚡ High-performance time management optimized for games
- 🔄 Support for repeating and one-shot timers
- ⏲️ Utility functions for time-based operations

## Why should I use this?

When developing games that target specific frame rates (e.g., 60 FPS), proper time management is crucial for:
- Ensuring smooth animations regardless of frame rate fluctuations
- Maintaining consistent game speed across different devices
- Accurately timing game events and cooldowns
- Monitoring performance through FPS tracking

This package provides a complete solution for time management in games, handling edge cases and providing a simple API for common timing needs.

## Installation

```sh
bun add @toasty-engine/timer
```

## Usage

### Basic Time Management

```typescript
import { Time } from '@toasty-engine/timer';

// Create a time manager (optionally configure FPS smoothing factor)
const time = new Time(0.9); // 0.9 = more smooth, 0.1 = more reactive

function gameLoop(now: number) {
  // Update timing metrics
  const deltaTime = time.update(now);
  
  // Access timing information
  console.log(time.framesPerSecond);        // Current FPS
  console.log(time.framesPerSecondSmoothed); // Smoothed FPS for display
  console.log(time.frameTimeInMilliseconds); // Raw frame time
  
  // Use deltaTime for frame-rate independent movement
  player.x += speed * deltaTime; // Consistent speed regardless of FPS
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

### Using Timers for Events

```typescript
import { Timer } from '@toasty-engine/timer';

// Create a 2-second timer (at 60 FPS)
const cooldownTimer = Timer.fromSeconds(2);

// Or create a timer with specific ticks
const attackTimer = new Timer(30); // 30 ticks (0.5 seconds at 60 FPS)

// Create a repeating timer for spawning enemies
const spawnTimer = new Timer(120, true); // Repeats every 120 ticks

function gameLoop(now: number) {
  // Update timers with delta time
  cooldownTimer.update(deltaTime);
  attackTimer.update(deltaTime);
  spawnTimer.update(deltaTime);
  
  // Check timer states
  if (cooldownTimer.isFinished()) {
    enableAbility();
  }
  
  // Perfect for repeating events
  if (spawnTimer.hasJustFinished()) {
    spawnEnemy(); // Called exactly when timer completes
  }
  
  requestAnimationFrame(gameLoop);
}
```

### Utility Functions

```typescript
import { waitForMilliseconds } from '@toasty-engine/timer';

async function gameSequence() {
  showIntro();
  await waitForMilliseconds(1000); // Wait for 1 second
  startGame();
}
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
