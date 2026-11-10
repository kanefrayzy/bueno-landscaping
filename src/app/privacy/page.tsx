import { AnalyticsChoice } from '@/components/analytics/AnalyticsChoice';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: `How ${site.name} uses the information you send through the estimate form, and how analytics cookies work on this site.`,
  path: '/privacy',
});

// TODO: have the client review this page. It describes only what the site does.
export default function PrivacyPage() {
  return (
    <section className="privacy" aria-labelledby="page-title">
      <Container className="privacy__inner">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Privacy', path: '/privacy' },
          ]}
        />
        <h1 id="page-title">Privacy Policy</h1>

        <h2>The estimate form</h2>
        <p>
          When you send the estimate form, we receive your name, phone number, town, the service you picked and,
          if you add them, your email and a message. It reaches us as an email, and we use it only to contact you
          about your estimate. We don’t sell it or share it for marketing.
        </p>

        <h2 id="cookies">Cookies and analytics</h2>
        <p>
          This site uses Google Analytics to count visits and see which pages and buttons people use, such as the
          Call and Text buttons and the estimate form. Google Analytics sets cookies in your browser for this. We
          don’t use it for ad personalization or remarketing.
        </p>
        <p>
          You can turn analytics off at any time. Decline on the cookie notice does the same, and browsers that send
          Global Privacy Control are treated as off.
        </p>
        <AnalyticsChoice />

        <h2>Questions</h2>
        <p>
          Call or text us at <a href={site.phone.href}>{site.phone.display}</a>
          {site.email && (
            <>
              {' '}
              or email <a href={`mailto:${site.email}`}>{site.email}</a>
            </>
          )}
          .
        </p>
      </Container>
    </section>
  );
}
