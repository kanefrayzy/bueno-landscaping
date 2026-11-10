// Rules for posts sent to POST /api/blog/publish. The route and the agent's check script
// (scripts/blog-agent/check.mjs) both import this file, so they enforce the same thing.
// Plain JavaScript so the check script runs on bare Node, without a TypeScript step.

export const LIMITS = {
  slug: { min: 10, max: 70 },
  title: { min: 20, max: 70 },
  seoTitle: { min: 20, max: 60 },
  description: { min: 70, max: 160 },
  intro: { min: 80, max: 320 },
  body: { min: 3000, max: 20000 },
  faqItems: { max: 6 },
  faqQuestion: { min: 10, max: 120 },
  faqAnswer: { min: 40, max: 400 },
  sections: { min: 3 },
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const STATIC_PATHS = ['/', '/services', '/our-work', '/service-areas', '/blog', '/contact', '/privacy'];

// Filler phrases, and claims about the company that src/config doesn't back up. Matched as
// whole words, case-insensitive, with curly apostrophes treated as straight ones.
export const BANNED_PHRASES = [
  "in today's",
  "whether you're",
  "here's the thing",
  'delve',
  'elevate',
  'unlock',
  'seamless',
  'game-changer',
  'game changer',
  'look no further',
  'nestled',
  'transform your',
  'dive into',
  'in conclusion',
  "it's important to note",
  'top-notch',
  'second to none',
  'guarantee',
  'guaranteed',
  'guarantees',
  'warranty',
  'licensed and insured',
  'fully insured',
  'award-winning',
  'family-owned',
  'family owned',
  'years of experience',
];

// Characters the site's copy never uses: em and en dashes, and exclamation marks
// (which also rules out Markdown images).
export const BANNED_CHARACTERS = [
  ['—', 'em dash'],
  ['–', 'en dash'],
  ['!', 'exclamation mark'],
];

const TEXT_FIELDS = ['title', 'seoTitle', 'description', 'intro', 'body'];

/**
 * @param {unknown} input
 * @param {{ services: string[], blogSlugs: string[] }} context
 * @returns {{ post: import('./blog-rules').PostInput | null, errors: Record<string, string[]> }}
 */
export function validatePost(input, { services, blogSlugs }) {
  const errors = {};
  const add = (field, message) => (errors[field] ??= []).push(message);

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { post: null, errors: { body: ['The request body must be a JSON object.'] } };
  }

  const post = {};
  for (const field of ['slug', 'service', ...TEXT_FIELDS]) {
    const value = input[field];
    if (typeof value !== 'string' || !value.trim()) {
      add(field, 'Required.');
      continue;
    }
    post[field] = value.trim();
  }

  for (const field of ['slug', ...TEXT_FIELDS]) {
    const value = post[field];
    const limit = LIMITS[field];
    if (value === undefined) continue;
    if (value.length < limit.min) add(field, `At least ${limit.min} characters (now ${value.length}).`);
    if (value.length > limit.max) add(field, `At most ${limit.max} characters (now ${value.length}).`);
  }

  if (post.slug && !SLUG_PATTERN.test(post.slug)) add('slug', 'Lowercase letters, digits and single hyphens only.');
  if (post.service && !services.includes(post.service)) {
    add('service', `Unknown service. Use one of: ${services.join(', ')}.`);
  }

  post.faq = validateFaq(input.faq, add);

  const texts = TEXT_FIELDS.map((field) => [field, post[field]]);
  for (const [index, item] of (post.faq ?? []).entries()) {
    texts.push([`faq.${index}.question`, item.question], [`faq.${index}.answer`, item.answer]);
  }
  for (const [field, text] of texts) {
    if (!text) continue;
    for (const [char, name] of BANNED_CHARACTERS) {
      if (text.includes(char)) add(field, `No ${name} (${char}).`);
    }
    for (const phrase of findBannedPhrases(text)) add(field, `Banned phrase: "${phrase}".`);
  }

  if (post.body) checkBody(post.body, post.service, { services, blogSlugs }, add);

  return { post: Object.keys(errors).length ? null : post, errors };
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const phrasePatterns = BANNED_PHRASES.map((phrase) => [
  phrase,
  new RegExp(`(?<![\\w'])${escapeRegExp(phrase)}(?![\\w'])`, 'i'),
]);

export function findBannedPhrases(text) {
  const normalized = text.replace(/[‘’]/g, "'");
  return phrasePatterns.filter(([, pattern]) => pattern.test(normalized)).map(([phrase]) => phrase);
}

function validateFaq(faq, add) {
  if (faq === undefined || faq === null) return undefined;
  if (!Array.isArray(faq)) {
    add('faq', 'Must be a list of { question, answer }.');
    return undefined;
  }
  if (faq.length > LIMITS.faqItems.max) add('faq', `At most ${LIMITS.faqItems.max} questions.`);

  return faq.map((item, index) => {
    const question = typeof item?.question === 'string' ? item.question.trim() : '';
    const answer = typeof item?.answer === 'string' ? item.answer.trim() : '';
    const q = LIMITS.faqQuestion;
    const a = LIMITS.faqAnswer;
    if (question.length < q.min || question.length > q.max) add(`faq.${index}.question`, `${q.min} to ${q.max} characters.`);
    else if (!question.endsWith('?')) add(`faq.${index}.question`, 'Must end with a question mark.');
    if (answer.length < a.min || answer.length > a.max) add(`faq.${index}.answer`, `${a.min} to ${a.max} characters.`);
    return { question, answer };
  });
}

function checkBody(body, service, context, add) {
  if (/<\/?[a-z][^>]*>/i.test(body)) add('body', 'No raw HTML. Use Markdown only.');

  const sections = body.match(/^## \S/gm)?.length ?? 0;
  if (sections < LIMITS.sections.min) add('body', `At least ${LIMITS.sections.min} "## " sections (now ${sections}).`);

  for (const line of body.split('\n')) {
    const row = line.trim();
    if (!row.startsWith('|') || !row.endsWith('|') || row.length < 2) continue;
    const cells = row.slice(1, -1).split('|').length;
    if (cells > 2) {
      add('body', 'Tables can have at most 2 columns (a third falls off a phone screen).');
      break;
    }
  }

  const links = [...body.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)].map((match) => match[1]);
  for (const href of links) {
    const problem = checkLink(href, context);
    if (problem) add('body', `Link ${href}: ${problem}`);
  }

  if (service && !links.some((href) => href.split(/[?#]/)[0] === `/services/${service}`)) {
    add('body', `Link to the service page /services/${service} at least once.`);
  }
  if (!links.includes('#quote')) add('body', 'Link to the estimate form (#quote) at least once.');
}

/** Returns a problem description, or null when the link is fine. */
export function checkLink(href, { services, blogSlugs }) {
  if (href === '#quote') return null;
  if (href.startsWith('#')) return 'the only on-page anchor is #quote.';
  if (href.startsWith('https://')) return null;
  if (!href.startsWith('/')) return 'use a site path like /services/drainage, #quote, or an https:// address.';

  const path = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (STATIC_PATHS.includes(path)) return null;
  const [, section, slug, extra] = path.split('/');
  if (extra === undefined && section === 'services' && services.includes(slug)) return null;
  if (extra === undefined && section === 'blog' && blogSlugs.includes(slug)) return null;
  return 'no such page on the site.';
}

export function readingMinutes(post) {
  const text = [post.body, ...(post.faq ?? []).flatMap((item) => [item.question, item.answer])].join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 230));
}
