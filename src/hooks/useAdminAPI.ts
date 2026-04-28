import { supabase } from '../lib/supabase';
import type {
  Lead, LeadNote, LeadActivity, TeamMember, ActivityLog, DashboardStats
} from '../lib/supabase';

type RPCResult<T> = { data: T | null; error: string | null };

function handleError(error: unknown): string {
  if (!error) return 'Unknown error';
  const e = error as { code?: string; message?: string };
  if (e.code === '42501') {
    return 'Admin access required. Please sign out and back in.';
  }
  return e.message || 'Unexpected error';
}

export const adminAPI = {
  async listLeads(filters: {
    status?: string | null;
    assignedTo?: string | null;
    search?: string | null;
    limit?: number;
    offset?: number;
  } = {}): Promise<RPCResult<Lead[]>> {
    const { data, error } = await supabase.rpc('admin_list_leads', {
      p_status: filters.status ?? null,
      p_assigned_to: filters.assignedTo ?? null,
      p_search: filters.search ?? null,
      p_limit: filters.limit ?? 100,
      p_offset: filters.offset ?? 0,
    });
    return { data: data as Lead[] | null, error: error ? handleError(error) : null };
  },

  async getLead(leadId: string): Promise<RPCResult<Lead>> {
    const { data, error } = await supabase.rpc('admin_get_lead', { p_lead_id: leadId });
    return { data: data as Lead | null, error: error ? handleError(error) : null };
  },

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<RPCResult<Lead>> {
    const { data, error } = await supabase.rpc('admin_update_lead', {
      p_lead_id: leadId,
      p_updates: updates,
    });
    return { data: data as Lead | null, error: error ? handleError(error) : null };
  },

  async deleteLead(leadId: string): Promise<RPCResult<null>> {
    const { error } = await supabase.rpc('admin_delete_lead', { p_lead_id: leadId });
    return { data: null, error: error ? handleError(error) : null };
  },

  async listLeadNotes(leadId: string): Promise<RPCResult<LeadNote[]>> {
    const { data, error } = await supabase.rpc('admin_list_lead_notes', { p_lead_id: leadId });
    return { data: data as LeadNote[] | null, error: error ? handleError(error) : null };
  },

  async createLeadNote(leadId: string, content: string): Promise<RPCResult<LeadNote>> {
    const { data, error } = await supabase.rpc('admin_create_lead_note', {
      p_lead_id: leadId,
      p_content: content,
    });
    return { data: data as LeadNote | null, error: error ? handleError(error) : null };
  },

  async listLeadActivities(leadId: string): Promise<RPCResult<LeadActivity[]>> {
    const { data, error } = await supabase.rpc('admin_list_lead_activities', { p_lead_id: leadId });
    return { data: data as LeadActivity[] | null, error: error ? handleError(error) : null };
  },

  async listTeamMembers(): Promise<RPCResult<TeamMember[]>> {
    const { data, error } = await supabase.rpc('admin_list_team_members');
    return { data: data as TeamMember[] | null, error: error ? handleError(error) : null };
  },

  async listActivityLogs(limit = 100, offset = 0): Promise<RPCResult<ActivityLog[]>> {
    const { data, error } = await supabase.rpc('admin_list_activity_logs', {
      p_limit: limit,
      p_offset: offset,
    });
    return { data: data as ActivityLog[] | null, error: error ? handleError(error) : null };
  },

  async dashboardStats(): Promise<RPCResult<DashboardStats>> {
    const { data, error } = await supabase.rpc('admin_dashboard_stats');
    return { data: data as DashboardStats | null, error: error ? handleError(error) : null };
  },
};
