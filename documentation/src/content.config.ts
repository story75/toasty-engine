import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  packages: defineCollection({
    loader: glob({ pattern: '*/package.json', base: './src/data/packages' }),
    schema: z.object({
      name: z.string(),
      description: z.string(),
    }),
  }),
  examples: defineCollection({
    loader: glob({ pattern: '*/package.json', base: './src/data/examples' }),
    schema: z.object({
      name: z.string(),
      description: z.string(),
    }),
  }),
};
