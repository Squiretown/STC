import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getServiceLabel } from '../lib/constants';

type PageState =
  | { stage: 'loading' }
  | { stage: 'preview'; leadName: string; company: string | null; service: string | null; assignedTo: string; action: 'accept' | 'decline' }
  | { stage: 'declining'; leadName: string; assignedTo: string; token: string }
  | { stage: 'done'; action: 'accepted' | 'declined'; leadName: string; assignedTo: string }
  | { stage: 'error'; message: string };

const LeadAccept: React.FC = () => {
  const [params] = useSearchParams();
  const token  = params.get('token') ?? '';
  const action = params.get('action') as 'accept' | 'decline' | null;

  const [state, setState] = useState<PageState>({ stage: 'loading' });
  const [declineReason, setDeclineReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState({ stage: 'error', message: 'No token provided in this link.' });
      return;
    }

    supabase.rpc('get_lead_by_token', { p_token: token }).then(({ data, error }) => {
      if (error || !data) {
        setState({ stage: 'error', message: 'Could not load lead information. The link may be invalid.' });
        return;
      }

      if (!data.found) {
        setState({ stage: 'error', message: 'This invitation link is invalid or has already been used.' });
        return;
      }

      if (data.expired) {
        setState({ stage: 'error', message: 'This invitation link has expired. Please contact your admin for a new one.' });
        return;
      }

      if (data.assignment_status !== 'pending') {
        const alreadyDone = data.assignment_status === 'accepted' ? 'accepted' : 'declined';
        setState({
          stage: 'done',
          action: alreadyDone,
          leadName: data.lead_name,
          assignedTo: data.assigned_to_name ?? '',
        });
        return;
      }

      if (action === 'decline') {
        setState({
          stage: 'declining',
          leadName: data.lead_name,
          assignedTo: data.assigned_to_name ?? '',
          token,
        });
      } else {
        // action=accept or no action — show preview with both buttons
        setState({
          stage: 'preview',
          leadName: data.lead_name,
          company: data.company ?? null,
          service: data.service ?? null,
          assignedTo: data.assigned_to_name ?? '',
          action: action === 'accept' ? 'accept' : 'accept',
        });

        // Auto-submit accept if action=accept in URL
        if (action === 'accept') {
          submitResponse(token, 'accepted', null);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, action]);

  const submitResponse = async (tok: string, act: 'accepted' | 'declined', note: string | null) => {
    setSubmitting(true);
    const { data, error } = await supabase.rpc('respond_to_lead_assignment', {
      p_token:  tok,
      p_action: act,
      p_note:   note ?? undefined,
    });

    if (error || !data?.success) {
      setState({ stage: 'error', message: data?.error ?? error?.message ?? 'Something went wrong.' });
      setSubmitting(false);
      return;
    }

    setState({
      stage: 'done',
      action: act,
      leadName: data.lead_name ?? '',
      assignedTo: data.assigned_to ?? '',
    });
    setSubmitting(false);
  };

  const handleDeclineSubmit = () => {
    if (state.stage !== 'declining') return;
    submitResponse(state.token, 'declined', declineReason.trim() || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Building2 className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">Squiretown Consulting</span>
          </div>
          <p className="text-slate-500 text-sm">Lead Assignment Response</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

          {/* ── LOADING ── */}
          {state.stage === 'loading' && (
            <div className="px-8 py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Loading your lead details…</p>
            </div>
          )}

          {/* ── PREVIEW (both buttons) ── */}
          {state.stage === 'preview' && !submitting && (
            <>
              <div className="bg-blue-600 px-8 py-6 text-white text-center">
                <h1 className="text-xl font-bold mb-1">Lead Assigned to You</h1>
                <p className="text-blue-100 text-sm">Hi {state.assignedTo} — please accept or decline this lead</p>
              </div>
              <div className="px-8 py-6 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Lead Name</p>
                    <p className="text-slate-800 font-medium">{state.leadName}</p>
                  </div>
                  {state.company && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Company</p>
                      <p className="text-slate-700">{state.company}</p>
                    </div>
                  )}
                  {state.service && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Service Interest</p>
                      <p className="text-slate-700">{getServiceLabel(state.service)}</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 text-center">
                  Your response helps us serve this client promptly.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => submitResponse(token, 'accepted', null)}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Accept
                  </button>
                  <button
                    onClick={() => setState({ stage: 'declining', leadName: state.leadName, assignedTo: state.assignedTo, token })}
                    className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition-all"
                  >
                    <XCircle className="h-5 w-5" />
                    Decline
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submitting spinner overlay for preview */}
          {state.stage === 'preview' && submitting && (
            <div className="px-8 py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Processing your response…</p>
            </div>
          )}

          {/* ── DECLINE FORM ── */}
          {state.stage === 'declining' && (
            <>
              <div className="bg-red-600 px-8 py-6 text-white text-center">
                <h1 className="text-xl font-bold mb-1">Decline This Lead</h1>
                <p className="text-red-100 text-sm">"{state.leadName}"</p>
              </div>
              <div className="px-8 py-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Let us know why you're declining — this helps admins reassign appropriately.
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reason <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={declineReason}
                    onChange={e => setDeclineReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. Outside my expertise, capacity issue, conflict of interest…"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setState({ stage: 'preview', leadName: state.leadName, company: null, service: null, assignedTo: state.assignedTo, action: 'accept' })}
                    disabled={submitting}
                    className="py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDeclineSubmit}
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-60 transition-colors"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    {submitting ? 'Declining…' : 'Confirm Decline'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── DONE ── */}
          {state.stage === 'done' && (
            <div className="px-8 py-12 text-center space-y-4">
              {state.action === 'accepted' ? (
                <>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-9 w-9 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Lead Accepted!</h2>
                  <p className="text-slate-500 text-sm">
                    You've accepted <span className="font-medium text-slate-700">"{state.leadName}"</span>.
                    Expect a follow-up with full contact details soon.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="h-9 w-9 text-slate-500" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Lead Declined</h2>
                  <p className="text-slate-500 text-sm">
                    You've declined <span className="font-medium text-slate-700">"{state.leadName}"</span>.
                    The admin team will reassign this lead.
                  </p>
                </>
              )}
              <p className="text-xs text-slate-400 pt-2">You may close this window.</p>
            </div>
          )}

          {/* ── ERROR ── */}
          {state.stage === 'error' && (
            <div className="px-8 py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-9 w-9 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Unable to Process</h2>
              <p className="text-slate-500 text-sm">{state.message}</p>
              <p className="text-xs text-slate-400">
                If you believe this is an error, please contact your admin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadAccept;
