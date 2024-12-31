import { describe, expect, test } from 'bun:test';
import { decay } from './decay';

describe('decay', () => {
  test('decays value over time', () => {
    expect(decay(100, 0, 0.5, 1)).toBeCloseTo(60.65);
    expect(decay(100, 0, 0.5, 2)).toBeCloseTo(36.79);
    expect(decay(100, 0, 0.5, 3)).toBeCloseTo(22.31);
  });

  test('handles zero decay rate', () => {
    expect(decay(100, 0, 0, 1)).toBe(100);
    expect(decay(100, 0, 0, 2)).toBe(100);
  });

  test('handles full decay rate', () => {
    expect(decay(100, 0, 1, 1)).toBeCloseTo(36.79);
  });

  test('handles zero initial value', () => {
    expect(decay(0, 0, 0.5, 1)).toBe(0);
  });

  test('handles negative values', () => {
    expect(decay(-100, 0, 0.5, 1)).toBeCloseTo(-60.65);
  });

  test('handles zero time', () => {
    expect(decay(100, 0, 0.5, 0)).toBe(100);
  });

  test('decays towards target value', () => {
    expect(decay(0, 100, 0.5, 1)).toBeCloseTo(39.35);
    expect(decay(0, 100, 0.5, 2)).toBeCloseTo(63.21);
  });
});
