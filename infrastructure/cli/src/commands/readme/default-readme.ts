export const DEFAULT_README_CONTENT = (
  packageName: string,
  packageDescription: string,
) => `# ${packageName}
    
<!-- automd:badges color="yellow" name="${packageName}" license codecov no-npmDownloads -->
<!-- /automd -->

${packageDescription}

## Features

- Sample feature A
- Sample feature B
- Sample feature C

## Why should I use this?

- Sample reason A
- Sample reason B
- Sample reason C

## Installation

\`\`\`sh
bun add ${packageName}
\`\`\`

## Usage

\`\`\`typescript
import { sampleFunction } from '${packageName}';

// Sample usage
sampleFunction();
\`\`\`


## License

This package is part of the Toasty Engine project and is licensed under the MIT License.

<!-- automd:contributors author="story75" -->
<!-- /automd -->

<!-- automd:with-automd -->
<!-- /automd -->
`;
