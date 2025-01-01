import { describe, expect, test } from 'vitest';
import { TARGET_FRAME_RATE } from './target-frame-rate';
import { Timer } from './timer';

describe('Timer', () => {
  test('should initialize with correct values', () => {
    const timer = new Timer(60);
    expect(timer.ticks).toBe(60);
    expect(timer.repeating).toBe(false);
    expect(timer.elapsedTicks).toBe(0);
  });

  test('should create timer from seconds correctly', () => {
    const timer = Timer.fromSeconds(1);
    expect(timer.ticks).toBe(TARGET_FRAME_RATE);
    expect(timer.repeating).toBe(false);
  });

  test('should update elapsed ticks correctly', () => {
    const timer = new Timer(60);
    timer.update(10);
    expect(timer.elapsedTicks).toBe(10);
    timer.update(20);
    expect(timer.elapsedTicks).toBe(30);
  });

  test('should detect completion correctly', () => {
    const timer = new Timer(60);
    expect(timer.isFinished()).toBe(false);
    timer.update(59);
    expect(timer.isFinished()).toBe(false);
    timer.update(1);
    expect(timer.isFinished()).toBe(true);
  });

  test('should handle repeating timer correctly', () => {
    const timer = new Timer(30, true);
    timer.update(29);
    expect(timer.isFinished()).toBe(false);
    timer.update(1);
    expect(timer.hasJustFinished()).toBe(true);
    expect(timer.elapsedTicks).toBe(0); // Should reset
    timer.update(1);
    expect(timer.hasJustFinished()).toBe(false);

    // Test second cycle
    timer.update(28);
    expect(timer.hasJustFinished()).toBe(false);
    timer.update(1);
    expect(timer.hasJustFinished()).toBe(true);
    expect(timer.elapsedTicks).toBe(0); // Should reset again
    timer.update(1);
    expect(timer.hasJustFinished()).toBe(false);
  });

  test('should detect just finished state correctly', () => {
    const timer = new Timer(30);
    timer.update(29);
    expect(timer.hasJustFinished()).toBe(false);
    timer.update(1);
    expect(timer.hasJustFinished()).toBe(true);
    timer.update(1);
    expect(timer.hasJustFinished()).toBe(false);
  });
});
