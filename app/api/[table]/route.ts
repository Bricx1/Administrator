import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { PostgrestError } from '@supabase/supabase-js'

export async function handleGET(request: NextRequest, table: string) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const idsParam = searchParams.get('ids')
  const statusParam = searchParams.get('status')
  const sort = (searchParams.get('sort') || 'asc').toLowerCase()
  const searchTerm = searchParams.get('search') || searchParams.get('query')

  try {
    console.log(`[api:${table}] query params`, Object.fromEntries(searchParams))
    if (id) {
      const { data, error, status } = await supabaseAdmin
        .from(table)
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        console.error(`Error fetching ${table} record`, error)
        return NextResponse.json(
          { success: false, error: error.message, code: error.code, details: error.details },
          { status },
        )
      }

      if (!data) {
        return NextResponse.json({ success: false, error: `${table} not found` }, { status: 404 })
      }

      return NextResponse.json({ success: true, data })
    }

    if (idsParam) {
      const ids = idsParam.split(',').map((v) => v.trim()).filter(Boolean)
      const { data, error, status } = await supabaseAdmin
        .from(table)
        .select('*')
        .in('id', ids)

      if (error) {
        console.error(`Error fetching ${table} records`, error)
        return NextResponse.json(
          { success: false, error: error.message, code: error.code, details: error.details },
          { status },
        )
      }

      return NextResponse.json({ success: true, data: data ?? [] })
    }

  let query = supabaseAdmin.from(table).select('*')

  if (statusParam !== null) {
      const normalized = statusParam.toLowerCase()
      const status =
        normalized === 'true' || normalized === '1' || normalized === 'active'
    query = query.eq('status', status)
  }

  if (searchTerm) {
    const pattern = `%${searchTerm}%`
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern}`,
    )
  }

    const { data, error, status: queryStatus } = await query.order('created_at', {
      ascending: sort !== 'desc',
    })

    if (error) {
      console.error(`Error fetching ${table} records`, error)
      return NextResponse.json(
        { success: false, error: error.message, code: error.code, details: error.details },
        { status: queryStatus },
      )
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (err) {
    console.error(err)
    const supabaseError = err as PostgrestError
    return NextResponse.json(
      { success: false, error: supabaseError.message || `Failed to fetch ${table}`,
        code: supabaseError.code,
        details: supabaseError.details },
      { status: (supabaseError as any).status || 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { table: string } }) {
  return handleGET(request, params.table)
}
