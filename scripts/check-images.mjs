// Keeps the image budget honest before every build.
//
// The site never displays an artwork wider than about 1300px, nor an avatar
// larger than a small circle, so pixels beyond that are downloaded by nobody
// while still costing build minutes on every deploy and weight in every clone.
// This cannot live in the content schema: during validation `image()` is still an
// unresolved path marker.
import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import sharp from 'sharp';
import {
  AVATAR_EDGE,
  AVATAR_MAX_BYTES,
  AVATAR_MAX_EDGE,
  MAX_BYTES,
  MAX_EDGE,
  MIN_STRIP_WIDTH,
} from '../src/data/image-budget.mjs';

const IMAGE_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

// The limits are round numbers by construction, so they are printed as written
// while a measured size is rounded away from them. Rounding both would produce
// "512kB. Compress it under 512kB." for every file that just missed.
const megabytes = (bytes) => `${Math.ceil((bytes / 1024 / 1024) * 10) / 10}MB`;
const kilobytes = (bytes) => `${Math.ceil(bytes / 1024)}kB`;
const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const errors = [];
const notes = [];
const counts = [];

/**
 * Dimensions and weight of every image in a tree, named as a contributor wrote
 * it. Returns nothing at all when the directory is absent, which is how a clone
 * with no avatar in it looks.
 */
async function measure(dir, noun) {
  if (!existsSync(dir)) return [];

  // Anything else in there is not ours to validate, and would only make sharp
  // throw an error less helpful than the ones below.
  const files = walk(dir).filter((file) => IMAGE_TYPES.has(extname(file).toLowerCase()));
  counts.push(plural(files.length, noun));

  const measured = await Promise.all(
    files.map(async (file) => {
      const { width, height } = await sharp(file).metadata();
      return { name: relative(dir, file), width, height, size: statSync(file).size };
    }),
  );

  return measured.filter(({ name, width, height }) => {
    if (width && height) return true;
    errors.push(`${name}: unreadable dimensions. Is it a valid image?`);
    return false;
  });
}

for (const { name, width, height, size } of await measure('src/assets/artworks', 'artwork')) {
  if (Math.max(width, height) > MAX_EDGE) {
    errors.push(
      `${name}: ${width}x${height}px. Resize so the longest side is at most ${MAX_EDGE}px.`,
    );
  }
  if (size > MAX_BYTES) {
    errors.push(`${name}: ${megabytes(size)}. Compress it under ${MAX_BYTES / 1024 / 1024}MB.`);
  }
  if (width < MIN_STRIP_WIDTH) {
    notes.push(`${name}: ${width}px wide, too narrow for the home page strip.`);
  }
}

for (const { name, width, height, size } of await measure('src/assets/avatars', 'avatar')) {
  if (Math.max(width, height) > AVATAR_MAX_EDGE) {
    errors.push(
      `${name}: ${width}x${height}px. An avatar is shown in a small circle: resize so the longest side is at most ${AVATAR_MAX_EDGE}px.`,
    );
  }
  if (size > AVATAR_MAX_BYTES) {
    errors.push(`${name}: ${kilobytes(size)}. Compress it under ${AVATAR_MAX_BYTES / 1024}kB.`);
  }
  // Cropped to a square, so it is the shorter side that has to reach it.
  if (Math.min(width, height) < AVATAR_EDGE) {
    notes.push(
      `${name}: ${width}x${height}px, upscaled to fill the ${AVATAR_EDGE}px square it is cropped to.`,
    );
  }
}

for (const note of notes) console.log(`note  ${note}`);

if (errors.length) {
  console.error(`\n${plural(errors.length, 'image')} over budget:\n`);
  for (const error of errors) console.error(`  ${error}`);
  console.error('');
  process.exit(1);
}

if (counts.length) console.log(`${counts.join(', ')} within budget.`);
