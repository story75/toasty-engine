---
title: Versioning
---

Toasty uses [Changesets](https://github.com/changesets/changesets) and [Semantic Versioning](https://semver.org/) for versioning, with a few exceptions:

- Before stabilization, all packages will be bumped uniformly to the same version
- After stabilization, each package will be released independently

This will ensure that during the phase of high instability, you can just make sure all packages use the same version,
and everything will be compatible with each other.