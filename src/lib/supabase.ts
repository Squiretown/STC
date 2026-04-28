import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: string | null;
  source: string | null;
  assigned_to: string | null;
  tags: string[] | null;
  last_contacted: string | null;
  sms_consent: boolean;
  sms_consent_at: string | null;
  sms_consent_text: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LeadNote {
  id: string;
  lead_id: string | null;
  content: string;
  created_by: string | null;
  created_at: string | null;
}

export interface LeadActivity {
  id: string;
  lead_id: string | null;
  type: string;
  description: string;
  scheduled_at: string;
  completed: boolean | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string | null;
}

export interface ActivityLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown> | null;
  user_id: string | null;
  created_at: string | null;
}

export interface DashboardStats {
  total_leads: number;
  recent_leads: number;
  status_breakdown: Record<string, number>;
  service_breakdown: Record<string, number>;
}

export interface PortfolioProject {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  url?: string | null;
  status: 'live' | 'in-development';
  featured: boolean;
  sort_order: number;
  accent_color: string;
  accent_light: string;
  accent_text: string;
  icon_name: string;
}

export default supabase;
