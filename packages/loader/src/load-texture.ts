/**
 * Loads a texture from a path or an ImageBitmapSource
 *
 * @remarks
 * This function will return an ImageBitmap which can be used to create a texture in WebGPU
 *
 * @param pathOrImageSource - The path to the image or an ImageBitmapSource
 * @returns A promise that resolves to an ImageBitmap
 */
export async function loadTexture(
  pathOrImageSource: string | ImageBitmapSource,
): Promise<ImageBitmap> {
  if (typeof pathOrImageSource !== 'string') {
    return createImageBitmap(pathOrImageSource);
  }

  const response = await fetch(pathOrImageSource);
  const blob = await response.blob();
  return createImageBitmap(blob);
}
