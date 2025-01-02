/**
 * Creates a memoized version of a function that caches its results.
 * The cache key is created from the stringified arguments.
 *
 * @param fn - The function to memoize
 * @returns A memoized version of the function
 */
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = JSON.stringify(args);

    const hasCached = cache.has(key);
    if (hasCached) {
      return cache.get(key) as Result;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
