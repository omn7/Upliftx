import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      opportunities: {
        Row: {
          id: string;
          title: string;
          description: string;
          requirements: string;
          location: string;
          date: string;
          max_volunteers: number;
          current_volunteers: number;
          category: string;
          created_at: string;
          is_active: boolean;
          price?: number;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          requirements: string;
          location: string;
          date: string;
          max_volunteers: number;
          current_volunteers?: number;
          category: string;
          created_at?: string;
          is_active?: boolean;
          price?: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          requirements?: string;
          location?: string;
          date?: string;
          max_volunteers?: number;
          current_volunteers?: number;
          category?: string;
          created_at?: string;
          is_active?: boolean;
          price?: number;
        };
      };
      applications: {
        Row: {
          id: string;
          opportunity_id: string;
          volunteer_id: string;
          volunteer_name: string;
          volunteer_email: string;
          phone: string;
          message: string;
          status: 'pending' | 'approved' | 'rejected';
          rating?: number;
          volunteer_image_url?: string;
          admin_notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          volunteer_id: string;
          volunteer_name: string;
          volunteer_email: string;
          phone: string;
          message: string;
          status?: 'pending' | 'approved' | 'rejected';
          rating?: number;
          volunteer_image_url?: string;
          admin_notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          volunteer_id?: string;
          volunteer_name?: string;
          volunteer_email?: string;
          phone?: string;
          message?: string;
          status?: 'pending' | 'approved' | 'rejected';
          rating?: number;
          volunteer_image_url?: string;
          admin_notes?: string;
          created_at?: string;
        };
      };
    };
  };
};