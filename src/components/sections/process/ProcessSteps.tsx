import { processSteps } from '@/config/process';

export function ProcessSteps() {
  return (
    <ol className="process-steps">
      {processSteps.map((step, index) => (
        <li key={step.title} className="process-steps__item" data-reveal>
          <span className="process-steps__number">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="process-steps__title">{step.title}</h3>
            <p className="process-steps__text">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
