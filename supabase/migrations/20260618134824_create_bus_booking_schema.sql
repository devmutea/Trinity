/*
# Bus Ticket Booking Schema

1. New Tables
- `cities` — List of available cities for route endpoints.
- `routes` — Bus routes connecting origin and destination cities.
- `buses` — Individual bus instances with schedule, price, and seat configuration.
- `seats` — Seat layout for each bus (e.g., 1A, 2B, etc.) with availability.
- `bookings` — Passenger bookings linking buses and seats.
- `popular_routes` — Highlighted popular routes for the homepage.
- `reviews` — Customer testimonials for the homepage.

2. Security
- Enable RLS on all tables.
- Single-tenant app: allow anon and authenticated CRUD since data is public/shared.
*/

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  state text,
  country text DEFAULT 'Bangladesh',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_city_id uuid NOT NULL REFERENCES cities(id),
  destination_city_id uuid NOT NULL REFERENCES cities(id),
  distance_km integer,
  estimated_duration text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES routes(id),
  bus_name text NOT NULL,
  bus_type text NOT NULL DEFAULT 'AC',
  departure_time text NOT NULL,
  arrival_time text NOT NULL,
  departure_date date NOT NULL,
  price decimal(10,2) NOT NULL,
  total_seats integer NOT NULL DEFAULT 40,
  available_seats integer NOT NULL DEFAULT 40,
  rating decimal(2,1) DEFAULT 4.0,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid NOT NULL REFERENCES buses(id),
  seat_number text NOT NULL,
  seat_type text DEFAULT 'standard',
  is_booked boolean NOT NULL DEFAULT false,
  booking_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid NOT NULL REFERENCES buses(id),
  passenger_name text NOT NULL,
  passenger_email text NOT NULL,
  passenger_phone text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  seat_count integer NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS popular_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_city text NOT NULL,
  destination_city text NOT NULL,
  price decimal(10,2) NOT NULL,
  bus_count integer NOT NULL DEFAULT 5,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar text,
  rating integer NOT NULL,
  comment text NOT NULL,
  route text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Cities policies
DROP POLICY IF EXISTS "anon_select_cities" ON cities;
CREATE POLICY "anon_select_cities" ON cities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_cities" ON cities;
CREATE POLICY "anon_insert_cities" ON cities FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Routes policies
DROP POLICY IF EXISTS "anon_select_routes" ON routes;
CREATE POLICY "anon_select_routes" ON routes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_routes" ON routes;
CREATE POLICY "anon_insert_routes" ON routes FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Buses policies
DROP POLICY IF EXISTS "anon_select_buses" ON buses;
CREATE POLICY "anon_select_buses" ON buses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_buses" ON buses;
CREATE POLICY "anon_insert_buses" ON buses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_buses" ON buses;
CREATE POLICY "anon_update_buses" ON buses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Seats policies
DROP POLICY IF EXISTS "anon_select_seats" ON seats;
CREATE POLICY "anon_select_seats" ON seats FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_seats" ON seats;
CREATE POLICY "anon_insert_seats" ON seats FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_seats" ON seats;
CREATE POLICY "anon_update_seats" ON seats FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Bookings policies
DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Popular routes policies
DROP POLICY IF EXISTS "anon_select_popular_routes" ON popular_routes;
CREATE POLICY "anon_select_popular_routes" ON popular_routes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_popular_routes" ON popular_routes;
CREATE POLICY "anon_insert_popular_routes" ON popular_routes FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Reviews policies
DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
