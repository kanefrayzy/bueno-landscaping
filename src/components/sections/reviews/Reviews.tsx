import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { reviewLink, reviews, type Review } from '@/config/reviews';

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

function formatDate(review: Review) {
  const date = new Date(review.date);
  return review.dateApprox ? String(date.getUTCFullYear()) : monthYear.format(date);
}

function Rating({ review }: { review: Review }) {
  if (!review.rating) return <span className="review-card__recommends">Recommends</span>;

  return (
    <span className="review-card__stars" role="img" aria-label={`${review.rating} out of 5 stars`}>
      {'★'.repeat(review.rating)}
      <span className="review-card__stars-empty">{'★'.repeat(5 - review.rating)}</span>
    </span>
  );
}

export function Reviews({ limit }: { limit?: number }) {
  if (reviews.length === 0) return null;
  const shown = limit ? reviews.slice(0, limit) : reviews;

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <Container>
        <div className="reviews__heading">
          <div>
            <Eyebrow>Reviews</Eyebrow>
            <h2 id="reviews-title">What our customers say.</h2>
          </div>
          {reviewLink && (
            <Button href={reviewLink} variant="outline" size="sm" icon="arrowUp" target="_blank" rel="noopener">
              Leave us a review
            </Button>
          )}
        </div>
        <ul className="reviews__list">
          {shown.map((review) => (
            <li key={`${review.name}-${review.date}`} className="review-card">
              <div className="review-card__top">
                <span className="review-card__source">{review.source}</span>
                <Rating review={review} />
              </div>
              <blockquote className="review-card__text">{review.text}</blockquote>
              <p className="review-card__meta">
                <span className="review-card__name">{review.name}</span>
                <time dateTime={review.date}>{formatDate(review)}</time>
              </p>
              {review.link && (
                <a className="review-card__link" href={review.link} target="_blank" rel="noopener">
                  Read on {review.source}
                </a>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
