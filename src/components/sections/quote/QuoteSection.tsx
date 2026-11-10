import { ContactButtons } from '@/components/ui/ContactButtons';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { site } from '@/config/site';
import { QuoteForm } from './QuoteForm';

type QuoteSectionProps = {
  title?: string;
  defaultService?: string;
};

export function QuoteSection({ title = 'Request a free estimate', defaultService }: QuoteSectionProps) {
  return (
    <section id="quote" className="quote" aria-labelledby="quote-title">
      <Container className="quote__inner">
        <div className="quote__info">
          <Eyebrow>Free estimate</Eyebrow>
          <h2 id="quote-title" className="quote__title">
            {title}
          </h2>
          <p className="quote__text">
            Send the form and we’ll get back to you, or reach us directly. We’re at {site.address.street} in {site.location}.
          </p>
          {(site.hours.display || site.email) && (
            <dl className="quote__details">
              {site.hours.display && (
                <div>
                  <dt>Hours</dt>
                  <dd>{site.hours.display}</dd>
                </div>
              )}
              {site.email && (
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
              )}
            </dl>
          )}
          <ContactButtons location="quote_section" className="quote__contact" />
        </div>
        <QuoteForm defaultService={defaultService} />
      </Container>
    </section>
  );
}
