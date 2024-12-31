import { type BuildOptions, build } from 'esbuild';
import type yargs from 'yargs';

export function bundle(cli: ReturnType<typeof yargs>): void {
  cli.command('bundle', 'Bundle a package', async () => {
    const files = {
      cjs: 'dist/index.js',
      esm: 'dist/esm.js',
    };

    const options = (format: 'cjs' | 'esm'): BuildOptions => ({
      entryPoints: ['src/index.ts'],
      outfile: files[format],
      bundle: true,
      packages: 'external',
      platform: 'node',
      format,
      sourcemap: true,
      loader: {
        '.wgsl': 'text',
        '.png': 'dataurl',
      },
    });

    await Promise.all([build(options('cjs')), build(options('esm'))]);
  });
}
