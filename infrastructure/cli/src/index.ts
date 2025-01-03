#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { bundle } from './commands/bundle/bundle';
import { prepareRelease } from './commands/prepare-release/prepare-release';
import { readme } from './commands/readme/readme';
import { release } from './commands/release/release';

const cli = yargs(hideBin(Bun.argv))
  .scriptName('toasty-cli')
  .wrap(120)
  .strict()
  .version(false)
  .help(true);

const commands = [readme, bundle, release, prepareRelease];

for (const command of commands) {
  command(cli);
}
await cli.demandCommand().parse();
