// CMS Types
export interface SiteSetting {
  id?: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  updated_at?: string;
}

export interface SiteContent {
  id?: string;
  page_name: string;
  section_key: string;
  content_value: string;
  content_type: 'text' | 'html' | 'json';
  updated_at?: string;
}

export interface CMSData {
  settings: Record<string, string>;
  content: Record<string, Record<string, string>>;
}