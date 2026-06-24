export const STATUS_OPTIONS = [
  { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  { value: 'Converted', label: 'Converted', color: 'bg-green-100 text-green-800' },
  { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
] as const;

export const SERVICE_OPTIONS = [
  { value: '', label: 'Not specified' },
  { value: 'brand-marketing', label: 'Brand Awareness & Marketing' },
  { value: 'ai-technology', label: 'AI Technology Stack Building' },
  { value: 'business-funding', label: 'Business Funding' },
  { value: 'title-services', label: 'Real Estate Title Services' },
  { value: 'multiple', label: 'Multiple Services' },
  { value: 'consultation', label: 'General Consultation' },
] as const;

export const ACTIVITY_TYPE_OPTIONS = [
  { value: 'call', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'demo', label: 'Demo' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'other', label: 'Other' },
] as const;

export const getStatusColor = (status: string): string => {
  const option = STATUS_OPTIONS.find(o => o.value === status);
  return option?.color ?? 'bg-slate-100 text-slate-800';
};

export const getServiceLabel = (value: string): string => {
  const option = SERVICE_OPTIONS.find(o => o.value === value);
  return option?.label ?? (value || 'General');
};

export const getActivityTypeLabel = (value: string): string => {
  const option = ACTIVITY_TYPE_OPTIONS.find(o => o.value === value);
  return option?.label ?? value;
};
