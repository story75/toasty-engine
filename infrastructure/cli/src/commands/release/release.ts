import { join } from 'node:path';
import { cwd } from 'node:process';
import { $ } from 'bun';
import { findUp } from 'find-up';
import type yargs from 'yargs';

type PublishConfig = {
  bin?: string;
  main?: string;
  exports?: string | Record<string, string>;
  types?: string;
  typings?: string;
  module?: string;
  browser?: string;
};

type PackageJson = PublishConfig & {
  name: string;
  version: string;
  private?: boolean;
  publishConfig?: PublishConfig;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export function release(cli: ReturnType<typeof yargs>): void {
  cli.command(
    'release',
    'Release a package',
    {
      version: {
        type: 'string',
        describe: 'The version to release',
        alias: 'v',
        demandOption: true,
      },
      tag: {
        type: 'string',
        describe: 'The tag to release',
        alias: 't',
        default: 'latest',
      },
      'dry-run': {
        type: 'boolean',
        describe: 'Dry run the release',
        alias: 'd',
        default: false,
      },
    },
    async (args) => {
      const version = args.version;
      const tag = args.tag;
      const dryRun = args['dry-run'];
      const workingDirectory = cwd();

      const packageJsonFile = Bun.file(join(workingDirectory, 'package.json'));
      const content = (await packageJsonFile.json()) as PackageJson;

      if (content.private) {
        throw new Error(`Cannot release private package ${content.name}!`);
      }

      console.log(`Releasing package ${content.name} version ${version} with tag ${tag}...`);

      content.version = version;

      if (content.publishConfig) {
        // this is a subset of the values pnpm allows
        // see https://pnpm.io/package_json#publishconfig
        const allowedPublishConfigKeys = [
          'bin',
          'main',
          'types',
          'typings',
          'module',
          'browser',
        ] as const;

        for (const key of allowedPublishConfigKeys) {
          if (content.publishConfig[key]) {
            content[key] = content.publishConfig[key];
          }
        }

        if (content.publishConfig.exports) {
          content.exports = content.publishConfig.exports;
        }
      }

      const replaceWorkspaceDependencies = (root: Record<string, string>) => {
        const dependencies = Object.keys(root);
        for (const dependency of dependencies) {
          const value = root[dependency];
          root[dependency] = value === 'workspace:*' ? version : value;
        }
      };

      if (content.dependencies) {
        replaceWorkspaceDependencies(content.dependencies);
      }

      if (content.devDependencies) {
        replaceWorkspaceDependencies(content.devDependencies);
      }

      await Bun.write(packageJsonFile, JSON.stringify(content, null, 2));

      const licenseFilePath = await findUp('LICENSE');
      if (!licenseFilePath) {
        throw new Error('Could not find LICENSE file!');
      }

      const licenseInput = Bun.file(licenseFilePath);
      const licenseOutput = Bun.file(join(workingDirectory, 'LICENSE'));
      await Bun.write(licenseOutput, licenseInput);

      await $`bun publish --access public --tag ${tag} ${dryRun ? '--dry-run' : ''}`;
    },
  );
}
