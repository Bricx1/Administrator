# Administrator Project

## Supabase Setup Verification

1. Ensure `.env.local` contains your actual `SUPABASE_URL` and `SUPABASE_ANON_KEY` values from the Supabase dashboard.
2. You can validate the credentials by calling the REST endpoint directly:

```bash
curl -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/integrations"
```

The response should return JSON from the `integrations` table or an error detailing what went wrong.
