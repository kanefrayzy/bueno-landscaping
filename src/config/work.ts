import { workImages } from './work-images';

export type WorkCategory = 'patios' | 'masonry' | 'walls' | 'lawn' | 'irrigation' | 'before-after' | 'more';

export type WorkImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  category: WorkCategory;
  pair?: string;
  stage?: 'before' | 'after';
  source: { video: string; time: number };
};

export const workCategories: { id: WorkCategory; label: string }[] = [
  { id: 'patios', label: 'Patios & Walkways' },
  { id: 'masonry', label: 'Masonry & Stone' },
  { id: 'walls', label: 'Walls & Steps' },
  { id: 'lawn', label: 'Lawn & Planting' },
  { id: 'irrigation', label: 'Irrigation & Drainage' },
  { id: 'before-after', label: 'Before & After' },
  { id: 'more', label: 'Sheds & More' },
];

const byId = new Map(workImages.map((image) => [image.id, image]));

export function findWork(id: string): WorkImage | undefined {
  return byId.get(id);
}

export function getWork(id: string): WorkImage {
  const image = byId.get(id);
  if (!image) throw new Error(`Unknown work image: ${id}`);
  return image;
}

export function getWorks(ids: string[]) {
  return ids.map(getWork);
}

// Homepage strip: mostly masonry and hardscape, chosen from photos no service page uses.
export const featuredWork = getWorks([
  'fire-pit-patio-waterfront',
  'flagstone-patio-sunset',
  'paver-walkway-front-porch',
  'checkerboard-patio-seating-wall',
  'retaining-wall-lit-bed',
  'paver-patio-from-deck',
  'stepping-pavers-crushed-stone',
  'paver-walkway-front-beds',
]);

export { workImages };
