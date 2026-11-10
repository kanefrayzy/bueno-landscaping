import { PostCard } from '@/components/sections/blog/PostCard';
import { PageHeader } from '@/components/sections/page-header/PageHeader';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { getAllPosts } from '@/lib/blog';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Landscaping Tips & Guides for Long Island',
  description:
    'Practical guides on sprinklers, drainage, patios, cleanups and lawn care for homeowners in Patchogue and nearby Long Island towns.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Landscaping Tips & Guides"
        intro="Straight answers to the questions we hear most from homeowners in Patchogue and nearby towns, season by season."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Blog', path: '/blog' },
            ]}
          />
        }
      />
      <section className="blog-index" aria-label="All articles">
        <Container>
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} headingLevel="h2" />
            ))}
          </div>
        </Container>
      </section>
      <QuoteSection />
    </>
  );
}
