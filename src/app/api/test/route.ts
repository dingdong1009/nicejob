import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      openai_key: !!process.env.OPENAI_API_KEY,
      stripe_publishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripe_secret: !!process.env.STRIPE_SECRET_KEY,
      stripe_webhook: !!process.env.STRIPE_WEBHOOK_SECRET,
      node_env: process.env.NODE_ENV
    }

    // Test Supabase connection
    let supabaseStatus = 'unknown'
    try {
      const supabase = createClient()
      const { error } = await supabase.from('profiles').select('count').limit(1)
      supabaseStatus = error ? `error: ${error.message}` : 'connected'
    } catch (err) {
      supabaseStatus = `connection error: ${err instanceof Error ? err.message : 'unknown'}`
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      environment_variables: envCheck,
      database: {
        supabase: supabaseStatus
      },
      deployment: {
        phase: 'Phase 1 Complete',
        version: '1.0.0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 