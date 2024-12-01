import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          last_active: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          last_active?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          last_active?: string
          user_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          role: 'user' | 'assistant'
          content: string
          timestamp: string
          project_id: string
        }
        Insert: {
          id?: string
          role: 'user' | 'assistant'
          content: string
          timestamp?: string
          project_id: string
        }
        Update: {
          id?: string
          role?: 'user' | 'assistant'
          content?: string
          timestamp?: string
          project_id?: string
        }
      }
      actions: {
        Row: {
          id: string
          type: 'command' | 'result' | 'error' | 'automation' | 'bolt'
          content: string
          timestamp: string
          status: 'pending' | 'completed' | 'failed' | null
          project_id: string
          details: Json | null
        }
        Insert: {
          id?: string
          type: 'command' | 'result' | 'error' | 'automation' | 'bolt'
          content: string
          timestamp?: string
          status?: 'pending' | 'completed' | 'failed' | null
          project_id: string
          details?: Json | null
        }
        Update: {
          id?: string
          type?: 'command' | 'result' | 'error' | 'automation' | 'bolt'
          content?: string
          timestamp?: string
          status?: 'pending' | 'completed' | 'failed' | null
          project_id?: string
          details?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}