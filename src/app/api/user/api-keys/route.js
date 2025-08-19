import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-utils'

// GET - Fetch all API keys for the authenticated user
export async function GET(request) {
  const { userId, error: authError } = await requireAuth(request)
  if (authError) return authError

  try {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new API key for the authenticated user
export async function POST(request) {
  const { userId, error: authError } = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, description, permissions } = body

    if (!name) {
      return NextResponse.json(
        { data: null, error: 'Name is required' },
        { status: 400 }
      )
    }

    const newKey = {
      name,
      description: description || '',
      permissions: permissions || [],
      key: generateApiKey(),
      type: 'dev',
      usage: 0,
      user_id: userId, // Associate with authenticated user
      created_at: new Date().toISOString(),
      last_used: null
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert([newKey])
      .select()

    if (error) throw error

    return NextResponse.json({ data: data[0], error: null })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }
}

// Generate a random API key
function generateApiKey() {
  const prefix = 'api_'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = prefix
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
