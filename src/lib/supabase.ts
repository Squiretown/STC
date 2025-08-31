// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
// For browser environments, we need to use import.meta.env or window.env
// Next.js typically exposes env vars with NEXT_PUBLIC_ prefix to the browser
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 
                    process.env?.NEXT_PUBLIC_SUPABASE_URL || 
                    'https://pbwkpdpofrndpgsqzgig.supabase.co'; // Fallback to your actual URL if needed

const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 
                        process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                        ''; // Add your public anon key as fallback if needed

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

export default supabase; LeadNote {
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