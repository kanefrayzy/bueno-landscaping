import { WorkGallery } from '@/components/sections/work/WorkGallery';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Service } from '@/config/services';

export function ServiceWork({ service, name }: { service: Service; name: string }) {
  if (service.gallery.length === 0) return null;

  return (
    <section className="work" aria-labelledby="service-work-title">
      <Container>
        <SectionHeading
          id="service-work-title"
          eyebrow="Our work"
          title={`Recent ${name.toLowerCase()} projects.`}
          action={
            <Button href="/our-work" variant="outline" size="sm" icon="arrowUp">
              See all our work
            </Button>
          }
        />
        <WorkGallery items={service.gallery} label={`${name} photos`} />
      </Container>
    </section>
  );
}
