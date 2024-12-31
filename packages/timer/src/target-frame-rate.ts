/**
 * The target frame rate
 *
 * @remarks
 * This value is optimized for browsers' requestAnimationFrame which typically targets 60fps.
 * You would only need to modify this if implementing a custom render loop with a different
 * target frame rate than requestAnimationFrame's default 60fps.
 *
 * Since we expect all users to use requestAnimationFrame, this value is not exposed for configuration.
 */
export const TARGET_FRAME_RATE = 60;

/**
 * The target frame rate in milliseconds per frame, calculated as (1000ms / 60fps = ~16.67ms).
 * The value 0.06 represents this interval normalized to the [0,1] range (16.67ms / 1000ms = 0.06).
 */
export const TARGET_FRAME_RATE_FACTOR = 0.06;
