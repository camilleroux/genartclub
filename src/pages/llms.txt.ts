// What the club is, and who is in it, in the one file an assistant fetches
// before answering a question about a site. An endpoint rather than a file in
// public/, so the roster it publishes is the collection itself and cannot fall
// behind the directory it summarises.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { artistUrl, sortedByName } from '../lib/artist';
import { getMaintainer } from '../lib/maintainer';
import { absolute } from '../lib/url';
import { DESCRIPTION, MEMBERSHIP, ORG_NAME, REPOSITORY, TAGLINE } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const members = sortedByName(await getCollection('artists'));
  const maintainer = await getMaintainer(site);

  const roster = members.map((artist) => {
    const link = `- [${artist.data.name}](${artistUrl(artist, site)})`;
    // A tagline is the artist's own line about their practice. Nothing stands in
    // for it when it is missing.
    return artist.data.tagline ? `${link}: ${artist.data.tagline}` : link;
  });

  const body = [
    `# ${ORG_NAME}`,
    '',
    `> ${DESCRIPTION}`,
    '',
    TAGLINE,
    '',
    MEMBERSHIP,
    '',
    'Each member has one page here, which links to their own site and profiles. The',
    'work itself lives with the artists: this site publishes the directory, not the art.',
    '',
    `The site is maintained by ${maintainer.name} (${maintainer.page}), a member of the club.`,
    `It is open source, one Markdown file per member, and corrections come as pull requests: ${REPOSITORY}`,
    '',
    '## Pages',
    '',
    `- [Artists](${absolute('/artists', site)}): all ${members.length} members, alphabetically, with links to their work.`,
    `- [About this site](${absolute('/credits', site)}): what this site is, who maintains it, and how to contribute.`,
    '',
    '## Members',
    '',
    ...roster,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
