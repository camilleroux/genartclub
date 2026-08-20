// The image budget, shared by the site and by the pre-build guard.
// Plain JavaScript on purpose: scripts/check-images.mjs runs on bare Node and
// cannot import a TypeScript module, and these numbers have to agree or the
// guard would warn about a rule the site does not apply.

/** Below this width, an artwork stays on its artist page but never joins the home strip. */
export const MIN_STRIP_WIDTH = 1200;

/** The site never displays an artwork wider than about 1300px, so this is ample. */
export const MAX_EDGE = 2560;

export const MAX_BYTES = 2 * 1024 * 1024;

/**
 * The square an avatar is cropped to at build time, and therefore the smallest
 * source worth supplying: it covers the 100px circle on an artist page at a
 * little over three times the density.
 */
export const AVATAR_EDGE = 320;

/**
 * Twice the square it is cropped to, which is the headroom artworks get over
 * their own display width. Beyond it, every pixel is decoded by sharp, thrown
 * away, and still carried in every clone.
 */
export const AVATAR_MAX_EDGE = 2 * AVATAR_EDGE;

export const AVATAR_MAX_BYTES = 128 * 1024;
