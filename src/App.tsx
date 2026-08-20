import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import type { City, PopularRoute, Review, Bus, TicketData } from './types';
import { trackPageView } from './lib/googleAnalytics';

import Header from './components/Header';
import Footer from './components/Footer';
import SeatSelection from './components/SeatSelection';
import BookingForm from './components/BookingForm';
import TicketPage from './components/TicketPage';
import RuntimeConfigDebug from './components/RuntimeConfigDebug';

const HomePage = lazy(() => import('./pages/HomePage'));
const RoutesPage = lazy(() => import('./pages/RoutesPage'));
const RouteDetailPage = lazy(() => import('./pages/RouteDetailPage'));
const FAQPageWrapper = lazy(() => import('./pages/FAQPageWrapper'));
const NewsPageWrapper = lazy(() => import('./pages/NewsPageWrapper'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));

import {
  DUMMY_CITIES,
  DUMMY_POPULAR_ROUTES,
  DUMMY_REVIEWS,
  DUMMY_SCHEDULES,
  getPreBookedSeats,
  getRouteImage,
} from './constants/dummyData';

function AnalyticsRouteTracker() {
  const location = useLocation();
  const hasTrackedInitialPageView = useRef(false);

  useEffect(() => {
    if (hasTrackedInitialPageView.current) return;

    hasTrackedInitialPageView.current = true;
    trackPageView(`${location.pathname}${location.search}${location.hash}`);
  }, [location.hash, location.pathname, location.search]);

  return null;
}

export default function App() {
  const [cities] = useState<City[]>(DUMMY_CITIES);
  const [popularRoutes] = useState<PopularRoute[]>(DUMMY_POPULAR_ROUTES);
  const [reviews] = useState<Review[]>(DUMMY_REVIEWS);
  const [isLoading, setIsLoading] = useState(false);
  const [, setSearchResults] = useState<Bus[]>([]);
  const [, setSearchParams] = useState({ from: '', to: '', date: '' });
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookedSeats, setBookedSeats] = useState<Record<string, boolean>>({});
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const validDestinationsByOrigin = useMemo(() => {
    const map: Record<string, string[]> = {};
    DUMMY_SCHEDULES.forEach((schedule) => {
      const origin = schedule.origin.toLowerCase();
      if (!map[origin]) {
        map[origin] = [];
      }
      if (!map[origin].includes(schedule.dest)) {
        map[origin].push(schedule.dest);
      }
    });
    return map;
  }, []);

  const routeAnchorScroll = (anchor: string) => {
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSearch = (from: string, to: string, date: string) => {
    setIsLoading(true);
    setSearchParams({ from, to, date });

    const routeImg = getRouteImage(from, to);
    const match = DUMMY_SCHEDULES.find(
      (s) => s.origin.toLowerCase() === from.toLowerCase() && s.dest.toLowerCase() === to.toLowerCase()
    );

    if (!match) {
      setSearchResults([]);
      setIsLoading(false);
      navigate(`/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`);
      return;
    }

    const routePreBooked = getPreBookedSeats(from, to);
    const mockBuses = match.departures.map((time, index) => {
      const busId = `${from}-${to}-${date}-${time.replace(/[:\s]/g, '')}`;
      const busBookedSeats = Object.keys(bookedSeats).filter((key) => key.startsWith(`${busId}-`));
      const availableSeats = 40 - busBookedSeats.length - routePreBooked.length;

      return {
        id: busId,
        bus_name: index % 2 === 0 ? 'Trinity Express Classic' : 'Trinity Express VIP Luxury',
        bus_type: index % 2 === 0 ? 'Classic' : 'VIP Luxury',
        departure_time: time,
        arrival_time: (() => {
          const [timeStr, ampm] = time.split(' ');
          const [rawHour, rawMinute] = timeStr.split(':').map(Number);
          let hour = rawHour;
          const minute = rawMinute;
          if (ampm === 'PM' && hour !== 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
          const arrH = (hour + 5) % 24;
          const arrAmpm = arrH >= 12 ? 'PM' : 'AM';
          const arrH12 = arrH % 12 === 0 ? 12 : arrH % 12;
          return `${String(arrH12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${arrAmpm}`;
        })(),
        departure_date: date,
        price: match.price,
        total_seats: 40,
        available_seats: Math.max(0, availableSeats),
        rating: index % 2 === 0 ? 4.5 : 4.8,
        amenities: index % 2 === 0 ? ['ac'] : ['ac', 'wifi'],
        route_id: `route-${from}-${to}`,
        image_url: routeImg,
        number_plate: `TR${100 + index}${index % 2 === 0 ? 'A' : 'B'}`,
        bus_image_url: routeImg,
        routes: {
          origin_city_id: `city-${from}`,
          destination_city_id: `city-${to}`,
          origin_city: { name: from },
          destination_city: { name: to },
        },
      };
    });

    setSearchResults(mockBuses);
    setIsLoading(false);
    navigate(`/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`);
  };

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    navigate('/seat-selection');
  };

  const handleSeatConfirm = (seats: string[], amount: number) => {
    setSelectedSeats(seats);
    setTotalAmount(amount);
    navigate('/booking');
  };

  const handleBookSeats = (busId: string, seatNumbers: string[]) => {
    setBookedSeats((prev) => {
      const next = { ...prev };
      seatNumbers.forEach((seat) => {
        next[`${busId}-${seat}`] = true;
      });
      return next;
    });
  };

  const handleBookingComplete = (ticket: TicketData) => {
    setTicketData(ticket);
    navigate('/ticket');
  };

  const handleTicketDone = () => {
    setSelectedBus(null);
    setSelectedSeats([]);
    setTotalAmount(0);
    setSearchResults([]);
    setTicketData(null);
    navigate('/');
  };

  const handleNavigate = (target: string) => {
    if (target === 'home') {
      navigate('/');
      routeAnchorScroll('top');
      return;
    }

    if (target === 'faq') {
      navigate('/faq');
      return;
    }

    if (target === 'news') {
      navigate('/news');
      return;
    }

    if (target === 'routes') {
      navigate('/routes');
      return;
    }

    if (target === 'booking') {
      navigate('/');
      routeAnchorScroll('search-section');
      return;
    }

    if (target === 'contact') {
      navigate('/');
      routeAnchorScroll('contact');
      return;
    }

    if (target === 'services') {
      navigate('/');
      routeAnchorScroll('services');
      return;
    }
  };

  const shouldShowFooter = useMemo(
    () => ['/', '/faq', '/news', '/routes', '/routes'].includes(location.pathname) || location.pathname.startsWith('/routes/'),
    [location.pathname]
  );

  const pageFallback = <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-white">
      <AnalyticsRouteTracker />
      <Header onNavigate={handleNavigate} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={pageFallback}>
                <HomePage
                  cities={cities}
                  popularRoutes={popularRoutes}
                  reviews={reviews}
                  validDestinationsByOrigin={validDestinationsByOrigin}
                  isLoading={isLoading}
                  onSearch={handleSearch}
                  onSelectRoute={(from, to) => handleSearch(from, to, new Date().toISOString().split('T')[0])}
                />
              </Suspense>
            }
          />
          <Route path="/routes" element={<Suspense fallback={pageFallback}><RoutesPage /></Suspense>} />
          <Route path="/routes/:slug" element={<Suspense fallback={pageFallback}><RouteDetailPage onSearch={handleSearch} /></Suspense>} />
          <Route path="/faq" element={<Suspense fallback={pageFallback}><FAQPageWrapper onBack={() => navigate('/')} /></Suspense>} />
          <Route path="/news" element={<Suspense fallback={pageFallback}><NewsPageWrapper onBack={() => navigate('/')} /></Suspense>} />
          <Route path="/results" element={<Suspense fallback={pageFallback}><SearchResultsPage onSelectBus={handleSelectBus} /></Suspense>} />
          <Route
            path="/seat-selection"
            element={
              selectedBus ? (
                <SeatSelection
                  bus={selectedBus}
                  onBack={() => navigate(-1)}
                  onConfirm={handleSeatConfirm}
                  onBookingComplete={handleBookingComplete}
                  onBookSeats={handleBookSeats}
                  bookedSeats={bookedSeats}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/booking"
            element={
              selectedBus ? (
                <BookingForm
                  bus={selectedBus}
                  selectedSeats={selectedSeats}
                  totalAmount={totalAmount}
                  onBack={() => navigate('/seat-selection')}
                  onComplete={handleBookingComplete}
                  onBookSeats={handleBookSeats}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/ticket"
            element={
              ticketData ? (
                <TicketPage ticket={ticketData} onDone={handleTicketDone} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer onNavigate={handleNavigate} />}
      <RuntimeConfigDebug />
    </div>
  );
}
