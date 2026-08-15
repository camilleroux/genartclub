// Keeps the image budget honest before every build.
//
// The site never displays an artwork wider than about 1300px, so pixels beyond
// that are downloaded by nobody while still costing build minutes on every
// deploy and weight in every clone. This cannot live in the content schema:
// during validation `image()` is still an unresolved path marker.
import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import sharp from 'sharp';
import { MAX_BYTES, MAX_EDGE, MIN_STRIP_WIDTH } from '../src/data/image-budget.mjs';

const DIR = 'src/assets/artworks';
const IMAGE_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

if (!existsSync(DIR)) process.exit(0);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );

// Anything else in there is not ours to validate, and would only make sharp
// throw an error less helpful than the ones below.
const files = walk(DIR).filter((file) => IMAGE_TYPES.has(extname(file).toLowerCase()));

const errors = [];
const notes = [];

for (const file of files) {
  const { width, height } = await sharp(file).metadata();
  const { size } = statSync(file);
  const name = file.replace(`${DIR}/`, '');

  if (!width || !height) {
    errors.push(`${name}: unreadable dimensions. Is it a valid image?`);
    continue;
  }
  if (Math.max(width, height) > MAX_EDGE) {
    errors.push(
      `${name}: ${width}x${height}px. Resize so the longest side is at most ${MAX_EDGE}px.`,
    );
  }
  if (size > MAX_BYTES) {
    errors.push(
      `${name}: ${(size / 1024 / 1024).toFixed(1)}MB. Compress it under ${MAX_BYTES / 1024 / 1024}MB.`,
    );
  }
  if (width < MIN_STRIP_WIDTH) {
    notes.push(`${name}: ${width}px wide, too narrow for the home page strip.`);
  }
}

for (const note of notes) console.log(`note  ${note}`);

if (errors.length) {
  console.error(`\n${errors.length} artwork(s) over budget:\n`);
  for (const error of errors) console.error(`  ${error}`);
  console.error('');
  process.exit(1);
}

console.log(`${files.length} artworks within budget.`);
