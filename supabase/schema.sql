-- SQL schema for Supabase tables

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  role text,
  created_at timestamp with time zone default now()
);

create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff(id) on delete cascade,
  shift_id uuid references shifts(id) on delete cascade,
  status text default 'scheduled',
  created_at timestamp with time zone default now()
);

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  category text,
  status boolean default false,
  last_sync timestamp with time zone,
  sync_rate text,
  api_calls_today integer default 0,
  uptime integer,
  created_at timestamp with time zone default now()
);

alter table integrations enable row level security;
create policy "Admins only" on integrations
  for select, update using (
    exists (select 1 from staff where staff.id = auth.uid() and staff.role = 'admin')
  );

create table if not exists integration_settings (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  api_key text,
  secret text,
  url text,
  updated_at timestamp with time zone default now()
);

alter table integration_settings enable row level security;
create policy "Admins only" on integration_settings
  for select, update using (
    exists (select 1 from staff where staff.id = auth.uid() and staff.role = 'admin')
  );
