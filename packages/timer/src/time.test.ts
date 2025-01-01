import { describe, expect, test } from 'vitest';
import { Time } from './time';

describe('Time', () => {
  test('should initialize with correct values', () => {
    const time = new Time();
    expect(time.deltaTime).toBe(0);
    expect(time.frameTimeInMilliseconds).toBe(0);
    expect(time.framesPerSecond).toBe(0);
    expect(time.framesPerSecondSmoothed).toBe(0);
    expect(time.smoothingFactor).toBe(0.9);
  });

  test('should initialize with custom smoothing factor', () => {
    const time = new Time(0.5);
    expect(time.smoothingFactor).toBe(0.5);
  });

  test('should calculate delta time correctly', () => {
    const time = new Time();
    const now = time.lastFrameTimeInMilliseconds;

    // Simulate 16.67ms frame time (approximately 60 FPS)
    const nextFrame = now + 16.67;
    time.update(nextFrame);

    // Delta time should be approximately 1 at 60 FPS
    expect(time.deltaTime).toBeCloseTo(1, 1);
  });

  test('should calculate FPS correctly', () => {
    const time = new Time();
    const now = time.lastFrameTimeInMilliseconds;

    // Simulate 16.67ms frame time (approximately 60 FPS)
    const nextFrame = now + 16.67;
    time.update(nextFrame);

    // FPS should be approximately 60
    expect(time.framesPerSecond).toBeCloseTo(60, 0);
  });

  test('should smooth FPS values', () => {
    const time = new Time(0.5); // Use 0.5 smoothing for easier testing
    const now = time.lastFrameTimeInMilliseconds;

    // First frame at 60 FPS
    time.update(now + 16.67);
    const firstFPS = time.framesPerSecond;

    // Second frame at 30 FPS
    time.update(now + 16.67 + 33.33);

    // Smoothed FPS should be between 30 and 60
    expect(time.framesPerSecondSmoothed).toBeGreaterThan(30);
    expect(time.framesPerSecondSmoothed).toBeLessThan(60);
  });

  test('should update last frame time', () => {
    const time = new Time();
    const now = 1000;
    time.update(now);
    expect(time.lastFrameTimeInMilliseconds).toBe(now);
  });
});
