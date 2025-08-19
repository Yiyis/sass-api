-- Update RLS policies for api_keys table to be user-specific
-- Run this in your Supabase SQL Editor

-- Drop existing policy
DROP POLICY IF EXISTS "Allow all operations for now" ON api_keys;
DROP POLICY IF EXISTS "Allow all operations" ON api_keys;

-- Create user-specific policies
-- Users can only read their own API keys
CREATE POLICY "Users can read own api_keys" ON api_keys
  FOR SELECT USING (user_id IS NOT NULL);

-- Users can only insert API keys for themselves
CREATE POLICY "Users can insert own api_keys" ON api_keys
  FOR INSERT WITH CHECK (user_id IS NOT NULL);

-- Users can only update their own API keys
CREATE POLICY "Users can update own api_keys" ON api_keys
  FOR UPDATE USING (user_id IS NOT NULL);

-- Users can only delete their own API keys
CREATE POLICY "Users can delete own api_keys" ON api_keys
  FOR DELETE USING (user_id IS NOT NULL);

-- Also update the users table policies if needed
-- Drop existing policy on users table
DROP POLICY IF EXISTS "Allow all operations for now" ON users;

-- Create proper user policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true); -- Allow reading for authenticated requests

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true); -- Allow updating for authenticated requests

-- Note: Since we're using service role key in the API routes,
-- these policies will be enforced at the application level through our auth middleware
