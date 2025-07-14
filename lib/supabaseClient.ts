import { createClient } from '@supabase/supabase-js'

// Support both server and browser environments by checking NEXT_PUBLIC
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing')
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export default supabase
