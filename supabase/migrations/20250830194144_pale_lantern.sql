/*
  # Implement Fixed Lead Notification Function

  1. Function Updates
    - Replace problematic trigger functions with improved `notify_new_lead()` function
    - Use app settings instead of invalid JWT secret configuration
    - Add comprehensive error handling and logging
    - Ensure lead insertion always succeeds even if notification fails

  2. Trigger Updates
    - Drop existing problematic triggers
    - Create new trigger using the fixed function

  3. Security
    - Function uses SECURITY DEFINER for proper permissions
    - Comprehensive logging to activity_logs table for debugging
*/

-- Drop existing problematic triggers and functions
DROP TRIGGER IF EXISTS comprehensive_lead_notification_trigger ON leads;
DROP TRIGGER IF EXISTS trigger_lead_created ON leads;
DROP TRIGGER IF EXISTS trigger_send_email_notification ON leads;

DROP FUNCTION IF EXISTS comprehensive_lead_notification();
DROP FUNCTION IF EXISTS trigger_send_lead_email();

-- Create the new fixed notification function
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  function_url TEXT;
  service_role_key TEXT;
  request_id BIGINT;
BEGIN
  -- Get configuration (you'll need to set these values)
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- If configuration is missing, log and exit gracefully
  IF supabase_url IS NULL OR service_role_key IS NULL THEN
    -- Log the issue to activity_logs
    BEGIN
      INSERT INTO activity_logs (
        action, 
        resource_type, 
        resource_id, 
        details
      ) VALUES (
        'lead_notification_config_missing',
        'leads',
        NEW.id,
        jsonb_build_object(
          'has_url', supabase_url IS NOT NULL,
          'has_key', service_role_key IS NOT NULL,
          'lead_email', NEW.email,
          'timestamp', now()
        )
      );
    EXCEPTION WHEN OTHERS THEN
      -- If logging fails, continue anyway
    END;
    
    -- Don't prevent lead insertion
    RETURN NEW;
  END IF;
  
  -- Build the Edge Function URL
  function_url := supabase_url || '/functions/v1/send-lead-email';
  
  -- Log the attempt
  BEGIN
    INSERT INTO activity_logs (
      action, 
      resource_type, 
      resource_id, 
      details
    ) VALUES (
      'lead_notification_attempt',
      'leads',
      NEW.id,
      jsonb_build_object(
        'function_url', function_url,
        'lead_email', NEW.email,
        'timestamp', now()
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- If logging fails, continue anyway
  END;
  
  -- Call the Edge Function using pg_net
  BEGIN
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'record', row_to_json(NEW)
      )
    ) INTO request_id;
    
    -- Log success
    BEGIN
      INSERT INTO activity_logs (
        action, 
        resource_type, 
        resource_id, 
        details
      ) VALUES (
        'lead_notification_sent',
        'leads',
        NEW.id,
        jsonb_build_object(
          'request_id', request_id,
          'lead_email', NEW.email,
          'timestamp', now()
        )
      );
    EXCEPTION WHEN OTHERS THEN
      -- If logging fails, continue anyway
    END;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the lead insertion
    BEGIN
      INSERT INTO activity_logs (
        action, 
        resource_type, 
        resource_id, 
        details
      ) VALUES (
        'lead_notification_error',
        'leads',
        NEW.id,
        jsonb_build_object(
          'error', SQLERRM,
          'error_detail', SQLSTATE,
          'lead_email', NEW.email,
          'timestamp', now()
        )
      );
    EXCEPTION WHEN OTHERS THEN
      -- If logging fails, continue anyway
    END;
  END;
  
  -- Always return NEW to ensure lead insertion succeeds
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the new trigger
CREATE TRIGGER notify_new_lead_trigger
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();