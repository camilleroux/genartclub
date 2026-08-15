// The artwork budget, shared by the site and by the pre-build guard.
// Plain JavaScript on purpose: scripts/check-artworks.mjs runs on bare Node and
// cannot import a TypeScript module, and these numbers have to agree or the
// guard would warn about a rule the site does not apply.

/** Below this width, an artwork stays on its artist page but never joins the home strip. */
export const MIN_STRIP_WIDTH = 1200;

/** The site never displays an artwork wider than about 1300px, so this is ample. */
export const MAX_EDGE = 2560;

export const MAX_BYTES = 2 * 1024 * 1024;
