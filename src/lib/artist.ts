import type { CollectionEntry } from 'astro:content';
import { artistPath } from './url';

type Identity = { name: string; handle?: string };

/**
 * The name an artist signs with. In this scene that is usually the handle, so
 * "ippsketch" wins over "Jeff"; artists listed under their own name have no
 * handle and keep it.
 */
export function displayName({ name, handle }: Identity): string {
  return handle ?? name;
}

/** The legal or full name, when it says something the display name does not. */
export function secondaryName({ name, handle }: Identity): string | undefined {
  if (!handle) return undefined;
  const same = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return same(handle) === same(name) ? undefined : name;
}

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
    ...(data.handle ? { alternateName: data.handle } : {}),
    ...(data.role ? { jobTitle: data.role } : {}),
    ...(data.location ? { homeLocation: { '@type': 'Place', name: data.location } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
