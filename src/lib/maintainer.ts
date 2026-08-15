import { getEntry } from 'astro:content';
import { MAINTAINER_SLUG } from '../data/site';
import { personNode } from './artist';

/**
 * The maintainer as a directory member: read from their own entry so the credit
 * and the structured data can never drift from the file they maintain.
 * "maintainer" is the honest schema.org relationship here — whoever manages
 * contributions and publication, without claiming authorship of the club.
 */
export async function getMaintainer(site: URL | undefined) {
  const entry = await getEntry('artists', MAINTAINER_SLUG);
  if (!entry) {
    throw new Error(
      `Maintainer "${MAINTAINER_SLUG}" has no entry in src/content/artists. Update MAINTAINER_SLUG in src/data/site.ts.`,
    );
  }

  return {
    name: entry.data.name,
    website: entry.data.website,
    node: personNode(entry, site),
  };
}
