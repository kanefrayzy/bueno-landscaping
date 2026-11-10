'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { GA_ID, setAnalyticsOptOut } from '@/lib/analytics';

/**
 * Cookie notice on the first visit, as on buenoexoticsny.com. With GA4 on it offers Decline,
 * which turns analytics off for this browser; analytics runs until then (opt-out, as /privacy
 * says). Without a measurement ID there is nothing to notify about, so it is not shown.
 */
const KEY = 'bueno-landscaping:cookie-notice';
const listeners = new Set<() => void>();
let answeredNow = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function answered(): boolean {
  if (answeredNow) return true;
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return true;
  }
}

function answer() {
  answeredNow = true;
  try {
    localStorage.setItem(KEY, new Date().toISOString());
  } catch {
    // Storage blocked: hidden for this visit anyway.
  }
  listeners.forEach((listener) => listener());
}

export function CookieNotice() {
  // Hidden on the server and during hydration; shown after it if nothing is stored.
  const open = !useSyncExternalStore(subscribe, answered, () => true);
  if (!GA_ID || !open) return null;

  return (
    <section className="cookie-notice" aria-label="Cookie notice">
      <p className="cookie-notice__text">
        We use <Link href="/privacy#cookies">cookies</Link> for analytics.
      </p>
      <div className="cookie-notice__actions">
        <button
          type="button"
          className="cookie-notice__button cookie-notice__button--ghost"
          onClick={() => {
            setAnalyticsOptOut(true);
            answer();
          }}
        >
          Decline
        </button>
        <button type="button" className="cookie-notice__button" onClick={answer}>
          Accept
        </button>
      </div>
    </section>
  );
}
