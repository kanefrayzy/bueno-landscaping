import type { MDXComponents } from 'mdx/types';
import { proseComponents } from '@/components/ui/prose';

const components: MDXComponents = proseComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
