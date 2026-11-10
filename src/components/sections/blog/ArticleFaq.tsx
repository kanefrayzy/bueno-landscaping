import { JsonLd } from '@/components/ui/JsonLd';
import type { FaqItem } from '@/config/services';
import { faqSchema } from '@/lib/schema';

export function ArticleFaq({ items }: { items: FaqItem[] }) {
  return (
    <section className="article-faq" aria-labelledby="article-faq-title">
      <h2 id="article-faq-title">Quick answers</h2>
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
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
