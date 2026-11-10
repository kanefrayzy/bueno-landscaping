// Builds every logo file the site uses from the generated sources in design/logo, recoloured
// to the site palette (src/app/globals.css). Also writes a recoloured round logo for the client.
// Run after changing a source or the palette: npm run logo
import sharp from 'sharp';

// Brand green from the client's printed shirt logo (sampled, then brightened slightly for fabric
// and indoor light). Letters use it exactly; the tree uses shades of the same green.
const palette = {
  green: '#2e9e48',
  greenDark: '#1f6e33',
  greenDeep: '#134a22',
  accent: '#4fb35f',
  leaf: '#8fd08c',
};

// Each source colour in the generated logo and the site colour it becomes.
const colourMap = [
  ['#1f7d1a', palette.green],
  ['#45a24a', palette.accent],
  ['#1b3f22', palette.greenDark],
  ['#0d140d', palette.greenDeep],
  ['#a5c64e', palette.leaf],
];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const WHITE = [255, 255, 255];
const sub = (a, b) => a.map((v, i) => v - b[i]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const anchors = colourMap.map(([from, to]) => ({ dir: sub(rgb(from), WHITE), to: rgb(to) }));

// Explains a pixel on white as white plus up to two logo colours (least squares) and returns
// the same mix in site colours as [r, g, b, alpha]. Pixels it cannot explain (grey stones,
// yellow daisy centres) keep their colour.
function recolour(pixel) {
  const d = sub(pixel, WHITE);
  if (dot(d, d) < 60) return [255, 255, 255, 0];

  let best = { error: Infinity };
  const consider = (weights) => {
    if (weights.some(([w]) => w < 0)) return;
    const fit = weights.reduce((sum, [w, anchor]) => sum.map((v, i) => v + w * anchor.dir[i]), [0, 0, 0]);
    const error = dot(sub(d, fit), sub(d, fit));
    if (error < best.error) best = { error, weights };
  };

  for (let i = 0; i < anchors.length; i++) {
    const u = anchors[i].dir;
    consider([[Math.min(1, dot(u, d) / dot(u, u)), anchors[i]]]);
    for (let j = i + 1; j < anchors.length; j++) {
      const v = anchors[j].dir;
      const [uu, uv, vv, ud, vd] = [dot(u, u), dot(u, v), dot(v, v), dot(u, d), dot(v, d)];
      const det = uu * vv - uv * uv;
      if (Math.abs(det) < 1e-6) continue;
      consider([
        [(ud * vv - vd * uv) / det, anchors[i]],
        [(vd * uu - ud * uv) / det, anchors[j]],
      ]);
    }
  }

  if (best.error > 30 ** 2) return [...pixel, 255];
  const total = best.weights.reduce((sum, [w]) => sum + w, 0);
  // A faint second colour is noise in a flat fill: snap to the exact site colour.
  const weights = best.weights.filter(([w]) => w / total >= 0.2);
  const kept = weights.reduce((sum, [w]) => sum + w, 0);
  const colour = [0, 1, 2].map((i) => weights.reduce((sum, [w, anchor]) => sum + (w / kept) * anchor.to[i], 0));
  return [...colour.map(Math.round), Math.round(Math.min(1, total) * 255)];
}

// White background to transparency, keeping antialiased edges; recoloured or all white.
async function process(input, { mode = 'colour' } = {}) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const pixel = [data[i], data[i + 1], data[i + 2]];

    if (mode === 'white') {
      const alpha = Math.max(...pixel.map((c) => 255 - c)) / 255;
      out.fill(255, j, j + 3);
      out[j + 3] = alpha < 0.04 ? 0 : Math.round(Math.min(1, alpha * 1.6) * 255);
      continue;
    }

    out.set(recolour(pixel), j);
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

const horizontal = await sharp('design/logo/logo-horizontal-v1.png')
  .trim({ background: '#ffffff', threshold: 12 })
  .png()
  .toBuffer();

const colour = await process(horizontal);
const white = await process(horizontal, { mode: 'white' });

await sharp(colour).toFile('design/logo/logo-horizontal-site-colours.png');
await sharp(colour).resize({ height: 200 }).webp({ quality: 90, alphaQuality: 100 }).toFile('public/brand/logo.webp');
await sharp(white).resize({ height: 200 }).webp({ quality: 90, alphaQuality: 100 }).toFile('public/brand/logo-white.webp');
await sharp(colour)
  .resize({ height: 300 })
  .flatten({ background: '#ffffff' })
  .png({ palette: true, compressionLevel: 9 })
  .toFile('public/brand/logo.png');

// Favicon: the tree alone, cut from above the lettering.
const tree = await sharp(await process(await sharp('design/logo/logo-horizontal-v1.png')
  .extract({ left: 328, top: 2, width: 330, height: 252 })
  .png()
  .toBuffer()))
  .trim()
  .toBuffer({ resolveWithObject: true });
const side = Math.max(tree.info.width, tree.info.height) + 12;
const treeSquare = await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: tree.data, left: Math.round((side - tree.info.width) / 2), top: Math.round((side - tree.info.height) / 2) }])
  .png()
  .toBuffer();
await sharp(treeSquare).toFile('design/logo/tree-mark.png');
await sharp(treeSquare).resize(96).png({ palette: true, compressionLevel: 9 }).toFile('src/app/icon.png');
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
  .composite([{ input: await sharp(treeSquare).resize(156).toBuffer(), left: 12, top: 12 }])
  .png({ compressionLevel: 9 })
  .toFile('src/app/apple-icon.png');

// Round logo for the client, same colours.
const round = await process(await sharp('design/logo/logo-v1.png').png().toBuffer());
await sharp(round).flatten({ background: '#ffffff' }).png().toFile('design/logo/logo-round-site-colours.png');

console.log('Logo files written.');
