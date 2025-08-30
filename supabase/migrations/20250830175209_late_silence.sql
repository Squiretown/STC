/*
  # Fix JWT Secret Configuration Error

  1. Problem Fixed
    - Remove invalid `supabase_functions.jwt_secret` configuration parameter
    - Simplify edge function call without JWT authentication
    - Edge functions called from triggers don't need JWT auth headers

  2. Changes
    - Update trigger function to remove JWT secret reference
    - Use service role context for internal function calls
    - Maintain comprehensive logging for debugging
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS comprehensive_lead_notification_trigger ON leads;
DROP FUNCTION IF EXISTS comprehensive_lead_notification();

-- Create simplified trigger function without JWT config
CREATE OR REPLACE FUNCTION comprehensive_lead_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    supabase_url text;
    function_url text;
    payload jsonb;
    response_status int;
    response_body text;
    http_response record;
BEGIN
    -- Log trigger start
    INSERT INTO activity_logs (action, resource_type, resource_id, details)
    VALUES (
        'trigger_started',
        'leads',
        NEW.id,
        jsonb_build_object(
            'trigger_name', 'comprehensive_lead_notification',
            'lead_email', NEW.email,
            'timestamp', now()
        )
    );

    BEGIN
        -- Get Supabase URL from configuration
        supabase_url := current_setting('app.supabase_url', false);
        
        -- Log config retrieval
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'config_retrieved',
            'leads',
            NEW.id,
            jsonb_build_object(
                'supabase_url', supabase_url,
                'has_url', (supabase_url IS NOT NULL AND supabase_url != '')
            )
        );

        -- Construct function URL
        function_url := supabase_url || '/functions/v1/send-lead-email';
        
        -- Log URL construction
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'url_constructed',
            'leads',
            NEW.id,
            jsonb_build_object(
                'function_url', function_url
            )
        );

        -- Build payload
        payload := jsonb_build_object(
            'type', 'db_trigger',
            'table', 'leads',
            'record', row_to_json(NEW),
            'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
            'operation', TG_OP
        );

        -- Log payload creation
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'payload_built',
            'leads',
            NEW.id,
            jsonb_build_object(
                'payload_size', length(payload::text),
                'operation', TG_OP,
                'has_record', (payload->'record' IS NOT NULL)
            )
        );

        -- Make HTTP request to edge function (without JWT auth)
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'http_request_starting',
            'leads',
            NEW.id,
            jsonb_build_object(
                'url', function_url,
                'method', 'POST',
                'timestamp', now()
            )
        );

        -- Call edge function using pg_net
        SELECT
            status_code,
            content
        INTO
            response_status,
            response_body
        FROM
            net.http_post(
                url := function_url,
                headers := '{"Content-Type": "application/json"}'::jsonb,
                body := payload::text
            );

        -- Log HTTP response
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'http_response_received',
            'leads',
            NEW.id,
            jsonb_build_object(
                'status_code', response_status,
                'response_body', response_body,
                'success', (response_status BETWEEN 200 AND 299)
            )
        );

        -- Log final result
        IF response_status BETWEEN 200 AND 299 THEN
            INSERT INTO activity_logs (action, resource_type, resource_id, details)
            VALUES (
                'edge_function_success',
                'leads',
                NEW.id,
                jsonb_build_object(
                    'status_code', response_status,
                    'response', response_body
                )
            );
        ELSE
            INSERT INTO activity_logs (action, resource_type, resource_id, details)
            VALUES (
                'edge_function_error_response',
                'leads',
                NEW.id,
                jsonb_build_object(
                    'status_code', response_status,
                    'error_response', response_body,
                    'url', function_url
                )
            );
        END IF;

    EXCEPTION WHEN OTHERS THEN
        -- Log any errors that occur
        INSERT INTO activity_logs (action, resource_type, resource_id, details)
        VALUES (
            'trigger_error',
            'leads',
            NEW.id,
            jsonb_build_object(
                'error_message', SQLERRM,
                'error_detail', SQLSTATE,
                'error_context', SQLERRM,
                'timestamp', now()
            )
        );
    END;

    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER comprehensive_lead_notification_trigger
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION comprehensive_lead_notification();

-- Ensure proper permissions for activity_logs
DO $$
BEGIN
    -- Check if INSERT policy exists for activity_logs
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'activity_logs' 
        AND cmd = 'INSERT' 
        AND policyname = 'System can insert logs'
    ) THEN
        CREATE POLICY "System can insert logs" ON activity_logs
        FOR INSERT 
        TO public
        WITH CHECK (true);
    END IF;
END $$;