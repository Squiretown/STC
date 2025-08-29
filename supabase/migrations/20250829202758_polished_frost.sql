/*
  # Fix Complete Lead Email Notification Flow

  This migration ensures the complete flow from contact form submission to email notification:
  1. Contact form inserts into leads table
  2. Trigger fires on INSERT
  3. PostgreSQL function calls Edge function
  4. Edge function sends email via Resend

  ## Current Issues Found:
  - Trigger calls `handle_new_lead()` instead of `trigger_send_lead_email()`
  - Need to ensure `trigger_send_lead_email()` function exists and is properly configured
  - Need to verify net.http_post can call the Edge function
*/

-- First, ensure the http extension is enabled for making HTTP requests
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Drop the existing trigger to recreate it with the correct function
DROP TRIGGER IF EXISTS send_lead_email_notification ON public.leads;

-- Create or replace the PostgreSQL function that calls the Edge function
CREATE OR REPLACE FUNCTION public.trigger_send_lead_email()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  supabase_anon_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBid2twZHBvZnJuZHBnc3F6Z2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMTYzODMsImV4cCI6MjAzOTU5MjM4M30.4wVHOCg8C-O0l1K1VhFvAp5xWg1UU_5M-8_1oYqJwsQ'; -- Your actual anon key
  function_response JSONB;
  http_request_id BIGINT;
BEGIN
  -- Make HTTP POST request to the Edge function
  SELECT INTO http_request_id
    net.http_post(
      url := 'https://pbwkpdpofrndpgsqzgig.supabase.co/functions/v1/send-lead-email',
      body := json_build_object('record', row_to_json(NEW))::text,
      headers := jsonb_build_object(
        'Content-Type', 'application/json', 
        'Authorization', 'Bearer ' || supabase_anon_key
      )
    );
    
  -- Log the request for debugging
  RAISE NOTICE 'Edge function HTTP request initiated with ID: %', http_request_id;
    
  -- Return the new record (required for AFTER INSERT trigger)
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but don't fail the insert
    RAISE WARNING 'Failed to send lead email notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger to use the correct function
CREATE TRIGGER send_lead_email_notification
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_lead_email();

-- Enable the trigger
ALTER TABLE public.leads ENABLE TRIGGER send_lead_email_notification;

-- Log completion
DO $$ 
BEGIN 
  RAISE NOTICE 'Lead email notification flow has been configured successfully';
  RAISE NOTICE 'Trigger: send_lead_email_notification -> Function: trigger_send_lead_email()';
  RAISE NOTICE 'Edge Function URL: https://pbwkpdpofrndpgsqzgig.supabase.co/functions/v1/send-lead-email';
END $$;