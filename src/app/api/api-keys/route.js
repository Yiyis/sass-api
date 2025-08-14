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

// GET - Fetch all API keys
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
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

// POST - Create new API key
export async function POST(request) {
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

// PUT - Update API key
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, name, description, permissions } = body

    if (!id || !name) {
      return NextResponse.json(
        { data: null, error: 'ID and name are required' },
        { status: 400 }
      )
    }

    const updateData = {
      name,
      description: description || '',
      permissions: permissions || [],
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ data: data[0], error: null })
  } catch (error) {
    console.error('Error updating API key:', error)
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete API key
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ error: null })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json(
      { error: error.message },
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
