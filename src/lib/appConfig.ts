export interface RuntimeAppConfig {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_CLIENT_URL?: string;
  VITE_GA_MEASUREMENT_ID?: string;
  PAYMENT_KENYA_PROVIDER?: string;
  PAYMENT_INTERNATIONAL_PROVIDER?: string;
  PAYMENT_FALLBACK_PROVIDER?: string;
  WHATSAPP_NUMBER?: string;
  WHATSAPP_DEFAULT_MESSAGE?: string;
}

const stripQuotes = (value: string | undefined): string => {
  if (!value) {
    return '';
  }

  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const normalizeConfigValue = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return stripQuotes(value);
};

export const getRuntimeConfig = (): RuntimeAppConfig =>
  typeof window !== 'undefined'
    ? (Object.entries(window.__APP_CONFIG__ ?? {}).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = normalizeConfigValue(value);
        return acc;
      }, {}) as RuntimeAppConfig)
    : {};

export const readPublicConfigValue = (key: keyof RuntimeAppConfig): string => {
  const runtimeValue = normalizeConfigValue(getRuntimeConfig()[key]);
  if (runtimeValue) {
    return runtimeValue;
  }

  return normalizeConfigValue(import.meta.env[key] as string | undefined);
};
