import { join } from 'node:path';
import { cwd } from 'node:process';
import { $ } from 'bun';
import type yargs from 'yargs';

export function readme(cli: ReturnType<typeof yargs>): void {
  cli.command(
    'readme',
    'Maintain the README.md file',
    {
      create: {
        type: 'boolean',
        describe: 'Create a boilerplate README.md file instead of updating it',
        alias: 'c',
        default: false,
      },
    },
    async (args) => {
      const currentWorkingDirectory = cwd();
      const packageJsonFile = Bun.file(join(currentWorkingDirectory, 'package.json'));
      const packageJson = await packageJsonFile.json();

      if (args.create) {
        const content = `# ${packageJson.name}
    
<!-- automd:badges color="yellow" name="${packageJson.name}" license codecov no-npmDownloads -->
<!-- /automd -->

${packageJson.description}

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
bun add ${packageJson.name}
\`\`\`

## Usage

\`\`\`typescript
import { sampleFunction } from '${packageJson.name}';

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

        await Bun.write(join(currentWorkingDirectory, 'README.md'), content);
        return;
      }

      await $`bunx automd`;
    },
  );
}
