/**
 * Create a texture from text using a canvas.
 *
 * @remarks
 * The text will always be rendered with a top-left origin in white text on a transparent background.
 * The text is white so it can be tinted with a color in your shader, this offers more flexibility than encoding the color in the texture.
 *
 * @param text - The text to create a texture from.
 * @param font - The font to use for the text.
 * @param fontSizeInPixels - The size of the font in pixels.
 * @param givenCanvas - An optional canvas to use for the texture. If not provided, a new canvas will be created.
 * @returns The canvas with the text drawn on it.
 */
export function createTextureFromText(
  text: string,
  font: string,
  fontSizeInPixels = 16,
  givenCanvas?: HTMLCanvasElement,
): HTMLCanvasElement {
  let canvas = givenCanvas;
  if (!canvas) {
    canvas = document.createElement('canvas');
  }

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to create canvas context');
  }

  const configureContext = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textBaseline = 'top';
    context.font = `${fontSizeInPixels}px ${font}`;
    context.textAlign = 'left';
    context.fillStyle = 'white';
  };

  configureContext();
  const rect = context.measureText(text);

  // resize canvas to match text size
  // this will reset the context, so we need to set everything again
  canvas.width = rect.actualBoundingBoxRight - rect.actualBoundingBoxLeft; // left may be negative, so we need to subtract it
  canvas.height = rect.actualBoundingBoxDescent - rect.actualBoundingBoxAscent; // ascent may be negative, so we need to subtract it

  configureContext();
  context.fillText(text, 0, 0);
  return canvas;
}
