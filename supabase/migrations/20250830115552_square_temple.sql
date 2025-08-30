/*
  # Create rides table and authentication setup

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
*/

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

-- Enable RLS
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Policy for users to read all available rides
CREATE POLICY "Anyone can read rides"
  ON rides
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy for authenticated users to insert their own rides
CREATE POLICY "Users can insert own rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own rides
CREATE POLICY "Users can update own rides"
  ON rides
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own rides
CREATE POLICY "Users can delete own rides"
  ON rides
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_rides_date_location ON rides(ride_date, start_location, destination);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);