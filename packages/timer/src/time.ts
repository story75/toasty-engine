import { TARGET_FRAME_RATE_FACTOR } from './target-frame-rate';

/**
 * Tracks frame timing, delta time, and FPS metrics for game loop synchronization.
 * Used to ensure consistent game speed regardless of frame rate fluctuations.
 */
export class Time {
  private _deltaTime = 0;

  /**
   * Scaling factor for frame-rate independent movement and animations.
   *
   * @remarks
   * - Value of 1.0: Running at target frame rate
   * - Value of 0.5: Running twice as fast as target (multiply speeds by 0.5 to compensate)
   * - Value of 2.0: Running half as fast as target (multiply speeds by 2.0 to compensate)
   */
  get deltaTime(): number {
    return this._deltaTime;
  }

  private _frameTimeInMilliseconds = 0;

  /**
   * Time elapsed between the current and previous frame in milliseconds.
   */
  get frameTimeInMilliseconds(): number {
    return this._frameTimeInMilliseconds;
  }

  private _lastFrameTimeInMilliseconds: number;

  /**
   * Timestamp of the previous frame in milliseconds.
   */
  get lastFrameTimeInMilliseconds(): number {
    return this._lastFrameTimeInMilliseconds;
  }

  private _framesPerSecond = 0;

  /**
   * Current frames per second (FPS), updated each frame.
   */
  get framesPerSecond(): number {
    return this._framesPerSecond;
  }

  private _framesPerSecondSmoothed = 0;

  /**
   * Smoothed frames per second value to reduce display jitter.
   * Uses exponential moving average for stability.
   */
  get framesPerSecondSmoothed(): number {
    return this._framesPerSecondSmoothed;
  }

  /**
   * Creates a new Time instance for frame timing management.
   *
   * @param _smoothingFactor - Controls FPS smoothing (0.9 = more smooth, 0.1 = more reactive).
   */
  constructor(private readonly _smoothingFactor = 0.9) {
    this._lastFrameTimeInMilliseconds = performance.now();
  }

  get smoothingFactor(): number {
    return this._smoothingFactor;
  }

  /**
   * Updates timing metrics for the current frame.
   * Call this once per frame in your game loop.
   *
   * @param now - Current timestamp from requestAnimationFrame or performance.now()
   * @returns Current delta time for frame-rate independent updates
   */
  update(now: number): number {
    this._frameTimeInMilliseconds = now - this._lastFrameTimeInMilliseconds;
    this._deltaTime = this._frameTimeInMilliseconds * TARGET_FRAME_RATE_FACTOR;
    this._lastFrameTimeInMilliseconds = now;

    const framesPerSecond = 1000 / this._frameTimeInMilliseconds;
    this._framesPerSecondSmoothed =
      this._framesPerSecond * this._smoothingFactor + framesPerSecond * (1 - this._smoothingFactor);
    this._framesPerSecond = framesPerSecond;

    return this._deltaTime;
  }
}
