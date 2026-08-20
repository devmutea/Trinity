import { DUMMY_SCHEDULES, DUMMY_POPULAR_ROUTES, getPreBookedSeats, getRouteImage } from '../constants/dummyData';
import type { Bus } from '../types';

const departurePricingByOrigin = (from: string) => {
  const lowerFrom = from.toLowerCase();
  if (lowerFrom.includes('kigali')) return 35000;
  if (lowerFrom.includes('kampala')) return 110000;
  if (lowerFrom.includes('nairobi')) return 6000;
  if (lowerFrom.includes('busia')) return 2000;
  if (lowerFrom.includes('juba') || lowerFrom.includes('bor')) return 75000;
  return 50000;
};

const getArrivalTime = (dep: string) => {
  const [timeStr, ampm] = dep.split(' ');
  const [rawHour, rawMinute] = timeStr.split(':').map(Number);
  let hour = rawHour;
  const minute = rawMinute;
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  const arrH = (hour + 5) % 24;
  const arrAmpm = arrH >= 12 ? 'PM' : 'AM';
  const arrH12 = arrH % 12 === 0 ? 12 : arrH % 12;
  return `${String(arrH12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${arrAmpm}`;
};

const formatNumberPlate = (origin: string, destination: string, index: number) => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const key = `${origin}:${destination}:${index}`;
  const hash = Array.from(key).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const prefix = letters[hash % letters.length];
  const suffixes = ['UA', 'UB', 'UC', 'UD', 'UE', 'SSD', 'RA'];
  const suffix = suffixes[index % suffixes.length];
  const number = 100 + ((hash + index * 33) % 900);
  return `${prefix}${number}${suffix}`;
};

const findSchedule = (from: string, to: string) =>
  DUMMY_SCHEDULES.find(
    (schedule) => schedule.origin.toLowerCase() === from.toLowerCase() && schedule.dest.toLowerCase() === to.toLowerCase()
  );

export const buildSearchResults = (
  from: string,
  to: string,
  date: string,
  bookedSeats: Record<string, boolean> = {}
): Bus[] => {
  const routeImage = getRouteImage(from, to);
  const schedule = findSchedule(from, to);
  const match = schedule ?? {
    origin: from,
    dest: to,
    price: departurePricingByOrigin(from),
    departures: ['09:00 AM', '02:00 PM', '08:00 PM'],
  };
  const routePreBooked = getPreBookedSeats(from, to);
  const preBookedMap: Record<string, boolean> = {};
  routePreBooked.forEach((seat) => {
    preBookedMap[seat] = true;
  });

  return match.departures.map((time, index) => {
    const busId = `${from}-${to}-${date}-${time.replace(/[:\s]/g, '')}`;
    const busBookedSeats = Object.keys(bookedSeats).filter((key) => key.startsWith(`${busId}-`));
    const availableSeats = 40 - busBookedSeats.length - routePreBooked.length;

    return {
      id: busId,
      bus_name: index % 2 === 0 ? 'Trinity Express Classic' : 'Trinity Express VIP Luxury',
      bus_type: index % 2 === 0 ? 'Classic' : 'VIP Luxury',
      departure_time: time,
      arrival_time: getArrivalTime(time),
      departure_date: date,
      price: match.price,
      total_seats: 40,
      available_seats: Math.max(0, availableSeats),
      rating: index % 2 === 0 ? 4.5 : 4.8,
      amenities: index % 2 === 0 ? ['ac'] : ['ac', 'wifi'],
      route_id: `route-${from}-${to}`,
      image_url: routeImage,
      number_plate: formatNumberPlate(from, to, index),
      bus_image_url: routeImage,
      routes: {
        origin_city_id: `city-${from}`,
        destination_city_id: `city-${to}`,
        origin_city: { name: from },
        destination_city: { name: to },
      },
    };
  });
};

export const getPopularRouteFromSearch = (from: string, to: string) =>
  DUMMY_POPULAR_ROUTES.find(
    (route) => route.origin_city.toLowerCase() === from.toLowerCase() && route.destination_city.toLowerCase() === to.toLowerCase()
  );
