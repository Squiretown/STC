```sql
-- Enable the pg_net extension if it's not already enabled.
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create or replace the PostgreSQL function that makes the HTTP request to the Edge Function.
CREATE OR REPLACE FUNCTION public.trigger_send_lead_email()
RETURNS TRIGGER AS $$
DECLARE
  -- IMPORTANT: Replace 'YOUR_SUPABASE_ANON_KEY' with your actual Supabase anon key.
  -- You can find this in your Supabase Dashboard -> Project Settings -> API -> Project API keys.
  supabase_anon_key TEXT := 'YOUR_SUPABASE_ANON_KEY'; 
  function_response JSONB;
BEGIN
  -- Make an HTTP POST request to the 'send-lead-email' Edge Function.
  -- The 'record' field in the body will contain the new lead's data.
  SELECT INTO function_response
    content::jsonb 
  FROM 
    net.http_post(
      url := 'https://pbwkpdpofrndpgsqzgig.supabase.co/functions/v1/send-lead-email', -- Ensure this URL is correct for your deployed Edge Function
      body := json_build_object('record', row_to_json(NEW)),
      headers := jsonb_build_object(
        'Content-Type', 'application/json', 
        'Authorization', 'Bearer ' || supabase_anon_key
      )
    );
    
  -- Log the response for debugging (optional, can be removed in production)
  RAISE NOTICE 'Edge function response: %', function_response;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the anon role if the function is SECURITY DEFINER
-- This is crucial if the function is called by unauthenticated users (e.g., via RLS policies)
GRANT EXECUTE ON FUNCTION public.trigger_send_lead_email() TO anon;
GRANT EXECUTE ON FUNCTION public.trigger_send_lead_email() TO authenticated;

-- Drop the existing trigger to recreate it with the correct function.
-- This is safer than ALTER TRIGGER if the function signature changes or for clarity.
DROP TRIGGER IF EXISTS send_lead_email_notification ON public.leads;

-- Recreate the trigger to execute the new public.trigger_send_lead_email() function.
CREATE TRIGGER send_lead_email_notification
AFTER INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.trigger_send_lead_email();
```