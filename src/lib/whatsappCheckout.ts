import { type Bus } from '../types';
import { formatPriceWithKesConversion } from './currency';
import { readPublicConfigValue } from './appConfig';

export interface CheckoutPassenger {
  name: string;
  phone: string;
}

export interface WhatsAppOrderDetails {
  bus: Bus;
  passengers: CheckoutPassenger[];
  selectedSeats: string[];
  totalAmount: number;
  bookingReference: string;
}

export type WhatsAppCheckoutConfig =
  | {
      isValid: true;
      number: string;
      defaultMessage: string;
    }
  | {
      isValid: false;
      number: null;
      defaultMessage: null;
      error: string;
    };

const normalizeWhatsAppNumber = (value: string): string => value.replace(/[^\d]/g, '');

export const getWhatsAppCheckoutConfig = (): WhatsAppCheckoutConfig => {
  const rawNumber = readPublicConfigValue('WHATSAPP_NUMBER');
  const defaultMessage = readPublicConfigValue('WHATSAPP_DEFAULT_MESSAGE');
  const normalizedNumber = normalizeWhatsAppNumber(rawNumber);

  if (!rawNumber) {
    return {
      isValid: false,
      number: null,
      defaultMessage: null,
      error: 'WhatsApp checkout is not configured. Add WHATSAPP_NUMBER to continue.',
    };
  }

  if (!/^\d{7,15}$/.test(normalizedNumber)) {
    return {
      isValid: false,
      number: null,
      defaultMessage: null,
      error: 'WhatsApp checkout number is invalid. Use an international number without spaces or symbols.',
    };
  }

  if (!defaultMessage) {
    return {
      isValid: false,
      number: null,
      defaultMessage: null,
      error: 'WhatsApp checkout is not configured. Add WHATSAPP_DEFAULT_MESSAGE to continue.',
    };
  }

  return {
    isValid: true,
    number: normalizedNumber,
    defaultMessage,
  };
};


const formatSeatLabel = (seat: string): string => {
  const trimmed = seat.trim();
  return trimmed.toLowerCase().startsWith('seat ') ? trimmed : `Seat ${trimmed}`;
};

export const buildWhatsAppOrderMessage = (
  details: WhatsAppOrderDetails,
  defaultMessage: string
): string => {
  const { bus, passengers, selectedSeats, totalAmount, bookingReference } = details;
  const route = `${bus.routes.origin_city.name} to ${bus.routes.destination_city.name}`;

  const passengerLines = passengers
    .map((passenger, index) => {
      const name = passenger.name.trim();
      const phone = passenger.phone.trim();
      if (!name && !phone) {
        return null;
      }

      const seatValue = selectedSeats[index] ?? `${index + 1}`;
      const seatLabel = formatSeatLabel(seatValue);
      const detailsParts: string[] = [];

      if (name) {
        detailsParts.push(name);
      }
      if (phone) {
        detailsParts.push(phone);
      }
      detailsParts.push(seatLabel);

      return `${index + 1}. ${detailsParts.join(' - ')}`;
    })
    .filter((line): line is string => line !== null);

  const passengerSection = passengerLines.length > 0
    ? ['Customer details:', ...passengerLines]
    : [];

  return [
    defaultMessage.trim(),
    '',
    `Booking reference: ${bookingReference}`,
    `Route: ${route}`,
    `Travel date: ${bus.departure_date}`,
    `Departure: ${bus.departure_time}`,
    `Bus: ${bus.bus_name} (${bus.bus_type})`,
    `Quantity: ${selectedSeats.length} seat(s)`,
    `Seats: ${selectedSeats.join(', ')}`,
    `Total: ${formatPriceWithKesConversion(totalAmount, bus.routes.origin_city.name)}`,
    '',
    ...passengerSection,
  ].join('\n');
};

export const buildWhatsAppCheckoutUrl = (number: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  const normalizedNumber = number.replace(/[^\d]/g, '');
  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
};
