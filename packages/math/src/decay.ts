/**
 * Exponential decay function.
 *
 * @remarks
 * This is a lerp variant which accounts for delta time.
 *
 * @param a - The starting value.
 * @param b - The ending value.
 * @param decay - The decay rate. This is the value you would usually plug into the `t` parameter of the lerp function.
 * @param deltaTime - The time delta.
 * @returns The decayed value.
 *
 * @see https://www.youtube.com/watch?v=LSNQuFEDOyQ - Talk by Freya Holmér
 * @see https://www.youtube.com/watch?v=YJB1QnEmlTs - "An In-Depth look at Lerp, Smoothstep, and Shaping Functions" by SimonDev
 */
export function decay(a: number, b: number, decay: number, deltaTime: number): number {
  return b + (a - b) * Math.exp(-decay * deltaTime);
}
