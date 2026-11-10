import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/config/services';

export function ServiceFeature({ service }: { service: Service }) {
  const { feature } = service;
  if (!feature) return null;

  return (
    <section className="included service-feature" aria-labelledby="feature-title">
      <Container className="included__inner">
        <div>
          <Eyebrow>{feature.eyebrow}</Eyebrow>
          <h2 id="feature-title">{feature.title}</h2>
          {feature.paragraphs.map((paragraph) => (
            <p key={paragraph} className="included__text">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="included__list">
          {feature.bullets.map((bullet) => (
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
