import React, { useState } from 'react';
import { UserPlus, Filter, Trash2, X } from 'lucide-react';
import { STATUS_OPTIONS } from '../lib/constants';
import type { TeamMember } from '../lib/supabase';

interface BulkOperationsProps {
  selectedLeads: string[];
  onBulkAssign: (assignTo: string) => Promise<void>;
  onBulkStatus: (status: string) => Promise<void>;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  teamMembers?: TeamMember[];
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedLeads,
  onBulkAssign,
  onBulkStatus,
  onBulkDelete,
  onClearSelection,
  teamMembers = [],
}) => {
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);
  const [bulkAssignTo, setBulkAssignTo] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleBulkAssignSubmit = async () => {
    if (!bulkAssignTo) return;
    setIsAssigning(true);
    try {
      await onBulkAssign(bulkAssignTo);
      setIsBulkAssignOpen(false);
      setBulkAssignTo('');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleBulkStatusSubmit = async () => {
    if (!bulkStatus) return;
    setIsUpdatingStatus(true);
    try {
      await onBulkStatus(bulkStatus);
      setIsBulkStatusOpen(false);
      setBulkStatus('');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (selectedLeads.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="bg-blue-600 text-white text-sm font-semibold px-2.5 py-1 rounded-full">
          {selectedLeads.length}
        </span>
        <span className="text-blue-800 text-sm font-medium">
          {selectedLeads.length === 1 ? 'lead selected' : 'leads selected'}
        </span>
        <button
          onClick={onClearSelection}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Bulk Assign */}
        <div className="relative">
          <button
            onClick={() => { setIsBulkAssignOpen(!isBulkAssignOpen); setIsBulkStatusOpen(false); }}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Assign
          </button>

          {isBulkAssignOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20 p-4 border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-2">Assign to team member</p>
              {teamMembers.length > 0 ? (
                <select
                  value={bulkAssignTo}
                  onChange={e => setBulkAssignTo(e.target.value)}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.email}>{m.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={bulkAssignTo}
                  onChange={e => setBulkAssignTo(e.target.value)}
                  placeholder="Name or email"
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsBulkAssignOpen(false)} className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                <button
                  onClick={handleBulkAssignSubmit}
                  disabled={!bulkAssignTo || isAssigning}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
                >
                  {isAssigning ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Status */}
        <div className="relative">
          <button
            onClick={() => { setIsBulkStatusOpen(!isBulkStatusOpen); setIsBulkAssignOpen(false); }}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            Update Status
          </button>

          {isBulkStatusOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 p-4 border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-2">Update status</p>
              <select
                value={bulkStatus}
                onChange={e => setBulkStatus(e.target.value)}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsBulkStatusOpen(false)} className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                <button
                  onClick={handleBulkStatusSubmit}
                  disabled={!bulkStatus || isUpdatingStatus}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Delete */}
        <button
          onClick={onBulkDelete}
          className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 inline-flex items-center gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete {selectedLeads.length > 1 ? `(${selectedLeads.length})` : ''}
        </button>
      </div>
    </div>
  );
};

export default BulkOperations;
