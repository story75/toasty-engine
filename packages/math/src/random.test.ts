import { describe, expect, it } from 'vitest';
import { random } from './random';

describe('random', () => {
  it('should generate numbers between 0 and 1', () => {
    const rng = random('test-seed');
    for (let i = 0; i < 1000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should be deterministic with the same seed', () => {
    const rng1 = random('test-seed');
    const rng2 = random('test-seed');

    for (let i = 0; i < 100; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  it('should generate different sequences with different seeds', () => {
    const rng1 = random('seed1');
    const rng2 = random('seed2');

    let hasDifference = false;
    for (let i = 0; i < 100; i++) {
      if (rng1() !== rng2()) {
        hasDifference = true;
        break;
      }
    }
    expect(hasDifference).toBe(true);
  });

  it('should have a reasonable distribution', () => {
    const rng = random('distribution-test');
    const buckets = new Array(10).fill(0);
    const iterations = 10000;

    // Fill buckets
    for (let i = 0; i < iterations; i++) {
      const value = rng();
      const bucketIndex = Math.floor(value * 10);
      buckets[bucketIndex]++;
    }

    // Each bucket should have roughly the same number of values
    // We'll allow for some variance but expect each bucket to have
    // between 8% and 12% of the total values
    const expectedBucketSize = iterations / 10;
    for (const bucketCount of buckets) {
      expect(bucketCount).toBeGreaterThan(expectedBucketSize * 0.8);
      expect(bucketCount).toBeLessThan(expectedBucketSize * 1.2);
    }
  });
});
