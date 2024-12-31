# @toasty-engine/timer
    
<!-- automd:badges color="yellow" name="@toasty-engine/timer" license codecov no-npmDownloads -->
<!-- /automd -->

A utility package for managing timers in game development. This package provides a set of helper functions to simplify time management.

## Features

- 🕒 Timer class for managing time in game development
- 🚀 Timing function agnostic, works with any rendering loop

## Why should I use this?

When working with games that render at 60 fps in a browser, you need to manage time to ensure that animations and game logic run smoothly.
To do this you have to account for lag and frame rate drops. This package provides a simple way to manage time in your game,
so you can just multiply your game logic by the delta time to ensure smooth animations.

You can also use the timer to wait for a certain amount of time to pass in-game ticks or real time.
This is especially useful when orchestrating game events or waiting for animations to finish.

## Installation

```sh
bun add @toasty-engine/timer
```

## Usage

```typescript
import { Timer, waitForMilliseconds } from '@toasty-engine/timer';

// Create a global timer for all your timing needs
const timer = new Timer();
// You can also create a separate timer for game logic if you want to separate game logic from rendering
// For example if you have a menu that pauses the game, but menu animations should still run
const gameTimer = new Timer();
// You can also change the "speedFactor" to offer options like "gameSpeed" to allow the player to speed up or slow down the game
gameTimer.speedFactor = 2; // game runs at double speed

// If you want to track fps over time to display it in a graph
const fpsOverTime = [];

const loop = (now: number) => {
  const deltaTime = timer.update(now);
  const gameDeltaTime = gameTimer.update(now);
  // or read delta time directly from timer
  // const deltaTime = timer.deltaTime;
    
  // or read other timer values
  const fps = timer.framesPerSecondSmoothed; // if you want to just display a single number use the smoothed value
  fpsOverTime.push(timer.framesPerSecond); // if you want to track fps over time use the exact value
    
  // Your game logic here
  // e.g. sprite.x += 10 * deltaTime; // move sprite roughly 10 pixels per frame
  requestAnimationFrame(loop);
};
loop();

// You may have other logic somewhere that is bound by real time that you have to wait for
await waitForMilliseconds(1000); // wait for 1 second

// Or you may somewhere have to wait for a certain amount of in-game ticks to have passed
await gameTimer.waitForTicks(60); // wait for 60 ticks to have passed, this may be more than 60 update calls if the game is lagging or running with less speed
```

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
