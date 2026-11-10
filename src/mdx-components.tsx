import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

function Anchor({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener" {...props} />;
}

const components: MDXComponents = {
  a: Anchor,
  table: (props) => (
    <div className="prose__table">
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
