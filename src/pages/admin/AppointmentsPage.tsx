import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Check, ChevronLeft, ChevronRight, Phone, Mail, Users, Briefcase, FileText, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getActivityTypeLabel } from '../../lib/constants';
import LeadEditModal from '../../components/LeadEditModal';
import { useLeads } from '../../hooks/useLeads';
import type { LeadActivity, Lead } from '../../lib/supabase';

interface ActivityWithLead extends LeadActivity {
  lead?: Lead;
}

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  'follow-up': Clock,
  demo: Briefcase,
  proposal: FileText,
  other: Calendar,
};

type ViewMode = 'upcoming' | 'all' | 'completed';

const AppointmentsPage: React.FC = () => {
  const { leads, updateLead } = useLeads();
  const [activities, setActivities] = useState<ActivityWithLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('upcoming');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchAllActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_activities')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      const withLeads = (data || []).map(activity => ({
        ...activity,
        lead: leads.find(l => l.id === activity.lead_id),
      }));
      setActivities(withLeads);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leads.length >= 0) {
      fetchAllActivities();
    }
  }, [leads]);

  const handleComplete = async (activityId: string) => {
    const { error } = await supabase
      .from('lead_activities')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', activityId);

    if (!error) {
      setActivities(prev => prev.map(a =>
        a.id === activityId
          ? { ...a, completed: true, completed_at: new Date().toISOString() }
          : a
      ));
    }
  };

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const filtered = useMemo(() => {
    const now = new Date();
    if (viewMode === 'upcoming') return activities.filter(a => !a.completed && new Date(a.scheduled_at) >= now);
    if (viewMode === 'completed') return activities.filter(a => a.completed);
    return activities;
  }, [activities, viewMode]);

  const overdue = useMemo(() =>
    activities.filter(a => !a.completed && new Date(a.scheduled_at) < new Date()),
  [activities]);

  // Group upcoming by date
  const groupedByDate = useMemo(() => {
    if (viewMode !== 'upcoming') return null;
    const groups: Record<string, ActivityWithLead[]> = {};
    filtered.forEach(a => {
      const dateKey = new Date(a.scheduled_at).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(a);
    });
    return groups;
  }, [filtered, viewMode]);

  const totalUpcoming = activities.filter(a => !a.completed && new Date(a.scheduled_at) >= new Date()).length;
  const totalCompleted = activities.filter(a => a.completed).length;

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Appointments</h1>
            <p className="text-slate-500">Scheduled calls, meetings, and follow-ups across all leads</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Upcoming', value: totalUpcoming, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Overdue', value: overdue.length, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Completed', value: totalCompleted, color: 'text-green-600', bg: 'bg-green-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center border border-slate-100`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Overdue alert */}
          {overdue.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium text-sm">
                  {overdue.length} overdue appointment{overdue.length !== 1 ? 's' : ''}
                </p>
                <p className="text-amber-700 text-xs mt-0.5">
                  These are past their scheduled time and have not been marked complete.
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 mb-6 w-fit">
            {(['upcoming', 'all', 'completed'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
                  viewMode === mode ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No {viewMode} appointments</p>
              <p className="text-slate-400 text-sm mt-1">
                Open a lead and schedule an appointment from the Appointments tab.
              </p>
            </div>
          ) : viewMode === 'upcoming' && groupedByDate ? (
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([date, items]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-sm font-semibold">{date}</span>
                    </div>
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400">{items.length} appt{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onComplete={handleComplete}
                        onOpenLead={handleOpenLead}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onComplete={handleComplete}
                  onOpenLead={handleOpenLead}
                  showDate
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LeadEditModal
        lead={selectedLead}
        isOpen={isEditModalOpen}
        onSave={async (id, updates) => updateLead(id, updates)}
        onClose={() => { setSelectedLead(null); setIsEditModalOpen(false); }}
      />
    </>
  );
};

interface ActivityCardProps {
  activity: ActivityWithLead;
  onComplete: (id: string) => void;
  onOpenLead: (lead: Lead) => void;
  showDate?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onComplete, onOpenLead, showDate }) => {
  const Icon = ACTIVITY_ICONS[activity.type] || Calendar;
  const isPast = !activity.completed && new Date(activity.scheduled_at) < new Date();
  const isToday = (() => {
    const d = new Date(activity.scheduled_at);
    const n = new Date();
    return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  })();

  return (
    <div className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-colors ${
      activity.completed ? 'border-green-100 opacity-70' : isPast ? 'border-amber-200' : isToday ? 'border-blue-200' : 'border-slate-200'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        activity.completed ? 'bg-green-100' : isPast ? 'bg-amber-100' : isToday ? 'bg-blue-100' : 'bg-slate-100'
      }`}>
        <Icon className={`h-5 w-5 ${
          activity.completed ? 'text-green-600' : isPast ? 'text-amber-600' : isToday ? 'text-blue-600' : 'text-slate-500'
        }`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-800">{activity.description}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            activity.completed ? 'bg-green-100 text-green-700' : isPast ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
          }`}>
            {getActivityTypeLabel(activity.type)}
          </span>
          {isToday && !activity.completed && (
            <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-blue-600 text-white">Today</span>
          )}
          {isPast && <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700">Overdue</span>}
        </div>

        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
          {showDate ? (
            <span>
              {new Date(activity.scheduled_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          ) : (
            <span>
              {new Date(activity.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {activity.lead && (
            <button
              onClick={() => onOpenLead(activity.lead!)}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              {activity.lead.name}
              {activity.lead.company ? ` · ${activity.lead.company}` : ''}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {activity.lead && (
          <button
            onClick={() => onOpenLead(activity.lead!)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
            title="Open lead"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
        {!activity.completed && (
          <button
            onClick={() => onComplete(activity.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            Done
          </button>
        )}
        {activity.completed && (
          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
            <Check className="h-3.5 w-3.5" />
            Completed
          </span>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
