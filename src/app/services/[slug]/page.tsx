import { notFound } from 'next/navigation';
import { Areas } from '@/components/sections/areas/Areas';
import { BlogPosts } from '@/components/sections/blog/BlogPosts';
import { Faq } from '@/components/sections/faq/Faq';
import { PageHeader } from '@/components/sections/page-header/PageHeader';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { Reviews } from '@/components/sections/reviews/Reviews';
import { OtherServices } from '@/components/sections/service-detail/OtherServices';
import { ServiceFeature } from '@/components/sections/service-detail/ServiceFeature';
import { ServiceIncluded } from '@/components/sections/service-detail/ServiceIncluded';
import { ServiceProcess } from '@/components/sections/service-detail/ServiceProcess';
import { ServiceWork } from '@/components/sections/service-detail/ServiceWork';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { getService, services } from '@/config/services';
import { site } from '@/config/site';
import { postsForService } from '@/lib/blog';
import { serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<'/services/[slug]'>) {
  const service = getService((await params).slug);
  if (!service) return {};

  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    image: service.image.src,
  });
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const name = service.heading.replace(/ Services$/, '');
  const guides = await postsForService(service.slug);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <PageHeader
        eyebrow="Services"
        title={`${service.heading} in ${site.location}`}
        intro={service.intro}
        image={service.image}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
              { name: service.title, path },
            ]}
          />
        }
      />
      <ServiceIncluded service={service} />
      <ServiceWork service={service} name={name} />
      <ServiceFeature service={service} />
      <ServiceProcess />
      <Areas title={`${name} near Patchogue.`} />
      <Reviews limit={3} />
      <Faq items={service.faq} title={`${name} questions.`} />
      <BlogPosts posts={guides} eyebrow="Guides" title={`${name} tips from our blog.`} variant="compact" />
      <OtherServices currentSlug={service.slug} />
      <QuoteSection title={`Get a free ${name.toLowerCase()} estimate`} defaultService={service.title} />
    </>
  );
}
