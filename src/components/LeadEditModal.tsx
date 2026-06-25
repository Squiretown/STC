import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle, Calendar, MessageSquare, Plus, Check, Phone, Mail, Users, Briefcase, FileText, Clock, GitBranch, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase, fetchLeadNotes, fetchLeadActivities, fetchLeadAssignmentHistory } from '../lib/supabase';
import { STATUS_OPTIONS, SERVICE_OPTIONS, ACTIVITY_TYPE_OPTIONS, getActivityTypeLabel } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';
import type { Lead, LeadNote, LeadActivity, LeadAssignmentHistory, TeamMember } from '../lib/supabase';
import { fetchTeamMembers } from '../lib/supabase';

interface LeadEditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onSave: (leadId: string, updates: Partial<Lead>) => Promise<boolean>;
  onClose: () => void;
}

type Tab = 'details' | 'assignment' | 'activities' | 'notes';

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  'follow-up': Clock,
  demo: Briefcase,
  proposal: FileText,
  other: Calendar,
};

const LeadEditModal: React.FC<LeadEditModalProps> = ({ lead, isOpen, onSave, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Activities state
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'call',
    description: '',
    scheduled_at: '',
  });
  const [savingActivity, setSavingActivity] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Assignment state
  const [assignmentHistory, setAssignmentHistory] = useState<LeadAssignmentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showReassignForm, setShowReassignForm] = useState(false);
  const [reassignName, setReassignName] = useState('');
  const [reassignEmail, setReassignEmail] = useState('');
  const [reassignNote, setReassignNote] = useState('');
  const [reassigning, setReassigning] = useState(false);

  useEffect(() => {
    if (!lead) return;
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      company: lead.company || '',
      phone: lead.phone || '',
      service: lead.service || '',
      message: lead.message || '',
      status: lead.status || 'New',
      assigned_to: lead.assigned_to || '',
      source: lead.source || 'Website Contact Form',
    });
    setError(null);
    setFieldErrors({});
    setShowDeleteConfirm(false);
    setActiveTab('details');
  }, [lead]);

  useEffect(() => {
    if (!lead || !isOpen) return;
    if (activeTab === 'activities') {
      setLoadingActivities(true);
      fetchLeadActivities(lead.id).then(data => {
        setActivities(data);
        setLoadingActivities(false);
      });
    }
    if (activeTab === 'notes') {
      setLoadingNotes(true);
      fetchLeadNotes(lead.id).then(data => {
        setNotes(data);
        setLoadingNotes(false);
      });
    }
    if (activeTab === 'assignment') {
      setLoadingHistory(true);
      fetchLeadAssignmentHistory(lead.id).then(data => {
        setAssignmentHistory(data);
        setLoadingHistory(false);
      });
      fetchTeamMembers().then(setTeamMembers);
    }
  }, [lead, isOpen, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!lead?.id || !validate()) return;
    setIsSaving(true);
    setError(null);
    try {
      const ok = await onSave(lead.id, formData);
      if (ok) onClose();
      else setError('Failed to save changes. Please try again.');
    } catch {
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead?.id) return;
    setIsDeleting(true);
    try {
      const { error: err } = await supabase.from('leads').delete().eq('id', lead.id);
      if (err) throw err;
      onClose();
    } catch {
      setError('Failed to delete lead. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddActivity = async () => {
    if (!lead?.id || !newActivity.description.trim() || !newActivity.scheduled_at) return;
    setSavingActivity(true);
    try {
      const { data, error: err } = await supabase
        .from('lead_activities')
        .insert({
          lead_id: lead.id,
          type: newActivity.type,
          description: newActivity.description.trim(),
          scheduled_at: new Date(newActivity.scheduled_at).toISOString(),
          created_by: user?.email || 'admin',
          completed: false,
        })
        .select()
        .single();

      if (err) throw err;
      setActivities(prev => [...prev, data as LeadActivity].sort((a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      ));
      setNewActivity({ type: 'call', description: '', scheduled_at: '' });
      setShowActivityForm(false);
    } catch (err) {
      console.error('Error adding activity:', err);
    } finally {
      setSavingActivity(false);
    }
  };

  const handleCompleteActivity = async (activityId: string) => {
    const { error: err } = await supabase
      .from('lead_activities')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', activityId);

    if (!err) {
      setActivities(prev => prev.map(a =>
        a.id === activityId ? { ...a, completed: true, completed_at: new Date().toISOString() } : a
      ));
    }
  };

  const handleReassign = async () => {
    if (!lead?.id || !reassignEmail.trim() || !reassignName.trim()) return;
    setReassigning(true);
    try {
      const { error: err } = await supabase.from('leads').update({
        assigned_to:                 reassignName.trim(),
        assigned_to_email:           reassignEmail.trim(),
        assignment_status:           'pending',
        assignment_token:            null,
        assignment_token_expires_at: null,
        assignment_declined_reason:  null,
        updated_at:                  new Date().toISOString(),
      }).eq('id', lead.id);
      if (err) throw err;

      await supabase.from('lead_assignment_history').insert({
        lead_id:           lead.id,
        action:            'reassigned',
        assigned_to_name:  reassignName.trim(),
        assigned_to_email: reassignEmail.trim(),
        performed_by:      user?.email ?? 'admin',
        note:              reassignNote.trim() || null,
      });

      const updatedHistory = await fetchLeadAssignmentHistory(lead.id);
      setAssignmentHistory(updatedHistory);
      setShowReassignForm(false);
      setReassignName('');
      setReassignEmail('');
      setReassignNote('');
    } catch (e) {
      console.error('Reassign failed:', e);
    } finally {
      setReassigning(false);
    }
  };

  const handleAdminRespond = async (act: 'accepted' | 'declined') => {
    if (!lead?.id) return;
    setReassigning(true);
    try {
      await supabase.from('leads').update({
        assignment_status:  act,
        assignment_token:   null,
        updated_at:         new Date().toISOString(),
      }).eq('id', lead.id);

      // Lookup team_member_id by matching email
      const tm = teamMembers.find(m => m.email === lead.assigned_to_email);

      await supabase.from('lead_assignment_history').insert({
        lead_id:           lead.id,
        action:            act,
        assigned_to_name:  lead.assigned_to,
        assigned_to_email: lead.assigned_to_email,
        team_member_id:    tm?.id ?? null,
        performed_by:      user?.email ?? 'admin',
      });

      const updatedHistory = await fetchLeadAssignmentHistory(lead.id);
      setAssignmentHistory(updatedHistory);
    } catch (e) {
      console.error('Admin respond failed:', e);
    } finally {
      setReassigning(false);
    }
  };

  const handleAddNote = async () => {
    if (!lead?.id || !newNote.trim()) return;
    setSavingNote(true);
    try {
      const { data, error: err } = await supabase
        .from('lead_notes')
        .insert({
          lead_id: lead.id,
          content: newNote.trim(),
          created_by: user?.email || 'admin',
        })
        .select()
        .single();

      if (err) throw err;
      setNotes(prev => [data as LeadNote, ...prev]);
      setNewNote('');
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  if (!isOpen || !lead) return null;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'assignment', label: 'Assignment', icon: GitBranch },
    { id: 'activities', label: 'Appointments', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
  ];

  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 sm:p-0">
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 transition-opacity" onClick={onClose} />

        <div className="relative inline-block bg-white rounded-xl shadow-2xl w-full sm:max-w-2xl text-left overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{lead.name}</h3>
              <p className="text-sm text-slate-500">{lead.email}</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
            {/* ── DETAILS TAB ── */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.name ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.email ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 555 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
                    <select
                      name="service"
                      value={formData.service || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'New'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                    <input
                      type="text"
                      name="assigned_to"
                      value={formData.assigned_to || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Team member name or email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {showDeleteConfirm && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-red-800 font-medium text-sm">Delete this lead?</span>
                    </div>
                    <p className="text-red-700 text-sm mb-3">This action cannot be undone.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── ASSIGNMENT TAB ── */}
            {activeTab === 'assignment' && (
              <div className="space-y-4">
                {/* Current assignment status */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-blue-600" /> Current Assignment
                  </h4>
                  {lead.assigned_to ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Assignee</p>
                        <p className="font-medium text-slate-800">{lead.assigned_to}</p>
                        {lead.assigned_to_email && (
                          <p className="text-xs text-slate-500">{lead.assigned_to_email}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Status</p>
                        {!lead.assignment_status && <p className="text-slate-500">—</p>}
                        {lead.assignment_status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        )}
                        {lead.assignment_status === 'accepted' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                            <CheckCircle className="h-3 w-3" /> Accepted
                          </span>
                        )}
                        {lead.assignment_status === 'declined' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            <XCircle className="h-3 w-3" /> Declined
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No assignee yet.</p>
                  )}

                  {/* Declined reason */}
                  {lead.assignment_status === 'declined' && lead.assignment_declined_reason && (
                    <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700">
                      <span className="font-semibold">Reason: </span>{lead.assignment_declined_reason}
                    </div>
                  )}

                  {/* Admin accept/decline for pending leads */}
                  {lead.assignment_status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleAdminRespond('accepted')}
                        disabled={reassigning}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Accept on behalf
                      </button>
                      <button
                        onClick={() => handleAdminRespond('declined')}
                        disabled={reassigning}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Decline on behalf
                      </button>
                    </div>
                  )}
                </div>

                {/* Reassign panel */}
                <div>
                  {!showReassignForm ? (
                    <button
                      onClick={() => setShowReassignForm(true)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {lead.assigned_to ? 'Reassign Lead' : 'Assign Lead'}
                    </button>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                      <p className="text-sm font-medium text-blue-800">Reassign Lead</p>
                      {teamMembers.length > 0 && (
                        <select
                          value=""
                          onChange={e => {
                            const m = teamMembers.find(t => t.id === e.target.value);
                            if (m) { setReassignName(m.name); setReassignEmail(m.email); }
                          }}
                          className="w-full px-2 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pick from team…</option>
                          {teamMembers.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                          ))}
                        </select>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={reassignName}
                          onChange={e => setReassignName(e.target.value)}
                          placeholder="Name"
                          className="px-2 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="email"
                          value={reassignEmail}
                          onChange={e => setReassignEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="px-2 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        value={reassignNote}
                        onChange={e => setReassignNote(e.target.value)}
                        placeholder="Reason for reassignment (optional)"
                        className="w-full px-2 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleReassign}
                          disabled={reassigning || !reassignName.trim() || !reassignEmail.trim()}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {reassigning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          {reassigning ? 'Reassigning…' : 'Reassign'}
                        </button>
                        <button
                          onClick={() => { setShowReassignForm(false); setReassignName(''); setReassignEmail(''); }}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* History */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Assignment History</h4>
                  {loadingHistory ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto" />
                    </div>
                  ) : assignmentHistory.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">No assignment history yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {assignmentHistory.map(h => (
                        <div key={h.id} className="flex items-start gap-3 text-sm">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            h.action === 'accepted' ? 'bg-emerald-100' :
                            h.action === 'declined' ? 'bg-red-100' :
                            h.action === 'reminder_sent' ? 'bg-amber-100' :
                            'bg-blue-100'
                          }`}>
                            {h.action === 'accepted' && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                            {h.action === 'declined' && <XCircle className="h-3.5 w-3.5 text-red-600" />}
                            {h.action === 'reminder_sent' && <Clock className="h-3.5 w-3.5 text-amber-600" />}
                            {(h.action === 'assigned' || h.action === 'reassigned') && <GitBranch className="h-3.5 w-3.5 text-blue-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-700 capitalize">
                              {h.action.replace('_', ' ')}
                              {h.assigned_to_name && ` → ${h.assigned_to_name}`}
                            </p>
                            {h.note && <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>}
                            <p className="text-xs text-slate-400 mt-0.5">
                              {h.performed_by} · {new Date(h.created_at).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ACTIVITIES TAB ── */}
            {activeTab === 'activities' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-800">Scheduled Appointments</h4>
                  <button
                    onClick={() => setShowActivityForm(!showActivityForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule
                  </button>
                </div>

                {showActivityForm && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                        <select
                          value={newActivity.type}
                          onChange={e => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {ACTIVITY_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Date & Time *</label>
                        <input
                          type="datetime-local"
                          value={newActivity.scheduled_at}
                          min={minDateTime}
                          onChange={e => setNewActivity(prev => ({ ...prev, scheduled_at: e.target.value }))}
                          className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
                      <input
                        type="text"
                        value={newActivity.description}
                        onChange={e => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What is this appointment for?"
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleAddActivity}
                        disabled={savingActivity || !newActivity.description.trim() || !newActivity.scheduled_at}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingActivity ? 'Saving...' : 'Save Appointment'}
                      </button>
                      <button
                        onClick={() => setShowActivityForm(false)}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {loadingActivities ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Calendar className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No appointments scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map(activity => {
                      const Icon = ACTIVITY_ICONS[activity.type] || Calendar;
                      const isPast = new Date(activity.scheduled_at) < new Date();
                      return (
                        <div
                          key={activity.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${
                            activity.completed
                              ? 'bg-green-50 border-green-100'
                              : isPast
                              ? 'bg-amber-50 border-amber-100'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            activity.completed ? 'bg-green-100' : isPast ? 'bg-amber-100' : 'bg-blue-100'
                          }`}>
                            <Icon className={`h-4 w-4 ${activity.completed ? 'text-green-600' : isPast ? 'text-amber-600' : 'text-blue-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-slate-800">{activity.description}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                activity.completed ? 'bg-green-100 text-green-700' : isPast ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {getActivityTypeLabel(activity.type)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {new Date(activity.scheduled_at).toLocaleString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                              {activity.completed && activity.completed_at && (
                                <span className="text-green-600 ml-2">
                                  · Completed {new Date(activity.completed_at).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                          </div>
                          {!activity.completed && (
                            <button
                              onClick={() => handleCompleteActivity(activity.id)}
                              className="flex-shrink-0 p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark complete"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── NOTES TAB ── */}
            {activeTab === 'notes' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Add Note</label>
                  <textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    rows={3}
                    placeholder="Add a note about this lead..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={savingNote || !newNote.trim()}
                    className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {savingNote ? 'Saving...' : 'Add Note'}
                  </button>
                </div>

                {loadingNotes ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No notes yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notes.map(note => (
                      <div key={note.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-sm text-slate-800 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {note.created_by} · {new Date(note.created_at).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'details' && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Lead
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadEditModal;
