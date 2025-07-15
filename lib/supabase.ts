import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('[supabase] Loading env', {
  url: !!url,
  anonKey: !!anonKey,
  serviceRoleKey: !!serviceRoleKey,
})

if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')

export const supabaseClient = createClient(url, anonKey)
export const supabaseAdmin = createClient(url, serviceRoleKey)
