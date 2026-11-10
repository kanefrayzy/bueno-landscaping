// End-to-end tests for POST /api/blog/publish against the production build:
//   npm run build && npm run test:blog
// Each server runs with its own temporary data directory, so nothing real is touched.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

const PORT = 3217;
const BASE = `http://127.0.0.1:${PORT}`;
const TOKEN = 'test-token-0123456789';
const HOMEPAGE_PHOTOS = [
  'fire-pit-patio-waterfront',
  'flagstone-patio-sunset',
  'paver-walkway-front-porch',
  'checkerboard-patio-seating-wall',
  'retaining-wall-lit-bed',
  'paver-patio-from-deck',
  'stepping-pavers-crushed-stone',
  'paver-walkway-front-beds',
];
const MDX_COVERS = ['sprinkler-valve-box', 'dry-well-excavation', 'paver-patio-capped-wall', 'backyard-shed-plantings'];

let dataDir;
let server;

async function startServer(env = {}) {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(PORT), BLOG_DATA_DIR: dataDir, BLOG_PUBLISH_TOKEN: '', ...env },
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${BASE}/api/blog/posts`)).ok) return;
    } catch {
      // not listening yet
    }
    await sleep(500);
  }
  throw new Error('Server did not start');
}

async function stopServer() {
  if (!server) return;
  const exited = new Promise((resolve) => server.once('exit', resolve));
  server.kill();
  await exited;
  server = undefined;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function publish(post, { token = TOKEN, raw } = {}) {
  return fetch(`${BASE}/api/blog/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: raw ?? JSON.stringify(post),
  });
}

const paragraph =
  'Water that sits on a lawn for days usually has nowhere to go. The soil below may be sandy, but a layer of compacted fill near the surface keeps it from soaking in, and downspouts that dump a whole roof of water in one spot make it worse.';

function body(extra = '') {
  return [
    '## Why water pools',
    paragraph,
    paragraph,
    paragraph,
    paragraph,
    '## What to check first',
    paragraph,
    paragraph,
    '| Sign | Likely cause |\n| --- | --- |\n| Puddle by the door | A downspout |\n| Soggy strip | Compacted soil |',
    paragraph,
    paragraph,
    '## When to call',
    paragraph,
    paragraph,
    paragraph,
    paragraph,
    'See our [drainage service](/services/drainage) and the [dry well guide](/blog/dry-well-vs-french-drain-long-island), or [ask for an estimate](#quote).',
    extra,
  ].join('\n\n');
}

function validPost(slug, overrides = {}) {
  return {
    slug,
    service: 'drainage',
    title: 'Why Your Yard Floods After Rain on Long Island',
    seoTitle: 'Why Your Yard Floods After Rain',
    description: 'The usual reasons water pools in a Long Island yard after rain, what to check first, and when a drainage fix is worth it.',
    intro: 'Standing water after a storm is common around Patchogue even on sandy soil. Here is how to find where it comes from and what fixes it.',
    body: body(),
    faq: [
      { question: 'How long should a puddle last after rain?', answer: 'On most lawns around here water should soak in within a day. If it stays longer, something is in its way.' },
    ],
    ...overrides,
  };
}

async function storedFile(slug) {
  return JSON.parse(await readFile(path.join(dataDir, `${slug}.json`), 'utf8'));
}

async function ageStoredPost(slug, hours) {
  const post = await storedFile(slug);
  post.createdAt = new Date(Date.now() - hours * 3_600_000).toISOString();
  await writeFile(path.join(dataDir, `${slug}.json`), JSON.stringify(post));
}

async function pageIncludes(pathname, text, tries = 20) {
  for (let i = 1; i <= tries; i++) {
    const html = await (await fetch(`${BASE}${pathname}`)).text();
    if (html.includes(text)) return i;
    await sleep(500);
  }
  return 0;
}

before(async () => {
  dataDir = await mkdtemp(path.join(tmpdir(), 'blog-test-'));
});

after(async () => {
  await stopServer();
  await rm(dataDir, { recursive: true, force: true });
});

test('without BLOG_PUBLISH_TOKEN the route is a 404', async () => {
  await startServer();
  const response = await publish(validPost('no-token-check-post'));
  assert.equal(response.status, 404);
  await stopServer();
});

test('rejects a missing or wrong token, and invalid JSON', async () => {
  await startServer({ BLOG_PUBLISH_TOKEN: TOKEN, BLOG_PUBLISH_RATE_LIMIT: '1000' });
  assert.equal((await publish(validPost('token-check-post'), { token: '' })).status, 401);
  assert.equal((await publish(validPost('token-check-post'), { token: 'wrong-token' })).status, 401);
  assert.equal((await publish(null, { raw: '{not json' })).status, 400);
});

test('the posts list shows the hand-written posts and the services', async () => {
  const data = await (await fetch(`${BASE}/api/blog/posts`)).json();
  assert.equal(data.posts.length, 4);
  assert.ok(data.posts.every((post) => post.source === 'mdx'));
  assert.equal(data.services.length, 9);
});

test('422 for posts that break the rules', async () => {
  const cases = [
    ['title', { title: 'Why Your Yard Floods — and What Fixes It' }],
    ['intro', { intro: 'Whether you’re new to Long Island or not, standing water after a storm is something to look into before it gets worse.' }],
    ['body', { body: body('| A | B | C |\n| --- | --- | --- |\n| 1 | 2 | 3 |') }],
    ['service', { service: 'pools' }],
    ['body', { body: body('Also see [this page](/services/pools).') }],
    ['body', { body: body().replace('or [ask for an estimate](#quote)', 'or call us') }],
    ['body', { body: '## Short\n\nToo short. [drainage](/services/drainage) [estimate](#quote)' }],
    ['body', { body: body('<script>alert(1)</script>') }],
    ['faq.0.question', { faq: [{ question: 'This question has no question mark', answer: 'An answer that is long enough to pass the length rule for answers.' }] }],
    ['slug', { slug: 'Bad Slug!' }],
  ];
  for (const [field, overrides] of cases) {
    const response = await publish(validPost('rules-check-post', overrides));
    const data = await response.json();
    assert.equal(response.status, 422, `${field}: ${JSON.stringify(overrides).slice(0, 60)}`);
    assert.ok(data.errors[field], `expected an error on ${field}, got ${JSON.stringify(data.errors)}`);
  }
});

test('409 for the slug of a hand-written post', async () => {
  const response = await publish(validPost('dry-well-vs-french-drain-long-island'));
  assert.equal(response.status, 409);
});

let first;

test('publishes a valid post, picks a cover and updates every list', async () => {
  const response = await publish(validPost('why-yard-floods-after-rain'));
  assert.equal(response.status, 201);
  first = await response.json();

  assert.match(first.url, /\/blog\/why-yard-floods-after-rain$/);
  assert.notEqual(first.cover.kind, 'irrigation', 'the latest post has an irrigation photo');
  assert.ok(!HOMEPAGE_PHOTOS.includes(first.cover.id), 'cover must not be a homepage photo');
  assert.ok(!MDX_COVERS.includes(first.cover.id), 'unused photos come before used ones');

  const stored = await storedFile('why-yard-floods-after-rain');
  assert.equal(stored.cover, first.cover.id);
  assert.ok(stored.minutes >= 1);

  const html = await (await fetch(`${BASE}/blog/why-yard-floods-after-rain`)).text();
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.ok(html.includes('Why Your Yard Floods After Rain on Long Island'));
  assert.ok(html.includes('"@type":"BlogPosting"'));
  assert.ok(html.includes('"@type":"FAQPage"'));
  assert.ok(html.includes('property="og:type" content="article"'));

  for (const pathname of ['/', '/blog', '/sitemap.xml', '/services/drainage']) {
    const tries = await pageIncludes(pathname, '/blog/why-yard-floods-after-rain');
    assert.ok(tries > 0, `${pathname} does not list the new post`);
    console.log(`  ${pathname}: listed after ${tries} request(s)`);
  }

  const list = await (await fetch(`${BASE}/api/blog/posts`)).json();
  assert.equal(list.posts[0].slug, 'why-yard-floods-after-rain');
});

test('429 for a second post within 12 hours', async () => {
  const response = await publish(validPost('second-post-too-soon'));
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get('retry-after')) > 11 * 3600);
});

test('409 for a slug published through the API', async () => {
  await ageStoredPost('why-yard-floods-after-rain', 13);
  const response = await publish(validPost('why-yard-floods-after-rain'));
  assert.equal(response.status, 409);
});

test('the next cover is a different kind of photo', async () => {
  const response = await publish(validPost('soggy-lawn-after-snowmelt', { title: 'What a Soggy Lawn After Snowmelt Tells You' }));
  assert.equal(response.status, 201);
  const second = await response.json();
  assert.notEqual(second.cover.id, first.cover.id);
  assert.notEqual(second.cover.kind, first.cover.kind);
});

test('two requests at once publish only one post', async () => {
  await ageStoredPost('soggy-lawn-after-snowmelt', 13);
  const statuses = (
    await Promise.all([publish(validPost('race-check-post-one')), publish(validPost('race-check-post-two'))])
  )
    .map((response) => response.status)
    .sort();
  assert.deepEqual(statuses, [201, 429]);
});

test('Markdown is sanitized: no raw HTML, H1 demoted, outside links open in a new tab', async () => {
  await writeFile(
    path.join(dataDir, 'sanitize-check-post.json'),
    JSON.stringify({
      ...validPost('sanitize-check-post'),
      body: '# A heading written as H1\n\n<script>alert(1)</script>\n\nSome <b>bold</b> text.\n\n[outside](https://example.com/page) and [inside](/services/drainage)',
      published: '2026-11-01',
      minutes: 1,
      cover: 'patio-after',
      createdAt: '2026-11-01T12:00:00.000Z',
    }),
  );
  const html = await (await fetch(`${BASE}/blog/sanitize-check-post`)).text();
  assert.ok(!html.includes('alert(1)'));
  assert.ok(!html.includes('<b>'));
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.ok(html.includes('<h2>A heading written as H1</h2>'));
  assert.match(html, /<a href="https:\/\/example\.com\/page" target="_blank" rel="noopener">outside<\/a>/);
  assert.match(html, /<a href="\/services\/drainage">inside<\/a>/);
});

test('unknown slugs are a 404', async () => {
  assert.equal((await fetch(`${BASE}/blog/no-such-post-here`)).status, 404);
});

test('after a restart with an empty page cache the lists still show the published posts', async () => {
  await stopServer();
  // A deploy recreates the container: regenerated pages are gone and the built ones,
  // which don't know the API posts, come back. The startup refresh has to fix that.
  await rm(path.join('.next', 'server', 'route-cache'), { recursive: true, force: true });
  const built = await readFile(path.join('.next', 'server', 'app', 'index.html'), 'utf8');
  assert.ok(!built.includes('why-yard-floods-after-rain'));
  await startServer({ BLOG_PUBLISH_TOKEN: TOKEN, BLOG_PUBLISH_RATE_LIMIT: '3' });
  for (const pathname of ['/', '/blog', '/sitemap.xml']) {
    const tries = await pageIncludes(pathname, '/blog/why-yard-floods-after-rain', 40);
    assert.ok(tries > 0, `${pathname} lost the post after a restart`);
  }
});

test('more than the hourly limit of requests from one IP is a 429', async () => {
  const statuses = [];
  for (let i = 0; i < 4; i++) statuses.push((await publish(validPost('rate-check-post'), { token: 'wrong-token' })).status);
  assert.deepEqual(statuses, [401, 401, 401, 429]);
});
