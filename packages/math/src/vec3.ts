/**
 * An object that can be used to represent a 3D vector.
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
 * We do not create a Vector3 class so users do not have to change their code just to use this library.
 * You are free to use any other library e.g. wgpu-matrix or gl-matrix are fine solutions.
 * To keep the surface of external libraries low, we opt to implement our own functions.
 */
export type Vec3Like = {
  x: number;
  y: number;
  z: number;
};

/**
 * Returns the length of a 3D vector.
 *
 * @param vec - The vector to get the length of.
 * @returns The length of the vector.
 */
export function vec3_length(vec: Vec3Like): number {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
}

/**
 * Multiplies a 3D vector by a scalar.
 *
 * @param vec - The vector to multiply.
 * @param scalar - The scalar to multiply the vector by.
 * @returns The multiplied vector.
 */
export function vec3_multiply(vec: Vec3Like, scalar: number): Vec3Like {
  return { x: vec.x * scalar, y: vec.y * scalar, z: vec.z * scalar };
}

/**
 * Normalizes a 3D vector.
 *
 * @param vec - The vector to normalize.
 * @returns The normalized vector.
 */
export function vec3_normalize(vec: Vec3Like): Vec3Like {
  const length = vec3_length(vec);
  return { x: vec.x / length, y: vec.y / length, z: vec.z / length };
}

/**
 * Adds two 3D vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The sum of the two vectors.
 */
export function vec3_add(a: Vec3Like, b: Vec3Like): Vec3Like {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

/**
 * Subtracts two 3D vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The difference between the two vectors.
 */
export function vec3_subtract(a: Vec3Like, b: Vec3Like): Vec3Like {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

/**
 * Calculates the dot product of two 3D vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The dot product of the two vectors.
 */
export function vec3_dot(a: Vec3Like, b: Vec3Like): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * Calculates the cross product of two 3D vectors.
 *
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The cross product of the two vectors.
 */
export function vec3_cross(a: Vec3Like, b: Vec3Like): Vec3Like {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

/**
 * Rotates a 3D vector around an axis by a given angle in radians.
 *
 * @param vec - The vector to rotate.
 * @param axis - The axis to rotate around (should be normalized).
 * @param angleInRadians - The angle to rotate the vector by, in radians.
 * @returns The rotated vector.
 */
export function vec3_rotate(vec: Vec3Like, axis: Vec3Like, angleInRadians: number): Vec3Like {
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);
  const dot = vec3_dot(vec, axis);
  const cross = vec3_cross(axis, vec);

  return {
    x: vec.x * cos + cross.x * sin + axis.x * dot * (1 - cos),
    y: vec.y * cos + cross.y * sin + axis.y * dot * (1 - cos),
    z: vec.z * cos + cross.z * sin + axis.z * dot * (1 - cos),
  };
}
