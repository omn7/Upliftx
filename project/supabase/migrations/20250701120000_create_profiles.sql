-- Create profiles table for user profile info
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to select/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid()::uuid = user_id); 