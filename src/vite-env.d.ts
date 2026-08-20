/// <reference types="vite/client" />

interface Window {
  __APP_CONFIG__?: import('./lib/appConfig').RuntimeAppConfig;
}

interface ImportMetaEnv {
  readonly PAYMENT_KENYA_PROVIDER?: string;
  readonly PAYMENT_INTERNATIONAL_PROVIDER?: string;
  readonly PAYMENT_FALLBACK_PROVIDER?: string;
  readonly WHATSAPP_NUMBER?: string;
  readonly WHATSAPP_DEFAULT_MESSAGE?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_CLIENT_URL?: string;
  readonly VITE_ADSENSE_PUBLISHER_ID?: string;
}
