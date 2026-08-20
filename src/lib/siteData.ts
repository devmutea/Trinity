import { DUMMY_SCHEDULES, DUMMY_POPULAR_ROUTES, getRouteImage } from '../constants/dummyData';

const DEFAULT_SITE_URL = 'https://trinity-express.com';

const getSiteUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  const envUrl = typeof import.meta !== 'undefined'
    ? (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_PUBLIC_SITE_URL
    : undefined;

  if (envUrl) {
    return envUrl;
  }

  if (typeof process !== 'undefined' && process.env?.VITE_PUBLIC_SITE_URL) {
    return process.env.VITE_PUBLIC_SITE_URL;
  }

  return DEFAULT_SITE_URL;
};

export const SITE_URL = getSiteUrl();
export const SITE_NAME = 'Trinity Express';
export const SITE_DESCRIPTION =
  'Trinity Express provides reliable cross-border bus travel across East Africa, including Kigali, Kampala, Nairobi, Juba and Bor routes, with comfortable buses and trusted customer support.';
export const SITE_THEME_COLOR = '#132f4c';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/site/hero.jpg`;
export const CONTACT_EMAIL = 'contact.trinityexpress@gmail.com';
export const CONTACT_PHONE = '+250788314935';
export const ADDRESS_STREET = 'KN 1 Rd, Chez Manu House, Nyarugenge';
export const ADDRESS_LOCALITY = 'Kigali City';
export const ADDRESS_REGION = 'Kigali';
export const ADDRESS_COUNTRY = 'Rwanda';
export const BRAND_SAME_AS = [
  'https://www.instagram.com/trinity_express_bus_ltd/',
  'https://apps.apple.com/ug/app/trinitybus/id6739221185',
  'https://www.tripadvisor.com/Attraction_Review-g293829-d27461256-Reviews-Trinity_Express_Bus-Kigali_Kigali_Province.html',
];

export const SERVICE_AREAS = [
  'Rwanda',
  'Uganda',
  'Kenya',
  'South Sudan',
  'Democratic Republic of the Congo',
];

export interface RouteInfo {
  origin: string;
  destination: string;
  slug: string;
  imageUrl: string;
  price: number;
  departures: string[];
  description: string;
  keywords: string[];
}

const cityCountryMap: Record<string, string> = {
  Kigali: 'Rwanda',
  Kampala: 'Uganda',
  Mbarara: 'Uganda',
  Nairobi: 'Kenya',
  Busia: 'Kenya',
  Mombasa: 'Kenya',
  Kisumu: 'Kenya',
  Goma: 'Democratic Republic of the Congo',
  Juba: 'South Sudan',
  Bor: 'South Sudan',
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const buildRouteInfo = (origin: string, dest: string) => {
  const slug = `${slugify(origin)}-${slugify(dest)}`;
  const schedule = DUMMY_SCHEDULES.find(
    (item) => item.origin.toLowerCase() === origin.toLowerCase() && item.dest.toLowerCase() === dest.toLowerCase()
  );
  const price = schedule?.price ?? 50000;
  const departures = schedule?.departures ?? ['09:00 AM', '03:00 PM', '08:00 PM'];

  const originCountry = cityCountryMap[origin] ?? 'East Africa';
  const destinationCountry = cityCountryMap[dest] ?? 'East Africa';
  const keywords = [
    `${origin} to ${dest} bus`,
    `${origin} to ${dest} bus tickets`,
    `${origin} ${dest} bus booking`,
    `Trinity Express ${origin} to ${dest}`,
    `${originCountry} to ${destinationCountry} bus`,
  ];

  const description = `Book Trinity Express ${origin} to ${dest} bus tickets for cross-border travel from ${originCountry} to ${destinationCountry}. Check departures, fares, seats and route details for the ${origin} ${dest} bus route.`;

  return {
    origin,
    destination: dest,
    slug,
    imageUrl: getRouteImage(origin, dest),
    price,
    departures,
    description,
    keywords,
  };
};

const routePairs = new Map<string, RouteInfo>();

DUMMY_SCHEDULES.forEach((schedule) => {
  const key = `${schedule.origin.toLowerCase()}-${schedule.dest.toLowerCase()}`;
  if (!routePairs.has(key)) {
    routePairs.set(key, buildRouteInfo(schedule.origin, schedule.dest));
  }
});

DUMMY_POPULAR_ROUTES.forEach((route) => {
  const key = `${route.origin_city.toLowerCase()}-${route.destination_city.toLowerCase()}`;
  if (!routePairs.has(key)) {
    routePairs.set(key, buildRouteInfo(route.origin_city, route.destination_city));
  }
});

export const ROUTE_PAGES = Array.from(routePairs.values());

export const createRouteSlug = (origin: string, destination: string) =>
  `${slugify(origin)}-${slugify(destination)}`;

export const SITEMAP_ROUTES = [
  '/',
  '/routes',
  '/news',
  '/faq',
  ...ROUTE_PAGES.map((route) => `/routes/${route.slug}`),
];

export const getRoutePageFromSlug = (slug: string) =>
  ROUTE_PAGES.find((route) => route.slug === slug);

export const formatRouteTitle = (origin: string, destination: string) =>
  `${origin} to ${destination} Bus Tickets`;

export const formatRouteDescription = (origin: string, destination: string) =>
  `Book Trinity Express ${origin} to ${destination} bus tickets. Check schedules, fares, seats and route details for reliable cross-border bus travel in East Africa.`;

export const formatRouteBreadcrumbs = (origin: string, destination: string) => [
  { name: 'Home', url: SITE_URL },
  { name: 'Routes', url: `${SITE_URL}/routes` },
  { name: `${origin} to ${destination}`, url: `${SITE_URL}/routes/${slugify(origin)}-${slugify(destination)}` },
];
