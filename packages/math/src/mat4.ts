import type { Vec3Like } from './vec3';

/**
 * A 4x4 matrix.
 *
 * @remarks
 * We use Float32Array because it is the most common type for matrices.
 * It is also the fastest type for reading and writing values and can be passed directly to webgpu functions.
 */
export type Mat4Like = Float32Array;

/**
 * Creates a 4x4 identity matrix.
 *
 * @returns The identity matrix.
 */
export function mat4_identity(): Mat4Like {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

/**
 * Creates an orthographic projection matrix.
 *
 * @param left - The left clipping plane.
 * @param right - The right clipping plane.
 * @param bottom - The bottom clipping plane.
 * @param top - The top clipping plane.
 * @param near - The near clipping plane.
 * @param far - The far clipping plane.
 * @param input - The input matrix to use. If not provided, an identity matrix is used.
 * @returns The orthographic projection matrix.
 */
export function mat4_orthographic(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
  input?: Mat4Like,
): Mat4Like {
  const output = input ?? mat4_identity();

  output[0] = 2 / (right - left);
  output[1] = 0;
  output[2] = 0;
  output[3] = 0;

  output[4] = 0;
  output[5] = 2 / (top - bottom);
  output[6] = 0;
  output[7] = 0;

  output[8] = 0;
  output[9] = 0;
  output[10] = -2 / (far - near);
  output[11] = 0;

  output[12] = -(right + left) / (right - left);
  output[13] = -(top + bottom) / (top - bottom);
  output[14] = -(far + near) / (far - near);
  output[15] = 1;

  return output;
}

/**
 * Multiplies two 4x4 matrices.
 *
 * @param a - The first matrix.
 * @param b - The second matrix.
 * @param input - The input matrix to use. If not provided, an identity matrix is used.
 * @returns The product of the two matrices.
 */
export function mat4_multiply(a: Mat4Like, b: Mat4Like, input?: Mat4Like): Mat4Like {
  const output = input ?? mat4_identity();

  output[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
  output[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
  output[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
  output[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

  output[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
  output[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
  output[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
  output[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

  output[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
  output[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
  output[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
  output[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

  output[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
  output[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
  output[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
  output[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];

  return output;
}

/**
 * Translates a 4x4 matrix by a 3D vector.
 *
 * @param matrix - The matrix to translate.
 * @param vector - The vector to translate the matrix by.
 * @param input - The input matrix to use. If not provided, an identity matrix is used.
 * @returns The translated matrix.
 */
export function mat4_translate(matrix: Mat4Like, vector: Vec3Like, input?: Mat4Like): Mat4Like {
  const b = mat4_identity();

  b[12] = vector.x;
  b[13] = vector.y;
  b[14] = vector.z;

  return mat4_multiply(matrix, b, input);
}

/**
 * Scales a 4x4 matrix by a 3D vector.
 *
 * @param matrix - The matrix to scale.
 * @param vector - The vector to scale the matrix by.
 * @param input - The input matrix to use. If not provided, an identity matrix is used.
 * @returns The scaled matrix.
 */
export function mat4_scale(matrix: Mat4Like, vector: Vec3Like, input?: Mat4Like): Mat4Like {
  const output = input ?? mat4_identity();

  output[0] = matrix[0] * vector.x;
  output[1] = matrix[1] * vector.x;
  output[2] = matrix[2] * vector.x;
  output[3] = matrix[3] * vector.x;

  output[4] = matrix[4] * vector.y;
  output[5] = matrix[5] * vector.y;
  output[6] = matrix[6] * vector.y;
  output[7] = matrix[7] * vector.y;

  output[8] = matrix[8] * vector.z;
  output[9] = matrix[9] * vector.z;
  output[10] = matrix[10] * vector.z;
  output[11] = matrix[11] * vector.z;

  return output;
}
