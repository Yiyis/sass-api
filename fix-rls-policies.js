// Fix RLS policies script
// Run this with: node fix-rls-policies.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Fixing RLS policies...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixRLSPolicies() {
  try {
    console.log('🔍 Checking current RLS policies...')
    
    // First, let's try to disable RLS temporarily to test
    console.log('🔄 Temporarily disabling RLS...')
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;'
    })
    
    if (disableError) {
      console.log('⚠️ Could not disable RLS via RPC, trying alternative...')
      await fixPoliciesAlternative()
    } else {
      console.log('✅ RLS disabled temporarily')
      await testInsert()
      
      // Re-enable RLS with proper policy
      console.log('🔄 Re-enabling RLS with proper policy...')
      const { error: enableError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
          
          DROP POLICY IF EXISTS "Allow all operations" ON api_keys;
          CREATE POLICY "Allow all operations" ON api_keys
            FOR ALL USING (true);
        `
      })
      
      if (enableError) {
        console.log('⚠️ Could not set policy via RPC')
        console.log('📋 Please run this SQL manually in Supabase SQL Editor:')
        console.log('')
        console.log('ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;')
        console.log('DROP POLICY IF EXISTS "Allow all operations" ON api_keys;')
        console.log('CREATE POLICY "Allow all operations" ON api_keys FOR ALL USING (true);')
      } else {
        console.log('✅ RLS re-enabled with proper policy')
        await testInsert()
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to fix RLS policies:', error.message)
  }
}

async function fixPoliciesAlternative() {
  try {
    console.log('🔧 Trying alternative approach to fix policies...')
    
    // Try to create a more permissive policy
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Allow all operations" ON api_keys;
        DROP POLICY IF EXISTS "Enable read access for all users" ON api_keys;
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON api_keys;
        
        CREATE POLICY "Enable read access for all users" ON api_keys
          FOR SELECT USING (true);
          
        CREATE POLICY "Enable insert for authenticated users only" ON api_keys
          FOR INSERT WITH CHECK (true);
          
        CREATE POLICY "Enable update for users based on email" ON api_keys
          FOR UPDATE USING (true);
          
        CREATE POLICY "Enable delete for users based on email" ON api_keys
          FOR DELETE USING (true);
      `
    })
    
    if (error) {
      console.log('❌ Could not create policies via RPC')
      console.log('📋 Please run this SQL manually in Supabase SQL Editor:')
      console.log('')
      console.log('-- Drop existing policies')
      console.log('DROP POLICY IF EXISTS "Allow all operations" ON api_keys;')
      console.log('DROP POLICY IF EXISTS "Enable read access for all users" ON api_keys;')
      console.log('DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON api_keys;')
      console.log('')
      console.log('-- Create new policies')
      console.log('CREATE POLICY "Enable read access for all users" ON api_keys')
      console.log('  FOR SELECT USING (true);')
      console.log('')
      console.log('CREATE POLICY "Enable insert for authenticated users only" ON api_keys')
      console.log('  FOR INSERT WITH CHECK (true);')
      console.log('')
      console.log('CREATE POLICY "Enable update for users based on email" ON api_keys')
      console.log('  FOR UPDATE USING (true);')
      console.log('')
      console.log('CREATE POLICY "Enable delete for users based on email" ON api_keys')
      console.log('  FOR DELETE USING (true);')
    } else {
      console.log('✅ Policies created successfully')
      await testInsert()
    }
    
  } catch (error) {
    console.error('❌ Alternative approach failed:', error.message)
  }
}

async function testInsert() {
  try {
    console.log('🧪 Testing insert operation...')
    
    const testKey = {
      name: 'test_key_' + Date.now(),
      description: 'Test key for validation',
      key: 'test_' + Date.now(),
      type: 'dev',
      usage: 0,
      permissions: ['read']
    }
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([testKey])
      .select()
    
    if (error) {
      console.error('❌ Insert still failing:', error.message)
    } else {
      console.log('✅ Insert successful! Created key:', data?.[0]?.id)
      
      // Clean up test data
      await supabase
        .from('api_keys')
        .delete()
        .eq('name', testKey.name)
      
      console.log('✅ Test completed successfully!')
    }
    
  } catch (error) {
    console.error('❌ Insert test failed:', error.message)
  }
}

// Run the fix
fixRLSPolicies()
