'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { analyticsOptedOut, GA_ID, gaDebug, restartExpiredSession, trackLeaving } from '@/lib/analytics';

/**
 * Loads GA4 after the page is interactive, never for visitors who opted out. Same consent model
 * as buenoexoticsny.com: granted until the visitor presses Decline; ad_user_data is granted so
 * GA4 key events imported into Google Ads can be tied to the ad click; ad_personalization stays
 * denied (no remarketing). Also counts Call and Text taps on every page.
 */
export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!GA_ID || analyticsOptedOut()) return;
    window.dataLayer = window.dataLayer || [];
    // gtag.js reads `arguments` objects from the queue, not arrays.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      ...(gaDebug() ? { debug_mode: true } : {}),
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="sms:"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const call = link.getAttribute('href')!.startsWith('tel:');
      trackLeaving(call ? 'click_call' : 'click_sms', {
        link_location: link.dataset.track ?? 'page',
        link_text: (link.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 60),
      });
    };
    const onReturn = () => document.visibilityState === 'visible' && restartExpiredSession();
    const onRestore = (event: PageTransitionEvent) => event.persisted && restartExpiredSession();
    // Capture: counted before the browser hands the tap to the phone app.
    document.addEventListener('click', onClick, true);
    document.addEventListener('visibilitychange', onReturn);
    window.addEventListener('pageshow', onRestore);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('visibilitychange', onReturn);
      window.removeEventListener('pageshow', onRestore);
    };
  }, [enabled]);

  return enabled ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /> : null;
}
