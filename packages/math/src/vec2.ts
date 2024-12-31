/**
 * An object that can be used to represent a 2D vector.
 *
 * @remarks
 * We use object because they are a lot more common than arrays in js.
 * The performance difference is negligible.
 *
 * We also explicity do not use Float32Array because it is roughly 98% slower when you constantly create new instances.
 *
 * For writing values (1m entries) the order is array > Float32Array (4% slower) > object (14% slower).
 * For roughly 100k entries, there is next to no difference between the three.
 *
 * @see https://jsperf.app/jedemi
 * @see https://jsperf.app/hekiqa
 *
 * We do not create a Vector2 class so users do not have to change their code just to use this library.
 * You are free to use any other library e.g. wgpu-matrix or gl-matrix are fine solutions.
 * To keep the surface of external libraries low, we opt to implement our own functions.
 */
export type Vec2Like = {
  x: number;
  y: number;
};

/**
 * Returns the length of a 2D vector.
 *
 * @param vec - The vector to get the length of.
 * @returns The length of the vector.
 */
export function vec2_length(vec: Vec2Like): number {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

/**
 * Multiplies a 2D vector by a scalar.
 *
 * @param vec - The vector to multiply.
 * @param scalar - The scalar to multiply the vector by.
 * @returns The multiplied vector.
 */
export function vec2_multiply(vec: Vec2Like, scalar: number): Vec2Like {
  return { x: vec.x * scalar, y: vec.y * scalar };
}

/**
 * Normalizes a 2D vector.
 *
 * @param vec - The vector to normalize.
 * @returns The normalized vector.
 */
export function vec2_normalize(vec: Vec2Like): Vec2Like {
  const length = vec2_length(vec);
  return { x: vec.x / length, y: vec.y / length };
}

/**
 * Adds two 2D vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The sum of the two vectors.
 */
export function vec2_add(a: Vec2Like, b: Vec2Like): Vec2Like {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Subtracts two 2D vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The difference between the two vectors.
 */
export function vec2_subtract(a: Vec2Like, b: Vec2Like): Vec2Like {
  return { x: a.x - b.x, y: a.y - b.y };
}

/**
 * Calculates the dot product of two 2D vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The dot product of the two vectors.
 */
export function vec2_dot(a: Vec2Like, b: Vec2Like): number {
  return a.x * b.x + a.y * b.y;
}

/**
 * Calculates the cross product of two 2D vectors.
 *
 * @remarks
 * This is a fake 2D cross product, as the real cross product is only defined in 3D space.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The cross product of the two vectors.
 */
export function vec2_cross(a: Vec2Like, b: Vec2Like): Vec2Like {
  return { x: a.y * b.x - a.x * b.y, y: a.x * b.y - a.y * b.x };
}

/**
 * Rotates a 2D vector by a given angle in radians.
 *
 * @param vec - The vector to rotate.
 * @param origin - The origin of the rotation.
 * @param angleInRadians - The angle to rotate the vector by, in radians.
 * @returns The rotated vector.
 */
export function vec2_rotate(vec: Vec2Like, origin: Vec2Like, angleInRadians: number): Vec2Like {
  const x = vec.x - origin.x;
  const y = vec.y - origin.y;
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);
  return { x: origin.x + (x * cos - y * sin), y: origin.y + (x * sin + y * cos) };
}
