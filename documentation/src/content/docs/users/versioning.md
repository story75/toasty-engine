---
title: Versioning
---

Toasty uses [Semantic Versioning](https://semver.org/) for versioning, with a few exceptions:

- Before stabilization, all packages will be bumped uniformly to the same version
- Before stabilization, every release to the main branch will trigger a new release of all packages to the `dev` tag

This will ensure that during the phase of high instability, you can just make sure all packages use the same version,
and everything will be compatible with each other.

To stay up to date with the latest version, you can use the `dev` tag. Only do this if you're comfortable with the risk of instability.

Releases are managed using [Changesets](https://github.com/changesets/changesets) and custom scripts.
Only releases in the latest tag will receive release notes.

Once Toasty is in a stable state, each package will be released independently and receive frequent updates.