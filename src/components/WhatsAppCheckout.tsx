import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, Loader2, MessageCircle, ShieldCheck } from 'lucide-react';
import { type Bus } from '../types';
import { formatPrice } from '../lib/currency';
import { buildWhatsAppCheckoutUrl, buildWhatsAppOrderMessage, type CheckoutPassenger } from '../lib/whatsappCheckout';
import type { WhatsAppConfig } from '../lib/paymentConfig';

interface WhatsAppCheckoutProps {
  amount: number;
  bus: Bus;
  passengers: CheckoutPassenger[];
  selectedSeats: string[];
  bookingReference: string;
  onBack: () => void;
  config: WhatsAppConfig;
}

export default function WhatsAppCheckout({
  amount,
  bus,
  passengers,
  selectedSeats,
  bookingReference,
  onBack,
  config,
}: WhatsAppCheckoutProps) {
  const [redirecting, setRedirecting] = useState(false);

  const checkoutUrl = useMemo(() => {
    const message = buildWhatsAppOrderMessage(
      {
        bus,
        passengers,
        selectedSeats,
        totalAmount: amount,
        bookingReference,
      },
      config.defaultMessage
    );

    return buildWhatsAppCheckoutUrl(config.number, message);
  }, [amount, bookingReference, bus, config, passengers, selectedSeats]);

  const handleCheckout = () => {
    if (!checkoutUrl) {
      return;
    }

    setRedirecting(true);
    window.location.assign(checkoutUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">WhatsApp Checkout</h2>
              <p className="text-emerald-50 text-sm">Send your booking request to Trinity Express</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center py-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">Order Total</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(amount, bus.routes.origin_city.name)}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-emerald-950">Message ready to send</h3>
                  <p className="text-sm text-emerald-800 mt-1">
                    We will open WhatsApp with your route, seats, passenger details, and total already filled in.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-dark-900">Booking summary</span>
                <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded">
                  {selectedSeats.length} seat(s)
                </span>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-dark-500">Route</span>
                  <span className="font-medium text-dark-900 text-right">
                    {bus.routes.origin_city.name} to {bus.routes.destination_city.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-dark-500">Travel date</span>
                  <span className="font-medium text-dark-900">{bus.departure_date}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-dark-500">Seats</span>
                  <span className="font-medium text-dark-900">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
                  <span className="text-dark-500">Reference</span>
                  <span className="font-medium text-dark-900">{bookingReference}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={redirecting}
              className="w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {redirecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Opening WhatsApp...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Continue on WhatsApp
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>You only need to press Send in WhatsApp.</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
