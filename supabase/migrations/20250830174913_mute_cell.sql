/*
  # Clean up and fix lead notification triggers

  1. Remove Duplicate Triggers
    - Drop all existing conflicting triggers on leads table
    - Remove outdated trigger functions
  
  2. Create Single Comprehensive Trigger
    - One trigger function with proper error handling
    - Extensive logging for debugging
    - Proper pg_net extension usage
  
  3. Security and Permissions
    - Ensure trigger has proper permissions for activity_logs
    - Handle edge function calls safely without blocking lead insertion
*/

-- Step 1: Clean up existing triggers and functions
DROP TRIGGER IF EXISTS comprehensive_lead_notification_trigger ON leads;
DROP TRIGGER IF EXISTS trigger_lead_created ON leads;
DROP TRIGGER IF EXISTS trigger_send_email_notification ON leads;

DROP FUNCTION IF EXISTS comprehensive_lead_notification();
DROP FUNCTION IF EXISTS trigger_send_lead_email();

-- Step 2: Ensure pg_net extension is properly set up
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant necessary permissions for pg_net usage
GRANT USAGE ON SCHEMA net TO postgres, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA net TO postgres, authenticated, service_role;

-- Step 3: Create the main notification trigger function
CREATE OR REPLACE FUNCTION handle_new_lead_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net
AS $$
DECLARE
    request_id BIGINT;
    supabase_url TEXT;
    service_role_key TEXT;
    edge_function_url TEXT;
    lead_payload JSONB;
    http_response RECORD;
    log_details JSONB;
BEGIN
    -- Step 1: Log trigger start
    BEGIN
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'trigger_started',
            'leads',
            NEW.id,
            jsonb_build_object(
                'trigger_name', 'handle_new_lead_notification',
                'lead_email', NEW.email,
                'lead_name', NEW.name,
                'timestamp', NOW()
            ),
            NULL
        );
    EXCEPTION WHEN OTHERS THEN
        -- Don't fail lead insertion if logging fails
        RAISE WARNING 'Failed to log trigger start: %', SQLERRM;
    END;

    -- Step 2: Get configuration
    BEGIN
        supabase_url := current_setting('app.supabase_url', true);
        service_role_key := current_setting('app.supabase_service_role_key', true);
        
        -- Log configuration retrieval
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'config_check',
            'leads',
            NEW.id,
            jsonb_build_object(
                'has_supabase_url', CASE WHEN supabase_url IS NOT NULL AND supabase_url != '' THEN true ELSE false END,
                'has_service_role_key', CASE WHEN service_role_key IS NOT NULL AND service_role_key != '' THEN true ELSE false END,
                'supabase_url_length', COALESCE(length(supabase_url), 0),
                'key_length', COALESCE(length(service_role_key), 0)
            ),
            NULL
        );
        
        -- Check if configuration is available
        IF supabase_url IS NULL OR supabase_url = '' OR service_role_key IS NULL OR service_role_key = '' THEN
            INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
            VALUES (
                'config_missing',
                'leads',
                NEW.id,
                jsonb_build_object(
                    'error', 'Missing Supabase configuration',
                    'note', 'Run: SELECT set_config(''app.supabase_url'', ''YOUR_URL'', false); and set service_role_key'
                ),
                NULL
            );
            RETURN NEW; -- Don't fail lead insertion
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'config_error',
            'leads',
            NEW.id,
            jsonb_build_object('error', SQLERRM),
            NULL
        );
        RETURN NEW;
    END;

    -- Step 3: Build edge function URL and payload
    BEGIN
        edge_function_url := supabase_url || '/functions/v1/send-lead-email';
        
        -- Build the payload that matches what the edge function expects
        lead_payload := jsonb_build_object(
            'record', jsonb_build_object(
                'id', NEW.id,
                'name', NEW.name,
                'email', NEW.email,
                'phone', NEW.phone,
                'company', NEW.company,
                'service', NEW.service,
                'message', NEW.message,
                'created_at', NEW.created_at
            )
        );
        
        -- Log URL and payload construction
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'payload_built',
            'leads',
            NEW.id,
            jsonb_build_object(
                'edge_function_url', edge_function_url,
                'payload_size', length(lead_payload::text),
                'lead_id', NEW.id
            ),
            NULL
        );
        
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'payload_error',
            'leads',
            NEW.id,
            jsonb_build_object('error', SQLERRM),
            NULL
        );
        RETURN NEW;
    END;

    -- Step 4: Make HTTP request to edge function
    BEGIN
        -- Log attempt
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'http_request_starting',
            'leads',
            NEW.id,
            jsonb_build_object(
                'url', edge_function_url,
                'method', 'POST',
                'has_authorization', true
            ),
            NULL
        );

        -- Make the HTTP request using pg_net
        SELECT net.http_post(
            url := edge_function_url,
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || service_role_key
            ),
            body := lead_payload
        ) INTO request_id;

        -- Log request initiated
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'http_request_sent',
            'leads',
            NEW.id,
            jsonb_build_object(
                'request_id', request_id,
                'edge_function_url', edge_function_url,
                'timestamp', NOW()
            ),
            NULL
        );

        -- Optional: Check response (Note: pg_net is async, so response may not be immediate)
        SELECT * FROM net.http_collect_response(request_id, synchronous := true) INTO http_response;
        
        -- Log response details
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'http_response_received',
            'leads',
            NEW.id,
            jsonb_build_object(
                'status_code', http_response.status_code,
                'response_body', http_response.content,
                'response_headers', http_response.headers,
                'success', CASE WHEN http_response.status_code BETWEEN 200 AND 299 THEN true ELSE false END
            ),
            NULL
        );

    EXCEPTION WHEN OTHERS THEN
        -- Log the exact error
        INSERT INTO activity_logs (action, resource_type, resource_id, details, user_id)
        VALUES (
            'http_request_failed',
            'leads',
            NEW.id,
            jsonb_build_object(
                'error_code', SQLSTATE,
                'error_message', SQLERRM,
                'error_detail', SQLSTATE || ': ' || SQLERRM,
                'url_attempted', edge_function_url
            ),
            NULL
        );
    END;

    -- Always return NEW to allow lead insertion to succeed
    RETURN NEW;
END;
$$;

-- Step 5: Create the trigger
CREATE TRIGGER comprehensive_lead_notification_trigger
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_lead_notification();