// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { lastModified } from './scripts/lastmod.mjs';

// One pass over the git log, reused for every URL in the sitemap.
const modified = lastModified();

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
  integrations: [
    sitemap({
      // Text served to crawlers rather than a page a reader can land on.
      filter: (page) => !page.endsWith('/llms.txt'),
      serialize(item) {
        const lastmod = modified(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
