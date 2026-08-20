export interface City {
  id: string;
  name: string;
  state: string | null;
  country: string;
}

export interface PopularRoute {
  id: string;
  origin_city: string;
  destination_city: string;
  price: number;
  bus_count: number;
  image_url: string | null;
}

export interface Review {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  route: string;
}

export interface Bus {
  id: string;
  bus_name: string;
  bus_type: string;
  departure_time: string;
  arrival_time: string;
  departure_date: string;
  price: number;
  total_seats: number;
  available_seats: number;
  rating: number;
  amenities: string[];
  route_id: string;
  image_url: string | null;
  number_plate: string;
  bus_image_url: string | null;
  routes: {
    origin_city_id: string;
    destination_city_id: string;
    origin_city: { name: string };
    destination_city: { name: string };
  };
}

export interface Seat {
  id: string;
  bus_id: string;
  seat_number: string;
  seat_type: string;
  is_booked: boolean;
}

export interface BookingForm {
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
}

export interface TicketData {
  bus: Bus;
  selectedSeats: string[];
  totalAmount: number;
  passengerName: string;
  passengerPhone: string;
  bookingId: string;
  bookingDate: string;
}
