import { getImage } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import { absolute, artistPath } from './url';

/**
 * The width the artist page renders a work at. Shared with the structured data
 * so both ask the pipeline for the same derivative, instead of emitting a second
 * copy of every image for the sake of a URL in a JSON-LD block.
 */
export const ARTWORK_WIDTH = 1200;

/**
 * Sorts ignoring case, accents and any leading punctuation, so ".jpg" and "Anna"
 * both land under the letter a reader would look for them.
 */
const sortKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^[^a-z0-9]+/, '');

/** The section a name is filed under, or "#" for the ones no letter claims. */
export function letterFor(name: string) {
  return /^[a-z]/.exec(sortKey(name))?.[0].toUpperCase() ?? '#';
}

/** The directory order, shared by the page and by llms.txt so both read alike. */
export function sortedByName(artists: CollectionEntry<'artists'>[]) {
  // Keyed before sorting, so each name is normalised once instead of once per
  // comparison it takes part in.
  return artists
    .map((artist) => ({ artist, key: sortKey(artist.data.name) }))
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ artist }) => artist);
}

export function artistUrl(artist: CollectionEntry<'artists'>, site: URL | undefined) {
  return absolute(artistPath(artist.id), site);
}

/**
 * The identifier of an artist as an entity, rather than of the page about them.
 * Every mention across the site repeats it, so the format lives here once.
 */
export function personId(artist: CollectionEntry<'artists'>, site: URL | undefined) {
  return `${artistUrl(artist, site)}#person`;
}

/**
 * The Person node for an artist, built from their own file so every page that
 * mentions them describes the same entity. The shared `@id` says so explicitly,
 * which is what lets a search engine merge the mentions instead of reading them
 * as several people who happen to share a name.
 */
export function personNode(artist: CollectionEntry<'artists'>, site: URL | undefined) {
  const { data } = artist;
  const page = artistUrl(artist, site);
  const sameAs = [
    data.website,
    ...Object.values(data.socials ?? {}),
    ...(data.platforms ?? []),
  ].filter((url): url is string => url !== undefined);

  return {
    '@type': 'Person',
    '@id': personId(artist, site),
    name: data.name,
    url: page,
    // True wherever this node is embedded: the home page describes its
    // maintainer with the same statement, pointing at their own entry.
    mainEntityOfPage: page,
    // `name` is what they are known as, so the civil name is the alternate one.
    ...(data.realName ? { alternateName: data.realName } : {}),
    // A tagline is a short description of the practice, which is what it maps to.
    // `jobTitle` would read it as an occupation, which it is only most of the time.
    ...(data.tagline ? { description: data.tagline } : {}),
    ...(data.location ? { homeLocation: { '@type': 'Place', name: data.location } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/**
 * The works shown on an artist page, as entities of their own, credited to the
 * artist through the same `@id` their Person node carries.
 *
 * The URL comes from the image pipeline rather than from `image.src`, which would
 * publish the untouched source: the same picture at nine times the weight, and a
 * file that stays in the build only as long as the bundler keeps emitting an
 * original nothing on the site references. This asks for what the page serves.
 */
export async function artworkNodes(artist: CollectionEntry<'artists'>, site: URL | undefined) {
  const page = artistUrl(artist, site);
  const creator = { '@id': personId(artist, site) };

  return Promise.all(
    (artist.data.artworks ?? []).map(async (artwork, index) => {
      const rendered = await getImage({ src: artwork.image, width: ARTWORK_WIDTH });

      return {
        '@type': 'VisualArtwork',
        '@id': `${page}#work-${index + 1}`,
        // Untitled works stay untitled: the caption invents no name either.
        ...(artwork.title ? { name: artwork.title } : {}),
        ...(artwork.year ? { dateCreated: String(artwork.year) } : {}),
        image: absolute(rendered.src, site),
        creator,
      };
    }),
  );
}
