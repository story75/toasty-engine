import { describe, expect, test } from 'vitest';
import { lerp } from './lerp';

describe('lerp', () => {
  test('interpolates between two values', () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 1)).toBe(10);
  });

  test('handles negative values', () => {
    expect(lerp(-10, 10, 0.5)).toBe(0);
    expect(lerp(-20, -10, 0.5)).toBe(-15);
  });

  test('handles values outside 0-1 range', () => {
    expect(lerp(0, 10, 2)).toBe(20);
    expect(lerp(0, 10, -1)).toBe(-10);
  });
});
