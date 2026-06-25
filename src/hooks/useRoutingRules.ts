import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface RuleCondition {
  field: 'service' | 'source' | 'any';
  operator: 'equals' | 'contains' | 'any';
  value: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  active: boolean;
  conditions: RuleCondition[];
  assign_to_name: string;
  assign_to_email: string;
  notify_emails: string[];
  reminder_hours: number;
  created_at: string;
  updated_at: string;
}

export type RoutingRuleInput = Omit<RoutingRule, 'id' | 'created_at' | 'updated_at'>;

export const useRoutingRules = () => {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('routing_rules')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: true });
      if (err) throw err;
      setRules(data || []);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Failed to load rules';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRule = useCallback(async (input: RoutingRuleInput) => {
    try {
      const { data, error: err } = await supabase
        .from('routing_rules')
        .insert(input)
        .select()
        .single();
      if (err) throw err;
      setRules(prev => [...prev, data].sort((a, b) => a.priority - b.priority));
      return data as RoutingRule;
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Failed to create rule';
      setError(msg);
      return null;
    }
  }, []);

  const updateRule = useCallback(async (id: string, updates: Partial<RoutingRuleInput>) => {
    try {
      const { data, error: err } = await supabase
        .from('routing_rules')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      setRules(prev => prev.map(r => r.id === id ? data as RoutingRule : r).sort((a, b) => a.priority - b.priority));
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Failed to update rule';
      setError(msg);
      return false;
    }
  }, []);

  const deleteRule = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase.from('routing_rules').delete().eq('id', id);
      if (err) throw err;
      setRules(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Failed to delete rule';
      setError(msg);
      return false;
    }
  }, []);

  const toggleActive = useCallback(async (id: string, active: boolean) => {
    return updateRule(id, { active });
  }, [updateRule]);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  return { rules, loading, error, fetchRules, createRule, updateRule, deleteRule, toggleActive };
};
