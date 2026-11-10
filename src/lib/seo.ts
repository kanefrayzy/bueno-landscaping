import type { Metadata } from 'next';
import { site } from '@/config/site';

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  absoluteTitle?: boolean;
  article?: { published: string; modified?: string };
};

export function absoluteUrl(path = '/') {
  return `${site.url}${path === '/' ? '' : path}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image = site.ogImage,
  absoluteTitle,
  article,
}: PageMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(article
        ? { type: 'article', publishedTime: article.published, modifiedTime: article.modified ?? article.published }
        : { type: 'website' }),
      locale: 'en_US',
      siteName: site.name,
      title,
      description,
      url: path,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
