import React, { useState, useEffect, useMemo } from 'react';
import { Users, TrendingUp, Eye, Mail, Download, Search, Filter, ChevronUp, ChevronDown, CreditCard as Edit, X } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { fetchTeamMembers } from '../lib/supabase';
import LeadEditModal from '../components/LeadEditModal';
import BulkOperations from '../components/BulkOperations';
import { getStatusColor, getServiceLabel } from '../lib/constants';
import type { Lead, TeamMember } from '../lib/supabase';

type SortField = 'name' | 'status' | 'created_at' | 'assigned_to';
type SortDir = 'asc' | 'desc';

const AdminDashboard: React.FC = () => {
  const { leads, loading, error, updateLead, bulkUpdateLeads, bulkDeleteLeads, exportLeads, refetch } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Filter/sort state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssigned, setFilterAssigned] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    fetchTeamMembers().then(setTeamMembers);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredLeads = useMemo(() => {
    let list = leads;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q)
      );
    }
    if (filterStatus) list = list.filter(l => (l.status || 'New') === filterStatus);
    if (filterAssigned) list = list.filter(l => l.assigned_to === filterAssigned);

    return [...list].sort((a, b) => {
      const av = (a[sortField] ?? '') as string;
      const bv = (b[sortField] ?? '') as string;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [leads, search, filterStatus, filterAssigned, sortField, sortDir]);

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleSaveLead = async (leadId: string, updates: Partial<Lead>) => {
    return updateLead(leadId, updates);
  };

  const handleBulkAssign = async (assignTo: string) => {
    const ok = await bulkUpdateLeads(selectedLeads, { assigned_to: assignTo });
    if (ok) setSelectedLeads([]);
  };

  const handleBulkStatus = async (status: string) => {
    const ok = await bulkUpdateLeads(selectedLeads, { status });
    if (ok) setSelectedLeads([]);
  };

  const handleBulkDelete = async () => {
    const { failed } = await bulkDeleteLeads(selectedLeads);
    setSelectedLeads([]);
    setShowBulkDeleteConfirm(false);
    if (failed.length > 0) {
      alert(`${failed.length} lead(s) could not be deleted.`);
    }
  };

  const handleToggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleToggleAllLeads = () => {
    setSelectedLeads(
      selectedLeads.length === filteredLeads.length && filteredLeads.length > 0
        ? []
        : filteredLeads.map(l => l.id)
    );
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp className="h-3 w-3 text-blue-600" />
      : <ChevronDown className="h-3 w-3 text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="pt-8 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">Error loading leads</p>
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Stats
  const totalLeads = leads.length;
  const recentLeads = leads.filter(l => {
    const d = new Date(l.created_at || '');
    const w = new Date();
    w.setDate(w.getDate() - 7);
    return d >= w;
  }).length;
  const statusStats = leads.reduce((acc, l) => {
    const s = l.status || 'New';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const conversionRate = totalLeads > 0
    ? Math.round(((statusStats['Converted'] || 0) / totalLeads) * 100)
    : 0;

  const serviceInterests = leads.reduce((acc, l) => {
    const s = l.service || 'Not specified';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topService = Object.keys(serviceInterests).length > 0
    ? Object.entries(serviceInterests).sort(([, a], [, b]) => b - a)[0][0]
    : 'N/A';

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const uniqueAssignees = [...new Set(leads.map(l => l.assigned_to).filter(Boolean))] as string[];

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Lead Management</h1>
              <p className="text-slate-500">Monitor and manage leads from contact forms</p>
            </div>
            <button
              onClick={() => exportLeads()}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Leads', value: totalLeads, icon: Users, bg: 'bg-blue-100', color: 'text-blue-600' },
              { label: 'This Week', value: recentLeads, icon: TrendingUp, bg: 'bg-green-100', color: 'text-green-600' },
              { label: 'New', value: statusStats['New'] || 0, icon: Eye, bg: 'bg-blue-100', color: 'text-blue-600' },
              { label: 'Converted', value: statusStats['Converted'] || 0, icon: TrendingUp, bg: 'bg-emerald-100', color: 'text-emerald-600' },
              { label: 'Conv. Rate', value: `${conversionRate}%`, icon: Mail, bg: 'bg-purple-100', color: 'text-purple-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top service banner */}
          {topService !== 'N/A' && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 mb-6 text-sm text-blue-700">
              Top service interest: <span className="font-semibold">{getServiceLabel(topService)}</span>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="py-2 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {uniqueAssignees.length > 0 && (
                <select
                  value={filterAssigned}
                  onChange={e => setFilterAssigned(e.target.value)}
                  className="py-2 px-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Assignees</option>
                  {uniqueAssignees.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              )}
              {(search || filterStatus || filterAssigned) && (
                <button
                  onClick={() => { setSearch(''); setFilterStatus(''); setFilterAssigned(''); }}
                  className="p-2 text-slate-400 hover:text-slate-600"
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bulk Operations */}
          {selectedLeads.length > 0 && (
            <>
              <BulkOperations
                selectedLeads={selectedLeads}
                onBulkAssign={handleBulkAssign}
                onBulkStatus={handleBulkStatus}
                onBulkDelete={() => setShowBulkDeleteConfirm(true)}
                onClearSelection={() => setSelectedLeads([])}
                teamMembers={teamMembers}
              />
              {showBulkDeleteConfirm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <p className="text-red-700 font-medium text-sm">
                    Delete {selectedLeads.length} selected lead{selectedLeads.length !== 1 ? 's' : ''}? This cannot be undone.
                  </p>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowBulkDeleteConfirm(false)}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Leads Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Leads
                {filteredLeads.length !== leads.length && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({filteredLeads.length} of {leads.length})
                  </span>
                )}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left w-8">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={handleToggleAllLeads}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </th>
                    {([
                      { label: 'Name', field: 'name' as SortField },
                      { label: 'Email', field: null },
                      { label: 'Company', field: null },
                      { label: 'Status', field: 'status' as SortField },
                      { label: 'Service', field: null },
                      { label: 'Assigned', field: 'assigned_to' as SortField },
                      { label: 'Date', field: 'created_at' as SortField },
                      { label: 'Message', field: null },
                      { label: '', field: null },
                    ]).map(col => (
                      <th
                        key={col.label}
                        className={`px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${col.field ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                        onClick={col.field ? () => handleSort(col.field!) : undefined}
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          {col.field && <SortIcon field={col.field} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map(lead => (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-50 transition-colors ${selectedLeads.includes(lead.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleToggleLeadSelection(lead.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {lead.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800">
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                        {lead.company || <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status || 'New')}`}>
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                          {getServiceLabel(lead.service || '')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                        {lead.assigned_to || <span className="text-slate-400">Unassigned</span>}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 max-w-xs">
                        <p className="truncate" title={lead.message}>{lead.message}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
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

            {filteredLeads.length === 0 && (
              <div className="text-center py-16">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  {leads.length === 0 ? 'No leads yet' : 'No leads match your filters'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <LeadEditModal
        lead={selectedLead}
        isOpen={isEditModalOpen}
        onSave={handleSaveLead}
        onClose={() => { setSelectedLead(null); setIsEditModalOpen(false); }}
      />
    </>
  );
};

export default AdminDashboard;
