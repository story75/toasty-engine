import { describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize';

describe('memoize', () => {
  it('should cache function results', () => {
    const mockFn = vi.fn((x: number) => x * 2);
    const memoized = memoize(mockFn);

    // First call should execute the function
    expect(memoized(2)).toBe(4);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Second call with same args should use cache
    expect(memoized(2)).toBe(4);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Different args should execute function again
    expect(memoized(3)).toBe(6);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple arguments', () => {
    const mockFn = vi.fn((a: number, b: string) => `${a}-${b}`);
    const memoized = memoize(mockFn);

    expect(memoized(1, 'test')).toBe('1-test');
    expect(memoized(1, 'test')).toBe('1-test');
    expect(mockFn).toHaveBeenCalledTimes(1);

    expect(memoized(2, 'test')).toBe('2-test');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should handle object arguments', () => {
    const mockFn = vi.fn((obj: { x: number; y: string }) => `${obj.x}-${obj.y}`);
    const memoized = memoize(mockFn);

    expect(memoized({ x: 1, y: 'test' })).toBe('1-test');
    expect(memoized({ x: 1, y: 'test' })).toBe('1-test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
