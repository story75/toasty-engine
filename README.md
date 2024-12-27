# Toasty

This is the workspace for Toasty. A WebGPU game engine that is specifically tailored for 2d (and 2.5d) games that may run on any device that can run a browser.

## Here be dragons

This is a work in progress, and APIs may not be missing, incomplete, or subject to change.
If you're brave enough to give it a try, please read the [documentation](https://story75.github.io/toasty-engine/) and report any problems you find.

## Design goals

- **lightweight core**: Keep the core itself small and easy to understand. More complex features should be implemented as separate packages.
- **2d focus**: Target mainly 2d pixel art games, but it should be possible to create 2.5d games as well.
- **common functionality**: Provide common functionality that is needed for most games, like input handling, rendering, and physics.
- **editors**: Provide editors for creating levels, animations, and databases for items, characters, etc.
- **modular**: Be modular, so users can easily add,remove or replace features.
- **reasonable defaults**: Provide reasonable defaults, so users can get started quickly.
- **simplicity**: Focus on 2d games without the need for complex 3d features.
- **great documentation**: Provide great documentation, so users can easily get started and understand how to use the engine.

## Out of scope

- **3d**: Do not design to support for sophisticated 3d games or high-end graphics.
- **high performance**: Trade performance for simplicity, ease of use and iteration speed where it makes sense.
- **cross-platform**: Do not aim to support all platforms, focus on desktops but not necessarily mobile.
- **compete with existing engines**: Do not aim to compete with existing engines like Unity, Godot, or Unreal.

## Getting started

Please refer to the [getting started part of the user documentation](https://story75.github.io/toasty-engine/users/getting-started) for more information.

## Why create Toasty in the first place?

The main goal is to create a game engine akin to RPG Maker, but with more flexibility and control.
RPG Maker is very good to learn the basics of game development, and provide a ton of tools to create a game.
Together with the provided assets, basically anyone can create a game with it, as long as they see it through.

In my personal opinion, RPG Maker is too restrictive, and the games made with it are easily recognizable.
You can see a game and immediately know it was made with RPG Maker, just by looking at it.
This also holds true for heavily modified games with a lot of custom assets and scripts.

Toasty aims to be different in that regard. The goal is to provide a simple and easy to use engine,
that allows for quick prototyping and development of pixel art games, but provide enough flexibility and control,
to tweak _almost_ every aspect to your liking.

The difference to let's say LÖVE is that Toasty will try to include more batteries, like editors to create and edit levels or items,
without resorting to other tools like Tiled or spreadsheets unless you want to.

## Contributing

Please refer to the [contributor part of our documentation](https://story75.github.io/toasty-engine/contributors/getting-started) for more information.