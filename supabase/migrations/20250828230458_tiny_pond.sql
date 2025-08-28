/*
  # Fix Lead Email Notifications

  This migration fixes the lead email notification system by:
  1. Removing any conflicting triggers/functions
  2. Creating a proper trigger that calls our Edge Function
  3. Adding proper error handling

  ## Changes
  1. Clean up existing notification functions
  2. Create new trigger function that calls send-lead-email Edge Function
  3. Set up trigger on leads table

  ## Security
  - Uses SECURITY DEFINER for proper permissions
  - Includes error handling to prevent transaction failures
*/

-- First, drop any existing conflicting triggers and functions
DROP TRIGGER IF EXISTS on_lead_email_notification ON public.leads;
DROP TRIGGER IF EXISTS on_new_lead_notification ON public.leads;
DROP FUNCTION IF EXISTS public.notify_lead_email();
DROP FUNCTION IF EXISTS public.notify_new_lead();
DROP FUNCTION IF EXISTS public.handle_new_lead_notification();

-- Create the new trigger function that calls our Edge Function
CREATE OR REPLACE FUNCTION public.trigger_send_lead_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
BEGIN
  -- Create the payload for the Edge Function
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'leads',
    'record', row_to_json(NEW),
    'old_record', NULL
  );

  -- Call the Edge Function using pg_net (if available) or http extension
  BEGIN
    -- Try using pg_net first (newer Supabase instances)
    SELECT INTO request_id
      net.http_post(
        url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-lead-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key', true)
        ),
        body := payload
      );
  EXCEPTION WHEN OTHERS THEN
    -- Fallback: Log the error but don't fail the transaction
    RAISE WARNING 'Failed to send lead email notification: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER send_lead_email_notification
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_lead_email();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.trigger_send_lead_email() TO authenticated;
GRANT EXECUTE ON FUNCTION public.trigger_send_lead_email() TO anon;