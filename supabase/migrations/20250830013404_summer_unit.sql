/*
  # Comprehensive Lead Notification Trigger with Extensive Logging

  1. New Functions
    - `log_activity` - Helper function for detailed logging
    - `comprehensive_lead_notification` - Main trigger function with step-by-step logging
  
  2. Updated Triggers
    - Replace existing trigger with comprehensive logging version
  
  3. Logging Details
    - Every step of the trigger execution is logged
    - HTTP request/response details captured
    - Configuration values logged for debugging
    - Error handling with detailed error information
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS send_lead_notification_trigger ON leads;
DROP FUNCTION IF EXISTS send_lead_notification();

-- Helper function for detailed logging
CREATE OR REPLACE FUNCTION log_activity(
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_details jsonb DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (action, resource_type, resource_id, details)
  VALUES (p_action, p_resource_type, p_resource_id, p_details);
EXCEPTION WHEN OTHERS THEN
  -- If logging fails, don't break the main operation
  RAISE WARNING 'Failed to log activity: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comprehensive lead notification function
CREATE OR REPLACE FUNCTION comprehensive_lead_notification() RETURNS TRIGGER AS $$
DECLARE
  supabase_url text;
  service_role_key text;
  edge_function_url text;
  request_payload jsonb;
  response_data jsonb;
  http_response jsonb;
  step_counter integer := 1;
BEGIN
  -- Step 1: Log trigger start
  PERFORM log_activity(
    'trigger_started', 
    'leads', 
    NEW.id, 
    jsonb_build_object(
      'step', step_counter,
      'trigger_name', 'comprehensive_lead_notification',
      'lead_name', NEW.name,
      'lead_email', NEW.email,
      'timestamp', now()
    )
  );
  step_counter := step_counter + 1;

  -- Step 2: Get configuration values
  BEGIN
    supabase_url := current_setting('app.supabase_url', true);
    service_role_key := current_setting('app.supabase_service_role_key', true);
    
    PERFORM log_activity(
      'config_retrieved', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'supabase_url_set', (supabase_url IS NOT NULL AND supabase_url != ''),
        'service_role_key_set', (service_role_key IS NOT NULL AND service_role_key != ''),
        'supabase_url_preview', CASE 
          WHEN supabase_url IS NOT NULL THEN left(supabase_url, 30) || '...'
          ELSE 'NULL'
        END,
        'service_key_preview', CASE 
          WHEN service_role_key IS NOT NULL THEN left(service_role_key, 20) || '...'
          ELSE 'NULL'
        END
      )
    );
    step_counter := step_counter + 1;
  EXCEPTION WHEN OTHERS THEN
    PERFORM log_activity(
      'config_error', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'error', SQLERRM,
        'error_detail', SQLSTATE
      )
    );
    RETURN NEW;
  END;

  -- Step 3: Validate configuration
  IF supabase_url IS NULL OR supabase_url = '' THEN
    PERFORM log_activity(
      'config_validation_failed', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'error', 'supabase_url not configured',
        'remedy', 'Run: SELECT set_config(''app.supabase_url'', ''YOUR_URL'', false);'
      )
    );
    RETURN NEW;
  END IF;

  IF service_role_key IS NULL OR service_role_key = '' THEN
    PERFORM log_activity(
      'config_validation_failed', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'error', 'service_role_key not configured',
        'remedy', 'Run: SELECT set_config(''app.supabase_service_role_key'', ''YOUR_KEY'', false);'
      )
    );
    RETURN NEW;
  END IF;

  step_counter := step_counter + 1;

  -- Step 4: Build edge function URL
  edge_function_url := supabase_url || '/functions/v1/send-lead-email';
  
  PERFORM log_activity(
    'url_constructed', 
    'leads', 
    NEW.id, 
    jsonb_build_object(
      'step', step_counter,
      'edge_function_url', edge_function_url,
      'url_length', length(edge_function_url)
    )
  );
  step_counter := step_counter + 1;

  -- Step 5: Build request payload
  request_payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'leads',
    'record', jsonb_build_object(
      'id', NEW.id,
      'name', NEW.name,
      'email', NEW.email,
      'phone', NEW.phone,
      'company', NEW.company,
      'service', NEW.service,
      'message', NEW.message,
      'created_at', NEW.created_at
    ),
    'schema', 'public'
  );

  PERFORM log_activity(
    'payload_built', 
    'leads', 
    NEW.id, 
    jsonb_build_object(
      'step', step_counter,
      'payload_size', length(request_payload::text),
      'payload_keys', jsonb_object_keys(request_payload),
      'record_id', NEW.id,
      'record_name', NEW.name
    )
  );
  step_counter := step_counter + 1;

  -- Step 6: Check if net extension functions are available
  BEGIN
    -- Test if we can access the net functions
    PERFORM net.http_post;
  EXCEPTION WHEN OTHERS THEN
    PERFORM log_activity(
      'net_extension_unavailable', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'error', SQLERRM,
        'error_state', SQLSTATE,
        'note', 'pg_net extension may not be enabled or accessible'
      )
    );
    RETURN NEW;
  END;

  step_counter := step_counter + 1;

  -- Step 7: Make HTTP request to edge function
  BEGIN
    PERFORM log_activity(
      'http_request_starting', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'url', edge_function_url,
        'method', 'POST',
        'payload_preview', left(request_payload::text, 200) || '...'
      )
    );
    
    step_counter := step_counter + 1;

    -- Execute the HTTP request
    SELECT INTO http_response net.http_post(
      url := edge_function_url,
      body := request_payload,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key,
        'User-Agent', 'Supabase-Trigger/1.0'
      ),
      timeout_milliseconds := 10000
    );

    -- Step 8: Log HTTP response
    PERFORM log_activity(
      'http_response_received', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'status_code', COALESCE(http_response->>'status_code', 'unknown'),
        'response_body_preview', left(COALESCE(http_response->>'body', ''), 500),
        'response_headers', http_response->'headers',
        'full_response', http_response
      )
    );
    step_counter := step_counter + 1;

    -- Step 9: Check response status
    IF (http_response->>'status_code')::integer BETWEEN 200 AND 299 THEN
      PERFORM log_activity(
        'edge_function_success', 
        'leads', 
        NEW.id, 
        jsonb_build_object(
          'step', step_counter,
          'status_code', http_response->>'status_code',
          'message', 'Edge function called successfully'
        )
      );
    ELSE
      PERFORM log_activity(
        'edge_function_error_response', 
        'leads', 
        NEW.id, 
        jsonb_build_object(
          'step', step_counter,
          'status_code', http_response->>'status_code',
          'error_body', http_response->>'body',
          'full_response', http_response
        )
      );
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Step 10: Log any HTTP request errors
    PERFORM log_activity(
      'http_request_failed', 
      'leads', 
      NEW.id, 
      jsonb_build_object(
        'step', step_counter,
        'error_message', SQLERRM,
        'error_state', SQLSTATE,
        'error_context', 'HTTP request to edge function failed',
        'url_attempted', edge_function_url
      )
    );
  END;

  -- Always return NEW to allow the lead insertion to succeed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER comprehensive_lead_notification_trigger
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION comprehensive_lead_notification();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION comprehensive_lead_notification() TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION log_activity(text, text, uuid, jsonb) TO postgres, anon, authenticated, service_role;