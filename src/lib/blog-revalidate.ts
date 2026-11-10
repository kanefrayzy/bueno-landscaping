import { revalidatePath } from 'next/cache';

// Pages that list posts. They are prerendered at build time with the MDX posts only, so
// after a post is published (or the server restarts and loses its page cache) they are
// marked stale and rebuilt on the next visit. Pages without post lists stay as built.
// revalidatePath, not revalidateTag: tags need fetch() or 'use cache', and posts are files.
export function revalidateBlog(newSlug?: string) {
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/services/[slug]', 'page');
  revalidatePath('/sitemap.xml');
  // A visit before publishing may have cached a 404 for this address.
  if (newSlug) revalidatePath(`/blog/${newSlug}`);
}
