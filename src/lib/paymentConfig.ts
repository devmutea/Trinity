import { readPublicConfigValue } from './appConfig';

export type PaymentProvider = 'paystack' | 'whatsapp';

export type PaymentProviderConfig =
  | {
      isValid: true;
      provider: PaymentProvider;
      label: string;
      description: string;
    }
  | {
      isValid: false;
      provider: null;
      label: null;
      description: null;
      error: string;
    };

export interface PaystackConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  clientUrl: string;
}

export interface WhatsAppConfig {
  number: string;
  defaultMessage: string;
}

const normalizeProvider = (value: string | undefined): PaymentProvider | null => {
  const provider = value?.trim().toLowerCase();

  if (provider === 'paystack' || provider === 'whatsapp') {
    return provider;
  }

  return null;
};

const readConfigValue = (key: keyof import('./appConfig').RuntimeAppConfig) =>
  readPublicConfigValue(key);

const readRoutingProvider = (key: keyof import('./appConfig').RuntimeAppConfig): PaymentProvider | null =>
  normalizeProvider(readConfigValue(key));

export const getPaymentFallbackProvider = (): PaymentProvider =>
  readRoutingProvider('PAYMENT_FALLBACK_PROVIDER') ?? 'whatsapp';

export const getPaymentProviderForRoute = (
  originCountryCode?: string,
  passengerCountryCodes: string[] = []
): PaymentProvider => {
  const hasOnlyKenyanPassengers = passengerCountryCodes.length > 0 && passengerCountryCodes.every(
    (countryCode) => countryCode.toUpperCase() === 'KE'
  );
  const providerKey = originCountryCode?.toUpperCase() === 'KE' && hasOnlyKenyanPassengers
    ? 'PAYMENT_KENYA_PROVIDER'
    : 'PAYMENT_INTERNATIONAL_PROVIDER';

  return readRoutingProvider(providerKey) ?? getPaymentFallbackProvider();
};

const resolvePaystackConfig = (): PaystackConfig | null => {
  const supabaseUrl = readConfigValue('VITE_SUPABASE_URL');
  const supabaseAnonKey = readConfigValue('VITE_SUPABASE_ANON_KEY');
  const clientUrl = readConfigValue('VITE_CLIENT_URL');

  if (!supabaseUrl || !supabaseAnonKey || !clientUrl) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey, clientUrl };
};

const resolveWhatsAppConfig = (): WhatsAppConfig | null => {
  const rawNumber = readConfigValue('WHATSAPP_NUMBER');
  const defaultMessage = readConfigValue('WHATSAPP_DEFAULT_MESSAGE');
  const normalizedNumber = rawNumber.replace(/[^\d]/g, '');

  if (!rawNumber || !defaultMessage) {
    return null;
  }

  if (!/^\d{7,15}$/.test(normalizedNumber)) {
    return null;
  }

  return {
    number: normalizedNumber,
    defaultMessage,
  };
};

const paystackConfig = resolvePaystackConfig();
const whatsappConfig = resolveWhatsAppConfig();

const paymentProviderConfig: PaymentProviderConfig = (() => {
  const fallbackProvider = getPaymentFallbackProvider();

  if (fallbackProvider === 'paystack') {
    if (!paystackConfig) {
      return {
        isValid: false,
        provider: null,
        label: null,
        description: null,
        error: 'Invalid Paystack fallback configuration. Ensure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_CLIENT_URL are configured.',
      };
    }

    return {
      isValid: true,
      provider: fallbackProvider,
      label: 'Paystack',
      description: 'Paystack mobile money',
    };
  }

  if (!whatsappConfig) {
    return {
      isValid: false,
      provider: null,
      label: null,
      description: null,
      error: 'Invalid WhatsApp fallback configuration. Ensure WHATSAPP_NUMBER and WHATSAPP_DEFAULT_MESSAGE are configured.',
    };
  }

  return {
    isValid: true,
    provider: fallbackProvider,
    label: 'WhatsApp',
    description: 'WhatsApp checkout',
  };
})();

export const getPaymentProviderConfig = (): PaymentProviderConfig => paymentProviderConfig;

export const getPaystackConfig = (): PaystackConfig => {
  if (!paystackConfig) {
    throw new Error('Paystack is not configured. Ensure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_CLIENT_URL are configured.');
  }

  return paystackConfig;
};

export const getWhatsAppConfig = (): WhatsAppConfig => {
  if (!whatsappConfig) {
    throw new Error('WhatsApp is not configured. Ensure WHATSAPP_NUMBER and WHATSAPP_DEFAULT_MESSAGE are configured.');
  }

  return whatsappConfig;
};
