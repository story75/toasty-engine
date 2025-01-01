import { describe, expect, test } from 'vitest';
import {
  mat4_identity,
  mat4_multiply,
  mat4_orthographic,
  mat4_scale,
  mat4_translate,
} from './mat4';

describe('mat4', () => {
  test('mat4_identity should create identity matrix', () => {
    const identity = mat4_identity();
    expect(Array.from(identity)).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  });

  test('mat4_orthographic should create correct orthographic projection', () => {
    const ortho = mat4_orthographic(-1, 1, -1, 1, 0.1, 100);

    // Test a few key elements that define orthographic projection
    expect(ortho[0]).toBe(1); // 2/(right-left)
    expect(ortho[5]).toBe(1); // 2/(top-bottom)
    expect(ortho[10]).toBeCloseTo(-0.02); // -2/(far-near)
    expect(ortho[15]).toBe(1);
  });

  test('mat4_multiply should multiply matrices correctly', () => {
    const a = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const b = new Float32Array([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);

    const result = mat4_multiply(a, b);

    // Test first row of multiplication result
    expect(result[0]).toBe(250);
    expect(result[1]).toBe(260);
    expect(result[2]).toBe(270);
    expect(result[3]).toBe(280);
  });

  test('mat4_translate should translate matrix correctly', () => {
    const matrix = mat4_identity();
    const translation = { x: 2, y: 3, z: 4 };

    const result = mat4_translate(matrix, translation);

    // Check translation components
    expect(result[12]).toBe(2);
    expect(result[13]).toBe(3);
    expect(result[14]).toBe(4);

    // Check that other elements remain unchanged
    expect(result[0]).toBe(1);
    expect(result[5]).toBe(1);
    expect(result[10]).toBe(1);
    expect(result[15]).toBe(1);
  });

  test('mat4_scale should scale matrix correctly', () => {
    const matrix = mat4_identity();
    const scale = { x: 2, y: 3, z: 4 };

    const result = mat4_scale(matrix, scale);

    // Check scaling components
    expect(result[0]).toBe(2);
    expect(result[5]).toBe(3);
    expect(result[10]).toBe(4);

    // Check that translation components remain unchanged
    expect(result[12]).toBe(0);
    expect(result[13]).toBe(0);
    expect(result[14]).toBe(0);
    expect(result[15]).toBe(1);
  });

  test('operations should work with provided input matrix', () => {
    const input = new Float32Array(16);

    // Test translate
    const translateResult = mat4_translate(mat4_identity(), { x: 1, y: 2, z: 3 }, input);
    expect(translateResult).toBe(input); // Should return same instance
    expect(translateResult[12]).toBe(1);
    expect(translateResult[13]).toBe(2);
    expect(translateResult[14]).toBe(3);

    // Test scale
    const scaleResult = mat4_scale(mat4_identity(), { x: 2, y: 3, z: 4 }, input);
    expect(scaleResult).toBe(input); // Should return same instance
    expect(scaleResult[0]).toBe(2);
    expect(scaleResult[5]).toBe(3);
    expect(scaleResult[10]).toBe(4);
  });
});
