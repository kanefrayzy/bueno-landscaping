import { featuredWork, workImages, type WorkCategory, type WorkImage } from './work';

// Photos the server may give a published post as its cover. The homepage photos are left
// out (the latest posts show on the homepage, and a photo must not appear twice there), and
// so are "before" shots. Kind keeps two posts in a row from getting the same sort of photo.
export type CoverKind = Exclude<WorkCategory, 'before-after'>;

// "After" shots, filed under what they show.
const afterShotKinds: Record<string, CoverKind> = {
  'gravel-yard-after': 'lawn',
  'patio-after': 'patios',
  'sod-yard-after': 'lawn',
};

const onHomepage = new Set(featuredWork.map((image) => image.id));

export const coverPool: { image: WorkImage; kind: CoverKind }[] = workImages.flatMap((image) => {
  if (onHomepage.has(image.id)) return [];
  if (image.category === 'before-after') {
    const kind = afterShotKinds[image.id];
    return kind ? [{ image, kind }] : [];
  }
  return [{ image, kind: image.category }];
});

export function coverKind(id: string): CoverKind | undefined {
  return coverPool.find((cover) => cover.image.id === id)?.kind;
}
