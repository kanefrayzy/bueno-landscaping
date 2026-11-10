import { PageHeader } from '@/components/sections/page-header/PageHeader';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { ServiceTile } from '@/components/sections/services/ServiceTile';
import { Areas } from '@/components/sections/areas/Areas';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { services } from '@/config/services';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Landscaping Services in Patchogue, NY',
  description:
    'Lawn care, planting, hedge trimming, cleanups, irrigation, drainage, hardscape, masonry and sheds in Patchogue and nearby Long Island towns.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Landscaping Services in Patchogue, NY"
        intro="From weekly lawn care to a new patio or sprinkler system, here’s what we do for homeowners in Patchogue and nearby towns."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
            ]}
          />
        }
      />
      <section className="service-index" aria-label="All services">
        <Container>
          <div className="service-index__grid">
            {services.map((service) => (
              <ServiceTile key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>
      <Areas />
      <QuoteSection />
    </>
  );
}
