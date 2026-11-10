import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <div className="hero__content">
          <h1 id="hero-title" className="eyebrow hero__eyebrow">
            Landscaping, Hardscape & Irrigation in Patchogue, NY
          </h1>
          <p className="hero__title">
            A yard you love.
            <br />
            Care you can
            <br />
            count on.
          </p>
          <p className="hero__description">
            Lawn care, planting, patios, masonry, sprinklers, drainage and sheds in Patchogue and nearby Long Island towns.
          </p>
          <Button href="#quote" variant="lime" icon="arrowUp" className="hero__cta">
            Get a Free Estimate
          </Button>
          <a className="hero__link" href="#work">
            See our work <Icon name="arrow" size={17} />
          </a>
        </div>
      </div>

      <figure className="hero__media">
        <Image
          className="hero__image"
          src="/images/hero-backyard.webp"
          alt="Backyard with stepping stones through a gravel garden, Adirondack chairs and a paver patio by an outdoor kitchen"
          sizes="(max-width: 640px) 100vw, 54vw"
          fill
          preload
        />
        <figcaption className="hero__caption">Patio, gravel garden & stepping stones</figcaption>
      </figure>
    </section>
  );
}
