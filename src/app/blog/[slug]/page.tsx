import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleFaq } from '@/components/sections/blog/ArticleFaq';
import { BlogPosts } from '@/components/sections/blog/BlogPosts';
import { PageHeader } from '@/components/sections/page-header/PageHeader';
import { QuoteSection } from '@/components/sections/quote/QuoteSection';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { formatPostDate, mdxPosts } from '@/config/blog';
import { getService } from '@/config/services';
import { site } from '@/config/site';
import { getAllPosts, type Post } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';
import { blogPostingSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

// MDX posts are built with the site. Posts published through the API are rendered on their
// first visit and cached, so they go live without a rebuild; unknown slugs are a 404.
export function generateStaticParams() {
  return mdxPosts.map((post) => ({ slug: post.slug }));
}

async function PostBody({ post }: { post: Post }) {
  if (post.source === 'api') return renderMarkdown(post.body);
  const { default: Content } = await import(`@/content/blog/${post.slug}.mdx`);
  return <Content />;
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>) {
  const slug = (await params).slug;
  const post = (await getAllPosts()).find((candidate) => candidate.slug === slug);
  if (!post) return {};

  return pageMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image.src,
    article: { published: post.published, modified: post.updated },
  });
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const slug = (await params).slug;
  const posts = await getAllPosts();
  const post = posts.find((candidate) => candidate.slug === slug);
  const service = post && getService(post.service);
  if (!post || !service) notFound();

  const serviceName = service.heading.replace(/ Services$/, '').toLowerCase();
  const morePosts = posts.filter((other) => other.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <article>
        <PageHeader
          eyebrow={`Blog · ${service.title}`}
          title={post.title}
          intro={post.intro}
          image={post.image}
          meta={
            <>
              <time dateTime={post.published}>{formatPostDate(post.published)}</time> · {post.minutes} min read
            </>
          }
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: 'Home', path: '/' },
                { name: 'Blog', path: '/blog' },
                { name: post.title, path: `/blog/${post.slug}` },
              ]}
            />
          }
        />
        <section className="article">
          <Container className="article__inner">
            <div className="article__body prose">
              <PostBody post={post} />
              {post.faq && <ArticleFaq items={post.faq} />}
            </div>
            <aside className="article__aside" aria-label="Get help with this">
              <div className="article-cta">
                <Icon name={service.icon} size={40} className="article-cta__icon" />
                <p className="article-cta__title">Need help with this?</p>
                <p className="article-cta__text">{service.shortDescription}</p>
                <Button href="#quote" variant="green" size="sm" icon="arrowUp">
                  Get a Free Estimate
                </Button>
                <a className="article-cta__phone" href={site.phone.href} data-track="article">
                  Call or text {site.phone.display}
                </a>
                <Link className="article-cta__link" href={`/services/${service.slug}`}>
                  About our {serviceName} service <Icon name="arrow" size={15} />
                </Link>
              </div>
            </aside>
          </Container>
        </section>
      </article>
      <BlogPosts posts={morePosts} eyebrow="Keep reading" title="More from the blog." variant="plain" />
      <QuoteSection title={`Get a free ${serviceName} estimate`} defaultService={service.title} />
    </>
  );
}
