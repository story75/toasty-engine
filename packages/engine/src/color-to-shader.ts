import type { default as Color } from 'colorjs.io';

/**
 * Converts a color to a shader compatible format
 *
 * @remarks
 * The color will be converted to the `p3` color space because if the canvas is only in sRGB it will still render correctly,
 * thus converting directly to p3 is less work and removes the need for a HDR check.
 *
 * @param color - The color to convert
 * @returns The color in a shader compatible format
 */
export function colorToShader(color: Color): { r: number; g: number; b: number; a: number } {
  const { alpha, coords } = color.to('p3').toJSON();
  const [r, g, b] = coords;
  return { r, g, b, a: alpha ?? 1 };
}
