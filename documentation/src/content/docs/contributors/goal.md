---
title: Why Toasty?
description: Why does Toasty exist? What is the goal of the project?
---

There are many game engines out there, so why create another one? What does or should make Toasty different from the rest?
These are all questions that may come to mind when you think about yet another game engine.

This document will try to outline the main goals and ideas behind Toasty, and what makes it different from other engines.

## The goal

> A WebGPU game engine that is specifically tailored for 2d (and 2.5d) games that may run on any device that can run a browser.

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

## The audience

The main audience for Toasty are people who want to create pixel art games, mainly RPGs, but also other genres.
While the engine will focus on those aspects and make them as easily digestible as possible, 
it should also be possible to create other types of games with it.

Users will be expected to have some basic knowledge of programming. There may be alternatives to plain code,
like visual scripting and editors, and users will not have to be professional programmers, but some basic understanding is required.

## What should be provided out of the box?

Something that is invaluable for a game engine, or rather what makes RPG Maker very good, is the database feature and structure it provides.
You can create items, skills, enemies, actors, and so on, and define their properties and behavior.
You do not have to create and think about everything from scratch, and if the engine provides a good set of default values and structures,
that is more than half the battle won.

What other engines do better though, is the ability to extend and modify those structures and behaviors. 
It is very hard or sometimes impossible to extend the database of RPG Maker, or create custom editors for it.
For bigger projects this is a must-have and Toasty will try to provide this feature akin to other engines or tools like Unity and Odin for Unity.

Another thing that is easily overlooked, are ready-to-use characters with animations and basic behavior.
Literally every other engine or game tutorial starts of with creating a character controller and making it move.
If the focus is already constrained to pixel art games, this should be provided out of the box, so the user can start creating their game right away.
Later on they can skin and modify the provided assets, or create their own from scratch and do the same for the animations and behavior.

Last but not least, the engine should provide a way to create and manage maps and scenes. In my previous attempts to create a game engine,
I focused too much on the technical aspects and forgot about the actual game creation part. Unless you only create procedural games,
you will need a way to create handcrafted maps and scenes, and you have to do that visually. Hopping in and out of a level, tweaking parameters,
and jumping back in to see the changes is a must-have feature.

To sum it up, the engine should provide the following features out of the box:
- A database structure
- Customizable editors and the option to add custom editors
- A ready-to-use character with animations and basic behavior
- A way to create and manage maps and scenes visually

## What is out of scope?

Now that we roughly know what Toasty should be, let's talk about what it is not supposed to be.

Toasty is not supposed to be a general-purpose game engine. It is not supposed to be the next Unity or Godot.
These are very powerful engines, and my goal is **not** to compete with them in the general game engine market.

It should be possible to create sophisticated "indie games" with Toasty, but it is not supposed to be used for AAA games or similar.
The niche is pixel art games, classic and modern RPGs, or simple 2d games in general. 
You are not supposed to create a first-person shooter with it or a 3d game.

Toasty will also refrain from providing a standard asset pack or a lot of default assets. 
It will provide the bare minimum to get started, like one character, some icons and prototype tiles and materials.
Users should be able to quickly prototype and test their game, 
but they should not be able to put it on the market without creating their own assets.

## About the author

I am a software developer with a passion for development, games, and pixel art. 
I am especially interested in the technical aspects of the things I am working with and game engines are very intricate and interesting pieces of software.
They combine so many different aspects of software development tp provide a tool to create something new and unique.

Personally I want to know how stuff works under the hood, and why it works the way it does.
I have no deep background in game development, but I have some experience with a few engines and frameworks, 
and I am eager to learn more and create something new.

I suppose this will be a long journey and mostly a single person project, but I am open to contributions and feedback.

If you are interested in the project, and want to help out, please refer to [open issues](https://github.com/story75/toasty-engine/issues) for small tasks.

If you want to contribute something bigger, please [open a discussion](https://github.com/story75/toasty-engine/discussions) first, so we can talk about it.

If you want to be a long term contributor, please let me know, so we can talk about it and the future of the project.

If you want to create a game with Toasty, please do so and let me know about it. I am eager to see what you can create with it.