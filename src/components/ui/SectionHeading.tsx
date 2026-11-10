import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
};

export function SectionHeading({ id, eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="section-heading" data-reveal>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id}>{title}</h2>
      </div>
      {description && <p className="section-heading__description">{description}</p>}
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  );
}
