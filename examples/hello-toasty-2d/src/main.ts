import './style.css';
import { createApplication2d } from '@toasty-engine/engine';
import { vec2_add } from '@toasty-engine/math';

// Initialize WebGPU context and verify browser support
const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found');
}

// Create your game application
const context = await createApplication2d({
  canvas,
});

// Load a texture
const texture = await context.loadTexture('/toasty-logo.png');

// Create a sprite
const playerSprite = {
  ...context.createSprite(texture, {
    y: 100,
  }),
  velocity: { x: 5, y: 0 },
};

// Provide your custom update logic
context.provideUpdateLogic(() => {
  // Move roughly 5 pixels per frame and reverse direction when hitting the edge
  const { x, y } = vec2_add(playerSprite, playerSprite.velocity);
  playerSprite.x = x;
  playerSprite.y = y;

  if (playerSprite.x >= canvas.width - playerSprite.width || playerSprite.x <= 0) {
    playerSprite.velocity.x = -playerSprite.velocity.x;
  }
});

// Provide your custom render logic
context.provideRenderLogic(() => [playerSprite]);

// Start the game
context.start();
