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
