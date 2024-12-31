import { describe, expect, test } from 'bun:test';
import {
  type Vec2Like,
  vec2_add,
  vec2_cross,
  vec2_dot,
  vec2_length,
  vec2_multiply,
  vec2_normalize,
  vec2_rotate,
  vec2_subtract,
} from './vec2';

describe('vec2', () => {
  test('add', () => {
    const a: Vec2Like = { x: 1, y: 2 };
    const b: Vec2Like = { x: 3, y: 4 };
    const result = vec2_add(a, b);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  test('add with zero vector', () => {
    const a: Vec2Like = { x: 1, y: 2 };
    const zero: Vec2Like = { x: 0, y: 0 };
    const result = vec2_add(a, zero);
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
  });

  test('subtract', () => {
    const a: Vec2Like = { x: 3, y: 4 };
    const b: Vec2Like = { x: 1, y: 2 };
    const result = vec2_subtract(a, b);
    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });

  test('subtract from zero', () => {
    const a: Vec2Like = { x: 0, y: 0 };
    const b: Vec2Like = { x: 1, y: 2 };
    const result = vec2_subtract(a, b);
    expect(result.x).toBe(-1);
    expect(result.y).toBe(-2);
  });

  test('multiply', () => {
    const v: Vec2Like = { x: 2, y: 3 };
    const result = vec2_multiply(v, 2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  test('multiply by zero', () => {
    const v: Vec2Like = { x: 2, y: 3 };
    const result = vec2_multiply(v, 0);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  test('length', () => {
    const v: Vec2Like = { x: 3, y: 4 };
    expect(vec2_length(v)).toBe(5);
  });

  test('length of zero vector', () => {
    const v: Vec2Like = { x: 0, y: 0 };
    expect(vec2_length(v)).toBe(0);
  });

  test('normalize', () => {
    const v: Vec2Like = { x: 3, y: 4 };
    const result = vec2_normalize(v);
    expect(result.x).toBeCloseTo(0.6);
    expect(result.y).toBeCloseTo(0.8);
    expect(vec2_length(result)).toBeCloseTo(1);
  });

  test('normalize unit vector', () => {
    const v: Vec2Like = { x: 1, y: 0 };
    const result = vec2_normalize(v);
    expect(result.x).toBe(1);
    expect(result.y).toBe(0);
    expect(vec2_length(result)).toBeCloseTo(1);
  });

  test('dot', () => {
    const a: Vec2Like = { x: 1, y: 2 };
    const b: Vec2Like = { x: 3, y: 4 };
    expect(vec2_dot(a, b)).toBe(11); // 1*3 + 2*4
  });

  test('dot with perpendicular vectors', () => {
    const a: Vec2Like = { x: 1, y: 0 };
    const b: Vec2Like = { x: 0, y: 1 };
    expect(vec2_dot(a, b)).toBe(0);
  });

  test('dot with parallel vectors', () => {
    const a: Vec2Like = { x: 2, y: 0 };
    const b: Vec2Like = { x: 3, y: 0 };
    expect(vec2_dot(a, b)).toBe(6);
  });

  test('cross', () => {
    const a: Vec2Like = { x: 1, y: 0 };
    const b: Vec2Like = { x: 0, y: 1 };
    const result = vec2_cross(a, b);
    expect(result.x).toBe(-1);
    expect(result.y).toBe(1);
  });

  test('cross with parallel vectors', () => {
    const a: Vec2Like = { x: 2, y: 0 };
    const b: Vec2Like = { x: 4, y: 0 };
    const result = vec2_cross(a, b);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  test('rotate 90 degrees', () => {
    const v: Vec2Like = { x: 1, y: 0 };
    const origin: Vec2Like = { x: 0, y: 0 };
    const result = vec2_rotate(v, origin, Math.PI / 2);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
  });

  test('rotate 180 degrees', () => {
    const v: Vec2Like = { x: 1, y: 0 };
    const origin: Vec2Like = { x: 0, y: 0 };
    const result = vec2_rotate(v, origin, Math.PI);
    expect(result.x).toBeCloseTo(-1);
    expect(result.y).toBeCloseTo(0);
  });

  test('rotate around non-zero origin', () => {
    const v: Vec2Like = { x: 2, y: 0 };
    const origin: Vec2Like = { x: 1, y: 0 };
    const result = vec2_rotate(v, origin, Math.PI);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(0);
  });
});
