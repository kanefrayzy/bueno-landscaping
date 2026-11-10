import type { BlogPost } from '@/config/blog';
import { serviceAreas } from '@/config/service-areas';
import type { FaqItem, Service } from '@/config/services';
import { site } from '@/config/site';
import { absoluteUrl } from './seo';

const businessId = `${absoluteUrl('/')}#business`;

const areaServed = serviceAreas.map((town) => ({
  '@type': 'City',
  name: `${town}, ${site.address.region}`,
}));

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  postalCode: site.address.postalCode,
  addressRegion: site.address.region,
  addressCountry: site.address.country,
};

// TODO: add sameAs (social profiles) once the client confirms them.
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: absoluteUrl('/'),
    telephone: site.phone.e164,
    ...(site.email ? { email: site.email } : {}),
    ...(site.hours.schema.length ? { openingHours: site.hours.schema } : {}),
    logo: absoluteUrl(site.logo.png),
    image: absoluteUrl(site.ogImage),
    address: postalAddress,
    areaServed,
  };
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.heading,
    serviceType: service.title,
    description: service.intro,
    url: absoluteUrl(`/services/${service.slug}`),
    image: absoluteUrl(service.image.src),
    areaServed,
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      '@id': businessId,
      name: site.legalName,
      telephone: site.phone.e164,
      address: postalAddress,
    },
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image.src),
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', '@id': businessId, name: site.legalName, url: absoluteUrl('/') },
    publisher: {
      '@type': 'Organization',
      name: site.legalName,
      logo: { '@type': 'ImageObject', url: absoluteUrl(site.logo.png) },
    },
  };
}
