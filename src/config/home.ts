import type { FaqItem } from './services';
import { site } from './site';

export const homeFaq: FaqItem[] = [
  {
    question: 'Can I request a one-time cleanup?',
    answer:
      'Yes. Get in touch about a spring or fall cleanup, or tell us what your property needs. We’ll go over the work and availability with you.',
  },
  {
    question: 'What should I include in my estimate request?',
    answer: `Your name, phone number, town and the service you need. A short description of the job helps. You can also text photos of the area to ${site.phone.display}.`,
  },
  {
    question: 'Do you offer regular lawn maintenance?',
    answer: `Yes, lawn care is one of our services. Call or text ${site.phone.display} to talk about your property, scheduling and current availability.`,
  },
  {
    question: 'Do you do hardscape, irrigation and drainage work too?',
    answer:
      'Yes. Besides lawn care and planting, we build patios, walkways and retaining walls, do stone and brick work, install and service sprinkler systems, fix drainage problems with French drains and dry wells, and install sheds.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We’re based in Patchogue and work in nearby towns on Long Island. Check the service areas page or call to ask about your address.',
  },
];
