import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/config/services';

export function ServiceTile({ service }: { service: Service }) {
  return (
    <Link className="service-tile" href={`/services/${service.slug}`}>
      <span className="service-tile__media">
        <Image
          className="service-tile__image"
          src={service.image.src}
          alt={service.image.alt}
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          fill
        />
      </span>
      <span className="service-tile__body">
        <h2 className="service-tile__title">{service.title}</h2>
        <span className="service-tile__text">{service.shortDescription}</span>
        <span className="service-tile__more">
          Learn more <Icon name="arrow" size={16} />
        </span>
      </span>
    </Link>
  );
}
