import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/config/services';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link className="service-card" href={`/services/${service.slug}`} data-reveal>
      <Icon name={service.icon} size={48} className="service-card__icon" />
      <div>
        <h3 className="service-card__title">{service.title}</h3>
        <p className="service-card__text">{service.shortDescription}</p>
        <Icon name="arrow" size={18} className="service-card__arrow" />
      </div>
    </Link>
  );
}
