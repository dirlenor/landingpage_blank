import sharp from 'sharp';
import fs from 'node:fs/promises';
// Retain requested PNG originals; make identical-composition delivery derivatives.
await fs.mkdir('public/assets/web', { recursive: true });
for (const name of (await fs.readdir('public/assets')).filter(name => name.endsWith('.png'))) {
  await sharp(`public/assets/${name}`).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(`public/assets/web/${name.replace('.png','.webp')}`);
}
console.log('Generated WebP delivery files. Original PNGs preserved.');
