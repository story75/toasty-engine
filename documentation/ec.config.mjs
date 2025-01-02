import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default {
  styleOverrides: { borderRadius: '0.3rem' },
  themes: ['light-plus', 'github-dark'],
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
};
