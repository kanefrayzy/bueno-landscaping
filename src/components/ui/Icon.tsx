import { cn } from '@/lib/cn';

const icons = {
  arrow: { viewBox: '0 0 24 24', path: 'M5 12h14m-6-6 6 6-6 6' },
  arrowUp: { viewBox: '0 0 24 24', path: 'M6 18 18 6M6 6h12v12' },
  grass: {
    viewBox: '0 0 48 48',
    path: 'M5 42h38M10 41C12 27 8 16 5 13c10 4 16 18 16 28M24 42C19 22 22 10 29 5c-2 14-2 25 0 37M34 41c-2-14 2-24 10-31-4 10-5 21-5 31',
  },
  plant: {
    viewBox: '0 0 48 48',
    path: 'M24 43V19m0 12C13 33 6 25 6 17c11-1 18 4 18 14Zm0-9C23 11 29 5 38 4c1 10-3 17-14 18Zm0 16c1-11 8-16 18-15 0 10-6 16-18 15ZM14 44h20',
  },
  tree: {
    viewBox: '0 0 48 48',
    path: 'M24 43V29m-8 15h16M16 34C4 34 3 22 10 18 7 9 16 5 21 9c6-9 16-4 15 4 10 2 10 14 3 17-2 8-10 9-15 4-2 2-5 2-8 0Z',
  },
  pavers: {
    viewBox: '0 0 48 48',
    path: 'M5 21h38v22H5ZM10 21v-7h28v7M15 14V7h18v7M5 32h38M17 21v11m14-11v11M24 32v11',
  },
  leaf: {
    viewBox: '0 0 48 48',
    path: 'M8 37C-1 17 17 4 42 7c2 25-13 38-29 31M5 44 34 15M19 30l-2-12m9 6 11 1',
  },
  water: {
    viewBox: '0 0 48 48',
    path: 'M24 5C18 14 11 22 11 30a13 13 0 0 0 26 0c0-8-7-16-13-25ZM18 31a6 6 0 0 0 6 6',
  },
  drain: {
    viewBox: '0 0 48 48',
    path: 'M4 31h40M4 41h40M10 36h.01M18 36h.01M26 36h.01M34 36h.01M42 36h.01M15 6c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12ZM33 12c-3 4-4 6-4 8a4 4 0 0 0 8 0c0-2-1-4-4-8Z',
  },
  bricks: {
    viewBox: '0 0 48 48',
    path: 'M5 9h38v30H5ZM5 19h38M5 29h38M17 9v10m14-10v10M11 19v10m13-10v10m13-10v10M17 29v10m14-10v10',
  },
  shed: {
    viewBox: '0 0 48 48',
    path: 'M5 22 24 8l19 14M10 18v25h28V18M19 43V30h10v13M5 43h38',
  },
  phone: {
    viewBox: '0 0 24 24',
    path: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  },
  message: {
    viewBox: '0 0 24 24',
    path: 'M4 5h16v11H9l-5 4V5Z',
  },
  check: { viewBox: '0 0 24 24', path: 'm5 12 5 5 9-10' },
} as const;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 22, className }: IconProps) {
  const { viewBox, path } = icons[name];

  return (
    <svg className={cn('icon', className)} viewBox={viewBox} width={size} height={size} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
