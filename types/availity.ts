export interface AvailityTransaction {
  id: string
  type: string
  status: string
  patient?: string | null
  payer?: string | null
  created_at: string
}
