import { NextResponse } from 'next/server'

export async function POST() {
  // This endpoint is not needed since we use client-side signOut
  // But keeping it for compatibility
  return NextResponse.json({ success: true })
}

