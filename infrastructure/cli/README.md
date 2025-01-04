# @toasty-engine/cli

<!-- automd:badges color="yellow" name="@toasty-engine/cli" license codecov no-npmDownloads -->
<!-- /automd -->

A command-line interface tool for managing Toasty Engine packages. This tool provides essential commands for development, building, and releasing packages in the Toasty Engine ecosystem.

## Features

- 📦 Bundle packages with esbuild configuration
- 📝 Auto-generate and update package READMEs
- 🚀 Streamlined release process with version management
- 🔄 Automated workspace dependency handling
- 🛠️ Development workflow utilities

## Why should I use this?

The CLI is not yet intended to be used by end-users. It is a tool for internal use by the Toasty Engine team to manage the monorepo.
In the future it will also contain end-user facing commands, but for now it is only for internal use.

## Installation

```bash
bun add -D @toasty-engine/cli
```

## Usage

### Bundle Command
Bundles a package using esbuild with proper CJS and ESM output:

```bash
toasty-cli bundle
```

### README Command
Generates or updates package README files with consistent formatting:

```bash
# Update existing README with automd
toasty-cli readme

# Create a new boilerplate README
toasty-cli readme --create
```

### Release Commands
Manages the release process for packages:

```bash
# Prepare for release by setting up npm configuration
toasty-cli prepare-release

# Release a package with specific version and tag
toasty-cli release --version "1.0.0" [--tag latest] [--dry-run]
```

The release process includes:
- Version management
- Workspace dependency resolution
- License file copying
- Publishing to npm registry

## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
