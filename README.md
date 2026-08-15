# GenArtClub

Website of the Generative Artists Club — a community of generative artists
founded in 2019 as a Parisian salon.

The original site went offline in 2026. It was rebuilt from its last capture on
the [Internet Archive](https://web.archive.org/web/20260312141948/http://www.genartclub.com/)
by [Camille Roux](https://art.camilleroux.com/), a member of the club, with the
agreement of the club and of its previous maintainer.

Built with [Astro](https://astro.build), plain CSS and no UI framework, hosted
on Cloudflare Pages. Community-maintained: fixing your entry or adding an
artwork is a one-file pull request.

## Quick start

```bash
npm install
npm run dev     # local server at http://localhost:4321
npm run build   # static build into dist/
npm run preview # serve the built site
```

## Add or update an artist

Each artist is a single Markdown file in `src/content/artists/`. Use this one as
a complete reference: [`src/content/artists/camille-roux.md`](src/content/artists/camille-roux.md),
rendered at [genartclub.com/artists/camille-roux](https://www.genartclub.com/artists/camille-roux).

A minimal file:

```markdown
---
name: "Jane Doe"
tagline: "Generative artist"
website: "https://example.com/"
socials:
  x: "https://x.com/janedoe"
  instagram: "https://instagram.com/janedoe"
---

An optional short bio, in Markdown.
```

- **`name`** is required, and is the only name displayed: your own name, or the
  alias you sign your work with, written the way you write it. An artist who
  signs with an alias can add their civil name as `realName`, shown next to it —
  leave it out when `name` is already your name. The build rejects a `realName`
  that only repeats `name`, so `name: "Jane Doe"` with `realName: "janedoe"` is
  an error, not a second entry.
- **File name** decides the URL, and nothing else: `jane-doe.md` is served at
  `/artists/jane-doe`. It is slugified from the name, and stays put once
  published so links keep working even if the name changes.
- **`tagline`** is the line under your name: a short description of your
  practice, not a bio — the Markdown body below the frontmatter is for that. It
  reads as a sentence fragment and starts with a capital: `Generative artist`,
  not `generative artist`. `location` and `pronouns` are optional.
- **`socials`** uses fixed keys, so the same network is never labelled two
  different ways: `instagram`, `x`, `bluesky`, `farcaster`, `mastodon`,
  `tiktok`, `youtube`, `reddit`, `telegram`, `discord`, `linkedin`, `github`.
  An unknown key fails the build. They always display in that order, whatever
  order you write them in. Each renders as an icon, except `linkedin`, which
  shows a text label because Simple Icons dropped the logo over a trademark
  request.
- **`platforms`** is a plain list of URLs, shown on your artist page only. Known
  art platforms (fxhash, objkt, teia, gm.studio, SuperRare, OpenSea, Foundation,
  Art Blocks and more) are recognised by domain and labelled properly; anything
  else falls back to its domain. To register a new one, add it to
  [`src/data/platforms.ts`](src/data/platforms.ts). Keep personal sites in
  `website` rather than here.

## Add an artwork

Put the image in `src/assets/artworks/<slug>/` and declare it:

```yaml
artworks:
  - image: "../../assets/artworks/janedoe/my-piece.jpg"
    title: "My piece"
    year: 2024
```

Artworks appear on your artist page. Any image at least 1200px wide also joins
the random rotation of the home page strip, where it is cropped to fit the band
— the full image stays visible on your page. The strip shows at most one work
per artist at a time, so adding ten does not crowd anyone out. `title` and
`year` are optional.

Budget, enforced by the build: at most 10 artworks per artist, longest side
between 1200 and 2560px, under 2MB each. Astro derives every smaller variant, so
a bigger file buys nothing and costs build time for everyone.

## Project structure

```text
src/content/artists/     one Markdown file per artist
src/content.config.ts    schema every artist file is validated against
src/pages/               about (index), artists list, artist pages, 404
src/components/          nav, footer, links, icons, home image strip
src/data/platforms.ts    art platform registry (domain, name, icon)
src/assets/              artworks and platform icons, optimised at build
src/styles/global.css    the whole theme
public/                  logo, favicon, robots.txt, _redirects
```

## Deployment

Pushes to `main` deploy automatically through Cloudflare Pages (build command
`npm run build`, output directory `dist`). Pull requests get a preview URL.

One-time setup in the Cloudflare dashboard:

1. Add `www.genartclub.com` as a custom domain on the Pages project.
2. Add a redirect rule sending `genartclub.com/*` to
   `https://www.genartclub.com/$1` with status 301.
3. Optional: create a Web Analytics site and set `PUBLIC_CF_BEACON_TOKEN` as a
   production environment variable. Without it, no analytics script is emitted,
   so forks and local development stay clean.

Legacy URLs from the previous site are redirected in
[`public/_redirects`](public/_redirects).

## License

Code is [MIT licensed](LICENSE). Texts, artist names and artworks remain the
property of their respective authors; platform and social logos remain the
property of their owners.
