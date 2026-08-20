import { useRef } from 'react';
import { type TicketData } from '../types';
import { ArrowLeft, MapPin, Bus, CheckCircle, Printer } from 'lucide-react';
import { formatPrice } from '../lib/currency';

interface TicketPageProps {
  ticket: TicketData;
  onDone: () => void;
}

export default function TicketPage({ ticket, onDone }: TicketPageProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const { bus, selectedSeats, totalAmount, passengerName, passengerPhone, bookingId } = ticket;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button onClick={onDone} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-dark-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-dark-900">Booking Confirmed</h1>
              <p className="text-sm text-dark-700">Your ticket has been successfully generated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - Booking Details */}
          <div className="lg:w-1/2 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Success Header */}
              <div className="bg-green-50 p-6 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-green-800">Booking Confirmed!</h2>
                    <p className="text-sm text-green-600">Booking ID: {bookingId}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Bus Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-dark-900">{bus.bus_name}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-dark-500">{bus.bus_type}</div>
                      {bus.number_plate && (
                        <span className="text-xs font-mono bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-300">
                          {bus.number_plate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Route Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-dark-900">Boarding</div>
                      <div className="text-sm text-dark-600">
                        {bus.routes.origin_city.name} ({bus.departure_date} {bus.departure_time})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-dark-900">Dropping</div>
                      <div className="text-sm text-dark-600">
                        {bus.routes.destination_city.name} ({bus.departure_date} {bus.arrival_time})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Information */}
                <div>
                  <h3 className="font-bold text-dark-900 mb-3">Ticket Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600">Seat Type</span>
                      <span className="text-dark-900 font-medium">Adult</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600">Seat</span>
                      <span className="text-dark-900 font-medium">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600">Quantity</span>
                      <span className="text-dark-900 font-medium">{selectedSeats.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600">Price</span>
                      <span className="text-dark-900 font-medium">
                        ({formatPrice(bus.price, bus.routes.origin_city.name)} x{selectedSeats.length}) = {formatPrice(totalAmount, bus.routes.origin_city.name)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600">Passenger Name</span>
                      <span className="text-dark-900 font-medium">{passengerName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-600">Passenger Phone</span>
                      <span className="text-dark-900 font-medium">{passengerPhone}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-dark-900">Ticket Sub total</span>
                      <span className="font-bold text-primary-600 text-lg">{formatPrice(totalAmount, bus.routes.origin_city.name)}</span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-dark-900">Subtotal</span>
                    <span className="font-bold text-primary-600">{formatPrice(totalAmount, bus.routes.origin_city.name)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-dark-900">Total</span>
                    <span className="font-bold text-primary-600 text-xl">{formatPrice(totalAmount, bus.routes.origin_city.name)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-3 bg-gray-100 text-dark-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={onDone}
                    className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    Book Another Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Ticket Card */}
          <div className="lg:w-1/2 flex-shrink-0">
            <div className="sticky top-32">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-dark-900 mb-4 text-center">Your Ticket</h3>

                {/* Ticket Design */}
                <div ref={ticketRef} className="relative overflow-hidden rounded-xl">
                  {/* Ticket Body */}
                  <div className="bg-primary-600 relative">
                    {/* Perforation holes */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-white rounded-full" />

                    {/* Dashed line */}
                    <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-primary-400/50" />

                    <div className="p-6 sm:p-8">
                      {/* Top Section */}
                      <div className="text-center pb-8 border-b border-dashed border-primary-400/50">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-3">
                          <Bus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-wider">BUS TICKET</h2>
                        <p className="text-primary-200 text-sm mt-1">TRINITY EXPRESS</p>
                      </div>

                      {/* Bottom Section */}
                      <div className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-primary-200 text-xs uppercase tracking-wider">Route</div>
                          <div className="text-white font-medium text-sm">
                            {bus.routes.origin_city.name} &rarr; {bus.routes.destination_city.name}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-primary-200 text-xs uppercase tracking-wider">Date</div>
                          <div className="text-white font-medium text-sm">{bus.departure_date}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-primary-200 text-xs uppercase tracking-wider">Time</div>
                          <div className="text-white font-medium text-sm">{bus.departure_time}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-primary-200 text-xs uppercase tracking-wider">Seat</div>
                          <div className="text-white font-medium text-sm">{selectedSeats.join(', ')}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-primary-200 text-xs uppercase tracking-wider">Passenger</div>
                          <div className="text-white font-medium text-sm">{passengerName}</div>
                        </div>
                        {bus.number_plate && (
                          <div className="flex items-center justify-between">
                            <div className="text-primary-200 text-xs uppercase tracking-wider">Bus No.</div>
                            <div className="text-white font-medium text-sm font-mono">{bus.number_plate}</div>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-primary-400/50">
                          <div className="text-primary-200 text-xs uppercase tracking-wider">Total</div>
                          <div className="text-white font-bold text-lg">{formatPrice(totalAmount, bus.routes.origin_city.name)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-primary-200 text-xs uppercase tracking-wider">Booking ID</div>
                          <div className="text-primary-200 text-xs font-mono">{bookingId}</div>
                        </div>
                      </div>
                    </div>

                    {/* Barcode simulation */}
                    <div className="px-6 pb-6 pt-2">
                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-primary-400/50"
                            style={{ width: Math.random() > 0.5 ? '2px' : '3px', height: '24px' }}
                          />
                        ))}
                      </div>
                      <div className="text-center text-primary-300 text-[10px] mt-1 font-mono tracking-widest">
                        {bookingId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
