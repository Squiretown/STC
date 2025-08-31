import React, { useState } from 'react';
import { Save, RefreshCw, Settings } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import LogoManager from '../../components/admin/LogoManager';

const SettingsEditor: React.FC = () => {
  const { cmsData, loading, updateSetting, getSetting } = useCMS();
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const settingGroups = [
    {
      title: 'Company Information',
      settings: [
        { key: 'company_name', label: 'Company Name', type: 'text' as const },
        { key: 'company_tagline', label: 'Company Tagline', type: 'text' as const },
        { key: 'company_description', label: 'Company Description', type: 'textarea' as const }
      ]
    },
    {
      title: 'Contact Information',
      settings: [
        { key: 'company_email', label: 'Primary Email', type: 'email' as const },
        { key: 'contact_email_secondary', label: 'Secondary Email', type: 'email' as const },
        { key: 'contact_email_sales', label: 'Sales Email', type: 'email' as const },
        { key: 'contact_email_support', label: 'Support Email', type: 'email' as const },
        { key: 'company_phone', label: 'Phone Number', type: 'tel' as const },
        { key: 'company_phone_direct', label: 'Direct Phone Number', type: 'tel' as const },
        { key: 'company_address', label: 'Address', type: 'textarea' as const },
        { key: 'business_hours', label: 'Business Hours', type: 'textarea' as const },
        { key: 'office_hours_note', label: 'Additional Hours Note', type: 'textarea' as const },
        { key: 'response_time', label: 'Typical Response Time', type: 'text' as const }
      ]
    },
    {
      title: 'Social Media',
      settings: [
        { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url' as const },
        { key: 'social_twitter', label: 'Twitter URL', type: 'url' as const },
        { key: 'social_facebook', label: 'Facebook URL', type: 'url' as const },
        { key: 'social_instagram', label: 'Instagram URL', type: 'url' as const }
      ]
    },
    {
      title: 'Website Settings',
      settings: [
        { key: 'hero_cta_primary', label: 'Primary CTA Button Text', type: 'text' as const },
        { key: 'hero_cta_secondary', label: 'Secondary CTA Button Text', type: 'text' as const }
      ]
    }
  ];

  const handleSettingChange = (key: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (key: string) => {
    const value = editingSettings[key];
    if (value === undefined) return;

    setSaving(prev => ({ ...prev, [key]: true }));

    const success = await updateSetting(key, value);
    
    if (success) {
      setEditingSettings(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      setSuccessMessage(`Updated ${key.replace('_', ' ')} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setSaving(prev => ({ ...prev, [key]: false }));
  };

  const getCurrentValue = (key: string) => {
    return editingSettings[key] !== undefined 
      ? editingSettings[key] 
      : getSetting(key);
  };

  const hasUnsavedChanges = (key: string) => {
    return editingSettings[key] !== undefined;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Settings className="h-6 w-6 mr-3" />
            Site Settings
          </h1>
          <p className="text-slate-600 mt-1">Update your website's global settings and contact information</p>
        </div>
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}
      </div>

      {/* Logo Management Sections */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Logo Management</h2>
        </div>
        <div className="p-6">
          <LogoManager
            logoType="header"
            title="Header Logo"
            description="Upload and configure the logo that appears in your website's navigation header."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Footer Logo</h2>
        </div>
        <div className="p-6">
          <LogoManager
            logoType="footer"
            title="Footer Logo"
            description="Upload and configure the logo that appears in your website's footer section."
          />
        </div>
      </div>

      {settingGroups.map((group) => (
        <div key={group.title} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">{group.title}</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {group.settings.map((setting) => {
              const isEditing = hasUnsavedChanges(setting.key);
              const isSaving = saving[setting.key];
              
              return (
                <div key={setting.key} className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    {setting.label}
                  </label>
                  
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      {setting.type === 'textarea' ? (
                        <textarea
                          value={getCurrentValue(setting.key)}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          rows={2}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            isEditing ? 'border-blue-300 bg-blue-50' : 'border-slate-300'
                          }`}
                        />
                      ) : (
                        <input
                          type={setting.type}
                          value={getCurrentValue(setting.key)}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            isEditing ? 'border-blue-300 bg-blue-50' : 'border-slate-300'
                          }`}
                        />
                      )}
                    </div>
                    
                    {isEditing && (
                      <button
                        onClick={() => handleSave(setting.key)}
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

export default SettingsEditor;