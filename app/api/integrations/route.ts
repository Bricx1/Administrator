import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import crypto from 'crypto'

const IntegrationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  status: z.enum(['connected', 'disconnected', 'error']),
  uptime: z.number().min(0).max(100),
  api_calls_today: z.number().min(0),
})

async function seedIfEmpty() {
  const { data } = await supabase.from('integrations').select('id').limit(1)
  if (data && data.length === 0) {
    await supabase.from('integrations').insert([
      {
        id: crypto.randomUUID(),
        name: 'Axxess EMR',
        status: 'disconnected',
        uptime: 0,
        api_calls_today: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: 'ExtendedCare',
        status: 'disconnected',
        uptime: 0,
        api_calls_today: 0,
        created_at: new Date().toISOString(),
      },
    ])
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('created_at')

    if (error) throw error

    if (!data || data.length === 0) {
      await seedIfEmpty()
      const { data: seeded } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at')
      return NextResponse.json(seeded ?? [])
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = IntegrationSchema.omit({ id: true }).safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const record = {
      id: crypto.randomUUID(),
      ...result.data,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('integrations')
      .insert(record)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to create integration' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const result = IntegrationSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { id, ...fields } = result.data

    const { data, error } = await supabase
      .from('integrations')
      .update(fields)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to update integration' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const { error } = await supabase.from('integrations').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to delete integration' },
      { status: 500 },
    )
  }
}

