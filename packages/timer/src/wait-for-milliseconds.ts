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
