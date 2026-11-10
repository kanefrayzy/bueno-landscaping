import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { featuredWork } from '@/config/work';
import { WorkGallery } from './WorkGallery';

export function Work() {
  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <Container>
        <SectionHeading
          id="work-title"
          eyebrow="Recent work"
          title="Patios, stonework and more."
          action={
            <Button href="/our-work" variant="outline" size="sm" icon="arrowUp">
              See all our work
            </Button>
          }
        />
        <WorkGallery items={featuredWork} label="Recent projects" />
      </Container>
    </section>
  );
}
