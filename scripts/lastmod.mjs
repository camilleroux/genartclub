// Publication dates for the sitemap, read from the git history: nothing else
// here knows when an entry actually changed. A fresh clone stamps every file with
// the time of the checkout, and a date field in the frontmatter would ask
// contributors to maintain something they cannot check.
//
// Shallow clones know only the last commit, which is what Cloudflare Pages and
// actions/checkout give a build by default. Rather than stamp all 300 pages with
// the date of the last deploy, the dates git cannot account for are left out:
// a missing lastmod costs nothing, a wrong one teaches Google to ignore the file.
// Set the Cloudflare build command to `git fetch --unshallow && npm run build`
// to publish real dates.
import { execFileSync } from 'node:child_process';

const ARTISTS_DIR = 'src/content/artists';
const PAGES_DIR = 'src/pages';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

/** Every published path, mapped to the date of the last commit that touched it. */
function commitDates() {
  let output;
  try {
    output = execFileSync(
      'git',
      // Only the two trees a URL can resolve to, so the output stays proportional
      // to what is asked of it rather than to the length of the history.
      ['log', '--no-merges', '--pretty=format:%cI', '--name-only', '--', ARTISTS_DIR, PAGES_DIR],
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        // The default 1MB would be reached in a few thousand commits, and an
        // overflow arrives here as a throw, indistinguishable from having no git.
        maxBuffer: 64 * 1024 * 1024,
      },
    );
  } catch {
    // No git, no history, not a repository: all the same answer here.
    return new Map();
  }

  const dates = new Map();
  let date;

  for (const line of output.split('\n')) {
    if (!line) continue;
    if (ISO_DATE.test(line)) {
      date = line;
    } else if (date && !dates.has(line)) {
      // Newest commit first, so the first date a path is listed under is the
      // one to publish.
      dates.set(line, date);
    }
  }

  return dates;
}

/** Committer dates carry their own offset, so they compare as instants, not text. */
function newest(candidates) {
  const known = candidates.filter((date) => date !== undefined);
  if (!known.length) return undefined;
  return known.reduce((a, b) => (Date.parse(a) >= Date.parse(b) ? a : b));
}

/**
 * Resolves a sitemap URL to the date of its source, or to undefined when the
 * history does not reach it.
 */
export function lastModified() {
  const dates = commitDates();

  const entriesChanged = newest(
    [...dates].filter(([path]) => path.startsWith(`${ARTISTS_DIR}/`)).map(([, date]) => date),
  );

  return (url) => {
    const path = new URL(url).pathname;

    // Its own template only, deliberately. A new artwork does change the markup
    // of the home page, but only the pool the band shuffles from, and that band is
    // reshuffled on every visit anyway. Dating the page from it would announce a
    // change to the reader every day of a membership drive and describe none, which
    // is how a sitemap teaches Google to stop believing its own lastmod.
    if (path === '/') return dates.get(`${PAGES_DIR}/index.astro`);

    // The roster, by contrast, is what any member file rewrites: a name added or
    // a tagline corrected is a change to this page and to nothing else.
    if (path === '/artists') {
      return newest([dates.get(`${PAGES_DIR}/artists/index.astro`), entriesChanged]);
    }

    const slug = /^\/artists\/(.+)$/.exec(path)?.[1];
    if (slug) return dates.get(`${ARTISTS_DIR}/${slug}.md`);

    return dates.get(`${PAGES_DIR}${path}.astro`);
  };
}
