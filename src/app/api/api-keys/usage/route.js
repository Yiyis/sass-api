// DEPRECATED: This endpoint is deprecated. Use /api/user/api-keys/usage instead

import { NextResponse } from 'next/server'

// GET - Deprecated endpoint
export async function GET() {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use /api/user/api-keys/usage instead and ensure you are authenticated.' 
    },
    { status: 410 } // Gone
  )
}
