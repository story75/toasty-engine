import starlight from '@astrojs/starlight';
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Toasty',
      social: {
        github: 'https://github.com/story75/toasty-engine',
      },
      sidebar: [
        {
          label: 'User guide',
          items: [{ label: 'Getting started', slug: 'users/getting-started' }],
        },
        {
          label: 'Contributor guide',
          items: [
            { label: 'Why Toasty?', slug: 'contributors/goal' },
            { label: 'Getting started', slug: 'contributors/getting-started' },
          ],
        },
      ],
    }),
  ],
});
