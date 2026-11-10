import { services } from '@/config/services';
import { getAllPosts } from '@/lib/blog';
import { STATIC_PATHS } from '@/lib/blog-rules.mjs';
import { absoluteUrl } from '@/lib/seo';

// Read-only list for the blog agent: which topics are taken, and which pages it may link to.
export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await getAllPosts();

  return Response.json({
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      service: post.service,
      published: post.published,
      cover: post.image.id,
      source: post.source,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
    services: services.map((service) => ({ slug: service.slug, title: service.title, url: absoluteUrl(`/services/${service.slug}`) })),
    paths: STATIC_PATHS,
  });
}
