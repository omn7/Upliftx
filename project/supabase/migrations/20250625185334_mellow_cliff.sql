/*
  # Create applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `opportunity_id` (uuid, foreign key to opportunities)
      - `volunteer_id` (text, user ID from auth system)
      - `volunteer_name` (text, required)
      - `volunteer_email` (text, required)
      - `phone` (text, required)
      - `message` (text, optional)
      - `status` (text, default 'pending', enum: pending/approved/rejected)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on `applications` table
    - Add policy for users to read their own applications
    - Add policy for users to create applications
    - Add policy for authenticated users to read all applications (admin functionality)

  3. Constraints
    - Foreign key constraint linking to opportunities table
    - Check constraint for status values
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  volunteer_id text NOT NULL,
  volunteer_name text NOT NULL,
  volunteer_email text NOT NULL,
  phone text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own applications
CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (volunteer_id = auth.jwt() ->> 'sub');

-- Allow users to create applications
CREATE POLICY "Authenticated users can create applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (volunteer_id = auth.jwt() ->> 'sub');

-- Allow authenticated users to read all applications (for admin functionality)
CREATE POLICY "Authenticated users can view all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update applications (for admin functionality)
CREATE POLICY "Authenticated users can update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true);