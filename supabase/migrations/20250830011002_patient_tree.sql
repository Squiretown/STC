/*
  # Fix edge function trigger for lead notifications

  1. Problems Fixed
    - Remove duplicate/conflicting trigger functions
    - Fix pg_net extension usage
    - Correct edge function URL format
    - Add proper authentication headers
    - Improve error handling and logging

  2. Changes
    - Drop existing problematic triggers and functions
    - Create new streamlined trigger function
    - Set up proper edge function invocation
    - Add comprehensive logging to activity_logs

  3. Security
    - Trigger runs with SECURITY DEFINER privileges
    - Proper authentication headers for edge function
    - Safe error handling that doesn't break lead insertion
*/

-- Drop existing triggers that might conflict
DROP TRIGGER IF EXISTS on_lead_created ON leads;
DROP TRIGGER IF EXISTS send_lead_email ON leads;
DROP TRIGGER IF EXISTS send_lead_email_notification ON leads;

-- Drop existing trigger functions that might conflict
DROP FUNCTION IF EXISTS notify_lead_submission() CASCADE;
DROP FUNCTION IF EXISTS handle_new_lead() CASCADE;
DROP FUNCTION IF EXISTS trigger_send_lead_email() CASCADE;

-- Create a new, clean trigger function
CREATE OR REPLACE FUNCTION send_lead_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    response_data jsonb;
    request_id bigint;
    supabase_url text;
    service_role_key text;
    edge_function_url text;
    payload jsonb;
BEGIN
    -- Log trigger start
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
        'trigger_started',
        'leads',
        NEW.id,
        jsonb_build_object(
            'trigger_name', 'send_lead_notification',
            'timestamp', now()
        )
    );

    -- Get configuration
    supabase_url := current_setting('app.supabase_url', true);
    service_role_key := current_setting('app.supabase_service_role_key', true);

    -- Check if configuration is available
    IF supabase_url IS NULL OR service_role_key IS NULL THEN
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'trigger_config_error',
            'leads',
            NEW.id,
            jsonb_build_object(
                'error', 'Missing Supabase configuration',
                'has_url', supabase_url IS NOT NULL,
                'has_key', service_role_key IS NOT NULL
            )
        );
        -- Return NEW so lead insertion continues even if email fails
        RETURN NEW;
    END IF;

    -- Build edge function URL
    edge_function_url := supabase_url || '/functions/v1/send-lead-email';

    -- Prepare payload
    payload := jsonb_build_object(
        'type', 'INSERT',
        'table', 'leads',
        'record', row_to_json(NEW)
    );

    -- Log the attempt
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
        'edge_function_call_attempt',
        'leads',
        NEW.id,
        jsonb_build_object(
            'url', edge_function_url,
            'payload_size', length(payload::text)
        )
    );

    -- Call the edge function using pg_net
    BEGIN
        SELECT INTO request_id
            net.http_post(
                url := edge_function_url,
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || service_role_key
                ),
                body := payload
            );

        -- Log successful request submission
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'edge_function_called',
            'leads',
            NEW.id,
            jsonb_build_object(
                'request_id', request_id,
                'url', edge_function_url,
                'status', 'request_submitted'
            )
        );

    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the trigger
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'edge_function_error',
            'leads',
            NEW.id,
            jsonb_build_object(
                'error', SQLERRM,
                'sqlstate', SQLSTATE,
                'url', edge_function_url
            )
        );
    END;

    -- Return NEW to continue with the lead insertion
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER send_lead_notification_trigger
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION send_lead_notification();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA net TO postgres;

-- Set up configuration (you'll need to update these with your actual values)
-- Run these commands in the SQL editor with your actual values:
-- SELECT set_config('app.supabase_url', 'https://your-project.supabase.co', false);
-- SELECT set_config('app.supabase_service_role_key', 'your-service-role-key', false);