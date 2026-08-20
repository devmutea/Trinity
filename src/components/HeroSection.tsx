import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Calendar, Search } from 'lucide-react';
import type { City } from '../types';
import { IMAGES } from '../constants/images';

interface HeroSectionProps {
  cities: City[];
  validDestinationsByOrigin: Record<string, string[]>;
  onSearch: (from: string, to: string, date: string) => void;
  isLoading: boolean;
}

export default function HeroSection({ cities, validDestinationsByOrigin, onSearch, isLoading }: HeroSectionProps) {
  const [fromCity, setFromCity] = useState('Kigali');
  const [toCity, setToCity] = useState('Kampala');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const originCities = cities.filter((city) => validDestinationsByOrigin[city.name.toLowerCase()]?.length);
  const destinationCities = validDestinationsByOrigin[fromCity.toLowerCase()] || [];

  useEffect(() => {
    const img = new Image();
    img.src = IMAGES.hero;
    img.onload = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    if (!destinationCities.includes(toCity)) {
      setToCity(destinationCities[0] || '');
    }
  }, [fromCity, destinationCities, toCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fromCity, toCity, date);
  };

  const swapCities = () => {
    const nextFrom = toCity;
    const nextTo = fromCity;
    if (validDestinationsByOrigin[nextFrom.toLowerCase()]?.includes(nextTo)) {
      setFromCity(nextFrom);
      setToCity(nextTo);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-black">
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url('${IMAGES.hero}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/20 via-transparent to-black/35" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-60 lg:pt-80 pb-24">
        <div className="text-center mb-36">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Trinity Express Bus Tickets<br className="hidden sm:block" />
            <span className="text-secondary-300">Across East Africa</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Search Trinity Express routes from Kigali to Kampala, Kigali to Nairobi, Kampala to Juba and other trusted cross-border bus journeys.
          </p>
        </div>

        <div id="search-section" className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-dark-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  {originCities.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={swapCities}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
                </button>
              </div>

              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-dark-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  {destinationCities.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-dark-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-lg shadow-primary-600/30 disabled:opacity-60"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
