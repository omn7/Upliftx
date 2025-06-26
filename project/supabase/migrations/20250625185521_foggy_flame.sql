/*
  # Create applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `opportunity_id` (uuid, foreign key to opportunities)
      - `volunteer_id` (text, user ID from auth)
      - `volunteer_name` (text, required)
      - `volunteer_email` (text, required)
      - `phone` (text, required)
      - `message` (text, optional with default empty string)
      - `status` (text, default 'pending', constrained to pending/approved/rejected)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on `applications` table
    - Add policy for authenticated users to create applications (only their own)
    - Add policy for authenticated users to view all applications
    - Add policy for users to view their own applications
    - Add policy for authenticated users to update applications

  3. Constraints
    - Foreign key constraint to opportunities table with cascade delete
    - Check constraint for status values
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL,
  volunteer_id text NOT NULL,
  volunteer_name text NOT NULL,
  volunteer_email text NOT NULL,
  phone text NOT NULL,
  message text DEFAULT ''::text,
  status text DEFAULT 'pending'::text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'applications_opportunity_id_fkey'
    AND table_name = 'applications'
  ) THEN
    ALTER TABLE applications
    ADD CONSTRAINT applications_opportunity_id_fkey
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraint for status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'applications_status_check'
    AND table_name = 'applications'
  ) THEN
    ALTER TABLE applications
    ADD CONSTRAINT applications_status_check
    CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]));
  END IF;
END $$;

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can create applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (volunteer_id = (jwt() ->> 'sub'::text));

CREATE POLICY "Authenticated users can view all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (volunteer_id = (jwt() ->> 'sub'::text));

CREATE POLICY "Authenticated users can update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true);