import { type PopularRoute } from '../types';
import { ArrowRight, Bus } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { formatPrice } from '../lib/currency';

interface PopularRoutesSectionProps {
  routes: PopularRoute[];
  onSelectRoute: (from: string, to: string) => void;
}

export default function PopularRoutesSection({ routes, onSelectRoute }: PopularRoutesSectionProps) {
  return (
    <section id="popular-routes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900">
              Our Routes
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div
              key={`${route.id}-${route.origin_city}-${route.destination_city}-${index}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => onSelectRoute(route.origin_city, route.destination_city)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={route.image_url || IMAGES.crossBorderTrips}
                  alt={`${route.origin_city} to ${route.destination_city}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-sm font-semibold">{route.origin_city}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm font-semibold">{route.destination_city}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-dark-700">
                    <Bus className="w-4 h-4 text-primary-600" />
                    <span className="text-sm">{route.bus_count} buses daily</span>
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {formatPrice(route.price, route.origin_city)}
                  </div>
                </div>
                <button className="w-full py-2.5 text-sm font-semibold text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
