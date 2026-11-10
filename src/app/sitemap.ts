import type { MetadataRoute } from 'next';
import { services } from '@/config/services';
import { getAllPosts } from '@/lib/blog';
import { STATIC_PATHS } from '@/lib/blog-rules.mjs';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const servicePages = services.map((service) => `/services/${service.slug}`);

  const staticEntries: MetadataRoute.Sitemap = [...STATIC_PATHS, ...servicePages].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : path === '/privacy' ? 0.3 : 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updated ?? post.published,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
