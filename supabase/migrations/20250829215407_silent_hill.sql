/*
  # Fix pg_net Extension Access for Lead Email Triggers

  1. Extension Setup
     - Ensure pg_net extension is properly enabled
     - Grant necessary permissions for trigger functions
  
  2. Updated Trigger Function
     - Fix pg_net function call syntax
     - Add proper error handling and logging
     - Use correct schema reference for net.http_post
  
  3. Fallback Mechanism
     - Add graceful error handling if pg_net is unavailable
     - Ensure lead insertion still succeeds even if email fails
*/

-- Ensure pg_net extension is enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant usage on pg_net to authenticated and service roles
GRANT USAGE ON SCHEMA net TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA net TO authenticated, service_role;

-- Drop existing trigger function if it exists
DROP FUNCTION IF EXISTS trigger_send_lead_email() CASCADE;

-- Create updated trigger function with proper pg_net access
CREATE OR REPLACE FUNCTION trigger_send_lead_email()
RETURNS TRIGGER AS $$
DECLARE
    request_id bigint;
    edge_function_url text;
    payload jsonb;
    log_details jsonb;
BEGIN
    -- Log the trigger execution start
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
        'trigger_started',
        'leads',
        NEW.id,
        jsonb_build_object(
            'function', 'trigger_send_lead_email',
            'timestamp', now(),
            'lead_email', NEW.email,
            'lead_name', NEW.name
        )
    );

    -- Build the Edge Function URL
    edge_function_url := current_setting('app.supabase_url', true) || '/functions/v1/send-lead-email';
    
    -- Build the payload
    payload := jsonb_build_object(
        'type', 'INSERT',
        'table', 'leads',
        'record', row_to_json(NEW),
        'old_record', null
    );

    -- Log the attempt
    log_details := jsonb_build_object(
        'url', edge_function_url,
        'payload_size', length(payload::text),
        'attempt_time', now()
    );

    BEGIN
        -- Attempt to call the Edge Function using pg_net
        SELECT net.http_post(
            url := edge_function_url,
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)
            ),
            body := payload
        ) INTO request_id;

        -- Log successful trigger execution
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'email_trigger_success',
            'leads',
            NEW.id,
            jsonb_build_object(
                'function', 'trigger_send_lead_email',
                'request_id', request_id,
                'timestamp', now(),
                'url', edge_function_url
            )
        );

    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the lead insertion
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'email_trigger_error',
            'leads',
            NEW.id,
            jsonb_build_object(
                'function', 'trigger_send_lead_email',
                'error', SQLERRM,
                'error_code', SQLSTATE,
                'timestamp', now(),
                'url', edge_function_url,
                'payload', payload
            )
        );
        
        -- Continue with the lead insertion (don't raise the exception)
        -- This ensures that lead creation doesn't fail even if email notification fails
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger (replace existing one)
DROP TRIGGER IF EXISTS send_lead_email_notification ON leads;
CREATE TRIGGER send_lead_email_notification
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION trigger_send_lead_email();

-- Set up runtime settings for the trigger function
-- These settings help the trigger function access Supabase configuration
DO $$
BEGIN
    -- Only set if not already configured
    IF current_setting('app.supabase_url', true) IS NULL THEN
        PERFORM set_config('app.supabase_url', 'https://your-project.supabase.co', false);
    END IF;
    
    IF current_setting('app.supabase_service_role_key', true) IS NULL THEN
        PERFORM set_config('app.supabase_service_role_key', 'your-service-role-key', false);
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- If settings can't be configured, log it but continue
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
        'config_warning',
        'system',
        gen_random_uuid(),
        jsonb_build_object(
            'message', 'Could not set runtime configuration',
            'error', SQLERRM,
            'timestamp', now()
        )
    );
END $$;