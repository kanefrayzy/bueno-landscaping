import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { services } from '@/config/services';
import { navigation, site } from '@/config/site';
import { Brand } from './Brand';

export function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__cta">
          <p className="footer__title">
            Let’s make your yard
            <br />
            feel like home.
          </p>
          <div className="footer__contact">
            <Button href="#quote" variant="lime" icon="arrowUp">
              Get a Free Estimate
            </Button>
            <a className="footer__phone" href={site.phone.href} data-track="footer">
              {site.phone.display}
            </a>
            <a className="footer__sms sms-only" href={site.phone.sms} data-track="footer">
              Text us
            </a>
          </div>
        </div>

        <div className="footer__columns">
          <div className="footer__about">
            <Brand variant="footer" />
            <p>{site.description}</p>
          </div>
          <nav className="footer__column" aria-label="Services">
            <p className="footer__heading">Services</p>
            <ul className="footer__links">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="footer__column" aria-label="Company">
            <p className="footer__heading">Company</p>
            <ul className="footer__links">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__column">
            <p className="footer__heading">Contact</p>
            <ul className="footer__links">
              <li>
                <a href={site.phone.href} data-track="footer">
                  {site.phone.display}
                </a>
              </li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
              )}
              {site.hours.display && <li>{site.hours.display}</li>}
              <li>
                {site.address.street}, {site.address.locality}, {site.address.region} {site.address.postalCode}
              </li>
            </ul>
          </div>
        </div>

        <p className="footer__copyright">
          © {new Date().getFullYear()} {site.legalName} · <Link href="/privacy">Privacy</Link>
        </p>
      </Container>
    </footer>
  );
}
