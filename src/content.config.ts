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

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artists' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      // Club nickname, when it differs from the name.
      handle: z.string().optional(),
      role: z.string().optional(),
      location: z.string().optional(),
      pronouns: z.string().optional(),
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
    }),
});

export const collections = { artists };
