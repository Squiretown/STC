/*
  # Fix Remaining Security Issues

  ## Overview
  Addresses remaining security and performance issues from the database audit:

  ## 1. Unused Index Cleanup
  The following indexes have not been used and are being removed to reduce overhead:
  - idx_lead_activities_lead_id on lead_activities
  - idx_lead_notes_lead_id on lead_notes
  - leads_created_at_idx on leads
  - leads_email_idx on leads
  - leads_service_idx on leads

  ## 2. Function Search Path Hardening
  notify_new_lead function is updated to use a fixed search_path, preventing
  search path injection attacks where a malicious schema could shadow system functions.

  ## 3. RLS Policy Tightening
  Two policies previously had WITH CHECK (true) which allowed unrestricted access:

  - activity_logs "System can insert activity logs": Changed from public to service_role.
    SECURITY DEFINER trigger functions already bypass RLS, so this policy is only needed
    for direct service-level inserts, not public access.

  - leads "Anonymous can submit leads": Added meaningful field validation so anonymous
    users must supply non-empty name, email, and message fields. This prevents empty/junk
    submissions through the contact form.

  ## Notes
  - The "Auth DB Connection Strategy is not Percentage" issue requires a manual change
    in the Supabase dashboard under Project Settings > Database > Connection pooling.
    It cannot be fixed via SQL migration.
*/

-- ============================================================================
-- STEP 1: Drop unused indexes
-- ============================================================================

DROP INDEX IF EXISTS idx_lead_activities_lead_id;
DROP INDEX IF EXISTS idx_lead_notes_lead_id;
DROP INDEX IF EXISTS leads_created_at_idx;
DROP INDEX IF EXISTS leads_email_idx;
DROP INDEX IF EXISTS leads_service_idx;

-- ============================================================================
-- STEP 2: Fix notify_new_lead search path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS trigger AS $$
DECLARE
    function_url text;
    payload json;
BEGIN
    function_url := current_setting('app.supabase_url', true) || '/functions/v1/send-lead-email';

    IF function_url IS NULL OR function_url = '' THEN
        function_url := 'https://pbwkpdpofrndpgsqzgig.supabase.co/functions/v1/send-lead-email';
    END IF;

    payload := json_build_object(
        'record', row_to_json(NEW),
        'table', 'leads',
        'type', 'INSERT'
    );

    BEGIN
        PERFORM extensions.http((
            'POST',
            function_url,
            ARRAY[extensions.http_header('Content-Type', 'application/json')],
            'application/json',
            payload::text
        )::extensions.http_request);

        RAISE LOG 'Lead email notification sent for lead ID: %', NEW.id;

    EXCEPTION WHEN others THEN
        RAISE LOG 'Failed to send email notification for lead ID: %. Error: %', NEW.id, SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = extensions, public, pg_temp;

-- ============================================================================
-- STEP 3: Tighten overly-permissive RLS policies
-- ============================================================================

-- Activity logs: restrict INSERT to service_role only
-- (SECURITY DEFINER trigger functions bypass RLS and don't need a public policy)
DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;

CREATE POLICY "Service role can insert activity logs"
  ON activity_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Leads: add meaningful validation for anonymous contact form submissions
DROP POLICY IF EXISTS "Anonymous can submit leads" ON leads;

CREATE POLICY "Anonymous can submit leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (
    name <> '' AND
    email <> '' AND
    message <> ''
  );
