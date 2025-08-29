import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle } from 'lucide-react';
import type { Lead } from '../lib/supabase';

interface LeadEditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onSave: (leadId: string, updates: Partial<Lead>) => Promise<boolean>;
  onDelete?: (leadId: string) => Promise<boolean>;
  onClose: () => void;
}

const LeadEditModal: React.FC<LeadEditModalProps> = ({
  lead,
  isOpen,
  onSave,
  onDelete,
  onClose
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        source: lead.source || 'Website Contact Form'
      });
    }
    setError(null);
    setShowDeleteConfirm(false);
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
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Edit Lead: {lead.name}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
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

            {/* Company and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            {/* Service and Assigned To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label htmlFor="assigned_to" className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned To
                </label>
                <input
                  type="text"
                  id="assigned_to"
                  name="assigned_to"
                  value={formData.assigned_to || ''}
                  onChange={handleInputChange}
                  placeholder="Team member name or email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Source */}
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

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message || ''}
                onChange={handleInputChange}
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

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
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