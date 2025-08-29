```sql
-- Enable the pg_net extension if it's not already enabled.
-- This extension allows PostgreSQL to make HTTP requests.
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create or replace the PostgreSQL function that the database trigger executes.
-- This function will make an HTTP POST request to your Supabase Edge Function.
CREATE OR REPLACE FUNCTION public.trigger_send_lead_email()
RETURNS TRIGGER AS $$
DECLARE
  -- IMPORTANT: Replace 'YOUR_SUPABASE_PROJECT_URL' with your actual Supabase project URL.
  -- You can find this in your Supabase Dashboard -> Project Settings -> API -> URL.
  supabase_url TEXT := 'YOUR_SUPABASE_PROJECT_URL';

  -- IMPORTANT: Replace 'YOUR_SUPABASE_ANON_KEY' with your actual Supabase anon key.
  -- For triggers, it's often safer to use a service role key if the function is SECURITY DEFINER.
  -- You can find this in your Supabase Dashboard -> Project Settings -> API -> Project API keys.
  -- If using a service role key, ensure the function is SECURITY DEFINER and the key is kept secret.
  supabase_anon_key TEXT := 'YOUR_SUPABASE_ANON_KEY';
BEGIN
  -- Make an HTTP POST request to the 'send-lead-email' Edge Function.
  -- The 'record' field in the body will contain the new lead's data.
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-lead-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || supabase_anon_key
    ),
    body := jsonb_build_object('record', NEW)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the database trigger is active and correctly linked to the function.
-- If the trigger 'send_lead_email_notification' already exists, this will ensure it uses the updated function.
-- If you are creating this trigger for the first time, uncomment the following lines:
-- CREATE TRIGGER send_lead_email_notification
-- AFTER INSERT ON public.leads
-- FOR EACH ROW EXECUTE FUNCTION public.trigger_send_lead_email();
```