export interface Integration {
  id: string
  name: string
  type: string
  category: string
  status: boolean
  last_sync: string | null
  sync_rate: string | null
  api_calls_today: number
  uptime: number
  created_at: string
}
