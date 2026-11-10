import { services } from '@/config/services';
import { getAllPosts, pickCover } from '@/lib/blog';
import {
  clientIp,
  MIN_HOURS_BETWEEN_POSTS,
  newYorkDate,
  oneAtATime,
  publishToken,
  rateLimited,
  tokenMatches,
} from '@/lib/blog-publish';
import { revalidateBlog } from '@/lib/blog-revalidate';
import { readingMinutes, SLUG_PATTERN, validatePost } from '@/lib/blog-rules.mjs';
import { writeStoredPost } from '@/lib/blog-store';
import { absoluteUrl } from '@/lib/seo';

// The scheduled blog agent publishes here. It can only create a post: there is no way to
// edit or delete one through the API. Without BLOG_PUBLISH_TOKEN the route doesn't exist.
const MAX_BODY_BYTES = 100_000;

const json = (data: unknown, status: number, headers?: HeadersInit) => Response.json(data, { status, headers });

export async function POST(request: Request) {
  const token = publishToken();
  if (!token) return json({ error: 'Not found.' }, 404);

  if (rateLimited(clientIp(request.headers))) return json({ error: 'Too many requests. Try again later.' }, 429);
  if (!tokenMatches(request.headers.get('authorization'), token)) return json({ error: 'Invalid token.' }, 401);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: 'Request too large.' }, 413);
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return json({ error: 'The body must be JSON.' }, 400);
  }

  return oneAtATime(async () => {
    const posts = await getAllPosts();

    const lastApiPost = posts.find((post) => post.source === 'api');
    if (lastApiPost && lastApiPost.source === 'api') {
      const waitMs = Date.parse(lastApiPost.createdAt) + MIN_HOURS_BETWEEN_POSTS * 3_600_000 - Date.now();
      if (waitMs > 0) {
        const retryAfter = Math.ceil(waitMs / 1000);
        return json(
          { error: `A post was published less than ${MIN_HOURS_BETWEEN_POSTS} hours ago.`, retryAfter },
          429,
          { 'Retry-After': String(retryAfter) },
        );
      }
    }

    const slug = (input as { slug?: unknown })?.slug;
    if (typeof slug === 'string' && SLUG_PATTERN.test(slug) && posts.some((post) => post.slug === slug)) {
      return json({ error: `The slug "${slug}" is taken.` }, 409);
    }

    const { post, errors } = validatePost(input, {
      services: services.map((service) => service.slug),
      blogSlugs: posts.map((existing) => existing.slug),
    });
    if (!post) return json({ error: 'The post did not pass the checks.', errors }, 422);

    const cover = pickCover(posts, post.service);
    const now = new Date();
    const result = await writeStoredPost({
      ...post,
      published: newYorkDate(now),
      minutes: readingMinutes(post),
      cover: cover.image.id,
      createdAt: now.toISOString(),
    });
    if (result === 'exists') return json({ error: `The slug "${post.slug}" is taken.` }, 409);

    revalidateBlog(post.slug);

    return json(
      {
        url: absoluteUrl(`/blog/${post.slug}`),
        slug: post.slug,
        published: newYorkDate(now),
        cover: { id: cover.image.id, kind: cover.kind, src: absoluteUrl(cover.image.src), alt: cover.image.alt },
      },
      201,
    );
  });
}
