// Define the structure for sprite instance data passed from CPU to GPU
struct Instance {
    position: vec2f,
    size: vec2f,
    textureFrame: vec4f,
    z: f32,
}

// Define the vertex shader output structure that will be passed to the fragment shader
struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
}

// Bind groups define how shader resources are organized and accessed
// Bind group 0: Camera and view matrices
@group(0) @binding(0)
var<uniform> projection_view_matrix: mat4x4f;

// Bind group 1: Texture resources
@group(1) @binding(0)
var texture_sampler: sampler;
@group(1) @binding(1)
var texture: texture_2d<f32>;

// We use an extra uniform instead of textureDimensions to avoid binding the texture in both stages
@group(1) @binding(2)
var<uniform> texture_dimensions: vec2f;

// Bind group 2: Instance data
@group(2) @binding(0)
var<storage, read> instances: array<Instance>;

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32, @builtin(instance_index) instance_index: u32) -> VertexOutput {
  // Because we know we are only ever going to draw quads,
  // we can hardcode some data into the shader like the indices, uvs and positions without explicitly passing them in
  // this saves a lot of bandwidth for big batches of sprites
const indices = array(0, 1, 2, 2, 3, 0);

  var index = indices[vertex_index];
  var instance = instances[instance_index];

  // Here we assume that we use screen coordiniates, otherwise we need other maps for clipspace or different world coordinate systems
  var positions = array(
    vec2f(instance.position[0], instance.position[1]), // top left
    vec2f(instance.position[0], instance.position[1] + instance.size[1]), // bottom left
    vec2f(instance.position[0] + instance.size[0], instance.position[1] + instance.size[1]), // bottom right
    vec2f(instance.position[0] + instance.size[0], instance.position[1]), // top right
  );

  var u = vec2f(
    instance.textureFrame[0] / texture_dimensions[0],
    (instance.textureFrame[0] + instance.textureFrame[2]) / texture_dimensions[0],
  );
  var v = vec2f(
    instance.textureFrame[1] / texture_dimensions[1],
    (instance.textureFrame[1] + instance.textureFrame[3]) / texture_dimensions[1],
  );

  // The uvs are static in this example, but it makes sense to have them in the shader
  // because calculation rotations will be faster here than in JS land
  var uv = array(
    vec2f(u[0], v[0]), // top left
    vec2f(u[0], v[1]), // bottom left
    vec2f(u[1], v[1]), // bottom right
    vec2f(u[1], v[0]), // top right
  );

  var output: VertexOutput;
  output.position = projection_view_matrix * vec4f(positions[index], instance.z, 1.0);
  output.uv = uv[index];
  return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
  var texture_color = textureSample(texture, texture_sampler, input.uv);

  // If you want tinting, this would be done here before the discard
  // because tints may change the alpha value to be even lower than the alpha of the texture at the current pixel

  // If the sprite is transparent, we discard it
  // this avoids pixels which write to the depth buffer and occlude other sprites
  if (texture_color.a < 0.01) {
    discard;
  }

  return texture_color;
}