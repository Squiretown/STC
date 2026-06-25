import React, { useState } from 'react';
import { GitBranch, Plus, Trash2, ChevronUp, ChevronDown, ToggleLeft, ToggleRight, CreditCard as Edit2, X, Check, AlertCircle, Mail, User, Info } from 'lucide-react';
import { useRoutingRules, RoutingRule, RuleCondition, RoutingRuleInput } from '../../hooks/useRoutingRules';
import { SERVICE_OPTIONS } from '../../lib/constants';
import { fetchTeamMembers } from '../../lib/supabase';
import type { TeamMember } from '../../lib/supabase';

const FIELD_OPTIONS = [
  { value: 'service', label: 'Service Interest' },
  { value: 'source', label: 'Lead Source' },
  { value: 'any', label: 'Any (catch-all)' },
] as const;

const OPERATOR_OPTIONS: Record<string, { value: string; label: string }[]> = {
  service: [
    { value: 'equals', label: 'equals' },
    { value: 'contains', label: 'contains' },
  ],
  source: [
    { value: 'equals', label: 'equals' },
    { value: 'contains', label: 'contains' },
  ],
  any: [{ value: 'any', label: 'always matches' }],
};

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'phone', label: 'Phone' },
  { value: 'other', label: 'Other' },
];

const EMPTY_CONDITION: RuleCondition = { field: 'service', operator: 'equals', value: '' };

const EMPTY_RULE: Omit<RoutingRuleInput, 'assign_to_name' | 'assign_to_email'> = {
  name: '',
  priority: 100,
  active: true,
  conditions: [{ ...EMPTY_CONDITION }],
  notify_emails: [],
};

interface RuleFormProps {
  initial?: Partial<RoutingRule>;
  teamMembers: TeamMember[];
  onSave: (data: RoutingRuleInput) => Promise<void>;
  onCancel: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ initial, teamMembers, onSave, onCancel }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [priority, setPriority] = useState(initial?.priority ?? 100);
  const [active, setActive] = useState(initial?.active ?? true);
  const [conditions, setConditions] = useState<RuleCondition[]>(
    initial?.conditions?.length ? initial.conditions : [{ ...EMPTY_CONDITION }]
  );
  const [assignToName, setAssignToName] = useState(initial?.assign_to_name ?? '');
  const [assignToEmail, setAssignToEmail] = useState(initial?.assign_to_email ?? '');
  const [notifyEmailsRaw, setNotifyEmailsRaw] = useState(
    (initial?.notify_emails ?? []).join(', ')
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleTeamMemberSelect = (memberId: string) => {
    const m = teamMembers.find(t => t.id === memberId);
    if (m) {
      setAssignToName(m.name);
      setAssignToEmail(m.email);
    }
  };

  const addCondition = () => {
    setConditions(prev => [...prev, { ...EMPTY_CONDITION }]);
  };

  const removeCondition = (i: number) => {
    setConditions(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateCondition = (i: number, updates: Partial<RuleCondition>) => {
    setConditions(prev => prev.map((c, idx) => {
      if (idx !== i) return c;
      const updated = { ...c, ...updates };
      if (updates.field) {
        updated.operator = OPERATOR_OPTIONS[updates.field][0].value as RuleCondition['operator'];
        updated.value = '';
      }
      return updated;
    }));
  };

  const validate = () => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Rule name is required');
    if (!assignToEmail.trim()) errs.push('Assignee is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignToEmail)) errs.push('Assignee email is invalid');
    conditions.forEach((c, i) => {
      if (c.field !== 'any' && c.operator !== 'any' && !c.value.trim()) {
        errs.push(`Condition ${i + 1}: value is required`);
      }
    });
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }

    const notifyEmails = notifyEmailsRaw
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    setSaving(true);
    await onSave({
      name: name.trim(),
      priority,
      active,
      conditions,
      assign_to_name: assignToName.trim(),
      assign_to_email: assignToEmail.trim(),
      notify_emails: notifyEmails,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((e, i) => (
            <p key={i} className="text-red-600 text-sm flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{e}
            </p>
          ))}
        </div>
      )}

      {/* Name + priority */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Rule Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. AI leads → Sarah"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
          <input
            type="number"
            value={priority}
            onChange={e => setPriority(Number(e.target.value))}
            min={1}
            max={999}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1">Lower = evaluated first</p>
        </div>
      </div>

      {/* Conditions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Conditions</label>
          <button
            type="button"
            onClick={addCondition}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Add condition
          </button>
        </div>
        <div className="space-y-2">
          {conditions.map((cond, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              {/* Field */}
              <select
                value={cond.field}
                onChange={e => updateCondition(i, { field: e.target.value as RuleCondition['field'] })}
                className="flex-shrink-0 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {FIELD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              {/* Operator */}
              {cond.field !== 'any' && (
                <select
                  value={cond.operator}
                  onChange={e => updateCondition(i, { operator: e.target.value as RuleCondition['operator'] })}
                  className="flex-shrink-0 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {(OPERATOR_OPTIONS[cond.field] || []).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}

              {/* Value */}
              {cond.field !== 'any' && (
                cond.field === 'service' ? (
                  <select
                    value={cond.value}
                    onChange={e => updateCondition(i, { value: e.target.value })}
                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select service...</option>
                    {SERVICE_OPTIONS.filter(o => o.value).map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={cond.value}
                    onChange={e => updateCondition(i, { value: e.target.value })}
                    className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select source...</option>
                    {SOURCE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                )
              )}

              {cond.field === 'any' && (
                <span className="flex-1 px-2 py-1.5 text-sm text-slate-500 italic">
                  Matches all leads (catch-all)
                </span>
              )}

              {conditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCondition(i)}
                  className="flex-shrink-0 p-1 text-slate-400 hover:text-red-500 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1">All conditions must match (AND logic). Use catch-all for a default fallback.</p>
      </div>

      {/* Assign to */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <User className="h-4 w-4 inline mr-1" />Assign to
        </label>
        {teamMembers.length > 0 && (
          <select
            value=""
            onChange={e => handleTeamMemberSelect(e.target.value)}
            className="w-full mb-2 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pick from team members...</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
            ))}
          </select>
        )}
        <div className="grid grid-cols-2 gap-3">
          <input
            value={assignToName}
            onChange={e => setAssignToName(e.target.value)}
            placeholder="Full name"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            value={assignToEmail}
            onChange={e => setAssignToEmail(e.target.value)}
            placeholder="email@example.com"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* CC emails */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          <Mail className="h-4 w-4 inline mr-1" />Also notify (CC)
        </label>
        <input
          value={notifyEmailsRaw}
          onChange={e => setNotifyEmailsRaw(e.target.value)}
          placeholder="email1@example.com, email2@example.com"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-slate-400 mt-1">Comma-separated. These people get a copy of the lead notification.</p>
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActive(v => !v)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${active ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${active ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
        <span className="text-sm text-slate-700">{active ? 'Rule is active' : 'Rule is inactive'}</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save Rule'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const RoutingRulesEditor: React.FC = () => {
  const { rules, loading, error, createRule, updateRule, deleteRule, toggleActive } = useRoutingRules();
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  React.useEffect(() => {
    fetchTeamMembers().then(setTeamMembers);
  }, []);

  const handleCreate = async (data: RoutingRuleInput) => {
    await createRule(data);
    setShowCreate(false);
  };

  const handleUpdate = async (id: string, data: RoutingRuleInput) => {
    await updateRule(id, data);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteRule(id);
    setDeletingId(null);
  };

  const renderConditionSummary = (rule: RoutingRule) => {
    if (!rule.conditions.length) return <span className="text-slate-400 italic">No conditions</span>;
    return rule.conditions.map((c, i) => {
      if (c.field === 'any') return <span key={i} className="text-emerald-700 font-medium">All leads</span>;
      const fieldLabel = FIELD_OPTIONS.find(f => f.value === c.field)?.label ?? c.field;
      return (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-slate-400">AND</span>}
          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-700">
            {fieldLabel} {c.operator} "{c.value}"
          </span>
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-blue-600" />
            Lead Routing Rules
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Automatically assign incoming leads to team members based on conditions.
            Rules are evaluated in priority order — first match wins.
          </p>
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Rule
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">How routing works</p>
          <p>When a new lead is submitted, the edge function evaluates rules top-to-bottom. The first matching rule assigns the lead and sends the notification email to the assignee. Unmatched leads still go to the default admin email.</p>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-600" /> New Routing Rule
          </h2>
          <RuleForm
            teamMembers={teamMembers}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-slate-400">Loading rules…</div>
      )}

      {/* Rules list */}
      {!loading && rules.length === 0 && !showCreate && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <GitBranch className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No routing rules yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first rule to start auto-assigning leads.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create first rule
          </button>
        </div>
      )}

      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div
            key={rule.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              rule.active ? 'border-slate-200' : 'border-slate-200 opacity-60'
            }`}
          >
            {editingId === rule.id ? (
              <div className="p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Edit2 className="h-4 w-4" /> Editing: {rule.name}
                </h3>
                <RuleForm
                  initial={rule}
                  teamMembers={teamMembers}
                  onSave={(data) => handleUpdate(rule.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : deletingId === rule.id ? (
              <div className="p-5 bg-red-50">
                <p className="text-sm text-red-700 font-medium mb-3">
                  Delete "{rule.name}"? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Priority badge + name */}
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm">{rule.name}</span>
                        {!rule.active && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">Inactive</span>
                        )}
                        <span className="text-xs text-slate-400">priority {rule.priority}</span>
                      </div>
                      {/* Conditions */}
                      <div className="mt-1 flex flex-wrap items-center gap-1 text-sm">
                        <span className="text-slate-500 text-xs">IF</span>
                        {renderConditionSummary(rule)}
                        <span className="text-slate-500 text-xs">THEN assign to</span>
                        <span className="font-medium text-slate-700 text-xs">
                          {rule.assign_to_name} &lt;{rule.assign_to_email}&gt;
                        </span>
                      </div>
                      {rule.notify_emails.length > 0 && (
                        <p className="text-xs text-slate-400 mt-1">
                          CC: {rule.notify_emails.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(rule.id, !rule.active)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title={rule.active ? 'Deactivate' : 'Activate'}
                    >
                      {rule.active
                        ? <ToggleRight className="h-5 w-5 text-blue-600" />
                        : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => setEditingId(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutingRulesEditor;
