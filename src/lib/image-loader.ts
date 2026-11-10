import imageWidths from '@/config/image-widths.json';

type ImageLoaderProps = { src: string; width: number };

const manifest: Record<string, { widths: number[]; original: number }> = imageWidths;

export default function imageLoader({ src, width }: ImageLoaderProps) {
  const entry = manifest[src];
  if (!entry) return src;

  const match = entry.widths.find((available) => available >= width);
  if (!match) return src;

  const name = src.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
  return `/images/w/${name}-${match}.webp`;
}
