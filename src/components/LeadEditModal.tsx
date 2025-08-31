import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle, UserPlus, Calendar, MessageSquare, Phone, Mail } from 'lucide-react';
import type { Lead } from '../lib/supabase';

interface LeadEditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onSave: (leadId: string, updates: Partial<Lead>) => Promise<boolean>;
  onDelete?: (leadId: string) => Promise<boolean>;
  onClose: () => void;
  teamMembers?: Array<{id: string, name: string, email: string}>;
}

const LeadEditModal: React.FC<LeadEditModalProps> = ({
  lead,
  isOpen,
  onSave,
  onDelete,
  onClose,
  teamMembers = []
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'activity'>('details');
  const [leadNote, setLeadNote] = useState('');
  const [leadNotes, setLeadNotes] = useState<Array<{id: string, content: string, created_at: string, created_by: string}>>([]);
  const [plannedActivities, setPlannedActivities] = useState<Array<{id: string, type: string, date: string, description: string, completed: boolean}>>([]);
  const [newActivity, setNewActivity] = useState({
    type: 'call',
    date: new Date().toISOString().split('T')[0],
    description: '',
    completed: false
  });

  const statusOptions = [
    { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
    { value: 'Converted', label: 'Converted', color: 'bg-green-100 text-green-800' },
    { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
  ];

  const serviceOptions = [
    { value: '', label: 'Not specified' },
    { value: 'brand-marketing', label: 'Brand Awareness & Marketing' },
    { value: 'ai-technology', label: 'AI Technology Stack Building' },
    { value: 'business-funding', label: 'Business Funding' },
    { value: 'title-services', label: 'Real Estate Title Services' },
    { value: 'multiple', label: 'Multiple Services' },
    { value: 'consultation', label: 'General Consultation' }
  ];

  const activityTypeOptions = [
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'meeting', label: 'Meeting', icon: Calendar },
    { value: 'followup', label: 'Follow Up', icon: MessageSquare }
  ];

  // Initialize form data when lead changes
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        company: lead.company || '',
        service: lead.service || '',
        message: lead.message || '',
        status: lead.status || 'New',
        assigned_to: lead.assigned_to || '',
        source: lead.source || 'Website Contact Form',
        phone: lead.phone || '',
        tags: lead.tags || []
      });

      // Fake data for demonstration
      // In a real app, these would be fetched from your database
      setLeadNotes([
        {
          id: '1',
          content: 'Initial contact made via email. Client expressed interest in AI solutions.',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: 'John Smith'
        },
        {
          id: '2',
          content: 'Follow-up call scheduled for next week.',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: 'John Smith'
        }
      ]);
      
      setPlannedActivities([
        {
          id: '1',
          type: 'call',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Initial discovery call to understand client needs',
          completed: false
        },
        {
          id: '2',
          type: 'email',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Send proposal based on discovery call',
          completed: false
        }
      ]);
    }
    setError(null);
    setShowDeleteConfirm(false);
    setActiveTab('details');
    setLeadNote('');
  }, [lead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!lead?.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const success = await onSave(lead.id, formData);
      if (success) {
        onClose();
      } else {
        setError('Failed to save changes. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead?.id || !onDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const success = await onDelete(lead.id);
      if (success) {
        onClose();
      } else {
        setError('Failed to delete lead. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred while deleting.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddNote = () => {
    if (!leadNote.trim()) return;
    
    // In a real app, you would save this note to your database
    const newNote = {
      id: `note-${Date.now()}`,
      content: leadNote,
      created_at: new Date().toISOString(),
      created_by: 'Current User' // Replace with actual logged-in user
    };
    
    setLeadNotes(prev => [newNote, ...prev]);
    setLeadNote('');
  };

  const handleAddActivity = () => {
    if (!newActivity.description.trim()) return;
    
    // In a real app, you would save this activity to your database
    const activity = {
      id: `activity-${Date.now()}`,
      ...newActivity
    };
    
    setPlannedActivities(prev => [...prev, activity]);
    setNewActivity({
      type: 'call',
      date: new Date().toISOString().split('T')[0],
      description: '',
      completed: false
    });
  };

  const handleToggleActivityStatus = (activityId: string) => {
    setPlannedActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, completed: !activity.completed } 
          : activity
      )
    );
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-slate-100 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              {lead.name} <span className="text-sm font-normal text-slate-500">({lead.email})</span>
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Lead Details
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Planned Activities
              </button>
            </nav>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg m-6 p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Tab content */}
          <div className="px-6 py-4">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Phone and Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status and Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || 'New'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assigned To and Source */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="assigned_to" className="block text-sm font-medium text-slate-700 mb-2">
                      Assigned To
                    </label>
                    <select
                      id="assigned_to"
                      name="assigned_to"
                      value={formData.assigned_to || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Unassigned</option>
                      {teamMembers.length > 0 ? (
                        teamMembers.map(member => (
                          <option key={member.id} value={member.email}>
                            {member.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="john.smith@example.com">John Smith</option>
                          <option value="emily.jones@example.com">Emily Jones</option>
                          <option value="david.wilson@example.com">David Wilson</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="source" className="block text-sm font-medium text-slate-700 mb-2">
                      Lead Source
                    </label>
                    <input
                      type="text"
                      id="source"
                      name="source"
                      value={formData.source || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Initial Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    placeholder="Separate tags with commas"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                    onChange={(e) => {
                      const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      setFormData(prev => ({ ...prev, tags: tagsArray }));
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Lead Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Lead Information</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>ID:</strong> {lead.id}</p>
                    <p><strong>Created:</strong> {lead.created_at ? new Date(lead.created_at).toLocaleString() : 'N/A'}</p>
                    <p><strong>Updated:</strong> {lead.updated_at ? new Date(lead.updated_at).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div>
                {/* Add Note */}
                <div className="mb-6">
                  <label htmlFor="new-note" className="block text-sm font-medium text-slate-700 mb-2">
                    Add a Note
                  </label>
                  <textarea
                    id="new-note"
                    rows={3}
                    value={leadNote}
                    onChange={(e) => setLeadNote(e.target.value)}
                    placeholder="Enter notes about this lead..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!leadNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm font-medium"
                  >
                    Add Note
                  </button>
                </div>

                {/* Notes List */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-700">Notes History</h4>
                  
                  {leadNotes.length === 0 ? (
                    <p className="text-slate-500 italic">No notes yet. Add your first note above.</p>
                  ) : (
                    leadNotes.map(note => (
                      <div key={note.id} className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-800 mb-2">{note.content}</p>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>By: {note.created_by}</span>
                          <span>{new Date(note.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                {/* Add Activity */}
                <div className="mb-6 bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-3">Schedule New Activity</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label htmlFor="activity-type" className="block text-sm font-medium text-slate-700 mb-1">
                        Activity Type
                      </label>
                      <select
                        id="activity-type"
                        value={newActivity.type}
                        onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {activityTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="activity-date" className="block text-sm font-medium text-slate-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        id="activity-date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:row-span-2">
                      <label htmlFor="activity-description" className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="activity-description"
                        rows={3}
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                        placeholder="What needs to be done?"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-full"
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex items-end">
                      <button
                        onClick={handleAddActivity}
                        disabled={!newActivity.description.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm font-medium"
                      >
                        Schedule Activity
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activities List */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-700">Planned Activities</h4>
                  
                  {plannedActivities.length === 0 ? (
                    <p className="text-slate-500 italic">No activities scheduled. Plan your first activity above.</p>
                  ) : (
                    <div className="space-y-3">
                      {plannedActivities.map(activity => {
                        const ActivityIcon = activityTypeOptions.find(opt => opt.value === activity.type)?.icon || Calendar;
                        
                        return (
                          <div 
                            key={activity.id} 
                            className={`p-4 rounded-lg border ${
                              activity.completed 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`p-2 rounded-full mr-3 ${
                                activity.completed ? 'bg-green-100' : 'bg-slate-100'
                              }`}>
                                <ActivityIcon className="h-5 w-5 text-slate-600" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className={`font-medium ${
                                      activity.completed ? 'text-slate-500 line-through' : 'text-slate-800'
                                    }`}>
                                      {activityTypeOptions.find(opt => opt.value === activity.type)?.label || 'Activity'}
                                    </h5>
                                    <p className={`text-sm ${
                                      activity.completed ? 'text-slate-400 line-through' : 'text-slate-600'
                                    }`}>
                                      {activity.description}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      new Date(activity.date) < new Date() && !activity.completed
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-2 flex justify-end">
                                  <button
                                    onClick={() => handleToggleActivityStatus(activity.id)}
                                    className={`text-xs font-medium px-3 py-1 rounded ${
                                      activity.completed
                                        ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                                  >
                                    {activity.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
            {/* Delete button */}
            {onDelete && (
              <div>
                {showDeleteConfirm ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Confirm deletion?</span>
                    </div>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-red-400"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 bg-slate-300 text-slate-700 text-sm rounded hover:bg-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Lead
                  </button>
                )}
              </div>
            )}

            {/* Save and Cancel buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors duration-200"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadEditModal;