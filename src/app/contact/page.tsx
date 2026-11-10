import { PageHeader } from '@/components/sections/page-header/PageHeader';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Us for a Free Estimate',
  description: `Call or text ${site.phone.display} or send a request for a free landscaping, hardscape or irrigation estimate in Patchogue and nearby Long Island towns.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact Bueno Landscaping"
        intro={`Call or text ${site.phone.display}, or send the form below with a few details about your yard. Estimates are free.`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Contact', path: '/contact' },
            ]}
          />
        }
      />
      <QuoteSection />
    </>
  );
}
