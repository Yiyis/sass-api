// Test script to verify Supabase connection
// Run this with: node test-supabase.js

import { createClient } from '@supabase/supabase-js'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length || 0)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure .env.local exists with:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_url_here')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here')
  process.exit(1)
}

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase client created successfully')
  
  // Test connection by trying to access the table
  console.log('🔍 Testing table access...')
  
  supabase
    .from('api_keys')
    .select('count')
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Table access failed:', error.message)
        console.error('This might mean:')
        console.error('1. The table "api_keys" doesn\'t exist')
        console.error('2. RLS policies are blocking access')
        console.error('3. The table name is different')
      } else {
        console.log('✅ Table access successful!')
        console.log('Response:', data)
      }
    })
    .catch(err => {
      console.error('❌ Unexpected error:', err.message)
    })
    
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error.message)
}
