// DEPRECATED: This endpoint is deprecated. Use /api/user/api-keys/ instead
// This file is kept for backward compatibility but should not be used for new features

import { NextResponse } from 'next/server'

// All requests to this endpoint should be redirected to the new authenticated endpoints

// Deprecated endpoints - redirect to new authenticated endpoints
export async function GET() {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use /api/user/api-keys/ instead and ensure you are authenticated.' 
    },
    { status: 410 } // Gone
  )
}

export async function POST(request) {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use /api/user/api-keys/ instead and ensure you are authenticated.' 
    },
    { status: 410 } // Gone
  )
}

export async function PUT(request) {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use /api/user/api-keys/[id] instead and ensure you are authenticated.' 
    },
    { status: 410 } // Gone
  )
}

export async function DELETE(request) {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use /api/user/api-keys/[id] instead and ensure you are authenticated.' 
    },
    { status: 410 } // Gone
  )
}
