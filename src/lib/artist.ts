import type { CollectionEntry } from 'astro:content';
import { artistPath } from './url';

/**
 * The Person node for an artist, built from their own file so every page that
 * mentions them describes the same entity. The shared `@id` says so explicitly,
 * which is what lets a search engine merge the mentions instead of reading them
 * as several people who happen to share a name.
 */
export function personNode(artist: CollectionEntry<'artists'>, site: URL | undefined) {
  const { data } = artist;
  const page = new URL(artistPath(artist.id), site).href;
  const sameAs = [
    data.website,
    ...Object.values(data.socials ?? {}),
    ...(data.platforms ?? []),
  ].filter((url): url is string => url !== undefined);

  return {
    '@type': 'Person',
    '@id': `${page}#person`,
    name: data.name,
    url: page,
    // `name` is what they are known as, so the civil name is the alternate one.
    ...(data.realName ? { alternateName: data.realName } : {}),
    // A tagline is a short description of the practice, which is what it maps to.
    // `jobTitle` would read it as an occupation, which it is only most of the time.
    ...(data.tagline ? { description: data.tagline } : {}),
    ...(data.location ? { homeLocation: { '@type': 'Place', name: data.location } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
