'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { navigation, site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Brand } from './Brand';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const close = () => setMenuOpen(false);
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && close();
    const onClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    const desktop = window.matchMedia('(min-width: 961px)');

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    desktop.addEventListener('change', close);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
      desktop.removeEventListener('change', close);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="header">
      <Container className="header__inner">
        <Brand />

        <nav id="navigation" className={cn('header__nav', menuOpen && 'header__nav--open')} aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a className="header__nav-phone" href={site.phone.href} data-track="mobile_menu">
            Call {site.phone.display}
          </a>
        </nav>

        <div className="header__actions">
          <a className="header__phone" href={site.phone.href} data-track="header">
            {site.phone.display}
          </a>
          <Button href="#quote" size="sm" icon="arrowUp" className="header__cta">
            Free Estimate
          </Button>
        </div>

        <button
          className="header__toggle"
          type="button"
          aria-controls="navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </Container>
    </header>
  );
}
