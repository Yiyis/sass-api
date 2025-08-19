import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-utils'

// GET - Fetch usage analytics for all API keys of the authenticated user
export async function GET(request) {
  const { userId, error: authError } = await requireAuth(request)
  if (authError) return authError

  try {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('id, name, key, usage, last_used, created_at')
      .eq('user_id', userId)
      .order('usage', { ascending: false })

    if (error) throw error

    // Calculate some basic analytics
    const totalUsage = data.reduce((sum, key) => sum + (key.usage || 0), 0)
    const totalKeys = data.length
    const activeKeys = data.filter(key => key.last_used).length

    const analytics = {
      totalUsage,
      totalKeys,
      activeKeys,
      keys: data
    }

    return NextResponse.json({ data: analytics, error: null })
  } catch (error) {
    console.error('Error fetching API usage:', error)
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Update usage for a specific API key (internal use)
export async function POST(request) {
  const { userId, error: authError } = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { keyId, incrementUsage = 1 } = body

    if (!keyId) {
      return NextResponse.json(
        { error: 'Key ID is required' },
        { status: 400 }
      )
    }

    // Verify the API key belongs to the user and increment usage
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update({ 
        usage: supabaseAdmin.raw('usage + ?', [incrementUsage]),
        last_used: new Date().toISOString()
      })
      .eq('id', keyId)
      .eq('user_id', userId)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: data[0], error: null })
  } catch (error) {
    console.error('Error updating API usage:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
