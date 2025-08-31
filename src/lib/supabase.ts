// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface Lead {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  status?: string;
  service?: string;
  source?: string;
  assigned_to?: string;
  tags?: string[];
  last_contacted?: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  created_at: string;
  created_by: string;
  content: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  created_at: string;
  scheduled_at: string;
  type: string;
  description: string;
  completed: boolean;
  completed_at?: string;
  created_by: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

// Helper functions for fetching related data
export const fetchLeadNotes = async (leadId: string): Promise<LeadNote[]> => {
  const { data, error } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching lead notes:', error);
    return [];
  }
  
  return data || [];
};

export const fetchLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  const { data, error } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('scheduled_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching lead activities:', error);
    return [];
  }
  
  return data || [];
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
  
  return data || [];
};

export default supabase;