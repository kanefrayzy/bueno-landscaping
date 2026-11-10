import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { BlogPost } from '@/config/blog';
import { cn } from '@/lib/cn';
import { PostCard } from './PostCard';

type BlogPostsProps = {
  posts: BlogPost[];
  eyebrow?: string;
  title?: string;
  showAllLink?: boolean;
  /** Plain sits on the page background right after another section; compact drops the photos. */
  variant?: 'default' | 'plain' | 'compact';
};

export function BlogPosts({
  posts,
  eyebrow = 'From the blog',
  title = 'Yard tips for Long Island homes.',
  showAllLink = true,
  variant = 'default',
}: BlogPostsProps) {
  if (!posts.length) return null;

  return (
    <section className={cn('blog-posts', variant !== 'default' && 'blog-posts--plain')} aria-labelledby="blog-posts-title">
      <Container>
        <SectionHeading
          id="blog-posts-title"
          eyebrow={eyebrow}
          title={title}
          action={
            showAllLink && (
              <Button href="/blog" variant="outline" size="sm" icon="arrowUp">
                All articles
              </Button>
            )
          }
        />
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} compact={variant === 'compact'} />
          ))}
        </div>
      </Container>
    </section>
  );
}
