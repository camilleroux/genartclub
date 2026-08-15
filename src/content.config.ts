import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

// Social networks are a closed set: fixed keys keep labels consistent between
// contributions and let every network render with its own icon. The order here
// is the display order.
const socials = z
  .object({
    instagram: z.url().optional(),
    x: z.url().optional(),
    bluesky: z.url().optional(),
    farcaster: z.url().optional(),
    mastodon: z.url().optional(),
    tiktok: z.url().optional(),
    youtube: z.url().optional(),
    reddit: z.url().optional(),
    telegram: z.url().optional(),
    discord: z.url().optional(),
    linkedin: z.url().optional(),
    // Code last: it says where the work is made, not where it is shown.
    github: z.url().optional(),
  })
  .strict();

export type SocialKey = keyof z.infer<typeof socials>;

export const SOCIAL_KEYS = socials.keyof().options;

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: 'Instagram',
  x: 'X',
  bluesky: 'Bluesky',
  farcaster: 'Farcaster',
  mastodon: 'Mastodon',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  reddit: 'Reddit',
  telegram: 'Telegram',
  discord: 'Discord',
  linkedin: 'LinkedIn',
  github: 'GitHub',
};

/**
 * Enough to show a body of work without one member dominating the repository.
 * Image dimensions and weight cannot be checked here: at validation time
 * `image()` still holds a path marker, not the resolved file, so that budget is
 * enforced by scripts/check-artworks.mjs before every build.
 */
const MAX_ARTWORKS = 10;

/** Ignores case, spacing and punctuation: "Jeff Palmer" and "jeffpalmer" fold alike. */
const fold = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artists' }),
  schema: ({ image }) =>
    z
      .object({
        /**
         * The name the artist is credited under, on every page that mentions
         * them: their own name, or the alias they sign their work with. This is
         * the displayed one, so it is written the way they write it.
         */
        name: z
          .string()
          .refine((name) => !name.startsWith('@'), {
            error: 'Write the name as it is signed, without the leading @.',
          })
          .refine((name) => name.trim() === name, {
            error: 'Remove the surrounding whitespace.',
          }),
        /**
         * The civil name of an artist who signs with an alias, for those who
         * want it on record. Nothing to fill in when `name` is already it.
         */
        realName: z.string().optional(),
        /** The line under the name: a short description of the practice, not a bio. */
        tagline: z
          .string()
          .refine((tagline) => /^[^\p{L}]*\p{Lu}/u.test(tagline), {
            error: 'Taglines read as sentence fragments here, so start with a capital.',
          })
          .optional(),
        // Declared in the order they are shown, under the name.
        pronouns: z.string().optional(),
        location: z.string().optional(),
        website: z.url().optional(),
        socials: socials.optional(),
        // Plain list of URLs: known art platforms are matched by domain.
        platforms: z.array(z.url()).optional(),
        artworks: z
          .array(
            z.object({
              image: image(),
              title: z.string().optional(),
              year: z.number().int().min(1950).max(2100).optional(),
            }),
          )
          .max(MAX_ARTWORKS, {
            error: `Please keep it to ${MAX_ARTWORKS} artworks: the home page shows one work per artist anyway.`,
          })
          .optional(),
      })
      // An unknown key is a typo or a field that no longer exists, and silently
      // dropping it would publish a page missing what the contributor wrote.
      .strict()
      .refine((artist) => !artist.realName || fold(artist.realName) !== fold(artist.name), {
        path: ['realName'],
        error:
          'realName repeats name. It is only for artists who sign with an alias: drop it, and write name the way you sign.',
      }),
});

export const collections = { artists };
