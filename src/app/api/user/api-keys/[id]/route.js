import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-utils'

// GET - Fetch specific API key for the authenticated user
export async function GET(request, { params }) {
  const { userId, error: authError } = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { data: null, error: 'API key ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId) // Ensure user owns this API key
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'API key not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error('Error fetching API key:', error)
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update specific API key for the authenticated user
export async function PUT(request, { params }) {
  const { userId, error: authError } = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = params
    const body = await request.json()
    const { name, description, permissions } = body

    if (!id) {
      return NextResponse.json(
        { data: null, error: 'API key ID is required' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { data: null, error: 'Name is required' },
        { status: 400 }
      )
    }

    // First verify the API key belongs to the user
    const { data: existingKey, error: checkError } = await supabaseAdmin
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (checkError || !existingKey) {
      return NextResponse.json(
        { data: null, error: 'API key not found or access denied' },
        { status: 404 }
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
      .eq('user_id', userId) // Double-check user ownership
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

// DELETE - Delete specific API key for the authenticated user
export async function DELETE(request, { params }) {
  const { userId, error: authError } = await requireAuth(request)
  if (authError) return authError

  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    // First verify the API key belongs to the user
    const { data: existingKey, error: checkError } = await supabaseAdmin
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (checkError || !existingKey) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 404 }
      )
    }

    const { error } = await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Double-check user ownership

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
