// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.genartclub.com',
  // Keep the URL shape of the previous site: /artists, not /artists/
  trailingSlash: 'never',
  build: {
    format: 'file',
    // The stylesheet is ~3kB gzipped. Inlining it removes a render-blocking
    // request and, with it, the barrier that delays the home page image script.
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
});
