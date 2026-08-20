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
name: 'Jane Doe'
tagline: 'Generative artist'
website: 'https://example.com/'
socials:
  x: 'https://x.com/janedoe'
  instagram: 'https://instagram.com/janedoe'
---

An optional short bio, in Markdown.
```

`name` is the only required field. Everything else is optional, but a key that
is not in the list below fails the build rather than being dropped silently, so
a typo is caught instead of quietly costing you a link.

- **`name`** is the only name displayed: your own name, or the alias you sign
  your work with, written the way you write it — no leading `@`. An artist who
  signs with an alias can add their civil name as **`realName`**, shown next to
  it; leave it out when `name` is already your name. The build rejects a
  `realName` that only repeats `name`, so `name: "Jane Doe"` with
  `realName: "janedoe"` is an error, not a second entry.
- **File name** decides the URL, and nothing else: `jane-doe.md` is served at
  `/artists/jane-doe`. It is slugified from the name, and stays put once
  published so links keep working even if the name changes.
- **`tagline`** is the line under your name: a short description of your
  practice, not a bio — the Markdown body below the frontmatter is for that. It
  reads as a sentence fragment and starts with a capital: `Generative artist`,
  not `generative artist`. It follows you into the artists list and into the
  page description search engines show.
- **`avatar`** is the image you are known by, shown beside your name, or above it
  on a narrow screen: a face, one of your works, a mark, whichever you prefer —
  the field is not called a portrait because nothing here asks you to show your
  face. It is a path to a file in `src/assets/avatars/`, cropped to a square from
  the middle at build time and displayed in a circle, so centre what matters and
  expect the corners to go. It appears on your page only: the members list has
  none, and a page without one shows nothing in its place rather than a
  placeholder. Longest side at most 640px, under 128kB — it is only ever shown
  small, so a bigger file is decoded at build time and thrown away; anything under
  320px on its shorter side is accepted with a note, since that is the square it
  gets scaled up to fill.
- **`pronouns`** and **`location`** are free text, shown on one line under the
  name, after `realName` and in that order: `he/him`, `Montpellier, France`.
- **`website`** is your own site, and the first link under your name. It shows
  as its domain on your page, and as the word Website in the artists list.
- **`socials`** uses fixed keys, so the same network is never labelled two
  different ways: `instagram`, `x`, `bluesky`, `farcaster`, `mastodon`,
  `tiktok`, `youtube`, `reddit`, `telegram`, `discord`, `linkedin`, `github`.
  An unknown key fails the build. They always display in that order, whatever
  order you write them in. Each renders as an icon, except `linkedin`, which
  shows a text label because Simple Icons dropped the logo over a trademark
  request. The artists list has room for two, so it shows Instagram and X only —
  your page shows them all.
- **`platforms`** is a plain list of URLs, shown on your artist page only. Known
  art platforms (fxhash, objkt, teia, gm.studio, SuperRare, OpenSea, Foundation,
  Art Blocks and more) are recognised by domain and labelled properly; anything
  else falls back to its domain. To register a new one, add it to
  [`src/data/platforms.ts`](src/data/platforms.ts). Keep personal sites in
  `website` rather than here.
- **The Markdown body**, everything below the closing `---`, is your bio. It is
  shown on your page only, between your links and your artworks, and can be left
  empty. A short paragraph or two in the third person matches the rest of the
  site.

Every link you declare — `website`, `socials`, `platforms` — is also emitted as
`sameAs` in the JSON-LD `Person` of your page, which is how a search engine ties
this entry to the accounts you already have. An `avatar` is emitted there too, as
`image`, which is the picture a search engine can show beside your name.

## Add an artwork

Put the image in `src/assets/artworks/<slug>/` and declare it:

```yaml
artworks:
  - image: '../../assets/artworks/janedoe/my-piece.jpg'
    title: 'My piece'
    year: 2024
```

`image` is a path relative to your Markdown file, and the file has to exist:
a missing image fails the build. JPEG, PNG and WebP are all fine. `title` and
`year` are optional, and are shown as a caption under the work. The alt text is
written for you from them: `My piece by Jane Doe`, or `Work by Jane Doe` when
there is no title.

Artworks appear on your artist page, in the order you declare them. Any image at
least 1200px wide also joins the random rotation of the home page strip, where
it is cropped to fit the band — the full image stays visible on your page. The
strip shows at most one work per artist at a time, so adding ten does not crowd
anyone out.

Budget, enforced by the build: at most 10 artworks per artist, longest side at
most 2560px, under 2MB each. Astro derives every smaller variant, so a bigger
file buys nothing and costs build time for everyone. Narrower than 1200px is
allowed and only reported as a note, since the paragraph above is the only thing
it changes.

## Project structure

```text
src/content/artists/     one Markdown file per artist
src/content.config.ts    schema every artist file is validated against
src/pages/               about (index), artists list, artist pages, credits, 404,
                         llms.txt
src/components/          nav, footer, links, icons, home image strip
src/data/platforms.ts    art platform registry (domain, name, icon)
src/assets/              artworks, avatars and platform icons, optimised at build
src/styles/global.css    the whole theme
public/                  logo, favicon, robots.txt, _redirects
```

## Deployment

Pushes to `main` deploy automatically through Cloudflare Pages (output directory
`dist`). Pull requests get a preview URL.

One-time setup in the Cloudflare dashboard:

1. Set the build command to `git fetch --unshallow && npm run build`. Pages clones
   only the last commit, and the sitemap dates each page from the git history: with
   a shallow clone every `lastmod` is left out, because a date the history cannot
   account for is omitted rather than guessed.
2. Add `www.genartclub.com` as a custom domain on the Pages project.
3. Add a redirect rule sending `genartclub.com/*` to
   `https://www.genartclub.com/$1` with status 301.
4. Optional: enable Web Analytics from the Metrics tab of the Pages project.
   Cloudflare then injects its beacon into the deployed HTML itself, so the
   repository carries no analytics code and forks and local builds stay clean.
   Adding the snippet by hand on top of that would only count every visit twice.

Legacy URLs from the previous site are redirected in
[`public/_redirects`](public/_redirects).

## License

Code is [MIT licensed](LICENSE). Texts, artist names and artworks remain the
property of their respective authors; platform and social logos remain the
property of their owners.
