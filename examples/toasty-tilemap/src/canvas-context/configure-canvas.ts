/**
 * Result of the `configureCanvas` function
 */
export type ConfigureCanvasResult = {
  /**
   * The WebGPU context
   */
  context: GPUCanvasContext;

  /**
   * The WebGPU device
   */
  device: GPUDevice;

  /**
   * The configured format of the canvas
   *
   * @remarks
   * This value depends on HDR activation and the device support.
   */
  presentationFormat: GPUTextureFormat;

  /**
   * Whether the device supports HDR
   *
   * @remarks
   * This value is determined by the `window.matchMedia('(dynamic-range: high)')` query.
   * The value will be reported even if HDR was not requested.
   */
  supportsHDR: boolean;
};

/**
 * Additional options for configuring the canvas so change the default behavior
 */
export type ConfigureCanvasOptions = {
  /**
   * Whether to use HDR color space and tone mapping
   *
   * @remarks
   * If active, the canvas will use the `rgba16float` format and enable extended tone mapping.
   * Not all devices support HDR, but the format will still be applied regardless of the device support.
   *
   * If not enabled, the canvas will use the preferred format of the device.
   *
   * @default false
   */
  hdr?: boolean;

  /**
   * The width of the canvas
   *
   * @remarks
   * By default the canvas will be the same size as the entire window.
   */
  width?: number;

  /**
   * The height of the canvas
   *
   * @remarks
   * By default the canvas will be the same size as the entire window.
   */
  height?: number;
};

/**
 * Configures the canvas for WebGPU
 *
 * @param canvas - The canvas element to configure
 * @param options - Additional options for configuring the canvas
 * @returns The configuration result
 * @throws If the canvas context cannot be created
 * @throws If the WebGPU adapter cannot be requested
 * @throws If the WebGPU device cannot be requested
 */
export const configureCanvas = async (
  canvas: HTMLCanvasElement,
  options: ConfigureCanvasOptions = {},
): Promise<ConfigureCanvasResult> => {
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('WebGPU context cannot be created');
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('Could not request WebGPU adapter!');
  }

  const device = await adapter.requestDevice();

  // Configure the canvas format and alpha blending mode for proper transparency handling
  // For HDR content, we use rgba16float, to support the larger range of colors and also enable extended tone mapping
  // TODO: Should we fallback to the preferred format if the device does not support HDR?
  const supportsHDR = window.matchMedia('(dynamic-range: high)').matches;
  const presentationFormat = options.hdr ? 'rgba16float' : navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'premultiplied',
    toneMapping: options.hdr ? { mode: 'extended' } : undefined,
  });

  // By default we assume the canvas should be the same size as the entire window
  const width = options.width ?? window.innerWidth;
  const height = options.height ?? window.innerHeight;

  const devicePixelRatio = window.devicePixelRatio;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  // We have to set the canvas style additionally to the width and height, because for devices with a high dpi, the canvas size will be larger than the window size
  // for those cases you have to shrink the canvas back down to the window size to achieve the correct scaling
  // so e.g. if the pixel ratio is 2, you have to set the canvas to width=window.innerWidth * 2 and height=window.innerHeight * 2
  // while simultaneously setting the canvas size to width={window.innerWidth}px and height={window.innerHeight}px to achieve the required pixel density
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  return { context, device, presentationFormat, supportsHDR };
};
