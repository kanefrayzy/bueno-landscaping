import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { JsonLd } from '@/components/ui/JsonLd';
import type { FaqItem } from '@/config/services';
import { faqSchema } from '@/lib/schema';

type FaqProps = {
  items: FaqItem[];
  title?: string;
};

export function Faq({ items, title = 'A few things you might be wondering.' }: FaqProps) {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <Container>
        <Eyebrow>FAQ</Eyebrow>
        <h2 id="faq-title" className="faq__title">
          {title}
        </h2>
        <div className="faq__list">
          {items.map((item) => (
            <details key={item.question} className="faq__item">
              <summary className="faq__question">
                {item.question}
                <span className="faq__plus" aria-hidden="true" />
              </summary>
              <p className="faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
