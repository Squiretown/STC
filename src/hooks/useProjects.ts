import { useState, useEffect } from 'react';
import { supabase, type PortfolioProject } from '../lib/supabase';

export const useProjects = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error: sbError } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (sbError) throw sbError;
      setProjects(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: sbError } = await supabase
        .from('portfolio_projects')
        .insert([project])
        .select()
        .single();

      if (sbError) throw sbError;
      setProjects(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      setError(message);
      return { data: null, error: message };
    }
  };

  const updateProject = async (id: string, updates: Partial<PortfolioProject>) => {
    try {
      const { data, error: sbError } = await supabase
        .from('portfolio_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (sbError) throw sbError;
      setProjects(prev =>
        prev.map(p => (p.id === id ? data : p)).sort((a, b) => a.sort_order - b.sort_order)
      );
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      setError(message);
      return { data: null, error: message };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error: sbError } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (sbError) throw sbError;
      setProjects(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
      return { error: message };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};

export default useProjects;
