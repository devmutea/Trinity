const DEFAULT_CURRENCY = 'KES';

const CURRENCY_BY_CITY: Record<string, string> = {
  kigali: 'RWF',
  kampala: 'UGX',
  nairobi: 'KES',
  busia: 'KES',
  mombasa: 'KES',
  kisumu: 'KES',
  mbarara: 'UGX',
  goma: 'CDF',
  juba: 'SSP',
  bor: 'SSP',
};

const COUNTRY_CODE_BY_CITY: Record<string, string> = {
  kigali: 'RW',
  kampala: 'UG',
  nairobi: 'KE',
  busia: 'KE',
  mombasa: 'KE',
  kisumu: 'KE',
  mbarara: 'UG',
  goma: 'CD',
  juba: 'SS',
  bor: 'SS',
};

const EXCHANGE_TO_KES: Record<string, number> = {
  RWF: 0.1,
  UGX: 0.03,
  KES: 1,
  CDF: 0.0025,
  SSP: 0.01,
};

const PHONE_COUNTRY_CONFIG: Record<string, { label: string; dialCode: string; regex: RegExp; example: string }> = {
  KE: { label: 'Kenya', dialCode: '+254', regex: /^(?:\+254|254|0)?7\d{8}$/, example: '712345678' },
  UG: { label: 'Uganda', dialCode: '+256', regex: /^(?:\+256|256|0)?7\d{8}$/, example: '712345678' },
  RW: { label: 'Rwanda', dialCode: '+250', regex: /^(?:\+250|250|0)?7\d{8}$/, example: '712345678' },
  CD: { label: 'DR Congo', dialCode: '+243', regex: /^(?:\+243|243|0)?[89]\d{8}$/, example: '812345678' },
  SS: { label: 'South Sudan', dialCode: '+211', regex: /^(?:\+211|211|0)?9\d{8}$/, example: '912345678' },
};

const formatAmount = (price: number): string =>
  new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

const getCurrencyForCity = (originCityName?: string): string => {
  const normalized = originCityName?.toLowerCase().trim() || '';
  return CURRENCY_BY_CITY[normalized] || DEFAULT_CURRENCY;
};

export const getCountryCodeForCity = (cityName?: string): string | undefined => {
  const normalized = cityName?.toLowerCase().trim() || '';
  return COUNTRY_CODE_BY_CITY[normalized];
};

export const getCurrency = (originCityName?: string): string => getCurrencyForCity(originCityName);

export const formatPrice = (price: number, originCityName?: string): string => {
  const currency = getCurrencyForCity(originCityName);
  return `${currency} ${formatAmount(price)}`;
};

export const formatPriceForCheckout = (price: number, originCityName?: string): string => {
  const currency = getCurrencyForCity(originCityName);
  const rate = EXCHANGE_TO_KES[currency] ?? 1;
  const kesAmount = Math.round(Number(price) * rate);
  return `KES ${formatAmount(kesAmount)}`;
};

export const formatPriceWithKesConversion = (price: number, originCityName?: string): string => {
  const formattedOriginal = formatPrice(price, originCityName);
  const formattedKes = formatPriceForCheckout(price, originCityName);
  return `${formattedOriginal} (${formattedKes})`;
};

export const convertAmountToCheckoutCurrency = (price: number, originCityName?: string): number => {
  const currency = getCurrencyForCity(originCityName);
  const rate = EXCHANGE_TO_KES[currency] ?? 1;
  return Math.round(Number(price) * rate);
};

export const PHONE_COUNTRIES = Object.entries(PHONE_COUNTRY_CONFIG).map(([code, config]) => ({
  code,
  ...config,
}));

export const getDefaultPhoneCountry = (cityName?: string): string => getCountryCodeForCity(cityName) ?? 'KE';

export const isValidPhoneNumber = (value: string, countryCode: string): boolean => {
  const normalized = normalizePhoneInput(value).trim();
  if (!normalized) return false;

  const digits = normalized.replace(/^\+/, '');
  const config = PHONE_COUNTRY_CONFIG[countryCode as keyof typeof PHONE_COUNTRY_CONFIG];
  if (!config) return false;

  return config.regex.test(digits);
};

export const normalizePhoneInput = (value: string): string => {
  const trimmed = value.trim();
  const cleaned = trimmed.replace(/[^\d+]/g, '').replace(/\s+/g, '');

  if (!cleaned) {
    return '';
  }

  const withoutPlus = cleaned.replace(/\+/g, '');
  return cleaned.startsWith('+') ? `+${withoutPlus}` : withoutPlus;
};

export const isValidKenyanPhoneNumber = (value: string): boolean => {
  const normalized = normalizePhoneInput(value).trim();

  if (!normalized) {
    return false;
  }

  const withoutPlus = normalized.startsWith('+') ? normalized.slice(1) : normalized;
  const digitsOnly = withoutPlus.replace(/\D/g, '');

  if (/^254[17]\d{8}$/.test(digitsOnly)) {
    return true;
  }

  if (/^0[17]\d{8}$/.test(digitsOnly)) {
    return true;
  }

  if (/^[17]\d{8}$/.test(digitsOnly)) {
    return true;
  }

  return false;
};
