import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { FaqItem } from '@/config/services';

// Posts published through /api/blog/publish: one JSON file per post in a directory that
// outlives deploys (a volume on the server). Hand-written posts stay MDX in the repository.
export type StoredPost = {
  slug: string;
  service: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  body: string;
  faq?: FaqItem[];
  /** YYYY-MM-DD, New York date. */
  published: string;
  minutes: number;
  /** Work photo id, chosen by the server. */
  cover: string;
  /** ISO timestamp of the publish request. */
  createdAt: string;
};

// The data directory is outside the project, so file calls below tell Turbopack not to
// trace them (otherwise it bundles the whole project into the server output).
export function blogDataDir() {
  return process.env.BLOG_DATA_DIR || '/data/blog';
}

const isString = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

function isStoredPost(value: unknown): value is StoredPost {
  if (!value || typeof value !== 'object') return false;
  const post = value as Record<string, unknown>;
  const fields = ['slug', 'service', 'title', 'seoTitle', 'description', 'intro', 'body', 'published', 'cover', 'createdAt'];
  return fields.every((field) => isString(post[field])) && typeof post.minutes === 'number';
}

export async function readStoredPosts(): Promise<StoredPost[]> {
  const dir = blogDataDir();
  let names: string[];
  try {
    names = await fs.readdir(/*turbopackIgnore: true*/ dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }

  const posts = await Promise.all(
    names
      .filter((name) => name.endsWith('.json') && !name.startsWith('.'))
      .map(async (name) => {
        try {
          const data: unknown = JSON.parse(await fs.readFile(path.join(/*turbopackIgnore: true*/ dir, name), 'utf8'));
          return isStoredPost(data) && `${data.slug}.json` === name ? data : null;
        } catch {
          // A broken file must not take the blog down; it simply isn't listed.
          return null;
        }
      }),
  );
  return posts.filter((post): post is StoredPost => post !== null);
}

/**
 * Writes the post as <slug>.json. The file appears complete or not at all: it is written
 * under a temporary name, then hard-linked into place, which fails if the slug exists.
 */
export async function writeStoredPost(post: StoredPost): Promise<'created' | 'exists'> {
  const dir = blogDataDir();
  await fs.mkdir(/*turbopackIgnore: true*/ dir, { recursive: true });
  const target = path.join(/*turbopackIgnore: true*/ dir, `${post.slug}.json`);
  const temp = path.join(/*turbopackIgnore: true*/ dir, `.${post.slug}.${process.pid}.${Date.now()}.tmp`);

  await fs.writeFile(/*turbopackIgnore: true*/ temp, `${JSON.stringify(post, null, 2)}\n`, { flag: 'wx' });
  try {
    await fs.link(/*turbopackIgnore: true*/ temp, target);
    return 'created';
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') return 'exists';
    throw error;
  } finally {
    await fs.rm(/*turbopackIgnore: true*/ temp, { force: true });
  }
}
