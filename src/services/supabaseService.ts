import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      if (!CONFIG.supabase.url || !CONFIG.supabase.anonKey) {
        console.warn('⚠️ Supabase configuration missing');
        return false;
      }

      this.client = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
      
      // Test connection
      const { error } = await this.client.from('blindspots_analyses').select('count').limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('⚠️ Table "blindspots_analyses" does not exist');
          console.log('📋 Please run the SQL schema in supabase_schema.sql in your Supabase dashboard');
          await this.createSchema();
          return false;
        } else {
          console.error('❌ Supabase connection error:', error.message);
          return false;
        }
      }
      
      this.isInitialized = true;
      console.log('✅ Supabase connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
  }

  async createSchema(): Promise<void> {
    if (!this.client) throw new Error('Supabase not initialized');

    // Note: In a real app, these would be database migrations
    console.log('📊 Creating Supabase schema for Blind Spot analysis...');
    
    // This would typically be done via Supabase dashboard or migration files
    // For demo purposes, we'll log the schema that should be created
    const schema = `
      -- Blindspots Analysis Tables
      CREATE TABLE IF NOT EXISTS blindspots_analyses (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        session_id TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        trust_vector DECIMAL(3,2),
        signals JSONB,
        alerts JSONB,
        timeline JSONB,
        context_preset TEXT,
        claude_analysis TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blindspots_sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        session_id TEXT UNIQUE NOT NULL,
        start_time TIMESTAMP DEFAULT NOW(),
        end_time TIMESTAMP,
        context_preset TEXT,
        media_type TEXT,
        status TEXT DEFAULT 'active'
      );
    `;
    
    console.log('📋 Required schema:', schema);
  }

  async storeAnalysis(analysisData: any): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.client) {
      return { success: false, error: 'Supabase not initialized' };
    }

    try {
      const { data, error } = await this.client
        .from('blindspots_analyses')
        .insert([{
          session_id: analysisData.sessionId,
          trust_vector: analysisData.trustVector,
          signals: analysisData.signals,
          alerts: analysisData.alerts,
          timeline: analysisData.timeline,
          context_preset: analysisData.contextPreset,
          claude_analysis: analysisData.claudeAnalysis || null
        }])
        .select('id');

      if (error) throw error;

      console.log('💾 Analysis stored in Supabase:', data[0]?.id);
      return { success: true, id: data[0]?.id };
    } catch (error) {
      console.error('❌ Failed to store analysis:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getAnalyses(limit = 10): Promise<any[]> {
    if (!this.client) return [];

    try {
      const { data, error } = await this.client
        .from('blindspots_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch analyses:', error);
      return [];
    }
  }

  get connected(): boolean {
    return this.isInitialized && this.client !== null;
  }
}

export const supabaseService = new SupabaseService();