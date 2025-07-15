import 'server-only'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('[supabase-server] loading env', {
  url: !!url,
  serviceRoleKey: !!serviceRoleKey,
})

if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')

export const supabaseAdmin = createClient(url, serviceRoleKey)
