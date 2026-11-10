'use client';

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  closeLabel: string;
  className?: string;
  children: ReactNode;
};

export function Dialog({ open, onClose, labelledBy, closeLabel, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    const { clientX: x, clientY: y } = event;
    if (x < left || x > right || y < top || y > bottom) onClose();
  }

  return (
    <dialog
      ref={ref}
      className={cn('dialog', className)}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {/* Nothing inside while closed: text-only views (reader mode, ad landing-page checks) show a closed dialog's contents. */}
      {open && (
        <>
          <button className="dialog__close" type="button" aria-label={closeLabel} onClick={onClose}>
            ×
          </button>
          {children}
        </>
      )}
    </dialog>
  );
}
