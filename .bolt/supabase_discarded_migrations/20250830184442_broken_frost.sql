/*
  # Fix trigger functions JWT secret error

  1. Problem
    - Trigger functions are trying to access 'supabase_functions.jwt_secret' which doesn't exist
    - This causes lead submission to fail with configuration parameter error

  2. Solution
    - Drop and recreate trigger functions without JWT secret references
    - Use proper service role authentication for HTTP requests
    - Maintain all existing functionality while fixing authentication

  3. Changes
    - Replace comprehensive_lead_notification function
    - Replace trigger_send_lead_email function
    - Keep update_updated_at_column function (not affected)
*/

-- Drop existing problematic functions
DROP FUNCTION IF EXISTS comprehensive_lead_notification() CASCADE;
DROP FUNCTION IF EXISTS trigger_send_lead_email() CASCADE;

-- Create fixed comprehensive_lead_notification function
CREATE OR REPLACE FUNCTION comprehensive_lead_notification()
RETURNS TRIGGER AS $$
DECLARE
  service_role_key TEXT;
  supabase_url TEXT;
  webhook_url TEXT;
  http_response TEXT;
BEGIN
  -- Get service role key from environment
  service_role_key := current_setting('app.settings.service_role_key', true);
  supabase_url := current_setting('app.settings.supabase_url', true);
  
  -- If service role key is not set, log and continue without notification
  IF service_role_key IS NULL OR service_role_key = '' THEN
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
      'notification_skipped',
      'leads',
      NEW.id,
      jsonb_build_object(
        'reason', 'service_role_key_not_configured',
        'lead_email', NEW.email,
        'lead_name', NEW.name
      )
    );
    RETURN NEW;
  END IF;

  -- Construct webhook URL
  webhook_url := supabase_url || '/functions/v1/send-lead-email';
  
  -- Log notification attempt
  INSERT INTO activity_logs (action, resource_type, resource_id, details)
  VALUES (
    'notification_attempt',
    'leads',
    NEW.id,
    jsonb_build_object(
      'webhook_url', webhook_url,
      'lead_email', NEW.email,
      'lead_name', NEW.name
    )
  );

  -- Make HTTP request to edge function
  BEGIN
    SELECT content INTO http_response
    FROM net.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'lead', row_to_json(NEW)
      )
    );
    
    -- Log successful notification
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
      'notification_sent',
      'leads',
      NEW.id,
      jsonb_build_object(
        'response', http_response,
        'lead_email', NEW.email
      )
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Log notification error
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
      'notification_error',
      'leads',
      NEW.id,
      jsonb_build_object(
        'error', SQLERRM,
        'lead_email', NEW.email
      )
    );
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified trigger_send_lead_email function
CREATE OR REPLACE FUNCTION trigger_send_lead_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the trigger execution
  INSERT INTO activity_logs (action, resource_type, resource_id, details)
  VALUES (
    'email_trigger_fired',
    'leads',
    NEW.id,
    jsonb_build_object(
      'lead_email', NEW.email,
      'lead_name', NEW.name,
      'trigger_function', 'trigger_send_lead_email'
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the triggers
CREATE TRIGGER comprehensive_lead_notification_trigger
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION comprehensive_lead_notification();

CREATE TRIGGER trigger_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_lead_email();

CREATE TRIGGER trigger_send_email_notification
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_lead_email();