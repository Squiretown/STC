import React, { useState } from 'react';
import {
  Plus, Pencil, Trash2, ExternalLink, RefreshCw,
  X, Save, Star, StarOff, Globe, AlertTriangle
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import type { PortfolioProject } from '../../lib/supabase';

const CATEGORIES = ['Web Platform', 'AI / Automation', 'FinTech', 'Real Estate'] as const;
const ICON_OPTIONS = [
  'Globe', 'Bot', 'DollarSign', 'BarChart3', 'Building2',
  'Briefcase', 'Lightbulb', 'Code2', 'Layers', 'Zap',
];
const ACCENT_OPTIONS = [
  { label: 'Blue',    color: 'bg-blue-600',    light: 'bg-blue-50',    text: 'text-blue-600' },
  { label: 'Violet',  color: 'bg-violet-600',  light: 'bg-violet-50',  text: 'text-violet-600' },
  { label: 'Emerald', color: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600' },
  { label: 'Amber',   color: 'bg-amber-600',   light: 'bg-amber-50',   text: 'text-amber-600' },
  { label: 'Rose',    color: 'bg-rose-600',    light: 'bg-rose-50',    text: 'text-rose-600' },
  { label: 'Sky',     color: 'bg-sky-600',     light: 'bg-sky-50',     text: 'text-sky-600' },
  { label: 'Slate',   color: 'bg-slate-700',   light: 'bg-slate-100',  text: 'text-slate-700' },
  { label: 'Orange',  color: 'bg-orange-600',  light: 'bg-orange-50',  text: 'text-orange-600' },
];

const EMPTY_PROJECT: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  tagline: '',
  description: '',
  category: 'Web Platform',
  tags: [],
  url: '',
  status: 'live',
  featured: false,
  sort_order: 0,
  accent_color: 'bg-blue-600',
  accent_light: 'bg-blue-50',
  accent_text: 'text-blue-600',
  icon_name: 'Globe',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) =>
  status === 'live' ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      In Development
    </span>
  );

interface FormModalProps {
  project: PortfolioProject | null;
  onSave: (data: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

const ProjectFormModal: React.FC<FormModalProps> = ({ project, onSave, onClose }) => {
  const [form, setForm] = useState<Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>>(
    project
      ? {
          name: project.name,
          tagline: project.tagline,
          description: project.description,
          category: project.category,
          tags: project.tags,
          url: project.url ?? '',
          status: project.status,
          featured: project.featured,
          sort_order: project.sort_order,
          accent_color: project.accent_color,
          accent_light: project.accent_light,
          accent_text: project.accent_text,
          icon_name: project.icon_name,
        }
      : EMPTY_PROJECT
  );
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Project name is required';
    if (!form.tagline.trim()) e.tagline = 'Tagline is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAccentChange = (option: typeof ACCENT_OPTIONS[number]) => {
    setForm(f => ({
      ...f,
      accent_color: option.color,
      accent_light: option.light,
      accent_text: option.text,
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    await onSave({ ...form, url: form.url?.trim() || null as unknown as string });
    setSaving(false);
  };

  const field = (label: string, key: keyof typeof form, type: 'text' | 'textarea' | 'url' = 'text') => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          rows={3}
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[key] ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
        />
      ) : (
        <input
          type={type}
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[key] ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
        />
      )}
      {errors[key] && <p className="text-xs text-red-600 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-slate-900">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {field('Project Name *', 'name')}
          {field('Tagline * (one punchy line)', 'tagline')}
          {field('Description * (2-3 sentences)', 'description', 'textarea')}
          {field('Live URL (leave blank if not yet live)', 'url', 'url')}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as PortfolioProject['status'] }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="live">Live</option>
                <option value="in-development">In Development</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
              <input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Lower = shown first</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Featured</label>
              <button
                onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  form.featured
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {form.featured ? <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> : <StarOff className="h-4 w-4" />}
                {form.featured ? 'Featured' : 'Not Featured'}
              </button>
              <p className="text-xs text-slate-500 mt-1">Shows in the top section</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Type a tag and press Enter"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => handleAccentChange(opt)}
                  className={`w-8 h-8 rounded-full ${opt.color} transition-transform hover:scale-110 ${
                    form.accent_color === opt.color ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''
                  }`}
                  title={opt.label}
                  aria-label={`Select ${opt.label} accent color`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">Selected: {ACCENT_OPTIONS.find(o => o.color === form.accent_color)?.label ?? 'Custom'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Icon Name (lucide-react)</label>
            <select
              value={form.icon_name}
              onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectsEditor: React.FC = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject, refetch } = useProjects();
  const [modalProject, setModalProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const openCreate = () => {
    setModalProject(null);
    setIsModalOpen(true);
  };

  const openEdit = (project: PortfolioProject) => {
    setModalProject(project);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>) => {
    if (modalProject) {
      const { error: saveError } = await updateProject(modalProject.id, data);
      if (!saveError) showSuccess('Project updated successfully');
    } else {
      const { error: saveError } = await createProject(data);
      if (!saveError) showSuccess('Project created successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const { error: deleteError } = await deleteProject(deleteTarget.id);
    if (!deleteError) showSuccess('Project deleted');
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const toggleFeatured = async (project: PortfolioProject) => {
    await updateProject(project.id, { featured: !project.featured });
    showSuccess(`${project.name} ${!project.featured ? 'marked as featured' : 'removed from featured'}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Portfolio Projects</h1>
            <p className="text-slate-600 mt-1">Manage the projects shown on the Our Work page</p>
          </div>
          <div className="flex items-center gap-3">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            )}
            <button
              onClick={refetch}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Projects', value: projects.length },
            { label: 'Live', value: projects.filter(p => p.status === 'live').length },
            { label: 'Featured', value: projects.filter(p => p.featured).length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800">All Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ordered by Sort Order (lowest first). Edit to change position.</p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No projects yet</p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add your first project
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.map(project => (
                <div key={project.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${project.accent_color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-slate-900 truncate">{project.name}</p>
                      {project.featured && (
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{project.tagline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{project.category}</span>
                      <StatusBadge status={project.status} />
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Visit live URL"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono w-6 text-center flex-shrink-0">
                    #{project.sort_order}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`p-2 rounded-lg transition-colors ${project.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
                      title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      {project.featured ? <Star className="h-4 w-4 fill-amber-400" /> : <StarOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(project)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Changes appear on the <a href="/work" target="_blank" className="underline hover:text-slate-600">Our Work page</a> immediately after saving.
        </p>
      </div>

      {isModalOpen && (
        <ProjectFormModal
          project={modalProject}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Delete "{deleteTarget.name}"?</h3>
                <p className="text-sm text-slate-500">This will permanently remove the project from your portfolio. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isDeleting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsEditor;
