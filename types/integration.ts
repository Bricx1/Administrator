export interface Integration {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  uptime: number
  api_calls_today: number
  created_at: string
}
