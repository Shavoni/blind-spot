-- Create api_usage table for tracking user API consumption
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  total_cost DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
  request_count INTEGER NOT NULL DEFAULT 0,
  last_request_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one record per user per month
  UNIQUE(user_id, month)
);

-- Create index for faster lookups
CREATE INDEX idx_api_usage_user_month ON api_usage(user_id, month);

-- Add RLS (Row Level Security)
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own usage" ON api_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Only the edge function (service role) can insert/update usage
CREATE POLICY "Service role can manage usage" ON api_usage
  FOR ALL USING (auth.role() = 'service_role');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_api_usage_updated_at 
  BEFORE UPDATE ON api_usage 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();