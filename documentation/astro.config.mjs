// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightHeadingBadges from 'starlight-heading-badges';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightLinksValidator(), starlightHeadingBadges()],
      title: 'Toasty',
      social: {
        github: 'https://github.com/story75/toasty-engine',
      },
      sidebar: [
        {
          label: 'User guide',
          items: [
            { label: 'Getting started', slug: 'users/getting-started' },
            { label: 'Packages', slug: 'users/packages' },
            { label: 'Examples', slug: 'users/examples' },
          ],
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
