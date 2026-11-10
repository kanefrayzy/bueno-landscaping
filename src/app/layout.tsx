import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { Analytics } from '@/components/analytics/Analytics';
import { CookieNotice } from '@/components/analytics/CookieNotice';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { TopBar } from '@/components/layout/TopBar';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { site } from '@/config/site';
import './globals.css';

const manrope = localFont({
  src: '../fonts/manrope.ttf',
  weight: '200 800',
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  // Google Search Console ownership. Keep it after verification, or the property is unverified.
  verification: { google: 'jgd_QhUGF9Nv3P0Cs0B5kT5aQzJRGMaPAi2WQPvwMDI' },
};

export const viewport: Viewport = {
  themeColor: '#173f2c',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <TopBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealOnScroll />
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  );
}
