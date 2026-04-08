/*
  # Security Hardening

  ## Overview
  This migration addresses three security warnings:
  1. `notify_new_lead()` function had a mutable search path - now hardened with
     `SET search_path = public`.
  2. "System can insert activity logs" policy on `activity_logs` was granted to
     `public` - now restricted to `service_role` only.
  3. "Anonymous can submit leads" policy on `leads` had `WITH CHECK (true)` -
     now validates that `email` is non-null and non-empty.

  ## Notes
  - Logic for `notify_new_lead()` is preserved identically, with only the
    `SET search_path = public` clause added before the `AS $$` block.
  - Policies are dropped and recreated to tighten their roles/checks.
*/

-- ============================================================================
-- 1. Harden notify_new_lead() with SET search_path = public
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- ============================================================================
-- 2. Restrict activity_logs insert policy to service_role
-- ============================================================================

DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;

CREATE POLICY "System can insert activity logs"
  ON activity_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- 3. Tighten anonymous lead submission policy with email validation
-- ============================================================================

DROP POLICY IF EXISTS "Anonymous can submit leads" ON leads;

CREATE POLICY "Anonymous can submit leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (email IS NOT NULL AND length(trim(email)) > 0);
