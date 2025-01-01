import { join } from 'node:path';
import { cwd } from 'node:process';
import { $ } from 'bun';
import type yargs from 'yargs';
import { DEFAULT_README_CONTENT } from './default-readme';

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
        const content = DEFAULT_README_CONTENT(packageJson.name, packageJson.description);
        await Bun.write(join(currentWorkingDirectory, 'README.md'), content);
        return;
      }

      await $`bunx automd`;
    },
  );
}
