# Working on this repository

This site is a public directory of real people, published from one Markdown file
per artist. What a contribution needs — the fields, the image budget, the rules —
is in [CONTRIBUTING.md](CONTRIBUTING.md) and the [README](README.md). Read those
first. What follows is only what an agent gets wrong and a human does not.

## Never invent anything about a person

The schema checks that a social link is a URL. It cannot check that the URL
belongs to the artist it is filed under, and `instagram.com/<their name>` is a
guess. A wrong guess here hands a stranger's account to a member, under their
name, on a page they did not write.

Take every value from a page that already carries it: their own site, a profile
that links back with `rel="me"`, a post they signed. Open it before writing it
down. Homonyms are the norm, not the exception — one handle in this directory
matched three live Mastodon accounts, and only one of them linked back to the
artist's site. When nothing confirms a field, leave it out.

## Never rename a file in src/content/artists/

The file name is the URL, and those URLs are indexed. `jeffpalmer.md` stays
`jeffpalmer.md` even though the page is titled "Jeff Palmer"; the two are
allowed to differ, and the displayed name can change without the URL following.
A rename needs a 301 in [public/\_redirects](public/_redirects), which makes it a
deliberate decision rather than a tidy-up.

## Never add someone who has not been co-opted

An artist belongs to the club when an existing member brings them in. A list of
names, however credible its source, is not a list of members.

## Fix the data, not the guard

`npm run build` validates every file against `src/content.config.ts` and every
image against `scripts/check-images.mjs`. Those messages are the
specification, written for the contributor who will read them. When one fires,
the file is wrong, not the rule.

## Absences that are deliberate

An `avatar` appears on an artist's own page and nowhere else. In the list of
members it would show for some and not others, which is why it stays off there,
and on a page that has none nothing takes its place: no placeholder, no initials,
no reserved space. It is whatever the artist chose to be known by — a face, one of
their works, a mark — so never describe it as a portrait, and never fetch one from
a profile they did not put in their file.

Art platforms are typeset rather than pictured, for the reason given in
CONTRIBUTING.md. The only client-side script shuffles the home page band.
