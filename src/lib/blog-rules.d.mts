export type FaqInput = { question: string; answer: string };

export type PostInput = {
  slug: string;
  service: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  body: string;
  faq?: FaqInput[];
};

type Range = { min: number; max: number };

export const LIMITS: {
  slug: Range;
  title: Range;
  seoTitle: Range;
  description: Range;
  intro: Range;
  body: Range;
  faqItems: { max: number };
  faqQuestion: Range;
  faqAnswer: Range;
  sections: { min: number };
};
export const SLUG_PATTERN: RegExp;
export const STATIC_PATHS: string[];
export const BANNED_PHRASES: string[];
export const BANNED_CHARACTERS: [string, string][];

export function validatePost(
  input: unknown,
  context: { services: string[]; blogSlugs: string[] },
): { post: PostInput | null; errors: Record<string, string[]> };

export function findBannedPhrases(text: string): string[];

export function checkLink(href: string, context: { services: string[]; blogSlugs: string[] }): string | null;

export function readingMinutes(post: Pick<PostInput, 'body' | 'faq'>): number;
