// Pages are built as files (/artists.html) but served at clean URLs
// (/artists), so the .html suffix has to be stripped before a pathname is
// compared or published.
export function cleanPathname(pathname: string): string {
  const path = pathname.replace(/(?:index)?\.html$/, '').replace(/(.+)\/$/, '$1');
  return path || '/';
}

export function artistPath(id: string): string {
  return `/artists/${id}`;
}

/** Readable host for display, and the key platforms are matched on. */
export function hostname(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
}

export function artworkAlt(title: string | undefined, artistName: string): string {
  return title ? `${title} by ${artistName}` : `Work by ${artistName}`;
}
