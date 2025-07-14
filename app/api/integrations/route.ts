import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Integration } from '@/types/integration'

async function seedIfEmpty() {
  const { data } = await supabase.from('integrations').select('id').limit(1)
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
    await supabase.from('integrations').insert(samples)
  }
}

export async function GET() {
  const { data, error } = await supabase.from('integrations').select('*').order('created_at')
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }
  if (!data || data.length === 0) {
    await seedIfEmpty()
    const { data: seeded } = await supabase.from('integrations').select('*').order('created_at')
    return NextResponse.json(seeded ?? [])
  }
  return NextResponse.json(data)
}
