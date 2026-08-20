import { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowLeft, Building2, Phone, Loader2, XCircle, ExternalLink } from 'lucide-react';
import type { PaystackConfig } from '../lib/paymentConfig';

interface PayBillPaymentProps {
  amount: number;
  currency: string;
  phone: string;
  bookingReference: string;
  onPaymentConfirm: () => void;
  onBack: () => void;
  paystackConfig: PaystackConfig;
}

export default function PayBillPayment({
  amount,
  phone,
  bookingReference,
  onPaymentConfirm,
  onBack,
  paystackConfig,
  currency,
}: PayBillPaymentProps) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [initiatingPayment, setInitiatingPayment] = useState(true);
  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [authorizationUrl, setAuthorizationUrl] = useState('');
  const paymentAttemptStarted = useRef(false);

  const { supabaseUrl, supabaseAnonKey, clientUrl } = paystackConfig;

  const formatPhone = (p: string) => {
    let formatted = p.replace(/^0/, '254').replace(/^\+254/, '254');
    if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    return formatted;
  };

  useEffect(() => {
    void initiatePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initiatePayment = async () => {
    if (paymentAttemptStarted.current) return;

    paymentAttemptStarted.current = true;
    setInitiatingPayment(true);
    setPaymentError(null);
    setWaitingForPayment(false);
    setAuthorizationUrl('');

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/paystack-initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          phone: formatPhone(phone),
          amount,
          reference: bookingReference,
          callback_url: clientUrl,
          description: `Bus Ticket Booking - ${bookingReference}`,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      setAuthorizationUrl(data.authorization_url || '');
      if (data.status === 'success') {
        setWaitingForPayment(false);
        setPaymentConfirmed(true);
        setTimeout(() => {
          onPaymentConfirm();
        }, 1500);
        return;
      }

      setInitiatingPayment(false);
      setWaitingForPayment(true);
      pollPaystackStatus(data.reference || bookingReference);
    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Failed to initiate payment');
      setInitiatingPayment(false);
    }
  };

  const pollPaystackStatus = async (reference: string) => {
    const maxPolls = 18;
    let currentPoll = 0;

    const poll = async () => {
      if (currentPoll >= maxPolls) {
        setPaymentError('Payment timeout. Please try again.');
        setWaitingForPayment(false);
        return;
      }

      currentPoll++;

      try {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/paystack-status?reference=${encodeURIComponent(reference)}`,
          {
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === 'success') {
          setWaitingForPayment(false);
          setPaymentConfirmed(true);
          setTimeout(() => {
            onPaymentConfirm();
          }, 1500);
          return;
        }

        if (data.status === 'failed') {
          setWaitingForPayment(false);
          setPaymentError(data.gateway_response || data.message || 'Payment failed');
          return;
        }

        setTimeout(poll, 10000);
      } catch (error) {
        console.error('Paystack poll error:', error);
        setTimeout(poll, 10000);
      }
    };

    setTimeout(poll, 10000);
  };

  const openPaystackCheckout = () => {
    if (!authorizationUrl) return;

    const popup = window.open(authorizationUrl, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = authorizationUrl;
    }
  };

  const handleRetry = () => {
    paymentAttemptStarted.current = false;
    void initiatePayment();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Complete your mobile payment</h2>
              <p className="text-slate-300 text-sm">Secure M-PESA checkout through Paystack</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Display */}
          <div className="text-center py-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">Amount to Pay</div>
            <div className="text-3xl font-bold text-gray-900">{amount.toLocaleString()} {currency.toUpperCase()}</div>
          </div>

          {/* Initiating Payment State */}
          {initiatingPayment && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
              <p className="text-gray-700 font-medium">Initiating payment...</p>
              <p className="text-gray-500 text-sm mt-1">Please wait</p>
            </div>
          )}

          {/* Waiting for Payment State */}
          {waitingForPayment && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Phone className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Check your phone</h3>
              <p className="text-slate-600 mb-4">
                A secure payment prompt has been sent. Please approve the transaction on your device.
              </p>

              {authorizationUrl && (
                <button
                  type="button"
                  onClick={openPaystackCheckout}
                  className="mb-4 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Continue to payment
                </button>
              )}

              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-500">
                Waiting for payment confirmation...
              </p>
            </div>
          )}

          {/* Error State */}
          {paymentError && !initiatingPayment && !waitingForPayment && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-700 mb-2">Payment failed</h3>
              <p className="text-slate-600 mb-4">{paymentError}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Retry payment
              </button>
            </div>
          )}

          {/* Success State */}
          {paymentConfirmed && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-medium text-green-700">Payment Confirmed!</p>
            </div>
          )}

          {/* Phone Info */}
          {!initiatingPayment && (
            <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
              <Phone className="w-4 h-4" />
              <span>
                Phone: <span className="font-medium">{formatPhone(phone)}</span>
              </span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onBack}
              className="w-full py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
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
