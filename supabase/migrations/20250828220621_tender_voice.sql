/*
  # Add Email Notification Trigger for Leads

  1. New Functions
    - `notify_new_lead()` - Trigger function that calls the Edge Function
    
  2. New Triggers  
    - `on_lead_inserted` - Fires when new leads are inserted
    
  3. Requirements
    - Calls the `send-lead-email` Edge Function
    - Handles errors gracefully without breaking lead insertion
    - Uses HTTP extension for calling external functions
*/

-- Enable the HTTP extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http;

-- Create function to handle new lead notifications
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS trigger AS $$
DECLARE
    function_url text;
    payload json;
    response http_response;
BEGIN
    -- Construct the Edge Function URL
    -- Replace with your actual Supabase project URL
    function_url := current_setting('app.supabase_url', true) || '/functions/v1/send-lead-email';
    
    -- If the setting doesn't exist, use a default pattern
    -- You'll need to update this with your actual Supabase project URL
    IF function_url IS NULL OR function_url = '' THEN
        -- Update this URL with your actual Supabase project URL
        function_url := 'https://pbwkpdpofrndpgsqzgig.supabase.co/functions/v1/send-lead-email';
    END IF;

    -- Create payload with the new lead data
    payload := json_build_object(
        'record', row_to_json(NEW),
        'table', 'leads',
        'type', 'INSERT'
    );

    -- Call the Edge Function
    BEGIN
        SELECT * INTO response FROM http((
            'POST',
            function_url,
            ARRAY[http_header('Content-Type', 'application/json')],
            payload::text
        )::http_request);
        
        -- Log successful email notification
        RAISE LOG 'Lead email notification sent for lead ID: %', NEW.id;
        
    EXCEPTION WHEN others THEN
        -- Log the error but don't fail the insert
        RAISE LOG 'Failed to send email notification for lead ID: %. Error: %', NEW.id, SQLERRM;
    END;

    -- Always return NEW to ensure the insert continues
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_lead_inserted ON public.leads;

-- Create the trigger
CREATE TRIGGER on_lead_inserted
    AFTER INSERT ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_lead();

-- Add a comment for documentation
COMMENT ON FUNCTION public.notify_new_lead() IS 'Sends email notification via Edge Function when new leads are inserted';
COMMENT ON TRIGGER on_lead_inserted ON public.leads IS 'Triggers email notification for new lead submissions';