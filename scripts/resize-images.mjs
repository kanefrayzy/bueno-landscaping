// Writes smaller copies of every photo in public/images to public/images/w and the list of
// widths to src/config/image-widths.json. The production server's CPU cannot run sharp, so
// Next's image optimizer is off and src/lib/image-loader.ts picks from these files instead.
// Run after adding or replacing a photo: npm run images
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const widths = [384, 640, 828, 1080, 1440, 1920];
const sourceDir = 'public/images';
const outputDir = 'public/images/w';

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

const manifest = {};
const isImage = (file) => /\.(webp|jpe?g|png)$/i.test(file);
const files = [
  ...(await readdir(sourceDir)).filter(isImage),
  ...(await readdir(path.join(sourceDir, 'work'))).filter(isImage).map((file) => `work/${file}`),
];

for (const file of files) {
  const name = path.parse(file).name;
  const source = path.join(sourceDir, file);
  const { width: originalWidth } = await sharp(source).metadata();
  const available = widths.filter((width) => width < originalWidth);

  for (const width of available) {
    await sharp(source).resize({ width }).webp({ quality: 78 }).toFile(path.join(outputDir, `${name}-${width}.webp`));
  }

  manifest[`/images/${file}`] = { widths: available, original: originalWidth };
}

await writeFile('src/config/image-widths.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Resized ${files.length} images.`);
