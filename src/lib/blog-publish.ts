import { createHash, timingSafeEqual } from 'node:crypto';

// Guards for POST /api/blog/publish. One Node process serves the site, so in-memory state
// is enough for the rate limit and for running one publish at a time.

export const MIN_HOURS_BETWEEN_POSTS = 12;

export function publishToken() {
  return process.env.BLOG_PUBLISH_TOKEN || '';
}

export function tokenMatches(header: string | null, token: string) {
  const given = header?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? '';
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return given.length > 0 && timingSafeEqual(digest(given), digest(token));
}

// Behind Caddy, which replaces X-Forwarded-For with the real client address.
export function clientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for');
  return forwarded?.split(',').pop()?.trim() || 'local';
}

const hits = new Map<string, number[]>();

/** True when this IP has used up its requests for the past hour. */
export function rateLimited(ip: string) {
  const limit = Number(process.env.BLOG_PUBLISH_RATE_LIMIT) || 10;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

let queue: Promise<unknown> = Promise.resolve();

/** Runs publishes one after another, so two requests can't both pass the checks. */
export function oneAtATime<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

export function newYorkDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(date);
}
