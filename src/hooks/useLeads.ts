import { useState, useEffect } from 'react';
import { adminAPI } from './useAdminAPI';
import type { Lead } from '../lib/supabase';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error: apiError } = await adminAPI.listLeads();
    if (apiError) {
      setError(apiError);
    } else {
      setLeads(data || []);
      setError(null);
    }
    setLoading(false);
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>): Promise<boolean> => {
    const { error: apiError } = await adminAPI.updateLead(leadId, updates);
    if (apiError) {
      setError(apiError);
      return false;
    }
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
    return true;
  };

  const deleteLead = async (leadId: string): Promise<boolean> => {
    const { error: apiError } = await adminAPI.deleteLead(leadId);
    if (apiError) {
      setError(apiError);
      return false;
    }
    setLeads(prev => prev.filter(l => l.id !== leadId));
    return true;
  };

  const bulkUpdateLeads = async (leadIds: string[], updates: Partial<Lead>): Promise<boolean> => {
    const results = await Promise.all(leadIds.map(id => adminAPI.updateLead(id, updates)));
    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      setError(failed[0].error);
      return false;
    }
    setLeads(prev => prev.map(l => leadIds.includes(l.id) ? { ...l, ...updates } : l));
    return true;
  };

  const exportLeads = (filteredLeads?: Lead[]) => {
    const leadsToExport = filteredLeads || leads;
    const headers = ['Name', 'Email', 'Company', 'Phone', 'Service', 'Status', 'Assigned To', 'Created Date', 'Updated Date', 'Message', 'Source'];
    const rows = leadsToExport.map(lead => [
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
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    loading,
    error,
    updateLead,
    deleteLead,
    bulkUpdateLeads,
    exportLeads,
    refetch: fetchLeads,
  };
};

export default useLeads;
