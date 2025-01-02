import {
  type Sprite,
  create2dSpriteRenderer,
  createSprite,
} from '@toasty-engine/2d-sprite-renderer';
import { configureCanvas } from '@toasty-engine/canvas-context';
import { textureAllocator, uniformBufferAllocator } from '@toasty-engine/gpu-buffer';
import { loadTexture } from '@toasty-engine/loader';
import {
  type Mat4Like,
  type Vec2Like,
  type Vec3Like,
  mat4_orthographic,
  mat4_scale,
  mat4_translate,
} from '@toasty-engine/math';
import { Time } from '@toasty-engine/timer';
import { default as Color, type ColorTypes } from 'colorjs.io';
import { colorToShader } from './color-to-shader';
import { memoize } from './memoize';
/**
 * Options for creating a 2D application
 */
export type Application2dOptions = {
  /**
   * The canvas to use for the application
   */
  canvas: HTMLCanvasElement;

  /**
   * The background color of the application
   *
   * @remarks
   * The value can be any valid css color string or in general what colorjs.io supports.
   *
   * @default 'rebeccapurple'
   *
   * @see https://colorjs.io/docs/spaces
   */
  backgroundColor?: ColorTypes;

  /**
   * The initial camera scale
   */
  cameraScale?: Vec2Like;

  /**
   * The initial camera position
   */
  cameraPosition?: Vec2Like;
};

/**
 * The 2D application context
 */
export type Application2dContext = {
  /**
   * Loads a texture from the given path or ImageBitmapSource
   *
   * @remarks
   * This function will return a texture that can be used to create a sprite
   * This function is memoized for string paths, so that the same texture will be returned for the same path
   *
   * @param pathOrImageSource - The path to the texture or an ImageBitmapSource
   * @returns The texture
   */
  loadTexture: (pathOrImageSource: Parameters<typeof loadTexture>[0]) => Promise<GPUTexture>;

  /**
   * Creates a sprite
   *
   * @param texture - The texture to use for the sprite
   * @param options - The options for the sprite
   * @returns The sprite
   */
  createSprite: typeof createSprite;

  /**
   * Sets the camera scale
   *
   * @remarks
   * You can use this to zoom in and out on the scene.
   * Usually you want to set the same value for x and y,
   * but you can also set different values to skew the scene for special effects.
   *
   * @param scale - The scale to set
   */
  setCameraScale: (scale: Vec2Like) => void;

  /**
   * Moves the camera anchor to the given position
   *
   * @remarks
   * The camera is anchored to the top left corner of the canvas.
   * This function will move the camera anchor to the given position.
   *
   * @privateRemarks
   * Internally the values will be negated, so that the camera will move in the opposite direction, to reach the given position.
   *
   * @param position - The position to move the camera anchor to
   */
  moveCameraAnchorTo: (position: Vec2Like) => void;

  /**
   * Translates the camera by the given vector
   *
   * @remarks
   * This will move the camera by the given vector.
   *
   * @privateRemarks
   * Internally the values will be negated, so that the camera will move in the opposite direction, to reach the given position.
   *
   * @param vector - The vector to translate the camera by
   */
  translateCamera: (vector: Vec2Like) => void;

  /**
   * The time object
   */
  time: Time;

  /**
   * Start the application loop.
   *
   * @remarks
   * Call this function once you are ready to start the game loop.
   * Do any setup like loading textures and creating sprites before calling this function.
   *
   * If you do not call this function, the application will not start and do nothing.
   */
  start: () => void;

  /**
   * Provide your custom update logic.
   *
   * @remarks
   * The update function will be called every frame before it is drawn.
   *
   * Use it to update your sprites and game logic.
   */
  provideUpdateLogic: (update: () => void) => void;

  /**
   * Provide your custom render logic.
   *
   * @remarks
   * The render function will be called every frame after the update function.
   * Use it to do any late updates before the sprites are drawn.
   *
   * @returns The sprites to draw
   */
  provideRenderLogic: (render: () => Sprite[]) => void;
};

/**
 * Creates a new 2D application
 *
 * @remarks
 * This function will create a Toasty application optimized for 2D games.
 *
 * @param options - The options for creating the application
 * @returns The application context
 */
export async function createApplication2d(
  options: Application2dOptions,
): Promise<Application2dContext> {
  const { device, context, presentationFormat } = await configureCanvas(options.canvas, {
    hdr: true,
  });
  const textureAlloc = textureAllocator(device);

  const backgroundColor = new Color(options.backgroundColor ?? 'rebeccapurple');
  const clearValue = colorToShader(backgroundColor);

  const scale: Vec3Like = { x: 1, y: 1, z: 1 };
  if (options.cameraScale) {
    scale.x = options.cameraScale.x;
    scale.y = options.cameraScale.y;
  }

  const translation: Vec3Like = { x: 0, y: 0, z: 0 };
  if (options.cameraPosition) {
    translation.x = -options.cameraPosition.x;
    translation.y = -options.cameraPosition.y;
  }

  const createProjectionViewMatrix = (input?: Mat4Like) => {
    const matrix = mat4_orthographic(
      0,
      context.canvas.width,
      context.canvas.height,
      0,
      100,
      -100,
      input,
    );
    mat4_scale(matrix, scale, matrix);
    mat4_translate(matrix, translation, matrix);
    return matrix;
  };

  const projectionViewMatrix = createProjectionViewMatrix();
  const projectionViewMatrixUniformBuffer = uniformBufferAllocator(device)(projectionViewMatrix);
  device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);

  const spriteRenderer = create2dSpriteRenderer({
    device,
    context,
    presentationFormat,
    projectionViewMatrixUniformBuffer,
    clearValue,
  });

  const time = new Time();

  // Initialize the update and render hooks to noop functions
  let updateHook: () => void = () => {};
  let renderHook: () => Sprite[] = () => [];

  // We could opt to create a loop function that omits the noop update hook,
  // but for such simple games without any logic, it's not a big deal and thus not necessary
  const loop = (now: number) => {
    time.update(now);
    updateHook();
    spriteRenderer(renderHook());
    requestAnimationFrame(loop);
  };

  return {
    loadTexture: async (value) => {
      const loadAndAlloc = async (value: Parameters<typeof loadTexture>[0]) => {
        const imageBitmap = await loadTexture(value);
        return textureAlloc(imageBitmap);
      };

      const memoized = memoize(loadAndAlloc);

      if (typeof value === 'string') {
        return memoized(value);
      }

      return loadAndAlloc(value);
    },
    createSprite,
    setCameraScale: (newScale) => {
      scale.x = newScale.x;
      scale.y = newScale.y;
      createProjectionViewMatrix(projectionViewMatrix);
      device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);
    },
    moveCameraAnchorTo: (newPosition) => {
      translation.x = -newPosition.x;
      translation.y = -newPosition.y;
      createProjectionViewMatrix(projectionViewMatrix);
      device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);
    },
    translateCamera: (newTranslation) => {
      translation.x -= newTranslation.x;
      translation.y -= newTranslation.y;
      createProjectionViewMatrix(projectionViewMatrix);
      device.queue.writeBuffer(projectionViewMatrixUniformBuffer, 0, projectionViewMatrix);
    },
    time,
    provideUpdateLogic: (update) => {
      updateHook = update;
    },
    provideRenderLogic: (render) => {
      renderHook = render;
    },
    start: () => {
      const now = performance.now();
      // Preemptively update the time object to avoid a huge delta spike on the first frame
      time.update(now);
      // Request animation frame will automatically call the function with the current time,
      // but we also need it for the first iteration to avoid calling it inside the loop again
      loop(now);
    },
  };
}
