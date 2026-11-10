import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/config/site';

type BrandProps = {
  variant?: 'header' | 'footer';
};

export function Brand({ variant = 'header' }: BrandProps) {
  return (
    <Link className={`brand brand--${variant}`} href="/">
      <Image
        className="brand__logo"
        src={variant === 'footer' ? site.logo.white : site.logo.src}
        alt={`${site.legalName}, home page`}
        width={site.logo.width}
        height={site.logo.height}
        loading="eager"
        unoptimized
      />
    </Link>
  );
}
