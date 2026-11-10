import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/config/services';

export function ServiceIncluded({ service }: { service: Service }) {
  return (
    <section className="included" aria-labelledby="included-title">
      <Container className="included__inner">
        <div>
          <Eyebrow>{service.title}</Eyebrow>
          <h2 id="included-title">What’s included</h2>
          <p className="included__text">{service.shortDescription} Tell us what you need and we’ll put it in the estimate.</p>
        </div>
        <ul className="included__list">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="included__item">
              <Icon name="check" size={20} className="included__icon" />
              {bullet}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
