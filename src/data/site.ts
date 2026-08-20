import { absolute } from '../lib/url';

// Single source for the club identity, so the same sentence never drifts
// between the footer, the home page and the structured data.
export const ORG_NAME = 'Generative Artists Club';
export const ORG_SHORT_NAME = 'GenArtClub';

/** Verbatim from the original site, singular "Artist" and all. */
export const TAGLINE =
  'The Generative Artist Club was founded as a Parisian salon to give the third wave of generative artists a common place to talk shop.';

export const DESCRIPTION =
  'The Generative Artists Club is a community of generative artists who automate their artistic vision through rule-based systems, across digital mediums, crypto environments, robotics and light.';

/**
 * The rule that decides who appears in the directory. Stated to readers on the
 * credits page and to crawlers in llms.txt, from here, because a summary of this
 * club that leaves it out gets the club wrong.
 */
export const MEMBERSHIP =
  'Membership is by co-option: an artist belongs to the club when an existing member brings them in, and only members are listed here.';

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

/**
 * The two entities the whole graph hangs off: the club, and the site that
 * documents it. Every page that references either one repeats these strings, so
 * they are built here and nowhere else.
 */
export function organizationId(site: URL | undefined) {
  return `${absolute('/', site)}#organization`;
}

export function websiteId(site: URL | undefined) {
  return `${absolute('/', site)}#website`;
}

/**
 * Organization node reused by the home page schema and by each artist page. The
 * `@id` travels with it: without one, each embedding would publish a separate
 * anonymous club that a reader could not merge with the others.
 */
export function organization(site: URL | undefined) {
  return {
    '@type': 'Organization',
    '@id': organizationId(site),
    name: ORG_NAME,
    alternateName: ORG_SHORT_NAME,
    url: absolute('/', site),
  };
}
