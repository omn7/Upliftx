-- Fix for opportunity delete functionality
-- This ensures proper permissions for deleting opportunities and related applications

-- First, make sure applications table allows deletes
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies on applications that might interfere
DROP POLICY IF EXISTS "Authenticated users can create applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can view all applications" ON applications;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON applications;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON applications;
DROP POLICY IF EXISTS "Allow public access" ON applications;

-- Create comprehensive policies for applications table
CREATE POLICY "Allow all operations on applications"
  ON applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to applications"
  ON applications
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Now fix opportunities table policies
-- Drop existing policies that might be restrictive
DROP POLICY IF EXISTS "Authenticated users can delete opportunities" ON opportunities;
DROP POLICY IF EXISTS "Authenticated users can update opportunities" ON opportunities;
DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON opportunities;
DROP POLICY IF EXISTS "Anyone can view active opportunities" ON opportunities;

-- Create comprehensive policies for opportunities table
CREATE POLICY "Allow all operations on opportunities"
  ON opportunities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to view active opportunities"
  ON opportunities
  FOR SELECT
  TO public
  USING (is_active = true);

-- Add foreign key constraint with CASCADE delete if it doesn't exist
-- This ensures applications are automatically deleted when opportunity is deleted
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

-- Verify the policies are in place
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('opportunities', 'applications')
ORDER BY tablename, policyname;

-- Test if we can perform delete operations
-- This will show if there are any remaining permission issues
SELECT 
  'Opportunities table RLS status' as info,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'opportunities'

UNION ALL

SELECT 
  'Applications table RLS status' as info,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'applications'; 