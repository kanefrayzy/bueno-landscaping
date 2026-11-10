import Image from 'next/image';
import type { ReactNode } from 'react';
import { ContactButtons } from '@/components/ui/ContactButtons';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { cn } from '@/lib/cn';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image?: { src: string; alt: string };
  breadcrumbs?: ReactNode;
  meta?: ReactNode;
};

export function PageHeader({ eyebrow, title, intro, image, breadcrumbs, meta }: PageHeaderProps) {
  return (
    <section className={cn('page-header', image && 'page-header--media')} aria-labelledby="page-title">
      <Container className="page-header__inner">
        <div className="page-header__copy">
          {breadcrumbs}
          <Eyebrow className="page-header__eyebrow">{eyebrow}</Eyebrow>
          <h1 id="page-title" className="page-header__title">
            {title}
          </h1>
          {meta && <p className="page-header__meta">{meta}</p>}
          <p className="page-header__intro">{intro}</p>
          <ContactButtons location="page_header" quoteHref="#quote" variant="dark" />
        </div>
        {image && (
          <div className="page-header__media">
            <Image
              className="page-header__image"
              src={image.src}
              alt={image.alt}
              sizes="(max-width: 960px) 100vw, 45vw"
              fill
              preload
            />
          </div>
        )}
      </Container>
    </section>
  );
}
