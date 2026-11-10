import { ProcessSteps } from '@/components/sections/process/ProcessSteps';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export function ServiceProcess() {
  return (
    <section className="service-process" aria-labelledby="process-title">
      <Container className="service-process__inner">
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2 id="process-title">Three simple steps.</h2>
        </div>
        <ProcessSteps />
      </Container>
    </section>
  );
}
