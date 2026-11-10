import { Container } from '@/components/ui/Container';
import { site } from '@/config/site';

export function TopBar() {
  return (
    <div className="top-bar">
      <Container className="top-bar__inner">
        <span>
          {site.location} <span className="top-bar__dot">·</span> Serving nearby Long Island communities
        </span>
        <a className="top-bar__link" href={site.phone.href} data-track="top_bar">
          Call for a free estimate
        </a>
      </Container>
    </div>
  );
}
