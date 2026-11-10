import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <section className="not-found">
      <Container>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__text">The page you’re looking for doesn’t exist or has moved.</p>
        <Button href="/">Back to home</Button>
      </Container>
    </section>
  );
}
