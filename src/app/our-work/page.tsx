import { PageHeader } from '@/components/sections/page-header/PageHeader';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { WorkGallery } from '@/components/sections/work/WorkGallery';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { workImages } from '@/config/work';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Our Work: Patios, Masonry & Landscaping',
  description:
    'Photos of our paver patios, walkways, stone and masonry work, retaining walls, planting and lawns around Patchogue and nearby Long Island towns.',
  path: '/our-work',
  image: '/images/work/fire-pit-patio-waterfront.webp',
});

export default function OurWorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Our Landscaping & Masonry Work"
        intro="Patios, walkways, stonework, walls, planting and lawns from our jobs. Tap a photo to see it larger."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Our Work', path: '/our-work' },
            ]}
          />
        }
      />
      <section className="our-work" aria-label="Project photos">
        <Container>
          <WorkGallery items={workImages} filters label="Project photos" />
        </Container>
      </section>
      <QuoteSection />
    </>
  );
}
