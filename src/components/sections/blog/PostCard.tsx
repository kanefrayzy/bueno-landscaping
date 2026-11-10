import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { formatPostDate, type BlogPost } from '@/config/blog';
import { cn } from '@/lib/cn';

type PostCardProps = {
  post: BlogPost;
  headingLevel?: 'h2' | 'h3';
  /** Text only, for pages that already show the cover photo. */
  compact?: boolean;
};

export function PostCard({ post, headingLevel: Heading = 'h3', compact }: PostCardProps) {
  return (
    <Link className={cn('post-card', compact && 'post-card--compact')} href={`/blog/${post.slug}`}>
      {!compact && (
        <span className="post-card__media">
          <Image
            className="post-card__image"
            src={post.image.src}
            alt={post.image.alt}
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
            fill
          />
        </span>
      )}
      <span className="post-card__body">
        <span className="post-card__meta">
          <time dateTime={post.published}>{formatPostDate(post.published)}</time> · {post.minutes} min read
        </span>
        <Heading className="post-card__title">{post.title}</Heading>
        <span className="post-card__text">{post.description}</span>
        <span className="post-card__more">
          Read the guide <Icon name="arrow" size={16} />
        </span>
      </span>
    </Link>
  );
}
