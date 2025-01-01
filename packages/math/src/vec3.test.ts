import { describe, expect, test } from 'vitest';
import {
  Vec3Like,
  vec3_add,
  vec3_cross,
  vec3_dot,
  vec3_length,
  vec3_multiply,
  vec3_normalize,
  vec3_rotate,
  vec3_subtract,
} from './vec3';

describe('vec3', () => {
  test('vec3_length', () => {
    expect(vec3_length({ x: 3, y: 4, z: 0 })).toBe(5);
    expect(vec3_length({ x: 1, y: 1, z: 1 })).toBeCloseTo(Math.sqrt(3));
    expect(vec3_length({ x: 0, y: 0, z: 0 })).toBe(0);
  });

  test('vec3_multiply', () => {
    expect(vec3_multiply({ x: 1, y: 2, z: 3 }, 2)).toEqual({ x: 2, y: 4, z: 6 });
    expect(vec3_multiply({ x: 1, y: 2, z: 3 }, 0)).toEqual({ x: 0, y: 0, z: 0 });
    expect(vec3_multiply({ x: 1, y: 2, z: 3 }, -1)).toEqual({ x: -1, y: -2, z: -3 });
  });

  test('vec3_normalize', () => {
    const normalized = vec3_normalize({ x: 3, y: 4, z: 0 });
    expect(normalized.x).toBeCloseTo(0.6);
    expect(normalized.y).toBeCloseTo(0.8);
    expect(normalized.z).toBeCloseTo(0);
    expect(vec3_length(normalized)).toBeCloseTo(1);

    // Test unit vector remains unchanged
    const unit = vec3_normalize({ x: 1, y: 0, z: 0 });
    expect(unit.x).toBeCloseTo(1);
    expect(unit.y).toBeCloseTo(0);
    expect(unit.z).toBeCloseTo(0);
  });

  test('vec3_add', () => {
    expect(vec3_add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toEqual({ x: 5, y: 7, z: 9 });
    expect(vec3_add({ x: 1, y: 2, z: 3 }, { x: -1, y: -2, z: -3 })).toEqual({ x: 0, y: 0, z: 0 });
  });

  test('vec3_subtract', () => {
    expect(vec3_subtract({ x: 4, y: 5, z: 6 }, { x: 1, y: 2, z: 3 })).toEqual({ x: 3, y: 3, z: 3 });
    expect(vec3_subtract({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })).toEqual({ x: 0, y: 0, z: 0 });
  });

  test('vec3_dot', () => {
    expect(vec3_dot({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })).toBe(32);
    expect(vec3_dot({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBe(0);
    expect(vec3_dot({ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 })).toBe(-1);
  });

  test('vec3_cross', () => {
    expect(vec3_cross({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toEqual({ x: 0, y: 0, z: 1 });
    expect(vec3_cross({ x: 2, y: 3, z: 4 }, { x: 5, y: 6, z: 7 })).toEqual({ x: -3, y: 6, z: -3 });
  });

  test('vec3_rotate', () => {
    // Rotate (1,0,0) 90 degrees around z-axis should give approximately (0,1,0)
    const rotated = vec3_rotate({ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, Math.PI / 2);
    expect(rotated.x).toBeCloseTo(0);
    expect(rotated.y).toBeCloseTo(1);
    expect(rotated.z).toBeCloseTo(0);

    // Rotating by 360 degrees should return to original position
    const fullRotation = vec3_rotate({ x: 1, y: 2, z: 3 }, { x: 0, y: 1, z: 0 }, Math.PI * 2);
    expect(fullRotation.x).toBeCloseTo(1);
    expect(fullRotation.y).toBeCloseTo(2);
    expect(fullRotation.z).toBeCloseTo(3);
  });
});
