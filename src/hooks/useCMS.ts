import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { SiteSetting, SiteContent, CMSData } from '../types/cms';

export const useCMS = () => {
  const [cmsData, setCmsData] = useState<CMSData>({
    settings: {},
    content: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all CMS data
  const fetchCMSData = async () => {
    try {
      setLoading(true);
      setError(null);

     // Check if Supabase is properly configured
     if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
       throw new Error('Supabase configuration missing. Please check your environment variables.');
     }
      // Fetch settings
      const { data: settings, error: settingsError } = await supabase
        .from('site_settings')
        .select('*');

      if (settingsError) throw settingsError;

      // Fetch content
      const { data: content, error: contentError } = await supabase
        .from('site_content')
        .select('*');

      if (contentError) throw contentError;

      // Transform settings into key-value pairs
      const settingsMap = (settings || []).reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, string>);

      // Transform content into nested structure
      const contentMap = (content || []).reduce((acc, item) => {
        if (!acc[item.page_name]) {
          acc[item.page_name] = {};
        }
        acc[item.page_name][item.section_key] = item.content_value;
        return acc;
      }, {} as Record<string, Record<string, string>>);

      setCmsData({
        settings: settingsMap,
        content: contentMap
      });

    } catch (err) {
      console.error('Error fetching CMS data:', err);
     
     // Provide more helpful error messages
     let errorMessage = 'Failed to fetch CMS data';
     
     if (err instanceof Error) {
       if (err.message.includes('Failed to fetch')) {
         errorMessage = 'Cannot connect to Supabase. Please check your internet connection and Supabase configuration.';
       } else if (err.message.includes('Supabase configuration')) {
         errorMessage = err.message;
       } else {
         errorMessage = err.message;
       }
     }
     
     setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a setting
  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        }, { onConflict: 'setting_key' });

      if (error) throw error;

      // Update local state
      setCmsData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [key]: value
        }
      }));

      return true;
    } catch (err) {
      console.error('Error updating setting:', err);
      setError(err instanceof Error ? err.message : 'Failed to update setting');
      return false;
    }
  };

  // Update content
  const updateContent = async (pageName: string, sectionKey: string, value: string, contentType: 'text' | 'html' | 'json' = 'text') => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          page_name: pageName,
          section_key: sectionKey,
          content_value: value,
          content_type: contentType
        });

      if (error) throw error;

      // Update local state
      setCmsData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [pageName]: {
            ...prev.content[pageName],
            [sectionKey]: value
          }
        }
      }));

      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return false;
    }
  };

  // Get setting value with fallback
  const getSetting = (key: string, fallback = '') => {
    return cmsData.settings[key] || fallback;
  };

  // Get content value with fallback
  const getContent = (pageName: string, sectionKey: string, fallback = '') => {
    return cmsData.content[pageName]?.[sectionKey] || fallback;
  };

  useEffect(() => {
    fetchCMSData();

    // Set up real-time subscriptions
    const settingsSubscription = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_settings' }, 
        () => fetchCMSData()
      )
      .subscribe();

    const contentSubscription = supabase
      .channel('content_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_content' }, 
        () => fetchCMSData()
      )
      .subscribe();

    return () => {
      settingsSubscription.unsubscribe();
      contentSubscription.unsubscribe();
    };
  }, []);

  return {
    cmsData,
    loading,
    error,
    updateSetting,
    updateContent,
    getSetting,
    getContent,
    refetch: fetchCMSData
  };
};

export default useCMS;