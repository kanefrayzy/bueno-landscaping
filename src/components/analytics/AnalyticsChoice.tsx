'use client';

import { useState, useSyncExternalStore } from 'react';
import { analyticsOptedOut, setAnalyticsOptOut } from '@/lib/analytics';

const noop = () => () => {};

export function AnalyticsChoice() {
  const initialOff = useSyncExternalStore(noop, analyticsOptedOut, () => false);
  const [off, setOff] = useState<boolean | null>(null);
  const current = off ?? initialOff;

  return (
    <p className="privacy__choice">
      Analytics is <strong>{current ? 'off' : 'on'}</strong> in this browser.{' '}
      <button
        type="button"
        className="privacy__toggle"
        onClick={() => {
          setAnalyticsOptOut(!current);
          setOff(!current);
        }}
      >
        {current ? 'Turn analytics on' : 'Turn analytics off'}
      </button>
    </p>
  );
}
