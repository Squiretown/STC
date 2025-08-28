import React, { useState } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

const ContentEditor: React.FC = () => {
  const { cmsData, loading, updateContent, getContent } = useCMS();
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pages = [
    {
      name: 'home',
      title: 'Home Page',
      sections: [
        { key: 'hero_title', label: 'Hero Title', type: 'text' as const },
        { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' as const },
        { key: 'services_title', label: 'Services Section Title', type: 'text' as const },
        { key: 'services_subtitle', label: 'Services Section Subtitle', type: 'textarea' as const },
        { key: 'stats_clients', label: 'Client Count', type: 'text' as const },
        { key: 'stats_experience', label: 'Years Experience', type: 'text' as const },
        { key: 'stats_success_rate', label: 'Success Rate', type: 'text' as const }
      ]
    },
    {
      name: 'about',
      title: 'About Page',
      sections: [
        { key: 'hero_title', label: 'Page Title', type: 'text' as const },
        { key: 'hero_subtitle', label: 'Page Subtitle', type: 'textarea' as const },
        { key: 'mission_title', label: 'Mission Section Title', type: 'text' as const },
        { key: 'mission_content', label: 'Mission Content', type: 'textarea' as const }
      ]
    },
    {
      name: 'contact',
      title: 'Contact Page',
      sections: [
        { key: 'hero_title', label: 'Page Title', type: 'text' as const },
        { key: 'hero_subtitle', label: 'Page Subtitle', type: 'textarea' as const },
        { key: 'contact_intro', label: 'Contact Introduction', type: 'textarea' as const },
        { key: 'form_title', label: 'Contact Form Title', type: 'text' as const },
        { key: 'form_subtitle', label: 'Contact Form Subtitle', type: 'textarea' as const },
        { key: 'response_promise', label: 'Response Time Promise', type: 'text' as const },
        { key: 'service_areas_title', label: 'Service Areas Section Title', type: 'text' as const },
        { key: 'service_areas_subtitle', label: 'Service Areas Section Subtitle', type: 'textarea' as const }
      ]
    },
    {
      name: 'brand-marketing',
      title: 'Brand Marketing Page',
      sections: [
        { key: 'hero_title', label: 'Hero Title', type: 'text' as const },
        { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' as const }
      ]
    },
    {
      name: 'ai-technology',
      title: 'AI Technology Page',
      sections: [
        { key: 'hero_title', label: 'Hero Title', type: 'text' as const },
        { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' as const }
      ]
    },
    {
      name: 'business-funding',
      title: 'Business Funding Page',
      sections: [
        { key: 'hero_title', label: 'Hero Title', type: 'text' as const },
        { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' as const }
      ]
    }
  ];

  const handleContentChange = (pageName: string, sectionKey: string, value: string) => {
    const key = `${pageName}.${sectionKey}`;
    setEditingContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (pageName: string, sectionKey: string) => {
    const key = `${pageName}.${sectionKey}`;
    const value = editingContent[key];
    
    if (value === undefined) return;

    setSaving(prev => ({ ...prev, [key]: true }));

    const success = await updateContent(pageName, sectionKey, value);
    
    if (success) {
      setEditingContent(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      setSuccessMessage(`Updated ${sectionKey} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setSaving(prev => ({ ...prev, [key]: false }));
  };

  const getCurrentValue = (pageName: string, sectionKey: string) => {
    const key = `${pageName}.${sectionKey}`;
    return editingContent[key] !== undefined 
      ? editingContent[key] 
      : getContent(pageName, sectionKey);
  };

  const hasUnsavedChanges = (pageName: string, sectionKey: string) => {
    const key = `${pageName}.${sectionKey}`;
    return editingContent[key] !== undefined;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <FileText className="h-6 w-6 mr-3" />
            Content Editor
          </h1>
          <p className="text-slate-600 mt-1">Update your website content across all pages</p>
        </div>
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}
      </div>

      {pages.map((page) => (
        <div key={page.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">{page.title}</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {page.sections.map((section) => {
              const key = `${page.name}.${section.key}`;
              const isEditing = hasUnsavedChanges(page.name, section.key);
              const isSaving = saving[key];
              
              return (
                <div key={section.key} className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    {section.label}
                  </label>
                  
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      {section.type === 'textarea' ? (
                        <textarea
                          value={getCurrentValue(page.name, section.key)}
                          onChange={(e) => handleContentChange(page.name, section.key, e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            isEditing ? 'border-blue-300 bg-blue-50' : 'border-slate-300'
                          }`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={getCurrentValue(page.name, section.key)}
                          onChange={(e) => handleContentChange(page.name, section.key, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            isEditing ? 'border-blue-300 bg-blue-50' : 'border-slate-300'
                          }`}
                        />
                      )}
                    </div>
                    
                    {isEditing && (
                      <button
                        onClick={() => handleSave(page.name, section.key)}
                        disabled={isSaving}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                      >
                        {isSaving ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentEditor;