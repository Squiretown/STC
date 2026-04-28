import React, { useState, useEffect } from 'react';
import { Users, Mail, Calendar, TrendingUp, CreditCard as Edit, Eye, Check } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { adminAPI } from '../hooks/useAdminAPI';
import LeadEditModal from '../components/LeadEditModal';
import BulkOperations from '../components/BulkOperations';
import type { Lead, DashboardStats } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const { leads, loading, error, updateLead, deleteLead, bulkUpdateLeads, refetch } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    adminAPI.dashboardStats().then(({ data, error: e }) => {
      if (e) setStatsError(e);
      else setStats(data);
    });
  }, [leads]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-purple-100 text-purple-800';
      case 'Converted': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setIsEditModalOpen(false);
  };

  const handleSaveLead = async (leadId: string, updates: Partial<Lead>) => {
    const success = await updateLead(leadId, updates);
    if (success) await refetch();
    return success;
  };

  const handleDeleteLead = async (leadId: string) => {
    const success = await deleteLead(leadId);
    if (success) await refetch();
    return success;
  };

  const handleBulkAssign = async (assignTo: string) => {
    try {
      const success = await bulkUpdateLeads(selectedLeads, { assigned_to: assignTo });
      if (success) { await refetch(); setSelectedLeads([]); }
    } catch (e) { console.error('Error in bulk assignment:', e); }
  };

  const handleBulkStatus = async (status: string) => {
    try {
      const success = await bulkUpdateLeads(selectedLeads, { status });
      if (success) { await refetch(); setSelectedLeads([]); }
    } catch (e) { console.error('Error in bulk status update:', e); }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
      try {
        await Promise.all(selectedLeads.map(id => deleteLead(id)));
        await refetch();
        setSelectedLeads([]);
      } catch (e) { console.error('Error in bulk delete:', e); }
    }
  };

  const handleToggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleToggleAllLeads = () => {
    setSelectedLeads(selectedLeads.length === leads.length ? [] : leads.map(l => l.id));
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <p className="text-slate-600">Please make sure you're authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  const totalLeads = stats?.total_leads ?? leads.length;
  const recentLeads = stats?.recent_leads ?? 0;
  const statusBreakdown = stats?.status_breakdown ?? {};
  const serviceBreakdown = stats?.service_breakdown ?? {};

  const topService = Object.keys(serviceBreakdown).length > 0
    ? Object.entries(serviceBreakdown).sort(([, a], [, b]) => b - a)[0][0]
    : 'N/A';

  return (
    <>
      <div className="pt-16 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Lead Management Dashboard</h1>
            <p className="text-slate-600">Monitor and manage your business leads from contact forms.</p>
          </div>

          {statsError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-yellow-800 text-sm">
              Stats unavailable: {statsError}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Leads</p>
                  <p className="text-2xl font-bold text-slate-800">{totalLeads}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">This Week</p>
                  <p className="text-2xl font-bold text-slate-800">{recentLeads}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">New Leads</p>
                  <p className="text-2xl font-bold text-slate-800">{statusBreakdown['New'] ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Converted</p>
                  <p className="text-2xl font-bold text-slate-800">{statusBreakdown['Converted'] ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Top Service</p>
                  <p className="text-lg font-bold text-slate-800">{topService}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Operations */}
          {selectedLeads.length > 0 && (
            <BulkOperations
              selectedLeads={selectedLeads}
              onBulkAssign={handleBulkAssign}
              onBulkStatus={handleBulkStatus}
              onBulkDelete={handleBulkDelete}
              onClearSelection={() => setSelectedLeads([])}
            />
          )}

          {/* Leads Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">All Leads</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === leads.length && leads.length > 0}
                        onChange={handleToggleAllLeads}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className={`hover:bg-slate-50 ${selectedLeads.includes(lead.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleToggleLeadSelection(lead.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{lead.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800">{lead.email}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{lead.company || 'Not specified'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status || 'New')}`}>
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                          {lead.service || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{lead.assigned_to || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatDate(lead.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                        <p className="truncate" title={lead.message}>{lead.message}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="Edit lead"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No leads yet. Check back when contact forms are submitted.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <LeadEditModal
        lead={selectedLead}
        isOpen={isEditModalOpen}
        onSave={handleSaveLead}
        onDelete={handleDeleteLead}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default AdminDashboard;
