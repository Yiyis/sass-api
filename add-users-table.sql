-- Add users table for Google SSO user storage
-- Run this in your Supabase SQL editor

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  image_url TEXT,
  provider VARCHAR(50) DEFAULT 'google',
  provider_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for the users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Enable Row Level Security (RLS) for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can customize this later)
CREATE POLICY "Allow all operations for now" ON users
  FOR ALL USING (true);

-- Add user_id column to existing api_keys table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'api_keys' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
  END IF;
END $$;

-- Create a function to update the updated_at timestamp for users
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column for users
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_users_updated_at_column();
