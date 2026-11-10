import type { Element, Root, RootContent } from 'hast';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { proseComponents } from '@/components/ui/prose';

// The page shows the title as the only H1, so headings in the text start at H2.
function demoteH1() {
  const visit = (node: Root | RootContent) => {
    if (node.type === 'element' && (node as Element).tagName === 'h1') (node as Element).tagName = 'h2';
    if ('children' in node) node.children.forEach(visit);
  };
  return (tree: Root) => visit(tree);
}

// Raw HTML in the Markdown is dropped (remark-rehype without allowDangerousHtml), and the
// result is sanitized with GitHub's rules before it becomes React elements.
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize).use(demoteH1);

export async function renderMarkdown(markdown: string) {
  const tree = (await processor.run(processor.parse(markdown))) as Root;
  return toJsxRuntime(tree, { Fragment, jsx, jsxs, components: proseComponents });
}
