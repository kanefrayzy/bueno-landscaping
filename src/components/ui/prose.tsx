import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

// Elements shared by MDX posts (src/mdx-components.tsx) and posts rendered from Markdown
// (src/lib/markdown.tsx): site links stay in the app, other links open in a new tab, and
// tables scroll inside their own box on narrow screens.
function Anchor({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener" {...props} />;
}

function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="prose__table">
      <table {...props} />
    </div>
  );
}

export const proseComponents = { a: Anchor, table: Table };
