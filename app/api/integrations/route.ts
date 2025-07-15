import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const idsParam = searchParams.get('ids')
  const statusParam = searchParams.get('status')
  const sort = (searchParams.get('sort') || 'asc').toLowerCase()

  try {
    if (id) {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json(data)
    }

    if (idsParam) {
      const ids = idsParam.split(',').map((v) => v.trim()).filter(Boolean)
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .in('id', ids)

      if (error) throw error
      return NextResponse.json(data ?? [])
    }

    let query = supabase.from('integrations').select('*')

    if (statusParam !== null) {
      const normalized = statusParam.toLowerCase()
      const status = normalized === 'true' || normalized === '1' || normalized === 'active'
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', {
      ascending: sort !== 'desc',
    })

    if (error) throw error

    if (!data || data.length === 0) {
      if (!statusParam && !id && !idsParam) {
        await seedIfEmpty()
        const { data: seeded } = await supabase
          .from('integrations')
          .select('*')
          .order('created_at', { ascending: sort !== 'desc' })
        return NextResponse.json(seeded ?? [])
      }
      return NextResponse.json([])
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 },
    )
  }
}
