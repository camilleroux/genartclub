# Contributing

Everything on this site comes from small, readable files. You do not need to
know Astro to contribute — most changes touch a single Markdown file.

Delegating this to a coding agent? Point it at [AGENTS.md](AGENTS.md) as well,
which covers the mistakes agents make on a directory of real people.

## Not comfortable with Git?

Open an issue using the **Add or update an artist** template and a maintainer
will turn it into a pull request.

## The usual flow

1. Fork the repository and create a branch.
2. Edit or add one file in `src/content/artists/` (see the README for the fields
   and a reference file).
3. If you are adding artworks, put the images in
   `src/assets/artworks/<your-slug>/` and reference them from your file.
4. Run `npm install` then `npm run build`. The build validates every artist file
   against the schema in `src/content.config.ts`, so a typo or an unknown field
   fails the build with a clear message instead of breaking the site.
5. If you touched anything outside `src/content/artists/`, run `npm run format`.
   Artist files are left alone by the formatter, so nothing reshapes your entry
   behind your back.
6. Open a pull request. It is built automatically, so you get the same message
   here if something is off. Pull requests from a branch of this repository also
   get a Cloudflare preview URL; those from a fork do not, so check your page
   locally with `npm run dev`.

## What we ask

- **Members only.** The club works by co-option: an artist belongs to it when an
  existing member brings them in, and only members are listed here. A pull
  request adding someone who has not been co-opted will be declined.
- **Only add yourself, or fix obvious errors.** If you want to add someone else,
  please make sure they are fine with it.
- **`name` is how you are credited**, and the only name shown: your own name or
  the alias you sign with, whichever you want readers to see. It is not an
  identifier — the URL comes from the file name and does not change with it. Sign
  with an alias and want your civil name on record too? Add `realName`.
- **No email addresses.** They get scraped; use your website or a social profile.
- **Links must work.** Dead links are removed when we notice them.
- **Images:** JPEG, PNG or WebP, with a longest side between 1200 and 2560px and
  under 2MB. Astro generates every smaller variant, so there is nothing to gain
  from a larger file: the site never displays an artwork wider than about 1300px,
  and oversized sources only slow the build and bloat the repository. `npm run
  build` refuses anything over budget, and warns when an image is under 1200px
  wide, since those stay on your page but never join the home page strip.
- **Up to 10 artworks each.** The home page shows one work per artist at a time,
  so more would not give you more visibility.
- **Keep the file in English**, like the rest of the repository.

## Adding a platform

If your platform shows up as a bare domain, add it to `src/data/platforms.ts`
with the name it should display. Platforms are typeset, not pictured: favicons
were tried and dropped because most brand logos are illegible at that size and
the mix of pictures and words looked accidental.

## Style

- Plain CSS in `src/styles/global.css`, no framework, no preprocessor.
- Design tokens (colours, type scale, spacing) live at the top of that file.
  Prefer reusing a token over hardcoding a value.
- No client-side JavaScript unless there is no other way. The only script on the
  site shuffles the home page strip.
