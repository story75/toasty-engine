// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: 'vitest.config.mts',
    test: {
      name: 'node',
    },
  },
  {
    extends: 'vitest.config.mts',
    test: {
      include: ['**/*.browser.{test,spec}.?(c|m)[jt]s?(x)'],
      name: 'browser',
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        // https://playwright.dev
        providerOptions: {},
      },
    },
  },
]);
