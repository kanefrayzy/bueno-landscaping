'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { workCategories, type WorkCategory, type WorkImage } from '@/config/work';
import { cn } from '@/lib/cn';

type WorkGalleryProps = {
  items: WorkImage[];
  filters?: boolean;
  label: string;
};

export function WorkGallery({ items, filters = false, label }: WorkGalleryProps) {
  const [category, setCategory] = useState<WorkCategory | 'all'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (category === 'all' ? items : items.filter((item) => item.category === category)),
    [items, category],
  );
  const usedCategories = workCategories.filter((c) => items.some((item) => item.category === c.id));
  const current = openIndex === null ? null : visible[openIndex];

  const step = (delta: number) =>
    setOpenIndex((index) => (index === null ? null : (index + delta + visible.length) % visible.length));

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="work-gallery">
      {filters && (
        <div className="work-gallery__filters" role="group" aria-label="Filter photos by type of work">
          {[{ id: 'all' as const, label: 'All work' }, ...usedCategories].map((option) => (
            <button
              key={option.id}
              type="button"
              className={cn('work-gallery__filter', category === option.id && 'work-gallery__filter--active')}
              aria-pressed={category === option.id}
              onClick={() => setCategory(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <ul className="work-gallery__grid" aria-label={label}>
        {visible.map((item, index) => (
          <li key={item.id}>
            <button type="button" className="work-gallery__item" onClick={() => setOpenIndex(index)}>
              <Image
                className="work-gallery__image"
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
              />
              {item.stage && <span className="work-gallery__stage">{item.stage === 'before' ? 'Before' : 'After'}</span>}
              <span className="work-gallery__zoom" aria-hidden="true">
                <Icon name="arrowUp" size={16} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={current !== null}
        onClose={() => setOpenIndex(null)}
        labelledBy="work-lightbox-caption"
        closeLabel="Close photo"
        className="work-lightbox"
      >
        {current && (
          <>
            <div className="work-lightbox__media">
              <Image
                className="work-lightbox__image"
                src={current.src}
                alt={current.alt}
                fill
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
            </div>
            <div className="work-lightbox__bar">
              <p id="work-lightbox-caption" className="work-lightbox__caption">
                {current.alt}
              </p>
              {visible.length > 1 && (
                <div className="work-lightbox__nav">
                  <button type="button" className="work-lightbox__button" onClick={() => step(-1)} aria-label="Previous photo">
                    <Icon name="arrow" size={18} className="work-lightbox__prev" />
                  </button>
                  <span className="work-lightbox__count">
                    {(openIndex ?? 0) + 1} / {visible.length}
                  </span>
                  <button type="button" className="work-lightbox__button" onClick={() => step(1)} aria-label="Next photo">
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
