import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Integration } from '@/types/integration'
import type { PostgrestError } from '@supabase/supabase-js'
import { handleGET as genericGET } from '../[table]/route'

async function seedIfEmpty() {
  try {
    console.log('[seedIntegrations] checking')
    const { data, error } = await supabaseAdmin.from('integrations').select('id').limit(1)
    if (error) {
      console.error('seed check error', error)
      return
    }
    if (data && data.length === 0) {
      const samples: Integration[] = [
      {
        id: crypto.randomUUID(),
        name: 'Axxess',
        type: 'emr',
        category: 'healthcare',
        status: false,
        last_sync: null,
        sync_rate: 'daily',
        api_calls_today: 0,
        uptime: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'ExtendedCare',
        type: 'billing',
        category: 'healthcare',
        status: false,
        last_sync: null,
        sync_rate: 'daily',
        api_calls_today: 0,
        uptime: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'SendGrid',
        type: 'email',
        category: 'communication',
        status: true,
        last_sync: new Date().toISOString(),
        sync_rate: 'hourly',
        api_calls_today: 10,
        uptime: 99.9,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Twilio',
        type: 'sms',
        category: 'communication',
        status: true,
        last_sync: new Date().toISOString(),
        sync_rate: 'hourly',
        api_calls_today: 5,
        uptime: 99.5,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Stripe',
        type: 'payments',
        category: 'financial',
        status: false,
        last_sync: null,
        sync_rate: 'daily',
        api_calls_today: 0,
        uptime: 0,
        created_at: new Date().toISOString(),
      },
    ]
      await supabaseAdmin.from('integrations').insert(samples)
    }
  } catch (err) {
    console.error('seedIntegrations failed', err)
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const idsParam = searchParams.get('ids')
  const statusParam = searchParams.get('status')

  let response = await genericGET(request, 'integrations')

  if (
    response.status === 200 &&
    !id &&
    !idsParam &&
    !statusParam
  ) {
    const data = await response.clone().json().catch(() => null)
    if (Array.isArray(data) && data.length === 0) {
      await seedIfEmpty()
      response = await genericGET(request, 'integrations')
    }
  }

  return response
}
