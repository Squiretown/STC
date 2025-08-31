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

  // Status options - safe to include regardless of current schema
  const statusOptions = [
    { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
    { value: 'Converted', label: 'Converted', color: 'bg-green-100 text-green-800' },
    { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
  ];

  // Service options - safe to include regardless of current schema
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
      // Use optional chaining to safely access properties that might not exist in schema
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
      // Remove any properties that might not exist in the schema to avoid errors
      const safeUpdates: Partial<Lead> = {};
      const requiredFields = ['name', 'email']; // Fields we know must exist
      
      // Only include fields that have values and either are required or exist in the original lead
      Object.entries(formData).forEach(([key, value]) => {
        if (
          (value !== undefined && value !== null) && // Has a value
          (requiredFields.includes(key) || key in lead) // Is required or exists in lead
        ) {
          safeUpdates[key as keyof Lead] = value;
        }
      });

      const success = await onSave(lead.id, safeUpdates);
      if (success) {
        onClose();
      } else {
        setError('Failed to save changes. Please check if all fields in your form are supported by the database schema.');
      }
    } catch (err) {
      setError('An unexpected error occurred while saving. Please check your database schema.');
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
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              
              {error.includes('schema') && (
                <div className="mt-2 text-xs text-red-600">
                  <p>It appears your database may be missing required columns. Please run the database schema update SQL to add the necessary columns.</p>
                </div>
              )}
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
                  id="nameimport React, { useState, useEffect } from 'react';
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

  // Status options - safe to include regardless of current schema
  const statusOptions = [
    { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
    { value: 'Converted', label: 'Converted', color: 'bg-green-100 text-green-800' },
    { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
  ];

  // Service options - safe to include regardless of current schema
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
      // Use optional chaining to safely access properties that might not exist in schema
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
      // Remove any properties that might not exist in the schema to avoid errors
      const safeUpdates: Partial<Lead> = {};
      const requiredFields = ['name', 'email']; // Fields we know must exist
      
      // Only include fields that have values and either are required or exist in the original lead
      Object.entries(formData).forEach(([key, value]) => {
        if (
          (value !== undefined && value !== null) && // Has a value
          (requiredFields.includes(key) || key in lead) // Is required or exists in lead
        ) {
          safeUpdates[key as keyof Lead] = value;
        }
      });

      const success = await onSave(lead.id, safeUpdates);
      if (success) {
        onClose();
      } else {
        setError('Failed to save changes. Please check if all fields in your form are supported by the database schema.');
      }
    } catch (err) {
      setError('An unexpected error occurred while saving. Please check your database schema.');
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