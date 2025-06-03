import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    deployment: 'vercel',
    version: '1.0.0',
    phase: 'Phase 1 Complete - Foundation Ready'
  })
} 