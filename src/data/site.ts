// Single source for the club identity, so the same sentence never drifts
// between the footer, the home page and the structured data.
export const ORG_NAME = 'Generative Artists Club';
export const ORG_SHORT_NAME = 'GenArtClub';

/** Verbatim from the original site, singular "Artist" and all. */
export const TAGLINE =
  'The Generative Artist Club was founded as a Parisian salon to give the third wave of generative artists a common place to talk shop.';

export const DESCRIPTION =
  'The Generative Artists Club is a community of generative artists who automate their artistic vision through rule-based systems, across digital mediums, crypto environments, robotics and light.';

export const REPOSITORY = 'https://github.com/camilleroux/genartclub';

/**
 * Who keeps this rebuild running, as the id of their own entry in the
 * directory. Everything else about them, including the links published for the
 * structured data, is read from that file so the two can never disagree.
 */
export const MAINTAINER_SLUG = 'camille-roux';

/** Last archived capture of the original site, kept for attribution. */
export const ARCHIVE_SOURCE =
  'https://web.archive.org/web/20260312141948/http://www.genartclub.com/';

/** Organization node reused by the home page schema and by each artist page. */
export function organization(site: URL | undefined) {
  return {
    '@type': 'Organization',
    name: ORG_NAME,
    alternateName: ORG_SHORT_NAME,
    url: new URL('/', site).href,
  };
}

