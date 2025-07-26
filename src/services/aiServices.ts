import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from './config';

// OpenAI Service
class OpenAIService {
  private client: OpenAI | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      if (!CONFIG.apis.openai) {
        console.warn('⚠️ OpenAI API key missing');
        return false;
      }

      this.client = new OpenAI({
        apiKey: CONFIG.apis.openai,
        dangerouslyAllowBrowser: true // Note: In production, use a proxy server
      });

      // Test connection
      await this.client.models.list();
      console.log('✅ OpenAI connected successfully');
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ OpenAI connection failed:', error);
      return false;
    }
  }

  async analyzeAudio(audioData: Blob): Promise<{ transcript: string; emotions: string[]; confidence: number }> {
    if (!this.client || !this.isInitialized) {
      throw new Error('OpenAI not initialized');
    }

    try {
      // Convert blob to file for Whisper API
      const file = new File([audioData], 'audio.wav', { type: 'audio/wav' });
      
      const transcription = await this.client.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
      });

      // Analyze transcript for emotional indicators
      const analysis = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in vocal analysis and psychology. Analyze the following transcript for emotional indicators, stress patterns, and deception signals. Return a JSON object with emotions array and confidence score.'
          },
          {
            role: 'user',
            content: `Analyze this transcript for vocal behavioral patterns: "${transcription.text}"`
          }
        ],
        temperature: 0.3,
      });

      const result = JSON.parse(analysis.choices[0].message.content || '{}');
      
      return {
        transcript: transcription.text,
        emotions: result.emotions || ['neutral'],
        confidence: result.confidence || 0.5
      };
    } catch (error) {
      console.error('❌ OpenAI audio analysis failed:', error);
      throw error;
    }
  }

  async analyzeText(text: string, context: string): Promise<{ indicators: string[]; confidence: number }> {
    if (!this.client || !this.isInitialized) {
      throw new Error('OpenAI not initialized');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are analyzing text for behavioral patterns in a ${context} context. Focus on linguistic indicators of stress, deception, confidence, and emotional state. Return JSON with indicators array and confidence score.`
          },
          {
            role: 'user',
            content: `Analyze this text: "${text}"`
          }
        ],
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        indicators: result.indicators || ['baseline'],
        confidence: result.confidence || 0.5
      };
    } catch (error) {
      console.error('❌ OpenAI text analysis failed:', error);
      throw error;
    }
  }

  get connected(): boolean {
    return this.isInitialized && this.client !== null;
  }
}

// Anthropic Service
class AnthropicService {
  private client: Anthropic | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      if (!CONFIG.apis.anthropic) {
        console.warn('⚠️ Anthropic API key missing');
        return false;
      }

      this.client = new Anthropic({
        apiKey: CONFIG.apis.anthropic,
        dangerouslyAllowBrowser: true // Note: In production, use a proxy server
      });

      console.log('✅ Anthropic connected successfully');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Anthropic connection failed:', error);
      return false;
    }
  }

  async analyzeBehavior(analysisData: any, context: string): Promise<{ analysis: string; confidence: number; recommendations: string[] }> {
    if (!this.client || !this.isInitialized) {
      throw new Error('Anthropic not initialized');
    }

    try {
      const prompt = `
        As an expert behavioral analyst, analyze the following multi-signal data for a ${context} context:
        
        Trust Vector: ${analysisData.trustVector}
        Facial Signals: ${JSON.stringify(analysisData.signals.facial)}
        Vocal Signals: ${JSON.stringify(analysisData.signals.vocal)}
        Postural Signals: ${JSON.stringify(analysisData.signals.postural)}
        Temporal Signals: ${JSON.stringify(analysisData.signals.temporal)}
        Alerts: ${JSON.stringify(analysisData.alerts)}
        
        Provide a comprehensive behavioral analysis including:
        1. Overall assessment and confidence level
        2. Key behavioral patterns identified
        3. Risk factors and considerations
        4. Recommendations for interpretation
        
        Format your response as JSON with analysis, confidence, and recommendations fields.
      `;

      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });

      const textContent = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const result = JSON.parse(textContent);
      
      return {
        analysis: result.analysis || 'Analysis completed.',
        confidence: result.confidence || 0.7,
        recommendations: result.recommendations || ['Continue monitoring', 'Consider additional context']
      };
    } catch (error) {
      console.error('❌ Anthropic analysis failed:', error);
      throw error;
    }
  }

  get connected(): boolean {
    return this.isInitialized && this.client !== null;
  }
}

export const openaiService = new OpenAIService();
export const anthropicService = new AnthropicService();