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

export async function POST(request) {
  try {
    const body = await request.json()
    const { apiKey } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // Validate API key format
    if (!apiKey.startsWith('api_')) {
      return NextResponse.json({
        isValid: false,
        message: 'Invalid API key format. API keys must start with "api_"'
      })
    }

    // Check if API key exists in database
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (error || !data) {
      return NextResponse.json({
        isValid: false,
        message: 'API key not found in our system'
      })
    }

    // Check if key is active (you can add more validation logic here)
    if (data.type === 'test' && data.usage > 1000) {
      return NextResponse.json({
        isValid: false,
        message: 'Test API key has exceeded usage limits'
      })
    }

    // Return success with key details
    return NextResponse.json({
      isValid: true,
      message: 'API key is valid and active',
      keyDetails: {
        name: data.name || '',
        description: data.description || '',
        type: data.type || 'unknown',
        usage: typeof data.usage === 'number' ? data.usage : 0,
        permissions: Array.isArray(data.permissions) ? data.permissions : [],
        created_at: data.created_at || null
      }
    })

  } catch (error) {
    console.error('Error validating API key:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
