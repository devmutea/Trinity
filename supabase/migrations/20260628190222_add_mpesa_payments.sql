-- Add payment tracking for M-Pesa transactions
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS mpesa_checkout_request_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS mpesa_merchant_request_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS mpesa_receipt_number text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS mpesa_phone text;

-- Create payments table for transaction tracking
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  checkout_request_id text UNIQUE,
  merchant_request_id text,
  booking_reference text,
  amount decimal(10,2) NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  mpesa_receipt text,
  result_code integer,
  result_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Payments policies
DROP POLICY IF EXISTS "anon_select_payments" ON payments;
CREATE POLICY "anon_select_payments" ON payments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_payments" ON payments;
CREATE POLICY "anon_insert_payments" ON payments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_payments" ON payments;
CREATE POLICY "anon_update_payments" ON payments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);