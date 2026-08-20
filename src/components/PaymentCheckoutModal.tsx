import type { Bus } from '../types';
import type { CheckoutPassenger } from '../lib/whatsappCheckout';
import { paymentService } from '../lib/paymentService';

interface PaymentCheckoutModalProps {
  amount: number;
  bus: Bus;
  passengers: CheckoutPassenger[];
  selectedSeats: string[];
  bookingReference: string;
  onBack: () => void;
}

export default function PaymentCheckoutModal({
  amount,
  bus,
  passengers,
  selectedSeats,
  bookingReference,
  onBack,
}: PaymentCheckoutModalProps) {
  return paymentService.checkout({
    amount,
    bus,
    passengers,
    selectedSeats,
    bookingReference,
    onBack,
  });
}
