import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, type Lead } from '../lib/supabase';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchLeads = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setLeads(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? 'Failed to fetch leads';
      setError(msg);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const updateLead = useCallback(async (leadId: string, updates: Partial<Lead>) => {
    try {
      const updatesWithTimestamp = { ...updates, updated_at: new Date().toISOString() };
      const { error: supabaseError } = await supabase
        .from('leads')
        .update(updatesWithTimestamp)
        .eq('id', leadId);

      if (supabaseError) throw supabaseError;

      setLeads(prev =>
        prev.map(lead => lead.id === leadId ? { ...lead, ...updatesWithTimestamp } : lead)
      );
      return true;
    } catch (err) {
      console.error('Error updating lead:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lead');
      return false;
    }
  }, []);

  const deleteLead = useCallback(async (leadId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (supabaseError) throw supabaseError;
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      return true;
    } catch (err) {
      console.error('Error deleting lead:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
      return false;
    }
  }, []);

  const bulkUpdateLeads = useCallback(async (leadIds: string[], updates: Partial<Lead>) => {
    const updatesWithTimestamp = { ...updates, updated_at: new Date().toISOString() };
    const results = await Promise.all(
      leadIds.map(id =>
        supabase.from('leads').update(updatesWithTimestamp).eq('id', id)
      )
    );

    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      const msg = `${failed.length} of ${leadIds.length} updates failed`;
      setError(msg);
      console.error('Bulk update errors:', failed.map(r => r.error));
      return false;
    }

    setLeads(prev =>
      prev.map(lead => leadIds.includes(lead.id) ? { ...lead, ...updatesWithTimestamp } : lead)
    );
    return true;
  }, []);

  const bulkDeleteLeads = useCallback(async (leadIds: string[]): Promise<{ failed: string[] }> => {
    const results = await Promise.all(
      leadIds.map(async id => {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        return { id, error };
      })
    );

    const failed = results.filter(r => r.error).map(r => r.id);
    const succeeded = results.filter(r => !r.error).map(r => r.id);

    if (succeeded.length > 0) {
      setLeads(prev => prev.filter(lead => !succeeded.includes(lead.id)));
    }
    if (failed.length > 0) {
      setError(`${failed.length} of ${leadIds.length} deletes failed`);
    }
    return { failed };
  }, []);

  const exportLeads = useCallback((filteredLeads?: Lead[]) => {
    const rows = (filteredLeads || leads).map(lead => [
      lead.name || '',
      lead.email || '',
      lead.company || '',
      lead.phone || '',
      lead.service || '',
      lead.status || '',
      lead.assigned_to || '',
      lead.created_at ? new Date(lead.created_at).toLocaleString() : '',
      lead.updated_at ? new Date(lead.updated_at).toLocaleString() : '',
      lead.message || '',
      lead.source || '',
    ]);

    const headers = ['Name', 'Email', 'Company', 'Phone', 'Service', 'Status', 'Assigned To', 'Created', 'Updated', 'Message', 'Source'];
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [leads]);

  useEffect(() => {
    fetchLeads();

    const subscription = supabase
      .channel('leads_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, payload => {
        setLeads(prev => [payload.new as Lead, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, payload => {
        setLeads(prev => prev.map(l => l.id === payload.new.id ? payload.new as Lead : l));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'leads' }, payload => {
        setLeads(prev => prev.filter(l => l.id !== payload.old.id));
      })
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [fetchLeads]);

  const reassignLead = useCallback(async (
    leadId: string,
    assignToName: string,
    assignToEmail: string,
  ) => {
    return updateLead(leadId, {
      assigned_to: assignToName,
      assigned_to_email: assignToEmail,
      assignment_status: 'pending',
      assignment_token: null,
      assignment_token_expires_at: null,
      assignment_declined_reason: null,
    } as Partial<Lead>);
  }, [updateLead]);

  return {
    leads,
    loading,
    error,
    updateLead,
    deleteLead,
    reassignLead,
    bulkUpdateLeads,
    bulkDeleteLeads,
    exportLeads,
    refetch: fetchLeads,
  };
};

export default useLeads;
