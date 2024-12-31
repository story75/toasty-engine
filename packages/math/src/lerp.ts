/**
 * Linearly interpolates between two values.
 *
 * @param a - The starting value.
 * @param b - The ending value.
 * @param t - The interpolation factor between 0 and 1.
 * @returns The interpolated value between `a` and `b`.
 */
export function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}
