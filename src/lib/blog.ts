import { coverKind, coverPool, serviceCoverKinds } from '@/config/blog-covers';
import { mdxPosts, type BlogPost } from '@/config/blog';
import { findWork, type WorkImage } from '@/config/work';
import { readStoredPosts, type StoredPost } from './blog-store';

// Every post on the site: hand-written MDX posts from the repository and posts published
// through the API, newest first. Read on the server; pages that list posts are revalidated
// when a post is published (see blog-revalidate.ts).
type ApiPost = BlogPost & { source: 'api'; body: string; createdAt: string };
export type Post = (BlogPost & { source: 'mdx' }) | ApiPost;

function fromStored(stored: StoredPost): ApiPost | null {
  const image = findWork(stored.cover);
  if (!image) return null;
  const { slug, service, title, seoTitle, description, intro, body, faq, published, minutes, createdAt } = stored;
  return { slug, service, title, seoTitle, description, intro, body, faq, published, minutes, createdAt, image, source: 'api' };
}

export async function getAllPosts(): Promise<Post[]> {
  const stored = (await readStoredPosts()).flatMap((post) => fromStored(post) ?? []);
  stored.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const handWritten: Post[] = mdxPosts.map((post) => ({ ...post, source: 'mdx' }));

  // Stable merge by date. On the same day an API post counts as newer than an MDX post.
  return [...stored, ...handWritten]
    .map((post, order) => ({ post, order }))
    .sort((a, b) => b.post.published.localeCompare(a.post.published) || a.order - b.order)
    .map(({ post }) => post);
}

export async function getPost(slug: string) {
  return (await getAllPosts()).find((post) => post.slug === slug);
}

export async function postsForService(serviceSlug: string) {
  return (await getAllPosts()).filter((post) => post.service === serviceSlug);
}

function usedAt(post: Post) {
  return Date.parse(post.source === 'api' ? post.createdAt : post.published);
}

// A photo used by one of this many latest posts is not reused, so the same picture never
// shows twice in a list of posts.
const RECENT_POSTS = 6;

/**
 * The cover for the next post. First choice: a photo of a kind that fits the post's
 * service, not used by the latest posts, unused for longest. When the service has no such
 * photo left, any pool photo unused for longest, skipping the kind the latest post has.
 */
export function pickCover(posts: Post[], service: string): { image: WorkImage; kind: string } {
  const lastUsed = new Map<string, number>();
  for (const post of posts) {
    const time = usedAt(post);
    if (time > (lastUsed.get(post.image.id) ?? -Infinity)) lastUsed.set(post.image.id, time);
  }
  const leastUsed = (pool: typeof coverPool) =>
    pool
      .map((cover, order) => ({ cover, order, time: lastUsed.get(cover.image.id) ?? -Infinity }))
      .sort((a, b) => a.time - b.time || a.order - b.order)[0]?.cover;

  const recent = new Set(posts.slice(0, RECENT_POSTS).map((post) => post.image.id));
  const fitting = serviceCoverKinds[service] ?? [];
  const match = leastUsed(coverPool.filter((cover) => fitting.includes(cover.kind) && !recent.has(cover.image.id)));
  if (match) return match;

  const latestKind = posts[0] ? coverKind(posts[0].image.id) : undefined;
  const otherKinds = coverPool.filter((cover) => cover.kind !== latestKind && !recent.has(cover.image.id));
  return leastUsed(otherKinds.length ? otherKinds : coverPool)!;
}
