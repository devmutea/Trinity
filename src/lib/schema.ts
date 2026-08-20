import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  ADDRESS_STREET,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  ADDRESS_COUNTRY,
  BRAND_SAME_AS,
  ROUTE_PAGES,
  SERVICE_AREAS,
} from './siteData';
import type { RouteInfo } from './siteData';

const formatIso = (dateString: string) => {
  const [timeStr, ampm] = dateString.split(' ');
  const [rawHour, rawMinute] = timeStr.split(':').map(Number);
  let hour = rawHour;
  const minute = rawMinute;
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const getArrivalTime = (departureIso: string) => {
  const departureDate = new Date(departureIso);
  const arrivalDate = new Date(departureDate.getTime() + 5 * 60 * 60 * 1000);
  return arrivalDate.toISOString();
};

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: ['Trinity Express Bus', 'Trinity Bus', 'Trinity Bus Express'],
  url: SITE_URL,
  logo: `${SITE_URL}/site/company-logo.jpeg`,
  image: `${SITE_URL}/site/hero.jpg`,
  sameAs: BRAND_SAME_AS,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: CONTACT_PHONE,
      email: CONTACT_EMAIL,
      areaServed: 'RW',
      availableLanguage: ['English', 'Kinyarwanda', 'Swahili'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS_STREET,
    addressLocality: ADDRESS_LOCALITY,
    addressRegion: ADDRESS_REGION,
    addressCountry: ADDRESS_COUNTRY,
  },
  areaServed: SERVICE_AREAS.map((area) => ({
    '@type': 'Country',
    name: area,
  })),
});

export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: ['Trinity Express Bus', 'Trinity Bus'],
  description: SITE_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/results?from={from}&to={to}&date={date}`,
    'query-input': 'required name=from',
  },
});

export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'BusCompany'],
  name: SITE_NAME,
  alternateName: ['Trinity Express Bus', 'Trinity Bus'],
  url: SITE_URL,
  telephone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  image: `${SITE_URL}/site/company-logo.jpeg`,
  sameAs: BRAND_SAME_AS,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS_STREET,
    addressLocality: ADDRESS_LOCALITY,
    addressRegion: ADDRESS_REGION,
    addressCountry: ADDRESS_COUNTRY,
  },
  areaServed: SERVICE_AREAS.map((area) => ({
    '@type': 'Country',
    name: area,
  })),
});

export const getFAQSchema = (faqItems: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const getBreadcrumbSchema = (items: { name: string; item?: string; url?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((entry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: entry.name,
    item: entry.item ?? entry.url ?? '',
  })),
});

export const getBusTripSchema = (route: RouteInfo) => {
  const departureTime = formatIso(route.departures[0] || '09:00 AM');
  return {
    '@context': 'https://schema.org',
    '@type': 'BusTrip',
    name: `Trinity Express ${route.origin} to ${route.destination} bus`,
    description: route.description,
    url: `${SITE_URL}/routes/${route.slug}`,
    image: `${SITE_URL}${route.imageUrl}`,
    keywords: route.keywords.join(', '),
    provider: {
      '@type': 'BusCompany',
      name: SITE_NAME,
      url: SITE_URL,
      sameAs: BRAND_SAME_AS,
    },
    departureBusStop: {
      '@type': 'BusStation',
      name: route.origin,
      address: {
        '@type': 'PostalAddress',
        addressLocality: route.origin,
        addressCountry: ADDRESS_COUNTRY,
      },
    },
    arrivalBusStop: {
      '@type': 'BusStation',
      name: route.destination,
      address: {
        '@type': 'PostalAddress',
        addressLocality: route.destination,
        addressCountry: ADDRESS_COUNTRY,
      },
    },
    departureTime,
    arrivalTime: getArrivalTime(departureTime),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/routes/${route.slug}`,
      price: route.price,
      priceCurrency: 'RWF',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
  };
};

export const getRouteItemListSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Trinity Express bus routes',
  description: 'Popular Trinity Express cross-border bus routes across East Africa.',
  itemListElement: ROUTE_PAGES.map((route, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/routes/${route.slug}`,
    name: `${route.origin} to ${route.destination} bus tickets`,
    description: route.description,
  })),
});
