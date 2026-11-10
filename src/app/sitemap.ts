import type { MetadataRoute } from 'next';
import { posts } from '@/config/blog';
import { services } from '@/config/services';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/services', '/our-work', '/service-areas', '/blog', '/contact', '/privacy'];
  const servicePages = services.map((service) => `/services/${service.slug}`);

  const staticEntries: MetadataRoute.Sitemap = [...pages, ...servicePages].map((path) => ({
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
