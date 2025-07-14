export interface IntegrationCredentials {
  integration_id: string
  username: string
  password: string
  agency_id?: string
  environment: string
  iv?: string
  updated_at?: string
}

export interface SyncSettings {
  integration_id: string
  data_types: string[]
  sync_frequency: string
  updated_at?: string
}

export interface ReferralRules {
  integration_id: string
  accepted_insurance: string[]
  min_reimbursement: number
  max_distance: number
  required_services: string[]
  excluded_diagnoses: string[]
  msw_notifications: string[]
  updated_at?: string
}

export interface SyncControls {
  integration_id: string
  auto_eligibility_check: boolean
  auto_prior_auth: boolean
  real_time_updates: boolean
  sync_interval: string
  updated_at?: string
}

export interface IntegrationMetrics {
  integration_id: string
  api_calls_today: number
  uptime: number
  success_rate: number
  avg_response: number
  recent_activity: any[]
}
