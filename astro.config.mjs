import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kitzero.jokerx04.com',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
});
