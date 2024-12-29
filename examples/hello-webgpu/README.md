# Hello World with raw WebGPU

An example to show the basics of raw WebGPU with TypeScript. 

This example is a simple "Hello World" program that draws a red square to the screen. 
It should be a reference for how to get started with WebGPU in the most basic way and also what it takes to draw something simple.

## How does it work?

The examples first requests a device, for which it has to go through the following steps:
- Get a canvas element
- Request the webgpu context
- Request the adapter
- Request the device

Once the device is ready we can do some setup:
- Resize the canvas
- Get the desired format for the color attachment

For rendering we need to create a render pipeline:
- Create a shader module for the vertex and fragment shader
- Create a render pipeline with the bare minimum of settings including the shaders
- Define a clear color
- Create a command encoder
- Create a render pass descriptor
- Begin a render pass drawing two fixed triangles via 6 hardcoded vertices
- Submit the render pass

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

