import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/config/services';
import { ServiceCard } from './ServiceCard';

export function Services() {
  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <Container>
        <SectionHeading
          id="services-title"
          eyebrow="What we do"
          title="Everything your yard needs."
          action={
            <Button href="/services" variant="outline" size="sm" icon="arrowUp">
              All services
            </Button>
          }
        />
        <div className="services__grid">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
