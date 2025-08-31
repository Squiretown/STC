import React, { useState } from 'react';
import { UserPlus, Filter, Trash2, X, ArrowRight } from 'lucide-react';
import type { Lead } from '../lib/supabase';

interface BulkOperationsProps {
  selectedLeads: string[];
  onBulkAssign: (assignTo: string) => Promise<void>;
  onBulkStatus: (status: string) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onClearSelection: () => void;
  teamMembers?: Array<{id: string, name: string, email: string}>;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedLeads,
  onBulkAssign,
  onBulkStatus,
  onBulkDelete,
  onClearSelection,
  teamMembers = []
}) => {
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);
  const [bulkAssignTo, setBulkAssignTo] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  const statusOptions = [
    { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
    { value: 'Converted', label: 'Converted', color: 'bg-green-100 text-green-800' },
    { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
  ];

  const handleBulkAssignSubmit = async () => {
    if (bulkAssignTo) {
      await onBulkAssign(bulkAssignTo);
      setIsBulkAssignOpen(false);
      setBulkAssignTo('');
    }
  };

  const handleBulkStatusSubmit = async () => {
    if (bulkStatus) {
      await onBulkStatus(bulkStatus);
      setIsBulkStatusOpen(false);
      setBulkStatus('');
    }
  };

  if (selectedLeads.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center mb-4 md:mb-0">
        <span className="flex items-center bg-white px-3 py-1 rounded-lg text-blue-700 font-medium text-sm mr-3">
          {selectedLeads.length}
          <ArrowRight className="h-3 w-3 mx-1" />
          {selectedLeads.length === 1 ? 'lead' : 'leads'}
        </span>
        <button
          onClick={onClearSelection}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <X className="h-3 w-3 mr-1" />
          Clear selection
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Bulk Assign */}
        <div className="relative">
          <button
            onClick={() => setIsBulkAssignOpen(!isBulkAssignOpen)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign
          </button>
          
          {isBulkAssignOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-slate-200">
              <h3 className="text-sm font-semibold mb-2">Assign to team member</h3>
              
              {teamMembers.length > 0 ? (
                <select
                  value={bulkAssignTo}
                  onChange={(e) => setBulkAssignTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.email}>
                      {member.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={bulkAssignTo}
                  onChange={(e) => setBulkAssignTo(e.target.value)}
                  placeholder="Team member name or email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsBulkAssignOpen(false)}
                  className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssignSubmit}
                  disabled={!bulkAssignTo}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded"
                >
                  Assign
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Bulk Status Update */}
        <div className="relative">
          <button
            onClick={() => setIsBulkStatusOpen(!isBulkStatusOpen)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Update Status
          </button>
          
          {isBulkStatusOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-slate-200">
              <h3 className="text-sm font-semibold mb-2">Update lead status</h3>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsBulkStatusOpen(false)}
                  className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkStatusSubmit}
                  disabled={!bulkStatus}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Bulk Delete */}
        <button
          onClick={onBulkDelete}
          className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete {selectedLeads.length > 1 ? `(${selectedLeads.length})` : ''}
        </button>
      </div>
    </div>
  );
};

export default BulkOperations;