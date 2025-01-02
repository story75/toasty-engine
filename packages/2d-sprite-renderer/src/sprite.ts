/**
 * A sprite to be rendered.
 */
export type Sprite = {
  /**
   * The texture to use for the sprite.
   */
  texture: GPUTexture;

  /**
   * The x position of the sprite from the top left corner of the screen going right.
   */
  x: number;

  /**
   * The y position of the sprite from the top left corner of the screen going down.
   */
  y: number;
  /**
   * The z position of the sprite.
   */
  z: number;
  /**
   * The width of the sprite.
   */
  width: number;
  /**
   * The height of the sprite.
   */
  height: number;

  /**
   * The frame of the texture to use for the sprite.
   *
   * @remarks
   * The area of the texture to use for the sprite.
   * If not provided, the entire texture will be used.
   */
  textureFrame: {
    /**
     * The x position of the texture frame from the top left corner of the texture.
     */
    x: number;
    /**
     * The y position of the texture frame from the top left corner of the texture.
     */
    y: number;
    /**
     * The width of the texture frame.
     */
    width: number;
    /**
     * The height of the texture frame.
     */
    height: number;
  };
};

/**
 * Create a sprite
 *
 * @param texture - The texture to use for the sprite
 * @param options - The options for the sprite
 */
export function createSprite(
  texture: GPUTexture,
  options: Partial<Omit<Sprite, 'texture'>>,
): Sprite {
  return {
    texture,
    x: options.x ?? 0,
    y: options.y ?? 0,
    z: options.z || 0.001,
    width: options.width ?? options.textureFrame?.width ?? texture.width,
    height: options.height ?? options.textureFrame?.height ?? texture.height,
    textureFrame: options.textureFrame ?? {
      x: 0,
      y: 0,
      width: texture.width,
      height: texture.height,
    },
  };
}
