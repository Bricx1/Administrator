-- Integration setup tables

create table if not exists integrations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  enabled boolean default false,
  status boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.integration_credentials (
  id uuid primary key default uuid_generate_v4(),
  integration_id uuid references integrations(id),
  username text,
  password text,
  agency_id text,
  environment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.integration_sync_settings (
  id uuid primary key default uuid_generate_v4(),
  integration_id uuid references integrations(id),
  data_types text[],
  sync_frequency text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.integration_referral_rules (
  id uuid primary key default uuid_generate_v4(),
  integration_id uuid references integrations(id),
  accepted_insurance text[],
  min_reimbursement numeric,
  max_distance numeric,
  required_services text[],
  excluded_diagnoses text[],
  msw_notifications text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.integration_sync_controls (
  id uuid primary key default uuid_generate_v4(),
  integration_id uuid references integrations(id),
  auto_eligibility_check boolean,
  auto_prior_auth boolean,
  real_time_updates boolean,
  sync_interval text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.integration_metrics (
  id uuid primary key default uuid_generate_v4(),
  integration_id uuid references integrations(id),
  api_calls_today integer,
  uptime numeric,
  success_rate numeric,
  avg_response numeric,
  recent_activity jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.api_monitoring (
  id uuid primary key default uuid_generate_v4(),
  api_call_type text, -- e.g. 'Eligibility Check'
  status text, -- success, failed, pending
  user_name text,
  response_time_ms int,
  created_at timestamp default now()
);
