import { describe, expect, test } from 'bun:test';
import { clamp } from './clamp';

describe('clamp', () => {
  test('returns value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('handles equal min and max', () => {
    expect(clamp(5, 10, 10)).toBe(10);
  });

  test('handles negative ranges', () => {
    expect(clamp(0, -10, -5)).toBe(-5);
    expect(clamp(-15, -10, -5)).toBe(-10);
    expect(clamp(-7, -10, -5)).toBe(-7);
  });
});
