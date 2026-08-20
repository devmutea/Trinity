const getRuntimeMeasurementId = () =>
  typeof window !== 'undefined' ? window.__APP_CONFIG__?.VITE_GA_MEASUREMENT_ID?.trim() : undefined;

const getMeasurementId = () => import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || getRuntimeMeasurementId();

const GTAG_SCRIPT_ID = 'google-analytics-gtag';

type GtagConfig = {
  send_page_view?: boolean;
};

export type GoogleAnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

type GtagArguments =
  | ['js', Date]
  | ['config', string, GtagConfig?]
  | ['event', string, GoogleAnalyticsEventParams?];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArguments) => void;
  }
}

let hasInitialized = false;
let lastTrackedPagePath: string | null = null;

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export const isGoogleAnalyticsEnabled = () => Boolean(import.meta.env.PROD && getMeasurementId());

const loadGtagScript = () => {
  const measurementId = getMeasurementId();

  if (!measurementId || document.getElementById(GTAG_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;

  document.head.appendChild(script);
};

export const initGoogleAnalytics = () => {
  const measurementId = getMeasurementId();

  if (!isBrowser || !isGoogleAnalyticsEnabled() || hasInitialized || !measurementId) {
    return false;
  }

  loadGtagScript();

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag() {
      window.dataLayer = window.dataLayer ?? [];
      // Google gtag.js expects the official Arguments object here; rest-parameter arrays do not dispatch hits.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    } as (...args: GtagArguments) => void;

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
  });

  hasInitialized = true;
  return true;
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  const measurementId = getMeasurementId();

  if (!isBrowser || !isGoogleAnalyticsEnabled() || !measurementId || !window.gtag) return;
  if (pagePath === lastTrackedPagePath) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle ?? document.title,
    page_location: window.location.href,
  });

  lastTrackedPagePath = pagePath;
};

export const trackEvent = (eventName: string, eventParams?: GoogleAnalyticsEventParams) => {
  if (!isBrowser || !isGoogleAnalyticsEnabled() || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};
