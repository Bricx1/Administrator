import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const id = params?.integrationId;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing integration id' }, { status: 400 });
    }

    const { data: existing, error: getErr } = await supabase
      .from('integrations')
      .select('enabled')
      .eq('id', id)
      .single();

    if (getErr || !existing) {
      return NextResponse.json({ success: false, error: 'Integration not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('integrations')
      .update({ enabled: !existing.enabled })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Toggle failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
