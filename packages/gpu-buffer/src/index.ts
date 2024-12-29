/// <reference types="@webgpu/types" />

/**
 * Creates an index buffer allocator for the given device.
 *
 * @remarks
 * Passed data is automatically mapped to the GPU buffer.
 *
 * @param device - The GPU device.
 */
export function indexBufferAllocator(device: GPUDevice) {
  return (data: Uint16Array): GPUBuffer => {
    const buffer = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Uint16Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
  };
}

/**
 * Creates a storage buffer allocator for the given device.
 *
 * @remarks
 * Passed data is not mapped to the GPU buffer, but only used for sizing.
 * The buffer has to be written to manually via device.queue.writeBuffer.
 *
 * @param device - The GPU device.
 */
export function storageBufferAllocator(device: GPUDevice) {
  return (data: Float32Array): GPUBuffer => {
    return device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  };
}

/**
 * Creates a texture allocator for the given device.
 *
 * @remarks
 * Passed data is automatically mapped to the GPU texture.
 *
 * @param device - The GPU device.
 */
export function textureAllocator(device: GPUDevice) {
  return (data: ImageBitmap | HTMLCanvasElement): GPUTexture => {
    // createTexture just creates an empty buffer which has to be filled
    const texture = device.createTexture({
      size: [data.width, data.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.copyExternalImageToTexture({ source: data }, { texture }, [
      data.width,
      data.height,
    ]);

    return texture;
  };
}

/**
 * Creates a uniform buffer allocator for the given device.
 *
 * @remarks
 * Passed data is not mapped to the GPU buffer, but only used for sizing.
 * The buffer has to be written to manually via device.queue.writeBuffer.
 *
 * @param device - The GPU device.
 */
export function uniformBufferAllocator(device: GPUDevice) {
  return (data: Float32Array | Uint32Array): GPUBuffer => {
    return device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  };
}

/**
 * Creates a vertex buffer allocator for the given device.
 *
 * @remarks
 * Passed data is automatically mapped to the GPU buffer.
 *
 * @param device - The GPU device.
 */
export function vertexBufferAllocator(device: GPUDevice) {
  return (data: Float32Array): GPUBuffer => {
    const buffer = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
  };
}
