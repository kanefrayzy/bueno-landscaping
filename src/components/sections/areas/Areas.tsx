import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { serviceAreas } from '@/config/service-areas';

type AreasProps = {
  title?: string;
};

export function Areas({ title = 'Based in Patchogue. Working close to home.' }: AreasProps) {
  return (
    <section className="areas" aria-labelledby="areas-title">
      <Container className="areas__inner">
        <h2 id="areas-title" className="areas__title">
          {title}
        </h2>
        <div>
          <p className="areas__text">
            Call to check service in your area, or <Link href="/service-areas">see all service areas</Link>.
          </p>
          <ul className="areas__list">
            {serviceAreas.map((area) => (
              <li key={area} className="areas__tag">
                {area}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
