// One Runware image generation (Nano Banana Pro by default). The key is RUNWARE_API_KEY in
// .env.local and is never printed. One image per call, no retries, never overwrites a file.
//
//   node scripts/runware.mjs design/logo/logo-v1.png --prompt "..." --ref design/logo/source.png
//        [--width 2048 --height 2048] [--model google:4@2]
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const output = args[0];
const option = (flag) => {
  const index = args.indexOf(`--${flag}`);
  return index === -1 ? undefined : args[index + 1];
};
const refs = args.flatMap((arg, index) => (arg === '--ref' ? [args[index + 1]] : []));
const prompt = option('prompt');

if (!output || !prompt) {
  console.error('usage: node scripts/runware.mjs <output.png> --prompt "..." [--ref file ...]');
  process.exit(1);
}
if (existsSync(output)) {
  console.error(`refusing: ${output} already exists`);
  process.exit(1);
}

const env = await readFile('.env.local', 'utf8').catch(() => '');
const apiKey = /^RUNWARE_API_KEY=(.+)$/m.exec(env)?.[1]?.trim();
if (!apiKey) {
  console.error('RUNWARE_API_KEY is missing from .env.local');
  process.exit(1);
}

const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const referenceImages = await Promise.all(
  refs.map(async (file) => `data:${mime[path.extname(file).toLowerCase()]};base64,${(await readFile(file)).toString('base64')}`),
);

const task = {
  taskType: 'imageInference',
  taskUUID: randomUUID(),
  model: option('model') ?? 'google:4@2',
  positivePrompt: prompt,
  width: Number(option('width') ?? 2048),
  height: Number(option('height') ?? 2048),
  numberResults: 1,
  outputType: 'URL',
  outputFormat: path.extname(output).slice(1).toUpperCase() === 'JPG' ? 'JPG' : 'PNG',
  includeCost: true,
  ...(referenceImages.length ? { inputs: { referenceImages } } : {}),
};

const response = await fetch('https://api.runware.ai/v1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
  body: JSON.stringify([task]),
});
const body = await response.json().catch(() => ({}));
const result = body.data?.[0];

if (!response.ok || !result?.imageURL) {
  console.error(`generation failed (HTTP ${response.status}): ${JSON.stringify(body.errors ?? body).slice(0, 600)}`);
  process.exit(1);
}

const image = await fetch(result.imageURL);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, Buffer.from(await image.arrayBuffer()));
console.log(`saved ${output}, cost $${result.cost}`);
