/**
 * The timer class is responsible for tracking frame time, calculating delta time and frames per second.
 */
export class Timer {
  /**
   * How much time has passed in relation to the target frame rate
   *
   * @remarks
   * The value will be between 0 and 1. If the value is 1, then the frame rate is at the target frame rate.
   *
   * If the value is 0.5, then the frame rate is half the target frame rate so instead of taking 16.67ms to render a frame, it took 8.33ms.
   * So to compensate for the time difference, you would multiply your movement speed by 0.5 (deltaTime).
   *
   * If the value is 2, then the frame rate is double the target frame rate so instead of taking 16.67ms to render a frame, it took 33.33ms.
   * So to compensate for the time difference, you would multiply your movement speed by 2 (deltaTime).
   */
  deltaTime = 0;

  /**
   * The time between the current frame and the last frame
   */
  frameTimeInMilliseconds = 0;

  /**
   * The time of the last frame
   */
  lastFrameTimeInMilliseconds: number;

  /**
   * The approximate frames per second
   */
  framesPerSecond = 0;

  /**
   * The approximate frames per second with applied smoothing
   */
  framesPerSecondSmoothed = 0;

  /**
   * The speed factor
   *
   * @remarks
   * The speed factor is used to speed up or slow down the time measured by the timer.
   * For example, if you set the speed factor to 2, then the time measured by the timer will be twice as fast.
   * If you set the speed factor to 0.5, then the time measured by the timer will be half as fast.
   */
  speedFactor = 1;

  /**
   * The subscribers to the ticker
   */
  private subscribers = new Set<(timer: this) => void>();

  /**
   * @param targetFrameRate - The target frame rate. The value is expected to be in fps / 1000 e.g. 60 / 1000 => 0.06.
   * @param smoothingFactor - The smoothing factor to apply to the frames per second.
   *
   * @remarks
   * You will only ever need to change targetFrameRate if you want to target a different frame rate
   * with a different render loop instead of requestAnimationFrame.
   *
   * The smoothing factor is used to smooth out the frames per second.
   * A higher value will smooth out the frames per second more resulting in a less jittery value to display.
   */
  constructor(
    public readonly targetFrameRate = 0.06,
    public readonly smoothingFactor = 0.9,
  ) {
    this.lastFrameTimeInMilliseconds = performance.now();
  }

  /**
   * Call this for each frame of your game loop to update the timer.
   *
   * @param now - The time reported by performance.now() or the value from requestAnimationFrame.
   * @returns The delta time calculated by the timer.
   */
  update(now: number): number {
    this.frameTimeInMilliseconds = now - this.lastFrameTimeInMilliseconds;
    this.deltaTime = this.frameTimeInMilliseconds * this.targetFrameRate * this.speedFactor;
    this.lastFrameTimeInMilliseconds = now;

    const framesPerSecond = 1000 / this.frameTimeInMilliseconds;
    this.framesPerSecondSmoothed =
      this.framesPerSecond * this.smoothingFactor + framesPerSecond * (1 - this.smoothingFactor);
    this.framesPerSecond = framesPerSecond;

    for (const subscriber of this.subscribers) {
      subscriber(this);
    }

    return this.deltaTime;
  }

  /**
   * Adds a subscriber to the ticker.
   *
   * @param subscriber - The subscriber to add.
   * @returns A function that removes the subscriber from the ticker.
   */
  subscribe(subscriber: (timer: this) => void): () => void {
    this.subscribers.add(subscriber);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  /**
   * Removes all subscribers from the ticker.
   */
  clearSubscribers(): void {
    this.subscribers.clear();
  }

  /**
   * Waits for the specified number of ticks.
   *
   * @param ticks - The number of ticks to wait for.
   */
  waitForTicks(ticks: number): Promise<void> {
    let ticksPassed = 0;
    return new Promise((resolve) => {
      const subscriber = (timer: this) => {
        ticksPassed += timer.deltaTime;
        if (ticksPassed >= ticks) {
          resolve();
          removeSubscriber();
        }
      };
      const removeSubscriber = this.subscribe(subscriber);
    });
  }
}

/**
 * Waits for the specified number of milliseconds.
 *
 * @remarks
 * Use this for code that has to wait for a certain amount of real time to pass.
 * If you need to wait for a certain number of frames to pass, use the Timer class instead.
 *
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export function waitForMilliseconds(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
