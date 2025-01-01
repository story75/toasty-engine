import { TARGET_FRAME_RATE } from './target-frame-rate';

/**
 * A timer that counts elapsed ticks and can be used for time-based events, animations, or cooldowns.
 *
 * @example
 * ```ts
 * // Create a 60-tick (1 second at 60 FPS) non-repeating timer
 * const timer = new Timer(60);
 *
 * // Update in your game loop
 * timer.update(deltaTime);
 *
 * // Check if timer is complete
 * if (timer.isFinished()) {
 *   // Handle completion
 * }
 * ```
 */
export class Timer {
  private _elapsedTicks = 0;

  /**
   * The current number of elapsed ticks since the timer started or was last reset.
   */
  public get elapsedTicks(): number {
    return this._elapsedTicks;
  }

  /**
   * Tracks if the timer completed in the most recent update.
   */
  private justFinished = false;

  /**
   * Creates a new Timer instance.
   *
   * @param ticks - The target number of ticks this timer should count to.
   * @param repeating - When true, the timer will automatically reset when finished.
   *
   * @example
   * ```ts
   * // Create a 2-second timer at 60 FPS
   * const nonRepeatingTimer = new Timer(120);
   *
   * // Create a repeating 0.5-second timer at 60 FPS
   * const repeatingTimer = new Timer(30, true);
   * ```
   */
  constructor(
    public readonly ticks: number,
    public readonly repeating = false,
  ) {}

  /**
   * Creates a new Timer instance from a number of seconds.
   *
   * @remarks
   * This is a convenience method for creating a timer from seconds.
   * It is equivalent to `new Timer(seconds * TARGET_FRAME_RATE)`.
   *
   * @param seconds - The number of seconds to count towards.
   * @param repeating - When true, the timer will automatically reset when finished.
   * @returns A new Timer instance.
   */
  static fromSeconds(seconds: number, repeating = false): Timer {
    return new Timer(seconds * TARGET_FRAME_RATE, repeating);
  }

  /**
   * Updates the timer's state based on the elapsed time.
   * Call this method once per frame in your game loop.
   *
   * @param deltaTime - The time elapsed since the last frame, normalized to your target frame rate.
   *
   * @example
   * ```ts
   * // In your game loop
   * timer.update(Time.deltaTime);
   * ```
   */
  update(deltaTime: number): void {
    const isFinished = this.isFinished();
    this._elapsedTicks += deltaTime;

    // This may only ever be true if exactly this tick fills the timer.
    this.justFinished = !isFinished && this.isFinished();

    if (this.justFinished && this.repeating) {
      this._elapsedTicks = 0;
    }
  }

  /**
   * Checks if the timer has reached or exceeded its target ticks.
   *
   * @returns true if the timer has completed, false otherwise.
   *
   * @remarks
   * For repeating timers, this will return false after the timer resets.
   * If you need to detect the exact moment of completion, use {@link hasJustFinished} instead.
   *
   * @example
   * ```ts
   * if (timer.isFinished()) {
   *   // Timer has completed
   * }
   * ```
   */
  isFinished(): boolean {
    return this.justFinished || this._elapsedTicks >= this.ticks;
  }

  /**
   * Checks if the timer completed exactly on the last update.
   * Useful for triggering one-time events, especially with repeating timers.
   *
   * @returns true if the timer completed in the most recent update, false otherwise.
   *
   * @example
   * ```ts
   * // Perfect for triggering events on repeating timers
   * if (timer.hasJustFinished()) {
   *   spawnEnemy();
   * }
   * ```
   */
  hasJustFinished(): boolean {
    return this.justFinished;
  }
}
