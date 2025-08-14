import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// GET - Get total usage across all API keys
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('usage')

    if (error) throw error
    
    const totalUsage = data.reduce((sum, key) => sum + (key.usage || 0), 0)

    return NextResponse.json({ data: totalUsage, error: null })
  } catch (error) {
    console.error('Error calculating total usage:', error)
    return NextResponse.json(
      { data: 0, error: error.message },
      { status: 500 }
    )
  }
}
