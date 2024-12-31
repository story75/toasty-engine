#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { bundle } from './commands/bundle';
import { readme } from './commands/readme';

const cli = yargs(hideBin(Bun.argv))
  .scriptName('toasty-cli')
  .wrap(120)
  .strict()
  .version(false)
  .help(true);

const commands = [readme, bundle];

for (const command of commands) {
  command(cli);
}
await cli.demandCommand().parse();
