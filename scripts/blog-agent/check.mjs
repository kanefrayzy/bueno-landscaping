// Checks a draft before the blog agent publishes it:
//   node scripts/blog-agent/check.mjs post.json [--site https://buenolandscapinginc.com]
// Runs the same rules as POST /api/blog/publish, checks the slug is free, and opens every
// link. Exits with 1 and lists the problems when something has to be fixed.
import { readFile } from 'node:fs/promises';
import { validatePost } from '../../src/lib/blog-rules.mjs';

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith('--'));
const siteIndex = args.indexOf('--site');
const site = (siteIndex >= 0 ? args[siteIndex + 1] : 'https://buenolandscapinginc.com').replace(/\/$/, '');

if (!file) {
  console.error('Usage: node scripts/blog-agent/check.mjs post.json [--site https://buenolandscapinginc.com]');
  process.exit(2);
}

const post = JSON.parse(await readFile(file, 'utf8'));
const live = await (await fetch(`${site}/api/blog/posts`)).json();
const problems = [];

const { errors } = validatePost(post, {
  services: live.services.map((service) => service.slug),
  blogSlugs: live.posts.map((existing) => existing.slug),
});
for (const [field, messages] of Object.entries(errors)) {
  for (const message of messages) problems.push(`${field}: ${message}`);
}

if (live.posts.some((existing) => existing.slug === post.slug)) problems.push(`slug: "${post.slug}" is already live.`);

const links = [...String(post.body ?? '').matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)].map((match) => match[1]);
for (const href of new Set(links)) {
  if (href.startsWith('#')) continue;
  const url = href.startsWith('/') ? `${site}${href}` : href;
  try {
    const response = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (blog-agent link check)' } });
    if (response.status !== 200) problems.push(`link ${href}: answered ${response.status}.`);
  } catch (error) {
    problems.push(`link ${href}: could not be opened (${error.message}).`);
  }
}

const body = String(post.body ?? '');
const words = body.split(/\s+/).filter(Boolean).length;
const sections = body.match(/^## \S/gm)?.length ?? 0;
console.log(`${words} words, ${sections} sections, ${links.length} links, ${post.faq?.length ?? 0} FAQ.`);
if (words < 900 || words > 1500) console.log(`Note: aim for 900 to 1,500 words (now ${words}).`);

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`- ${problem}`);
  process.exit(1);
}
console.log('OK: ready to publish.');
