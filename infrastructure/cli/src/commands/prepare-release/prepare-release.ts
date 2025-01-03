import { join } from 'node:path';
import { cwd } from 'node:process';
import type yargs from 'yargs';

export function prepareRelease(cli: ReturnType<typeof yargs>): void {
  cli.command('prepare-release', 'Prepare a release', async () => {
    const workingDirectory = cwd();
    await Bun.write(
      join(workingDirectory, '.npmrc'),
      '//registry.npmjs.org/:_authToken=${NPM_TOKEN}',
    );
  });
}
