# Administrator Project

## Supabase Setup Verification

1. Ensure `.env.local` contains your actual `SUPABASE_URL` and `SUPABASE_ANON_KEY` values from the Supabase dashboard.
2. You can validate the credentials by calling the REST endpoint directly:

```bash
curl -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/integrations"
```

The response should return JSON from the `integrations` table or an error detailing what went wrong.

## Troubleshooting 500 Errors

If `/api/integrations` returns a `500 Internal Server Error`, verify the
following:

1. `.env.local` includes valid `SUPABASE_URL` and `SUPABASE_ANON_KEY` values.
2. The `integrations` table exists in your Supabase project and has the correct
   schema.
3. Row level security policies allow the current API user to read from the
   table.

You can also check server logs for the message printed by the API route for more
details on the failure.

## Creating the `integrations` Table

If the API returns an error like `relation "integrations" does not exist` you
need to create the table in your Supabase project. Run the following SQL in the
Supabase SQL editor:

```sql
create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  name text,
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
    exists (
      select 1 from staff where staff.id = auth.uid() and staff.role = 'admin'
    )
  );
```

After creating the table and policy, the `/api/integrations` endpoint should
return data successfully.

Ensure your frontend requests use the path `/api/integrations` which maps to
`app/api/integrations/route.ts` in this repository.
