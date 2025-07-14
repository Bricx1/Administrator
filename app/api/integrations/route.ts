import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import crypto from 'crypto'

/**
 * Schema for creating a new integration. Only Availity and ExtendCare are
 * supported and all credential fields are required.
 */
const CreateSchema = z.object({
  name: z.enum(['Availity', 'ExtendCare']),
  apiKey: z.string().min(1),
  clientId: z.string().min(1),
  secret: z.string().min(1),
  environment: z.enum(['sandbox', 'production']),
})

/**
 * Schema for updating an existing integration. Fields are optional so callers
 * may update only specific values.
 */
const UpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.enum(['Availity', 'ExtendCare']).optional(),
  apiKey: z.string().optional(),
  clientId: z.string().optional(),
  secret: z.string().optional(),
  environment: z.enum(['sandbox', 'production']).optional(),
  status: z.enum(['connected', 'disconnected', 'error']).optional(),
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
    const result = CreateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const record = {
      id: crypto.randomUUID(),
      ...result.data,
      status: 'connected',
      uptime: 0,
      api_calls_today: 0,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('integrations')
      .insert(record)
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      id: data.id,
      message: 'Integration saved',
    })
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
    const result = UpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { id, ...fields } = result.data

    const { data, error } = await supabase
      .from('integrations')
      .update(fields)
      .eq('id', id)
      .select('*')
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

