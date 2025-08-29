import { useState, useEffect } from 'react';
import { supabase, type Lead } from '../lib/supabase';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  // Update a lead
  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const { error: supabaseError } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { ...lead, ...updates } : lead
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating lead:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lead');
      return false;
    }
  };

  // Delete a lead
  const deleteLead = async (leadId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));

      return true;
    } catch (err) {
      console.error('Error deleting lead:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
      return false;
    }
  };

  // Subscribe to real-time changes
  useEffect(() => {
    fetchLeads();

    // Set up real-time subscription
    const subscription = supabase
      .channel('leads_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'leads' 
        }, 
        (payload) => {
          console.log('Real-time change received:', payload);
          fetchLeads(); // Refetch leads when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    leads,
    loading,
    error,
    updateLead,
    deleteLead,
    refetch: fetchLeads
  };
};

export default useLeads;