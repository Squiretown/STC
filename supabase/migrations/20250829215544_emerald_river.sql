/*
  # Fix activity_logs RLS policy for trigger writes

  1. Security Changes
    - Add INSERT policy for activity_logs table to allow trigger writes
    - Allow service_role and authenticated users to insert activity logs
    - Update trigger function to run with SECURITY DEFINER for proper permissions

  This fixes the RLS violation error when leads are submitted and triggers try to write to activity_logs.
*/

-- Add INSERT policy for activity_logs to allow trigger writes
CREATE POLICY IF NOT EXISTS "Allow system to insert activity logs"
  ON activity_logs
  FOR INSERT
  TO authenticated, service_role
  WITH CHECK (true);

-- Update the trigger function to run with SECURITY DEFINER
-- This ensures it runs with the function owner's permissions rather than the caller's
CREATE OR REPLACE FUNCTION trigger_send_lead_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  response_data jsonb;
  request_id bigint;
  function_url text;
BEGIN
  -- Log trigger start
  INSERT INTO activity_logs (action, resource_type, resource_id, details)
  VALUES (
    'trigger_executed',
    'leads',
    NEW.id,
    jsonb_build_object(
      'trigger_name', 'send_lead_email_notification',
      'status', 'started',
      'timestamp', now()
    )
  );

  -- Get the Supabase URL from configuration
  function_url := current_setting('app.supabase_url', true) || '/functions/v1/send-lead-email';
  
  IF function_url IS NULL OR function_url = '/functions/v1/send-lead-email' THEN
    -- Fallback if setting not configured
    function_url := 'https://pbwkpdpofrndpgsqzgig.supabase.co/functions/v1/send-lead-email';
  END IF;

  -- Make HTTP request to Edge Function
  SELECT INTO request_id, response_data
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)
      ),
      body := jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'phone', NEW.phone,
        'company', NEW.company,
        'service', NEW.service,
        'message', NEW.message,
        'created_at', NEW.created_at
      )
    );

  -- Log the response
  INSERT INTO activity_logs (action, resource_type, resource_id, details)
  VALUES (
    'email_notification',
    'leads',
    NEW.id,
    jsonb_build_object(
      'request_id', request_id,
      'response', response_data,
      'function_url', function_url,
      'status', 'completed',
      'timestamp', now()
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
      'email_notification_error',
      'leads',
      NEW.id,
      jsonb_build_object(
        'error_message', SQLERRM,
        'error_state', SQLSTATE,
        'function_url', function_url,
        'status', 'failed',
        'timestamp', now()
      )
    );
    
    -- Don't prevent lead insertion if email fails
    RETURN NEW;
END;
$$;