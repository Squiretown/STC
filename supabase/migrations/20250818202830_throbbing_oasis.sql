/*
  # Setup Storage and Enhanced CMS

  1. Storage Setup
    - Create public bucket for logos and assets
    - Set up policies for file uploads and access

  2. Enhanced Contact Data
    - Add additional contact-related settings
    - Ensure all contact form data is properly structured
*/

-- Create storage bucket for logos and assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos', 
  'logos', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to logos
CREATE POLICY "Public can view logos" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');

-- Policy to allow authenticated users to upload logos
CREATE POLICY "Authenticated users can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'logos' AND 
  auth.role() = 'authenticated'
);

-- Policy to allow authenticated users to update logos
CREATE POLICY "Authenticated users can update logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'logos' AND 
  auth.role() = 'authenticated'
);

-- Policy to allow authenticated users to delete logos
CREATE POLICY "Authenticated users can delete logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'logos' AND 
  auth.role() = 'authenticated'
);

-- Add additional contact and business settings if they don't exist
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
('company_tagline', 'Your trusted partner for business transformation', 'Company tagline or motto'),
('company_description', 'We blend creative branding, cutting-edge AI solutions, and business funding expertise to drive your business forward.', 'Brief company description'),
('contact_email_sales', 'sales@squiretownconsulting.com', 'Sales contact email'),
('contact_email_support', 'support@squiretownconsulting.com', 'Support contact email'),
('social_linkedin', '', 'LinkedIn profile URL'),
('social_twitter', '', 'Twitter profile URL'),
('social_facebook', '', 'Facebook page URL'),
('office_hours_note', 'Emergency consultations available 24/7 by appointment', 'Additional note about availability'),
('response_time', '24 hours', 'Typical response time for inquiries')
ON CONFLICT (setting_key) DO NOTHING;