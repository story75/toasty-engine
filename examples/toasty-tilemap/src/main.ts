/// <reference types="@webgpu/types" />
import './style.css';
import { textureAllocator, uniformBufferAllocator } from '@toasty-engine/gpu-buffer';
import { loadTexture } from '@toasty-engine/loader';
import { mat4_orthographic, mat4_scale } from '@toasty-engine/math';
import { Time } from '@toasty-engine/timer';
import { type Sprite, createSprite } from './2d-sprite-renderer/2d-sprite';
import { create2dSpriteRenderer } from './2d-sprite-renderer/2d-sprite-renderer';
import { configureCanvas } from './canvas-context/configure-canvas';
import mapJson from './map.json';

// Initialize WebGPU context and verify browser support
const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found');
}
const { device, context, presentationFormat } = await configureCanvas(canvas);

const textureAlloc = textureAllocator(device);

// Load and create texture from image
const imageBitmap = await loadTexture('/0x72_DungeonTilesetII_v1.7.png');
const texture = textureAlloc(imageBitmap);

const tiles = new Map(Object.entries(mapJson.tiles));
const map = mapJson.layers;

const sprites: Sprite[] = [];
let z = 0;
for (const layer of map) {
  for (const tile of layer) {
    sprites.push(
      createSprite(texture, {
        x: tile.x,
        y: tile.y,
        z,
        textureFrame: tiles.get(tile.tile.toString()),
      }),
    );
  }
  z += 1;
}

const projectionViewMatrix = mat4_orthographic(
  0,
  context.canvas.width,
  context.canvas.height,
  0,
  100,
  -100,
);
mat4_scale(projectionViewMatrix, { x: 4, y: 4, z: 1 }, projectionViewMatrix);
const projectionViewMatrixUniformBuffer = uniformBufferAllocator(device)(projectionViewMatrix);
device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);

const renderSprites = create2dSpriteRenderer({
  device,
  context,
  presentationFormat,
  projectionViewMatrixUniformBuffer,
  clearValue: { r: 0.13, g: 0.13, b: 0.13, a: 1.0 },
});

const time = new Time();

const render = (now: number) => {
  time.update(now);
  renderSprites(sprites);
  requestAnimationFrame(render);
};

// Request animation frame will automatically call the function with the current time,
// but we also need it for the first iteration to avoid calling it inside the loop again
render(performance.now());
