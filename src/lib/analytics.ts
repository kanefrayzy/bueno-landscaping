/**
 * Google Analytics 4, set up the same way as on buenoexoticsny.com. The measurement ID is compiled
 * in (NEXT_PUBLIC_GA_ID, passed to deploy/deploy.sh); without it nothing loads and `track` does
 * nothing. The tag is <Analytics> in the root layout; components only call `track`.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export type AnalyticsEvent = 'click_call' | 'click_sms' | 'form_start' | 'quote_submit';

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const OPT_OUT_KEY = 'bueno-landscaping:analytics';

/** The visitor turned analytics off (Decline, or the switch on /privacy), or the browser sends Global Privacy Control. */
export function analyticsOptedOut(): boolean {
  if (typeof navigator !== 'undefined' && (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl) return true;
  try {
    return localStorage.getItem(OPT_OUT_KEY) === 'off';
  } catch {
    return false;
  }
}

/** Turns analytics off (or back on) for this browser. Off takes effect at once. */
export function setAnalyticsOptOut(off: boolean) {
  try {
    if (off) localStorage.setItem(OPT_OUT_KEY, 'off');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // Storage blocked: the choice holds for this page only.
  }
  if (!GA_ID) return;
  const state = off ? 'denied' : 'granted';
  window.gtag?.('consent', 'update', {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: 'denied',
  });
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = off;
}

/** `?ga_debug=1` once in a session sends this browser's hits to GA4 DebugView. */
export function gaDebug(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('ga_debug') === '1') sessionStorage.setItem('bueno-landscaping:ga-debug', '1');
    return sessionStorage.getItem('bueno-landscaping:ga-debug') === '1';
  } catch {
    return false;
  }
}

const SESSION_TIMEOUT_S = 30 * 60;
let restartedAt = 0;

function lastHitSeconds(): number {
  const match = document.cookie.match(new RegExp(`(?:^|; )_ga_${GA_ID.replace(/^G-/, '')}=([^;]*)`));
  if (!match) return 0;
  const value = decodeURIComponent(match[1]);
  return Number(value.startsWith('GS1') ? value.split('.')[5] : /\$t(\d+)/.exec(value)?.[1]) || 0;
}

/**
 * A tab left open for more than 30 minutes: without a page_view first, the next event starts a
 * session with source "(not set)", which Google Ads cannot tie to the ad click.
 */
export function restartExpiredSession() {
  if (!GA_ID || !window.gtag || analyticsOptedOut()) return;
  const cookieLast = lastHitSeconds();
  if (!cookieLast) return;
  const last = Math.max(cookieLast, performance.timeOrigin / 1000);
  if (Date.now() / 1000 - last < SESSION_TIMEOUT_S || Date.now() - restartedAt < 10_000) return;
  restartedAt = Date.now();
  window.gtag('event', 'page_view', { page_location: window.location.href });
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (!GA_ID || !window.gtag || analyticsOptedOut()) return;
  restartExpiredSession();
  window.gtag('event', event, params);
}

/** For tel: and sms: links: sent as a beacon so it survives the phone app taking over. The link itself opens natively. */
export function trackLeaving(event: AnalyticsEvent, params: Params = {}) {
  if (!GA_ID || !window.gtag || analyticsOptedOut()) return;
  restartExpiredSession();
  window.gtag('event', event, { ...params, transport_type: 'beacon' });
}
