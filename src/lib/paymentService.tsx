import type { ComponentType, ReactElement } from 'react';
import type { Bus } from '../types';
import PayBillPayment from '../components/PayBillPayment';
import WhatsAppCheckout from '../components/WhatsAppCheckout';
import {
  getPaymentProviderConfig,
  getPaystackConfig,
  getWhatsAppConfig,
  getPaymentProviderForRoute,
  getPaymentFallbackProvider,
  type PaymentProvider,
} from './paymentConfig';
import { buildWhatsAppCheckoutUrl, buildWhatsAppOrderMessage, type CheckoutPassenger } from './whatsappCheckout';
import { convertAmountToCheckoutCurrency, getCountryCodeForCity } from './currency';

const buildWhatsAppRedirectUrl = (
  props: PaymentCheckoutProps,
  config: ReturnType<typeof getWhatsAppConfig>
) => {
  const message = buildWhatsAppOrderMessage(
    {
      bus: props.bus,
      passengers: props.passengers,
      selectedSeats: props.selectedSeats,
      totalAmount: props.amount,
      bookingReference: props.bookingReference,
    },
    config.defaultMessage
  );

  return buildWhatsAppCheckoutUrl(config.number, message);
};

type PaymentPassenger = CheckoutPassenger & { country?: string };

export interface PaymentCheckoutProps {
  amount: number;
  bus: Bus;
  passengers: PaymentPassenger[];
  selectedSeats: string[];
  bookingReference: string;
  onBack: () => void;
}

const paymentProviderConfig = getPaymentProviderConfig();
const paystackConfig = (() => {
  try {
    return getPaystackConfig();
  } catch {
    return null;
  }
})();
const whatsAppConfig = (() => {
  try {
    return getWhatsAppConfig();
  } catch {
    return null;
  }
})();

const PaymentUnavailable: ComponentType<PaymentCheckoutProps> = ({ onBack }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-900">Checkout unavailable</h2>
      <p className="mt-3 text-sm text-gray-600">
        {paymentProviderConfig.isValid ? 'Unable to load checkout flow.' : paymentProviderConfig.error}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Go back
      </button>
    </div>
  </div>
);

const getPaymentProviderForCheckout = (props: Pick<PaymentCheckoutProps, 'bus' | 'passengers'>): PaymentProvider | null => {
  const resolvedProvider = getPaymentProviderForRoute(
    getCountryCodeForCity(props.bus.routes.origin_city.name),
    props.passengers.map((passenger) => passenger.country ?? '')
  );
  const fallbackProvider = getPaymentFallbackProvider();

  if (resolvedProvider === 'paystack' && paystackConfig) {
    return 'paystack';
  }

  if (resolvedProvider === 'whatsapp' && whatsAppConfig) {
    return 'whatsapp';
  }

  if (fallbackProvider === 'paystack' && paystackConfig) {
    return 'paystack';
  }

  if (fallbackProvider === 'whatsapp' && whatsAppConfig) {
    return 'whatsapp';
  }

  // At this point, no configured checkout is available.
  return null;
};

const renderPaystackCheckout = (props: PaymentCheckoutProps): ReactElement => {
  if (!paystackConfig) {
    return <PaymentUnavailable {...props} />;
  }

  return (
    <PayBillPayment
      amount={convertAmountToCheckoutCurrency(props.amount)}
      currency="KES"
      phone={props.passengers[0]?.phone ?? ''}
      bookingReference={props.bookingReference}
      onPaymentConfirm={props.onBack}
      onBack={props.onBack}
      paystackConfig={paystackConfig}
    />
  );
};

const renderWhatsAppCheckout = (props: PaymentCheckoutProps): ReactElement => {
  if (!whatsAppConfig) {
    return <PaymentUnavailable {...props} />;
  }

  return (
    <WhatsAppCheckout
      amount={props.amount}
      bus={props.bus}
      passengers={props.passengers}
      selectedSeats={props.selectedSeats}
      bookingReference={props.bookingReference}
      onBack={props.onBack}
      config={whatsAppConfig}
    />
  );
};

export const paymentService = {
  getConfig: () => paymentProviderConfig,
  checkout: (props: PaymentCheckoutProps): ReactElement => {
    const provider = getPaymentProviderForCheckout(props);

    if (provider === 'paystack') {
      return renderPaystackCheckout(props);
    }

    if (provider === 'whatsapp') {
      return renderWhatsAppCheckout(props);
    }

    return <PaymentUnavailable {...props} />;
  },
  shouldSkipModalForWhatsApp: (props: Pick<PaymentCheckoutProps, 'bus' | 'passengers'>) => {
    return getPaymentProviderForCheckout(props) === 'whatsapp';
  },
  getWhatsAppRedirectUrl: (props: PaymentCheckoutProps): string | null => {
    const provider = getPaymentProviderForCheckout(props);

    if (provider !== 'whatsapp' || !whatsAppConfig) {
      return null;
    }

    return buildWhatsAppRedirectUrl(props, whatsAppConfig);
  },
  getPaystackConfig: () => paystackConfig,
  getWhatsAppConfig: () => whatsAppConfig,
};
