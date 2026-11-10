import { Container } from '@/components/ui/Container';
import { ProcessSteps } from '@/components/sections/process/ProcessSteps';

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <Container className="about__inner">
        <div className="about__copy" data-reveal>
          <h2 id="about-title">
            Local care.
            <br />
            Personal attention.
          </h2>
          <p className="about__lead">
            Bueno Landscaping helps homeowners take care of and improve their yards, from routine lawn care and
            planting to patios, masonry, sprinklers and sheds.
          </p>
        </div>
        <ProcessSteps />
      </Container>
    </section>
  );
}
