# Sprites with WebGPU

An example to show the basics sprite rendering with WebGPU.

This example tries to illustrate the basic concepts of rendering 2D sprites with WebGPU. 
It uses a simple shader to render a sprite with a texture. 
The example also shows how to use a uniform buffer to pass the transformation matrix to the shader.

## How does it work?

First make sure to take a look at the [Hello World with raw WebGPU](../hello-webgpu/README.md) example to understand the basics of WebGPU.

As a continuation of the Hello World example, this example adds the following features:
- Loading a texture
- Creating a uniform buffer
- Creating a depth texture
- Creating an orthographic projection matrix
- Feeding custom data via a storage buffer to the shader
- Add a render loop instead of rendering only once
- Calculate the delta time and use it to move the sprites
- Move and update the sprite positions in the render loop

## Why does this use storage buffers over vertex buffers?

For this particular example there is no real difference between using a storage buffer or a vertex buffer.
Once your application becomes more complex, you may want to use storage buffers, because they allow for the following:
- Write data back to the buffer in compute shaders
- Attach data per instance instead of per vertex
- Can more easily use render bundles

Since there is nothing to lose with storage buffers, but just things to gain, this example uses storage buffers,
although the setup can be a bit more complex.

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

