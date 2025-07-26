-- Blindspots Analysis Database Schema
-- Run this in your Supabase SQL editor to create the required tables

-- Create the analyses table
CREATE TABLE IF NOT EXISTS blindspots_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trust_vector DECIMAL(3,2) CHECK (trust_vector >= 0 AND trust_vector <= 1),
  signals JSONB NOT NULL DEFAULT '{}',
  alerts JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  context_preset TEXT,
  scenario_details JSONB DEFAULT '{}',
  text_input TEXT,
  analysis_mode TEXT DEFAULT 'video' CHECK (analysis_mode IN ('video', 'text', 'live')),
  educational_feedback JSONB DEFAULT '{}',
  actionable_advice JSONB DEFAULT '[]',
  claude_analysis TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the sessions table
CREATE TABLE IF NOT EXISTS blindspots_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  context_preset TEXT,
  media_type TEXT CHECK (media_type IN ('live', 'upload', 'text')),
  media_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}',
  learning_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning progress table
CREATE TABLE IF NOT EXISTS blindspots_learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  scenario_type TEXT,
  skill_area TEXT,
  progress_level INTEGER DEFAULT 0 CHECK (progress_level >= 0 AND progress_level <= 100),
  completed_exercises JSONB DEFAULT '[]',
  improvement_areas JSONB DEFAULT '[]',
  last_practice_session TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_analyses_session_id ON blindspots_analyses(session_id);
CREATE INDEX idx_analyses_created_at ON blindspots_analyses(created_at DESC);
CREATE INDEX idx_analyses_context_preset ON blindspots_analyses(context_preset);
CREATE INDEX idx_sessions_session_id ON blindspots_sessions(session_id);
CREATE INDEX idx_sessions_status ON blindspots_sessions(status);
CREATE INDEX idx_learning_user_id ON blindspots_learning_progress(user_id);
CREATE INDEX idx_learning_scenario ON blindspots_learning_progress(scenario_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE
  ON blindspots_analyses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_learning_updated_at BEFORE UPDATE
  ON blindspots_learning_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE blindspots_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE blindspots_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blindspots_learning_progress ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert and read their own data
CREATE POLICY "Users can insert analyses" ON blindspots_analyses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view analyses" ON blindspots_analyses
  FOR SELECT USING (true);

CREATE POLICY "Users can insert sessions" ON blindspots_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view sessions" ON blindspots_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert learning progress" ON blindspots_learning_progress
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view learning progress" ON blindspots_learning_progress
  FOR SELECT USING (true);

CREATE POLICY "Users can update learning progress" ON blindspots_learning_progress
  FOR UPDATE USING (true);

-- Grant permissions
GRANT ALL ON blindspots_analyses TO authenticated;
GRANT ALL ON blindspots_sessions TO authenticated;
GRANT ALL ON blindspots_learning_progress TO authenticated;
GRANT ALL ON blindspots_analyses TO anon;
GRANT ALL ON blindspots_sessions TO anon;
GRANT ALL ON blindspots_learning_progress TO anon;