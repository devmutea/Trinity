import { useState, useEffect, useMemo } from 'react';
import { type Bus, type Seat, type TicketData } from '../types';
import { ArrowLeft, Armchair, Info, Star, Clock, MapPin, Wifi, Snowflake, Circle, User, Phone, Trash2, Hash } from 'lucide-react';
import {
  formatPrice,
  getDefaultPhoneCountry,
  isValidPhoneNumber,
  normalizePhoneInput,
  PHONE_COUNTRIES,
} from '../lib/currency';
import { getPreBookedSeats } from '../constants/dummyData';
import { paymentService } from '../lib/paymentService';
import PaymentCheckoutModal from './PaymentCheckoutModal';

interface SeatSelectionProps {
  bus: Bus;
  onBack: () => void;
  onConfirm: (selectedSeats: string[], totalAmount: number) => void;
  onBookingComplete?: (ticket: TicketData) => void;
  onBookSeats?: (busId: string, seats: string[]) => void;
  bookedSeats: Record<string, boolean>;
}

const SEAT_ROWS = ['A', 'B', 'C', 'D'];

export default function SeatSelection({ bus, onBack, onConfirm, bookedSeats }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState<Array<{ name: string; phone: string; country: string }>>([]);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const bookingReference = useMemo(() => `TRINITY-${Date.now().toString(36).toUpperCase()}`, []);

  const preBookedSeats = useMemo(() => getPreBookedSeats(bus.routes.origin_city.name, bus.routes.destination_city.name), [bus.routes.origin_city.name, bus.routes.destination_city.name]);

  const seats = useMemo(() => {
    const s: Seat[] = [];
    for (let row = 1; row <= 10; row++) {
      SEAT_ROWS.forEach((col) => {
        const num = `${row}${col}`;
        const seatKey = `${bus.id}-${num}`;
        const isBooked = bookedSeats[seatKey] || preBookedSeats.includes(num);
        s.push({
          id: seatKey,
          bus_id: bus.id,
          seat_number: num,
          seat_type: col === 'A' || col === 'D' ? 'window' : 'standard',
          is_booked: isBooked
        });
      });
    }
    return s;
  }, [bus.id, bookedSeats, preBookedSeats]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const toggleSeat = (seatNumber: string, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedSeats((prev) => {
      const newSeats = prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber];
      if (newSeats.length > prev.length) {
        setPassengers(pg => [...pg, { name: '', phone: '', country: getDefaultPhoneCountry(bus.routes.origin_city.name) }]);
      } else if (newSeats.length < prev.length) {
        const removedIndex = prev.indexOf(seatNumber);
        setPassengers(pg => pg.filter((_, i) => i !== removedIndex));
      }
      return newSeats;
    });
    setError('');
  };

  const totalAmount = selectedSeats.length * bus.price;

  const seatMap = useMemo(() => new Map(seats.map(s => [s.seat_number, s])), [seats]);

  const seatLayout = useMemo(() => {
    const rows: Seat[][] = [];
    for (let row = 1; row <= 10; row++) {
      const rowSeats: Seat[] = [];
      for (const col of SEAT_ROWS) {
        const num = `${row}${col}`;
        rowSeats.push(seatMap.get(num)! || { id: '', bus_id: bus.id, seat_number: num, seat_type: 'standard', is_booked: false });
      }
      rows.push(rowSeats);
    }
    return rows;
  }, [seatMap, bus.id]);

  const getSeatLabel = (seatNumber: string) => {
    const row = seatNumber.slice(0, -1);
    const col = seatNumber.slice(-1);
    const colIndex = SEAT_ROWS.indexOf(col);
    const letters = 'abcdefghijklmnopqr';
    const seatIndex = (parseInt(row) - 1) * 4 + colIndex;
    return letters[seatIndex] || seatNumber.toLowerCase();
  };

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
    setSelectedSeats(prev => prev.filter((_, i) => i !== index));
    setPassengers(prev => prev.filter((_, i) => i !== index));
  };

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    // Validate each selected seat has passenger info
    for (let i = 0; i < selectedSeats.length; i++) {
      const passenger = passengers[i];
      const seatLabel = getSeatLabel(selectedSeats[i]);

      if (!passenger?.name?.trim()) {
        setError(`Passenger name is required for seat ${seatLabel}`);
        return;
      }
      if (!passenger?.phone?.trim()) {
        setError(`Passenger phone is required for seat ${seatLabel}`);
        return;
      }
      if (!isValidPhoneNumber(passenger.phone, passenger.country)) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-dark-900">{bus.bus_name}</h1>
              <p className="text-sm text-dark-700">
                {bus.departure_time} &middot; {bus.routes.origin_city.name} to {bus.routes.destination_city.name} &middot; {bus.bus_type}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - Bus Details (shown when no seats selected, slides away when seats selected) */}
          <div className={`lg:w-80 flex-shrink-0 transition-all duration-500 ease-in-out ${selectedSeats.length > 0 ? 'lg:hidden' : ''}`}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-32">
              {/* Bus Image */}
              {bus.bus_image_url && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={bus.bus_image_url}
                    alt={bus.bus_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Number Plate Badge */}
                  {bus.number_plate && (
                    <div className="absolute top-3 left-3 bg-yellow-400 px-3 py-1.5 rounded-lg shadow-md border-2 border-yellow-500">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-yellow-900" />
                        <span className="text-xs font-bold text-yellow-900 tracking-wide">{bus.number_plate}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="bg-primary-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg">{bus.bus_name}</h2>
                </div>
                <div className="flex items-center gap-1 text-primary-100 text-sm">
                  <Star className="w-4 h-4 text-accent-300 fill-accent-300" />
                  <span>{bus.rating}</span>
                  <span className="mx-1">|</span>
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
                <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
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
                    <Armchair className="w-3 h-3" /> 40 seats
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-sm text-dark-500 mb-1">Price per seat</div>
                  <div className="text-2xl font-bold text-primary-600">{formatPrice(bus.price, bus.routes.origin_city.name)}</div>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="text-sm text-dark-500">Selected Seats</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSeats.map(seat => (
                        <span key={seat} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                          <Circle className="w-3 h-3 fill-primary-600" /> {getSeatLabel(seat)}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm text-dark-700">Total</span>
                      <span className="text-xl font-bold text-primary-600">{formatPrice(totalAmount, bus.routes.origin_city.name)}</span>
                    </div>
                    <button
                      onClick={() => onConfirm(selectedSeats, totalAmount)}
                      className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-sm"
                    >
                      Continue to Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seat Layout - moves left when seats selected */}
          <div className={`flex-1 transition-all duration-500 ease-in-out ${selectedSeats.length > 0 ? 'lg:max-w-[420px] lg:flex-shrink-0' : ''}`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-gray-300 bg-white" />
                  <span className="text-sm text-dark-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-primary-600 bg-primary-50" />
                  <span className="text-sm text-dark-700">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-gray-200 bg-gray-200" />
                  <span className="text-sm text-dark-700">Booked</span>
                </div>
              </div>

              {/* Seat Layout */}
              <div className="relative border-2 border-gray-200 rounded-3xl p-6 sm:p-8 bg-gray-50/50">
                {/* Steering Wheel */}
                <div className="flex items-center justify-center mb-2">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-400 bg-white flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-gray-500" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5" />
                      <path d="M12 12l3 3" />
                      <path d="M12 3v1" />
                      <path d="M12 20v1" />
                      <path d="M3 12h1" />
                      <path d="M20 12h1" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mb-6 font-medium uppercase tracking-wider">Driver</p>

                {/* Aisle label */}
                <div className="flex items-center mb-1">
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium">Window</span>
                  </div>
                  <div className="w-12 sm:w-16" />
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium">Aisle</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-center gap-1">
                      <div className="flex gap-1 sm:gap-2">
                        {row.slice(0, 2).map((seat) => (
                          <button
                            key={seat.seat_number}
                            onClick={() => toggleSeat(seat.seat_number, seat.is_booked)}
                            disabled={seat.is_booked}
                            className={`relative w-11 h-12 sm:w-12 sm:h-14 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                              seat.is_booked
                                ? 'border-gray-200 bg-gray-200 text-gray-400 cursor-not-allowed'
                                : selectedSeats.includes(seat.seat_number)
                                ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                                : 'border-gray-300 bg-white text-dark-700 hover:border-primary-400 hover:bg-primary-50'
                            }`}
                          >
                            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] leading-none">
                              {getSeatLabel(seat.seat_number)}
                            </span>
                            <Armchair className="w-4 h-4 sm:w-5 sm:h-5 mt-1" />
                          </button>
                        ))}
                      </div>
                      <div className="w-8 sm:w-12" />
                      <div className="flex gap-1 sm:gap-2">
                        {row.slice(2, 4).map((seat) => (
                          <button
                            key={seat.seat_number}
                            onClick={() => toggleSeat(seat.seat_number, seat.is_booked)}
                            disabled={seat.is_booked}
                            className={`relative w-11 h-12 sm:w-12 sm:h-14 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                              seat.is_booked
                                ? 'border-gray-200 bg-gray-200 text-gray-400 cursor-not-allowed'
                                : selectedSeats.includes(seat.seat_number)
                                ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                                : 'border-gray-300 bg-white text-dark-700 hover:border-primary-400 hover:bg-primary-50'
                            }`}
                          >
                            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] leading-none">
                              {getSeatLabel(seat.seat_number)}
                            </span>
                            <Armchair className="w-4 h-4 sm:w-5 sm:h-5 mt-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back of bus indicator */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="w-32 h-2 bg-gray-300 rounded-full" />
                </div>
                <p className="text-center text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">Back</p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-dark-700">
                <Info className="w-4 h-4 text-primary-600" />
                <span>Selected seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT - Checkout Form (appears when seats selected) */}
          <div className={`flex-1 transition-all duration-500 ease-in-out ${selectedSeats.length > 0 ? 'lg:opacity-100' : 'lg:hidden'}`}>
            {selectedSeats.length > 0 && (
              <form onSubmit={handleBookNow} className="space-y-6">
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
                        <span className="text-dark-700 font-medium">{getSeatLabel(seat)}</span>
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
                        Passenger Information <span className="text-primary-600">: {getSeatLabel(seat)}</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
