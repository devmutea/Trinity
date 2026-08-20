import { useState } from 'react';
import { type Bus } from '../types';
import { ArrowLeft, Star, Clock, MapPin, Wifi, Armchair, Snowflake, Bus as BusIcon, ChevronDown, Hash } from 'lucide-react';
import { formatPrice } from '../lib/currency';
import { getRouteImage } from '../constants/dummyData';

interface BusResultsProps {
  buses: Bus[];
  fromCity: string;
  toCity: string;
  date: string;
  onBack: () => void;
  onSelectBus: (bus: Bus) => void;
}

export default function BusResults({ buses, fromCity, toCity, date, onBack, onSelectBus }: BusResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('price');
  const [filterType, setFilterType] = useState<string>('all');

  const sortedBuses = [...buses]
    .filter((bus) => filterType === 'all' || bus.bus_type === filterType)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.departure_time.localeCompare(b.departure_time);
    });

  const busTypes = ['all', ...Array.from(new Set(buses.map((b) => b.bus_type)))];

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const routeImage = getRouteImage(fromCity, toCity);

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-dark-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-dark-900">
                {fromCity} <span className="text-primary-500">to</span> {toCity}
              </h1>
              <p className="text-sm text-dark-700 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {formatDate(date)} | {sortedBuses.length} buses available
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {busTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filterType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-dark-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Buses' : type}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <span className="text-sm text-dark-700">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'time' | 'rating')}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="price">Lowest Price</option>
                  <option value="time">Earliest Departure</option>
                  <option value="rating">Highest Rating</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedBuses.length === 0 ? (
          <div className="text-center py-20">
            <BusIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-900 mb-2">No buses found</h3>
            <p className="text-dark-700">Try adjusting your search criteria or date.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBuses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Bus Image Preview */}
                  <div className="relative w-full lg:w-72 h-48 lg:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={bus.bus_image_url || routeImage}
                      alt={bus.bus_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = routeImage;
                      }}
                    />
                    {/* Number Plate Badge */}
                    <div className="absolute top-3 left-3 bg-yellow-400 px-3 py-1.5 rounded-lg shadow-md border-2 border-yellow-500">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-yellow-900" />
                        <span className="text-xs font-bold text-yellow-900 tracking-wide">{bus.number_plate}</span>
                      </div>
                    </div>
                    {/* Bus Type Badge */}
                    <div className="absolute top-3 right-3 bg-primary-600 px-2 py-1 rounded-md">
                      <span className="text-xs font-semibold text-white">{bus.bus_type}</span>
                    </div>
                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-gray-900">{bus.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-dark-900">{bus.bus_name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-dark-700 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{bus.number_plate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-dark-700 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary-600" />
                            <span className="font-semibold text-dark-900">{bus.departure_time}</span>
                            <span className="text-gray-400">{bus.routes.origin_city.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <div className="w-12 h-px bg-gray-300" />
                            <span className="text-xs">{bus.arrival_time}</span>
                            <div className="w-12 h-px bg-gray-300" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary-600" />
                            <span className="font-semibold text-dark-900">{bus.arrival_time}</span>
                            <span className="text-gray-400">{bus.routes.destination_city.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {bus.amenities.includes('wifi') && (
                            <span className="flex items-center gap-1 text-xs text-dark-700 bg-gray-100 px-2 py-1 rounded">
                              <Wifi className="w-3 h-3" /> WiFi
                            </span>
                          )}
                          {bus.amenities.includes('ac') && (
                            <span className="flex items-center gap-1 text-xs text-dark-700 bg-gray-100 px-2 py-1 rounded">
                              <Snowflake className="w-3 h-3" /> AC
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-dark-700 bg-gray-100 px-2 py-1 rounded">
                            <Armchair className="w-3 h-3" /> {bus.available_seats} seats left
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 lg:ml-auto">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">{formatPrice(bus.price, bus.routes.origin_city.name)}</div>
                          <div className="text-xs text-dark-700">per seat</div>
                        </div>
                        <button
                          onClick={() => onSelectBus(bus)}
                          className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-sm"
                        >
                          Select Seats
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
