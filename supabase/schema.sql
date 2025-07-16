-- Create the axxess_integrations table in Supabase
CREATE TABLE IF NOT EXISTS axxess_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  username text NOT NULL,
  password_encrypted text NOT NULL,
  agency_id text NOT NULL,
  environment text NOT NULL DEFAULT 'production',
  sync_patients boolean DEFAULT true,
  sync_orders boolean DEFAULT true,
  sync_documents boolean DEFAULT true,
  sync_physicians boolean DEFAULT true,
  sync_frequency text NOT NULL DEFAULT 'hourly',
  connected boolean DEFAULT false,
  connected_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT axxess_integrations_user_id_unique UNIQUE (user_id),
  CONSTRAINT axxess_integrations_environment_check CHECK (environment IN ('production', 'sandbox')),
  CONSTRAINT axxess_integrations_frequency_check CHECK (sync_frequency IN ('realtime', '15min', 'hourly', 'daily', 'manual'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_axxess_integrations_user_id ON axxess_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_axxess_integrations_agency_id ON axxess_integrations(agency_id);
CREATE INDEX IF NOT EXISTS idx_axxess_integrations_connected ON axxess_integrations(connected);

-- Enable Row Level Security (RLS)
ALTER TABLE axxess_integrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own integrations
CREATE POLICY "Users can only access their own integrations" ON axxess_integrations
  FOR ALL USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_axxess_integrations_updated_at
  BEFORE UPDATE ON axxess_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();