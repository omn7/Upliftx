-- Fix for "Apply Now" functionality not working
-- Run this in your Supabase SQL Editor

-- Disable RLS on applications table since we're using Clerk auth instead of Supabase auth
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Also ensure opportunities table allows updates for volunteer counts
-- Drop existing policies that might be restrictive
DROP POLICY IF EXISTS "Authenticated users can update opportunities" ON opportunities;

-- Create a more permissive policy for updating opportunities
CREATE POLICY "Authenticated users can update opportunities"
  ON opportunities
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow authenticated users to insert opportunities (for admin)
DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON opportunities;
CREATE POLICY "Authenticated users can insert opportunities"
  ON opportunities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to delete opportunities (for admin)
DROP POLICY IF EXISTS "Authenticated users can delete opportunities" ON opportunities;
CREATE POLICY "Authenticated users can delete opportunities"
  ON opportunities
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify the changes
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('applications', 'opportunities'); 