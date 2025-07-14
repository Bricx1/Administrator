-- Sample integrations seed data
insert into integrations (name, type, category, status, last_sync, sync_rate, api_calls_today, uptime)
values
  ('Axxess', 'EMR', 'Healthcare', false, null, 'daily', 0, 99),
  ('ExtendedCare', 'Telehealth', 'Healthcare', false, null, 'daily', 0, 99),
  ('CAQH', 'Credentialing', 'Healthcare', false, null, 'daily', 0, 99),
  ('Twilio', 'Messaging', 'Communication', true, now(), 'hourly', 42, 98),
  ('Stripe', 'Payments', 'Payments', true, now(), 'hourly', 17, 99),
  ('Supabase', 'Database', 'Infrastructure', true, now(), 'realtime', 300, 99);
