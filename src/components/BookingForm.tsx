import { useMemo, useState } from 'react';
import { ArrowLeft, User, Phone, Trash2, Bus as BusIcon, Clock, MapPin } from 'lucide-react';
import { type Bus, type TicketData } from '../types';
import {
  formatPrice,
  getDefaultPhoneCountry,
  isValidPhoneNumber,
  normalizePhoneInput,
  PHONE_COUNTRIES,
} from '../lib/currency';
import { paymentService } from '../lib/paymentService';
import PaymentCheckoutModal from './PaymentCheckoutModal';

interface BookingFormProps {
  bus: Bus;
  selectedSeats: string[];
  totalAmount: number;
  onBack: () => void;
  onComplete: (ticket: TicketData) => void;
  onBookSeats?: (busId: string, seats: string[]) => void;
}

export default function BookingForm({ bus, selectedSeats, totalAmount, onBack }: BookingFormProps) {
  const [passengers, setPassengers] = useState<Array<{ name: string; phone: string; country: string }>>(
    selectedSeats.map(() => ({
      name: '',
      phone: '',
      country: getDefaultPhoneCountry(bus.routes.origin_city.name),
    }))
  );
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const bookingReference = useMemo(() => `TRINITY-${Date.now().toString(36).toUpperCase()}`, []);

  const updatePassenger = (index: number, field: 'name' | 'phone' | 'country', value: string) => {
    setPassengers(prev => {
      const next = [...prev];
      const cleanedValue = field === 'phone' ? normalizePhoneInput(value) : value;
      next[index] = { ...next[index], [field]: cleanedValue };
      return next;
    });
  };

  const removeSeat = (index: number) => {
    if (selectedSeats.length <= 1) {
      setError('At least one seat is required');
      return;
    }
    setPassengers(prev => prev.filter((_, i) => i !== index));
    // Note: selectedSeats is a prop, so parent needs to handle removal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    for (let i = 0; i < passengers.length; i++) {
      const seatLabel = selectedSeats[i] || `Seat ${i + 1}`;
      if (!passengers[i]?.name?.trim()) {
        setError(`Passenger name is required for seat ${seatLabel}`);
        return;
      }
      if (!passengers[i]?.phone?.trim()) {
        setError(`Passenger phone is required for seat ${seatLabel}`);
        return;
      }
      if (!isValidPhoneNumber(passengers[i].phone, passengers[i].country)) {
        setError(`Enter a valid phone number for seat ${seatLabel}`);
        return;
      }
    }

    if (paymentService.shouldSkipModalForWhatsApp({ bus, passengers })) {
      const redirectUrl = paymentService.getWhatsAppRedirectUrl({
        amount: totalAmount,
        bus,
        passengers,
        selectedSeats,
        bookingReference,
        onBack: () => setShowPayment(false),
      });

      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }
    }

    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Payment Checkout Modal */}
      {showPayment && (
        <PaymentCheckoutModal
          amount={totalAmount}
          bus={bus}
          passengers={passengers}
          selectedSeats={selectedSeats}
          bookingReference={bookingReference}
          onBack={() => setShowPayment(false)}
        />
      )}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-dark-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-dark-900">Complete Your Booking</h1>
              <p className="text-sm text-dark-700">
                {bus.bus_name} &middot; {selectedSeats.length} seat(s)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - Bus Details */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-32">
              <div className="bg-primary-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <BusIcon className="w-5 h-5" />
                  <h2 className="font-bold text-lg">{bus.bus_name}</h2>
                </div>
                <div className="flex items-center gap-1 text-primary-100 text-sm">
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">{bus.bus_type}</span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-dark-900">{bus.routes.origin_city.name}</div>
                    <div className="text-dark-500 text-xs">Departure at {bus.departure_time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-dark-900">{bus.routes.destination_city.name}</div>
                    <div className="text-dark-500 text-xs">Arrival at {bus.arrival_time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-dark-900">{bus.departure_date}</div>
                    <div className="text-dark-500 text-xs">Travel date</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-700">Seats</span>
                    <span className="text-sm font-medium text-dark-900">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-700">Total</span>
                    <span className="text-xl font-bold text-primary-600">{formatPrice(totalAmount, bus.routes.origin_city.name)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Checkout Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seat Summary Table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-dark-700">
                    <span>Seat Type</span>
                    <span>Seat</span>
                    <span>Price</span>
                    <span className="text-right">Action</span>
                  </div>
                </div>
                {selectedSeats.map((seat, index) => (
                  <div key={seat} className="px-6 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="grid grid-cols-4 gap-4 items-center text-sm">
                      <span className="text-dark-900">Adult</span>
                      <span className="text-dark-700 font-medium">{seat}</span>
                      <span className="text-dark-900 font-medium">{formatPrice(bus.price, bus.routes.origin_city.name)}</span>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => removeSeat(index)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-dark-900">Ticket Sub total</span>
                    <span className="font-bold text-dark-900">{formatPrice(totalAmount, bus.routes.origin_city.name)}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Information */}
              {selectedSeats.map((seat, index) => (
                <div key={seat} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                    <h3 className="font-medium text-dark-900">
                      Passenger Information <span className="text-primary-600">: {seat}</span>
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-900 mb-2">
                        Passenger Name <span className="text-primary-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={passengers[index]?.name || ''}
                          onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                          placeholder="Passenger Name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-900 mb-2">
                        Passenger Phone <span className="text-primary-600">*</span>
                      </label>
                      <div className="flex gap-3">
                        <select
                          value={passengers[index]?.country}
                          onChange={(e) => updatePassenger(index, 'country', e.target.value)}
                          className="w-36 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {PHONE_COUNTRIES.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.label} {country.dialCode}
                            </option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            required
                            value={passengers[index]?.phone || ''}
                            onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                            placeholder="Mobile number"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total & Submit */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-dark-900">Total</span>
                  <span className="font-bold text-primary-600">{formatPrice(totalAmount, bus.routes.origin_city.name)}</span>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  Continue with {formatPrice(totalAmount, bus.routes.origin_city.name)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
