/*
  # RideLink Database Setup Script
  
  Run this script in your Supabase SQL Editor to create all necessary tables and policies.
  
  1. Tables Created
    - `rides` - Stores all ride information posted by drivers
  
  2. Security
    - Row Level Security enabled
    - Policies for reading, creating, updating rides
    - Authentication integration with Supabase Auth
  
  3. Sample Data
    - Three example rides for testing
*/

-- Create the rides table
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_name text NOT NULL,
  car_model text NOT NULL,
  start_location text NOT NULL,
  destination text NOT NULL,
  ride_date date NOT NULL,
  ride_time time NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  available_seats integer NOT NULL DEFAULT 1,
  contact_detail text NOT NULL,
  remarks text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read rides" ON rides;
DROP POLICY IF EXISTS "Users can insert own rides" ON rides;
DROP POLICY IF EXISTS "Users can update own rides" ON rides;
DROP POLICY IF EXISTS "Users can delete own rides" ON rides;
DROP POLICY IF EXISTS "Anyone can book rides" ON rides;

-- Policy: Anyone can read all rides (for searching and viewing)
CREATE POLICY "Anyone can read rides"
  ON rides
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Authenticated users can insert rides (linked to their user_id)
CREATE POLICY "Users can insert own rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own rides
CREATE POLICY "Users can update own rides"
  ON rides
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow anyone to update available_seats (for booking functionality)
CREATE POLICY "Anyone can book rides"
  ON rides
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (available_seats >= 0);

-- Policy: Users can delete their own rides
CREATE POLICY "Users can delete own rides"
  ON rides
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rides_date_location ON rides(ride_date, start_location, destination);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_available_seats ON rides(available_seats) WHERE available_seats > 0;
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at when a row is modified
DROP TRIGGER IF EXISTS update_rides_updated_at ON rides;
CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO rides (
  driver_name, car_model, start_location, destination, 
  ride_date, ride_time, price, available_seats, contact_detail, remarks
) VALUES 
(
  'Ahmed Hassan', 
  'Toyota Camry', 
  'Dubai', 
  'Abu Dhabi', 
  '2025-02-01', 
  '10:00', 
  25.00, 
  3, 
  '+971-50-123-4567', 
  'Max 2 small bags per person. No pets allowed.'
),
(
  'Sara Al-Zahra', 
  'Honda Civic', 
  'Sharjah', 
  'Dubai', 
  '2025-02-01', 
  '12:30', 
  15.00, 
  2, 
  '+971-55-987-6543', 
  'Pickup from Central Mall.'
),
(
  'Omar Khalil', 
  'Tesla Model 3', 
  'Abu Dhabi', 
  'Rasalkhaima', 
  '2025-02-02', 
  '18:00', 
  20.00, 
  1, 
  '+971-52-456-7890', 
  ''
) ON CONFLICT (id) DO NOTHING;