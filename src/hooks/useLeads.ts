import { useState, useEffect } from 'react';
import { supabase, type Lead } from '../lib/supabase';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schemaVerified, setSchemaVerified] = useState(false);

  // Verify database schema has all required columns
  const verifySchema = async () => {
    try {
      // Try a simple query to check if all columns exist
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .select('id, name, email, company, phone, message, status, service, source, assigned_to, tags, last_contacted')
        .limit(1);
      
      if (supabaseError) {
        // If error indicates missing columns, we need to update the schema
        if (supabaseError.message && supabaseError.message.includes('Could not find')) {
          console.error('Database schema is missing columns:', supabaseError.message);
          setError('Database schema needs to be updated. Please run the schema update SQL.');
          return false;
        }
        throw supabaseError;
      }
      
      return true;
    } catch (err) {
      console.error('Error verifying schema:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify database schema');
      return false;
    }
  };

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      // Check schema if not already verified
      if (!schemaVerified) {
        const verified = await verifySchema();
        if (!verified) {
          setLoading(false);
          return;
        }
        setSchemaVerified(true);
      }

      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      
      setLeads(data || []);
      setError(null); // Clear any previous errors
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
      // Add updated_at timestamp if not provided
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { error: supabaseError } = await supabase
        .from('leads')
        .update(updatesWithTimestamp)
        .eq('id', leadId);

      if (supabaseError) {
        // Check for missing column errors
        if (supabaseError.message && supabaseError.message.includes('Could not find')) {
          console.error('Database schema is missing columns:', supabaseError.message);
          setError('Database schema needs to be updated. Please run the schema update SQL.');
          return false;
        }
        throw supabaseError;
      }

      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { ...lead, ...updatesWithTimestamp } : lead
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

  // Bulk update leads
  const bulkUpdateLeads = async (leadIds: string[], updates: Partial<Lead>) => {
    try {
      // Add updated_at timestamp if not provided
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Create an array of promises for each update operation
      const updatePromises = leadIds.map(leadId => 
        supabase
          .from('leads')
          .update(updatesWithTimestamp)
          .eq('id', leadId)
      );
      
      // Execute all updates in parallel
      const results = await Promise.all(updatePromises);
      
      // Check if any operations failed
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        // Check for missing column errors
        if (errors.some(e => e.error?.message?.includes('Could not find'))) {
          console.error('Database schema is missing columns:', errors[0].error?.message);
          setError('Database schema needs to be updated. Please run the schema update SQL.');
          return false;
        }
        
        console.error('Some updates failed:', errors);
        return false;
      }
      
      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          leadIds.includes(lead.id) ? { ...lead, ...updatesWithTimestamp } : lead
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error performing bulk updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to update leads');
      return false;
    }
  };

  // Export leads to CSV
  const exportLeads = (filteredLeads?: Lead[]) => {
    const leadsToExport = filteredLeads || leads;
    
    // Create CSV headers
    const headers = [
      'Name',
      'Email',
      'Company',
      'Phone',
      'Service',
      'Status',
      'Assigned To',
      'Created Date',
      'Updated Date',
      'Message',
      'Source'
    ];
    
    // Convert leads to CSV rows
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
      lead.source || ''
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create download link
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
    bulkUpdateLeads,
    exportLeads,
    refetch: fetchLeads,
    schemaVerified
  };
};

export default useLeads;