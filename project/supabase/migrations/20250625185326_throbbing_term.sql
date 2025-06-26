/*
  # Create opportunities table

  1. New Tables
    - `opportunities`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `requirements` (text, optional)
      - `location` (text, required)
      - `date` (date, required)
      - `max_volunteers` (integer, required)
      - `current_volunteers` (integer, default 0)
      - `category` (text, required)
      - `created_at` (timestamp, default now)
      - `is_active` (boolean, default true)

  2. Security
    - Enable RLS on `opportunities` table
    - Add policy for public read access to active opportunities
    - Add policy for authenticated users to create opportunities (admin functionality)
*/

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  requirements text DEFAULT '',
  location text NOT NULL,
  date date NOT NULL,
  max_volunteers integer NOT NULL,
  current_volunteers integer DEFAULT 0 NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true NOT NULL
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active opportunities
CREATE POLICY "Anyone can view active opportunities"
  ON opportunities
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert opportunities (for admin functionality)
CREATE POLICY "Authenticated users can create opportunities"
  ON opportunities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update opportunities (for admin functionality)
CREATE POLICY "Authenticated users can update opportunities"
  ON opportunities
  FOR UPDATE
  TO authenticated
  USING (true);