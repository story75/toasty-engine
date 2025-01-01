import { describe, expect, test } from 'vitest';
import { randomInRange } from './random-in-range';

describe('randomInRange', () => {
  test('generates numbers within range', () => {
    for (let i = 0; i < 1000; i++) {
      const result = randomInRange(Math.random, 0, 10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  test('handles negative ranges', () => {
    for (let i = 0; i < 1000; i++) {
      const result = randomInRange(Math.random, -10, -5);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-5);
    }
  });

  test('handles zero range', () => {
    const result = randomInRange(Math.random, 5, 5);
    expect(result).toBe(5);
  });

  test('handles reversed min/max', () => {
    // Should still work if min > max
    for (let i = 0; i < 1000; i++) {
      const result = randomInRange(Math.random, 10, 0);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  test('uses provided RNG function', () => {
    const mockRng = () => 0.5; // Always returns 0.5
    expect(randomInRange(mockRng, 0, 10)).toBe(5);
    expect(randomInRange(mockRng, -10, 10)).toBe(0);
  });
});
