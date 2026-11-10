import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { services } from '@/config/services';

export function OtherServices({ currentSlug }: { currentSlug: string }) {
  return (
    <section className="other-services" aria-labelledby="other-services-title">
      <Container>
        <h2 id="other-services-title" className="other-services__title">
          Other services
        </h2>
        <ul className="other-services__list">
          {services
            .filter((service) => service.slug !== currentSlug)
            .map((service) => (
              <li key={service.slug}>
                <Link className="other-services__link" href={`/services/${service.slug}`}>
                  <Icon name={service.icon} size={28} />
                  {service.title}
                </Link>
              </li>
            ))}
        </ul>
      </Container>
    </section>
  );
}
