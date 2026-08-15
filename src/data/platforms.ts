// Registry of art platforms, so contributors only have to paste a URL and the
// site knows what to call it. Favicons were tried and dropped: at 22px they are
// a soup of unreadable logos, and the ones that survive make the row look like
// a random mix of pictures and words.
import { hostname } from '../lib/url';

const NAMES: Record<string, string> = {
  'fxhash.xyz': 'fxhash',
  'objkt.com': 'objkt',
  'teia.art': 'teia',
  'gmstudio.art': 'gm.studio',
  'gmscribe.art': 'gm.scribe',
  'brightmoments.io': 'Bright Moments',
  '256art.com': '256ART',
  '256.art': '256ART',
  'superrare.com': 'SuperRare',
  'opensea.io': 'OpenSea',
  'raster.art': 'Raster',
  'verse.works': 'Verse',
  'editart.xyz': 'EditArt',
  'deca.art': 'Deca',
  'are.na': 'Are.na',
  'foundation.app': 'Foundation',
  'artblocks.io': 'Art Blocks',
  'zora.co': 'Zora',
  'manifold.xyz': 'Manifold',
  'exchange.art': 'Exchange.art',
  'async.art': 'Async Art',
  'makersplace.com': 'MakersPlace',
  'knownorigin.io': 'KnownOrigin',
  'artsy.net': 'Artsy',
  'behance.net': 'Behance',
  'dribbble.com': 'Dribbble',
  'vimeo.com': 'Vimeo',
  'openprocessing.org': 'OpenProcessing',
  'shadertoy.com': 'Shadertoy',
  'codepen.io': 'CodePen',
  'patreon.com': 'Patreon',
  'substack.com': 'Substack',
  'medium.com': 'Medium',
  'linktr.ee': 'Linktree',
};

/** How a platform should be labelled, falling back to its domain. */
export function platformName(url: string): string {
  const host = hostname(url);

  // Walk up subdomains so app.brightmoments.io matches brightmoments.io.
  const labels = host.split('.');
  for (let i = 0; i < labels.length - 1; i++) {
    const domain = labels.slice(i).join('.');
    if (NAMES[domain]) return NAMES[domain];
  }

  return host;
}
