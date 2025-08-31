/*
  # Create RideLink application tables

  1. New Tables
    - `rides`
      - `id` (uuid, primary key)
      - `driver_name` (text, required)
      - `car_model` (text, required)
      - `start_location` (text, required)
      - `destination` (text, required)
      - `ride_date` (date, required)
      - `ride_time` (time, required)
      - `price` (decimal, required)
      - `available_seats` (integer, required)
      - `contact_detail` (text, required)
      - `remarks` (text, optional)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `rides` table
    - Add policies for authenticated users to manage their own rides
    - Add policy for all users to read available rides

  3. Indexes
    - Performance indexes for common queries
*/

-- Create rides table
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

-- Policies for rides table
CREATE POLICY "Anyone can read rides"
  ON rides
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert own rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rides"
  ON rides
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rides"
  ON rides
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rides_date_location ON rides(ride_date, start_location, destination);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_available_seats ON rides(available_seats) WHERE available_seats > 0;

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();