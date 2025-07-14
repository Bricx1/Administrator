-- 🧱 Step 1: Create the table
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  category text,
  status boolean default false,
  last_sync timestamptz,
  sync_rate text,
  api_calls_today integer default 0,
  uptime integer,
  created_at timestamptz default now()
);

-- 🔐 Step 2: Enable RLS (after confirming table exists)
alter table public.integrations enable row level security;

-- 🔓 Step 3: Allow SELECT for admins
create policy "Admins can SELECT integrations" on public.integrations
for select using (
  exists (
    select 1 from public.staff
    where staff.id = auth.uid()
    and staff.role = 'admin'
  )
);

-- ✍ Step 4: Allow UPDATE for admins
create policy "Admins can UPDATE integrations" on public.integrations
for update using (
  exists (
    select 1 from public.staff
    where staff.id = auth.uid()
    and staff.role = 'admin'
  )
);
