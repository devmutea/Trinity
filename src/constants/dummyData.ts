import type { City, PopularRoute, Review } from '../types';

export const DUMMY_CITIES: City[] = [
  { id: '1', name: 'Kigali', state: 'Kigali City', country: 'Rwanda' },
  { id: '2', name: 'Kampala', state: 'Central', country: 'Uganda' },
  { id: '3', name: 'Mbarara', state: 'Western', country: 'Uganda' },
  { id: '4', name: 'Nairobi', state: 'Nairobi County', country: 'Kenya' },
  { id: '5', name: 'Busia', state: 'Western', country: 'Kenya' },
  { id: '6', name: 'Mombasa', state: 'Mombasa County', country: 'Kenya' },
  { id: '7', name: 'Kisumu', state: 'Kisumu County', country: 'Kenya' },
  { id: '8', name: 'Goma', state: 'North Kivu', country: 'DR Congo' },
  { id: '9', name: 'Juba', state: 'Central Equatoria', country: 'South Sudan' },
  { id: '10', name: 'Bor', state: 'Jonglei', country: 'South Sudan' }
];

const routeImageMap: Record<string, string> = {
  'Kigali-Kampala': '/site/routes/route (1).jpeg',
  'Kampala-Kigali': '/site/routes/route (2).jpeg',
  'Kigali-Mbarara': '/site/routes/route (1).jpg',
  'Mbarara-Kigali': '/site/routes/route (3).jpg',
  'Kigali-Nairobi': '/site/routes/route (1).png',
  'Nairobi-Kigali': '/site/routes/route (4).jpg',
  'Kigali-Busia': '/site/routes/route (1).webp',
  'Busia-Kigali': '/site/routes/route (5).jpg',
  'Busia-Kampala': '/site/routes/route (5).jpg',
  'Kampala-Busia': '/site/routes/route (3).jpg',
  'Kampala-Goma': '/site/routes/route (2).jpg',
  'Goma-Kampala': '/site/routes/route (6).jpg',
  'Kampala-Nairobi': '/site/routes/route (3).jpg',
  'Nairobi-Kampala': '/site/routes/route (4).jpeg',
  'Nairobi-Mombasa': '/site/routes/route (4).jpg',
  'Mombasa-Nairobi': '/site/routes/route (4).jpg',
  'Nairobi-Kisumu': '/site/routes/route (3).jpg',
  'Kisumu-Nairobi': '/site/routes/route (3).jpg',
  'Mombasa-Kisumu': '/site/routes/route (1).png',
  'Kisumu-Mombasa': '/site/routes/route (1).png',
  'Kampala-Juba': '/site/routes/route (4).jpeg',
  'Juba-Kampala': '/site/routes/route (7).jpg',
  'Juba-Bor': '/site/routes/route (7).jpg',
  'Bor-Juba': '/site/routes/route (9).jpg',
};

export const getRouteImage = (from: string, to: string): string => {
  const key = `${from}-${to}`;
  return routeImageMap[key] || '/site/routes/route (1).jpeg';
};

const preBookedSeatsMap: Record<string, string[]> = {
  'Kigali-Kampala': ['1A','1B','2C','3D','5A','6B','7C','8D','9A','10B','4C','6D'],
  'Kampala-Kigali': ['1C','1D','2A','3B','4D','5C','6A','7B','8C','9D','10A','3C'],
  'Kigali-Mbarara': ['1A','2B','3C','5D','6A','7B','8C','9D','10A','4B','2D'],
  'Mbarara-Kigali': ['1D','2A','3B','4C','5D','6A','7B','8C','9D','10A','1B','7C'],
  'Kigali-Nairobi': ['1A','1B','2C','2D','3A','4B','5C','6D','7A','8B','9C','10D','5A','8C'],
  'Nairobi-Kigali': ['1A','2B','3C','4D','5A','6B','7C','8D','9A','10B','3A','7D','6C'],
  'Kigali-Busia': ['1A','1B','2C','3D','4A','5B','6C','7D','8A','9B','10C','2D','9A'],
  'Busia-Kigali': ['1D','2C','3B','4A','5D','6C','7B','8A','9D','10C','1A','5B','8D'],
  'Kampala-Goma': ['1A','1B','2C','2D','3A','3B','4C','5D','6A','7B','8C','9D','10A','4D','7C'],
  'Goma-Kampala': ['1A','2B','3C','4D','5A','6B','7C','8D','9A','10B','2C','5D','8A'],
  'Kampala-Nairobi': ['1A','1B','2C','3D','4A','5B','6C','7D','8A','9B','10C','3C','6D','9A'],
  'Nairobi-Kampala': ['1D','2C','3B','4A','5D','6C','7B','8A','9D','10C','1A','4B','7D','10A'],
  'Nairobi-Mombasa': ['1A','2B','3C','4D','5A','6B','7C','8D','9A','10B','1C','2D','3A','4B'],
  'Mombasa-Nairobi': ['1D','2C','3B','4A','5D','6C','7B','8A','9D','10C','1A','4B','7D','10A'],
  'Nairobi-Kisumu': ['1A','1B','2C','2D','3A','4B','5C','6D','7A','8B','9C','10D','4C','7A'],
  'Kisumu-Nairobi': ['1D','2C','3B','4A','5D','6C','7B','8A','9D','10C','1A','4B','7D','10A'],
  'Mombasa-Kisumu': ['1A','1B','2C','3D','4A','5B','6C','7D','8A','9B','10C','2D','9A'],
  'Kisumu-Mombasa': ['1D','2C','3B','4A','5D','6C','7B','8A','9D','10C','1A','4B','7D','10A'],
  'Kampala-Juba': ['1A','1B','2C','2D','3A','4B','5C','6D','7A','8B','9C','10D','3D','6A','9B'],
  'Juba-Kampala': ['1A','2B','3C','4D','5A','6B','7C','8D','9A','10B','1D','4C','7A','10D'],
  'Juba-Bor': ['1A','1B','2C','3D','4A','5B','6C','7D','8A','9B','10C','2D','5A','8C'],
  'Bor-Juba': ['1D','2C','3B','4A','5D','6C','7B','8A','9D','10C','1A','4B','7D','10A'],
};

export const getPreBookedSeats = (from: string, to: string): string[] => {
  const key = `${from}-${to}`;
  return preBookedSeatsMap[key] || ['1A','2B','3C','4D','5A','6B','7C','8D'];
};

// Prices are stored in the origin city's display currency.
export const DUMMY_POPULAR_ROUTES: PopularRoute[] = [
  { id: 'pr1', origin_city: 'Kigali', destination_city: 'Kampala', price: 38000, bus_count: 5, image_url: '/site/routes/route (1).jpeg' },
  { id: 'pr2', origin_city: 'Kigali', destination_city: 'Mbarara', price: 25000, bus_count: 3, image_url: '/site/routes/route (1).jpg' },
  { id: 'pr3', origin_city: 'Kigali', destination_city: 'Nairobi', price: 75000, bus_count: 1, image_url: '/site/routes/route (1).png' },
  { id: 'pr4', origin_city: 'Kigali', destination_city: 'Busia', price: 55000, bus_count: 1, image_url: '/site/routes/route (1).webp' },
  { id: 'pr5', origin_city: 'Kampala', destination_city: 'Kigali', price: 100000, bus_count: 5, image_url: '/site/routes/route (2).jpeg' },
  { id: 'pr6', origin_city: 'Kampala', destination_city: 'Goma', price: 100000, bus_count: 2, image_url: '/site/routes/route (2).jpg' },
  { id: 'pr7', origin_city: 'Kampala', destination_city: 'Nairobi', price: 120000, bus_count: 2, image_url: '/site/routes/route (3).jpg' },
  { id: 'pr8', origin_city: 'Kampala', destination_city: 'Juba', price: 150000, bus_count: 2, image_url: '/site/routes/route (4).jpeg' },
  { id: 'pr9', origin_city: 'Nairobi', destination_city: 'Kigali', price: 7500, bus_count: 3, image_url: '/site/routes/route (4).jpg' },
  { id: 'pr10', origin_city: 'Nairobi', destination_city: 'Kampala', price: 4000, bus_count: 2, image_url: '/site/routes/route (4).jpeg' },
  { id: 'pr11', origin_city: 'Nairobi', destination_city: 'Mombasa', price: 2100, bus_count: 3, image_url: '/site/routes/route (4).jpg' },
  { id: 'pr12', origin_city: 'Nairobi', destination_city: 'Kisumu', price: 1600, bus_count: 2, image_url: '/site/routes/route (3).jpg' },
  { id: 'pr13', origin_city: 'Mombasa', destination_city: 'Kisumu', price: 2600, bus_count: 2, image_url: '/site/routes/route (1).png' },
  { id: 'pr14', origin_city: 'Mombasa', destination_city: 'Nairobi', price: 2100, bus_count: 3, image_url: '/site/routes/route (4).jpg' },
  { id: 'pr15', origin_city: 'Kisumu', destination_city: 'Nairobi', price: 1600, bus_count: 2, image_url: '/site/routes/route (3).jpg' },
  { id: 'pr16', origin_city: 'Busia', destination_city: 'Kampala', price: 2000, bus_count: 2, image_url: '/site/routes/route (5).jpg' },
  { id: 'pr15', origin_city: 'Kampala', destination_city: 'Busia', price: 60000, bus_count: 2, image_url: '/site/routes/route (3).jpg' },
  { id: 'pr16', origin_city: 'Busia', destination_city: 'Kigali', price: 5500, bus_count: 1, image_url: '/site/routes/route (5).jpg' },
  { id: 'pr17', origin_city: 'Juba', destination_city: 'Kampala', price: 600000, bus_count: 1, image_url: '/site/routes/route (7).jpg' },
  { id: 'pr18', origin_city: 'Juba', destination_city: 'Bor', price: 50000, bus_count: 1, image_url: '/site/routes/route (7).jpg' },
  { id: 'pr19', origin_city: 'Bor', destination_city: 'Juba', price: 50000, bus_count: 1, image_url: '/site/routes/route (9).jpg' }
];

export const DUMMY_REVIEWS: Review[] = [
  { id: 'rev1', name: 'John Mwangi', avatar: null, rating: 5, comment: 'Amazing service. The bus was very clean, WiFi was fast and we arrived in Kigali exactly on time.', route: 'Kampala → Kigali' },
  { id: 'rev2', name: 'Kagorora Alain', avatar: null, rating: 5, comment: 'Excellent luggage handling and professional crew. Extremely comfortable cross-border trip.', route: 'Kigali → Kampala' },
  { id: 'rev3', name: 'Sarah Nyambura', avatar: null, rating: 4, comment: 'Smooth custom clearing at Busia border. The staff made everything easy and hassle-free.', route: 'Kigali → Nairobi' },
  { id: 'rev4', name: 'Emmanuel Lado', avatar: null, rating: 5, comment: 'Fast and reliable package delivery service. Highly recommended.', route: 'Kampala → Juba' }
];

export interface BusSchedule {
  origin: string;
  dest: string;
  price: number;
  departures: string[];
}

export const DUMMY_SCHEDULES: BusSchedule[] = [
  { origin: 'Kigali', dest: 'Kampala', price: 38000, departures: ['09:00 AM', '03:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] },
  { origin: 'Kigali', dest: 'Mbarara', price: 25000, departures: ['09:00 AM', '03:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] },
  { origin: 'Kigali', dest: 'Nairobi', price: 75000, departures: ['02:00 PM'] },
  { origin: 'Kigali', dest: 'Busia', price: 55000, departures: ['02:00 PM'] },
  { origin: 'Mbarara', dest: 'Kigali', price: 25000, departures: ['08:00 AM', '12:00 PM', '05:00 PM'] },
  { origin: 'Kampala', dest: 'Kigali', price: 100000, departures: ['09:00 AM', '03:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'] },
  { origin: 'Kampala', dest: 'Goma', price: 100000, departures: ['09:00 AM', '08:00 PM', '09:00 PM'] },
  { origin: 'Kampala', dest: 'Nairobi', price: 120000, departures: ['05:00 PM', '07:00 PM'] },
  { origin: 'Kampala', dest: 'Juba', price: 150000, departures: ['08:00 PM', '09:00 PM'] },
  { origin: 'Nairobi', dest: 'Kigali', price: 7500, departures: ['12:00 PM', '04:00 PM'] },
  { origin: 'Nairobi', dest: 'Kampala', price: 4000, departures: ['08:00 PM'] },
  { origin: 'Nairobi', dest: 'Mombasa', price: 1800, departures: ['07:00 AM', '12:00 PM', '05:00 PM'] },
  { origin: 'Nairobi', dest: 'Kisumu', price: 1400, departures: ['08:00 AM', '04:00 PM'] },
  { origin: 'Mombasa', dest: 'Kisumu', price: 2500, departures: ['09:00 AM', '03:00 PM'] },
  { origin: 'Mombasa', dest: 'Nairobi', price: 1800, departures: ['08:00 AM', '01:00 PM', '06:00 PM'] },
  { origin: 'Kisumu', dest: 'Nairobi', price: 1400, departures: ['09:00 AM', '03:00 PM', '07:00 PM'] },
  { origin: 'Busia', dest: 'Kampala', price: 2000, departures: ['09:00 AM', '02:00 PM', '08:00 PM'] },
  { origin: 'Busia', dest: 'Kigali', price: 5500, departures: ['09:00 AM', '02:00 PM'] },
  { origin: 'Kampala', dest: 'Busia', price: 60000, departures: ['09:00 AM', '02:00 PM'] },
  { origin: 'Juba', dest: 'Kampala', price: 600000, departures: ['08:00 AM'] },
  { origin: 'Juba', dest: 'Bor', price: 50000, departures: ['08:00 AM'] },
  { origin: 'Bor', dest: 'Juba', price: 50000, departures: ['08:00 AM'] }
];
