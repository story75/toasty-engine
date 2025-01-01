import { join } from 'node:path';
// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightHeadingBadges from 'starlight-heading-badges';
import starlightLinksValidator from 'starlight-links-validator';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          exclude: ['/api/**/*'],
        }),
        starlightHeadingBadges(),
        starlightTypeDoc({
          entryPoints: ['../packages/*'],
          sidebar: {
            label: 'API reference (auto-generated)',
            collapsed: true,
          },
          typeDoc: {
            // mergeReadme and readme seem to be ignored by starlight-typedoc
            // CAUTION: do not use "outputFileStrategy": "modules" as it will break the sidebar
            entryPointStrategy: 'packages',
            enumMembersFormat: 'table',
            parametersFormat: 'table',
            indexFormat: 'table',
            useCodeBlocks: true,
            expandObjects: true,
            expandParameters: true,
            mergeReadme: true,
            excludeScopesInPaths: true,
            blockTagsPreserveOrder: ['@remarks', '@example', '@deprecated'],
            packageOptions: {
              entryPoints: ['src/index.ts'],
              readme: 'README.md',
            },
          },
        }),
      ],
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
        typeDocSidebarGroup,
      ],
    }),
  ],
});
