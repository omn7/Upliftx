-- Fix authentication issues for Clerk integration
-- Since we're using Clerk for auth instead of Supabase Auth, we need to disable RLS on applications

-- Disable RLS on applications table since we're using Clerk auth
-- This is the main fix needed for the "Apply Now" functionality
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Update opportunities table to allow authenticated users to update volunteer counts
DROP POLICY IF EXISTS "Authenticated users can update opportunities" ON opportunities;
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

-- Note: The opportunities table policies should already be working
-- If there are still issues, they can be addressed separately 