-- Fix Admin Permissions for Volunteer Platform
-- Run this script in your Supabase SQL Editor

-- First, let's see what policies exist
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
WHERE tablename IN ('opportunities', 'applications');

-- Drop ALL existing RLS policies that might be causing issues
DROP POLICY IF EXISTS "Enable read access for all users" ON opportunities;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON opportunities;
DROP POLICY IF EXISTS "Enable update for users based on email" ON opportunities;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON opportunities;
DROP POLICY IF EXISTS "Anyone can view active opportunities" ON opportunities;
DROP POLICY IF EXISTS "Authenticated users can create opportunities" ON opportunities;
DROP POLICY IF EXISTS "Authenticated users can update opportunities" ON opportunities;
DROP POLICY IF EXISTS "Allow all operations for admin functionality" ON opportunities;
DROP POLICY IF EXISTS "Allow all operations on opportunities" ON opportunities;

DROP POLICY IF EXISTS "Enable read access for all users" ON applications;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON applications;
DROP POLICY IF EXISTS "Enable update for users based on email" ON applications;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON applications;
DROP POLICY IF EXISTS "Anyone can view applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can create applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON applications;
DROP POLICY IF EXISTS "Allow all operations on applications for admin functionality" ON applications;
DROP POLICY IF EXISTS "Allow all operations on applications" ON applications;

-- Option 1: Completely disable RLS for admin operations
ALTER TABLE opportunities DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Option 2: If you prefer to keep RLS enabled, use these permissive policies
-- ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow all operations on opportunities" ON opportunities
--     FOR ALL USING (true) WITH CHECK (true);
-- 
-- CREATE POLICY "Allow all operations on applications" ON applications
--     FOR ALL USING (true) WITH CHECK (true);

-- Grant ALL necessary permissions
GRANT ALL ON opportunities TO authenticated;
GRANT ALL ON applications TO authenticated;
GRANT ALL ON opportunities TO anon;
GRANT ALL ON applications TO anon;
GRANT ALL ON opportunities TO service_role;
GRANT ALL ON applications TO service_role;

-- Grant USAGE on sequences (for auto-incrementing IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Create a function to verify permissions
CREATE OR REPLACE FUNCTION verify_admin_permissions()
RETURNS TABLE(table_name text, has_select boolean, has_insert boolean, has_update boolean, has_delete boolean) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'opportunities'::text as table_name,
        has_table_privilege('authenticated', 'opportunities', 'SELECT') as has_select,
        has_table_privilege('authenticated', 'opportunities', 'INSERT') as has_insert,
        has_table_privilege('authenticated', 'opportunities', 'UPDATE') as has_update,
        has_table_privilege('authenticated', 'opportunities', 'DELETE') as has_delete
    UNION ALL
    SELECT 
        'applications'::text as table_name,
        has_table_privilege('authenticated', 'applications', 'SELECT') as has_select,
        has_table_privilege('authenticated', 'applications', 'INSERT') as has_insert,
        has_table_privilege('authenticated', 'applications', 'UPDATE') as has_update,
        has_table_privilege('authenticated', 'applications', 'DELETE') as has_delete;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the verification function
GRANT EXECUTE ON FUNCTION verify_admin_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_permissions() TO anon;

-- Verify the changes
SELECT 'RLS Status:' as info, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('opportunities', 'applications');

SELECT 'Policies:' as info, tablename, policyname FROM pg_policies WHERE tablename IN ('opportunities', 'applications');

-- Test the permissions
SELECT * FROM verify_admin_permissions(); 