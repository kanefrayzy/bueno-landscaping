import Link from 'next/link';
import { PageHeader } from '@/components/sections/page-header/PageHeader';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { serviceAreas } from '@/config/service-areas';
import { services } from '@/config/services';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Service Areas Near Patchogue, NY',
  description: `Landscaping, hardscape and irrigation in Patchogue, Medford, Bellport, Sayville and nearby Long Island towns. Call or text ${site.phone.display} to check your address.`,
  path: '/service-areas',
});

export default function ServiceAreasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Service areas"
        title="Service Areas Near Patchogue, NY"
        intro="We’re based in Patchogue and work in towns nearby. If your town isn’t listed, call or text and ask. We may still be able to help."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Service Areas', path: '/service-areas' },
            ]}
          />
        }
      />
      <section className="area-index" aria-labelledby="towns-title">
        <Container className="area-index__inner">
          <div>
            <h2 id="towns-title">Towns we work in</h2>
            <ul className="area-index__towns">
              {serviceAreas.map((town) => (
                <li key={town} className="area-index__town">
                  <Icon name="check" size={18} />
                  {town}, NY
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Services in these towns</h2>
            <ul className="area-index__services">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <QuoteSection />
    </>
  );
}
