import supabase from '@/lib/supabaseClient'

export async function fetchIntegrationSettings(platform: string) {
  const { data, error } = await supabase
    .from('integration_settings')
    .select('*')
    .eq('platform', platform)
    .single()
  if (error) throw error
  return data
}
