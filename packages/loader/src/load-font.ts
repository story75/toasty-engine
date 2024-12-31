/**
 * Loads a font from a path and adds it to the document
 *
 * @param fontName - The name of the font
 * @param fontPath - The path to the font
 * @returns A promise that resolves to a FontFace
 */
export async function loadFont(fontName: string, fontPath: string): Promise<FontFace> {
  const font = new FontFace(fontName, `url(${fontPath})`);
  await font.load();
  document.fonts.add(font);
  return font;
}
