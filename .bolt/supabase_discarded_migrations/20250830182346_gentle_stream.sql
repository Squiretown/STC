/*
  # Remove problematic triggers causing JWT secret error

  1. Issues Fixed
     - Drop all triggers that reference invalid configuration parameters
     - Remove functions that try to access "supabase_functions.jwt_secret"
     - Clean up trigger functions causing lead insertion failures

  2. Actions Taken
     - Drop all existing lead notification triggers
     - Drop problematic trigger functions
     - This will allow lead insertion to work without notification errors

  3. Notes
     - Lead submission will work normally after this migration
     - Email notifications can be re-implemented later if needed
     - Prioritizing functional lead capture over notifications
*/

-- Drop all existing triggers on leads table
DROP TRIGGER IF EXISTS comprehensive_lead_notification_trigger ON leads;
DROP TRIGGER IF EXISTS trigger_lead_created ON leads;
DROP TRIGGER IF EXISTS trigger_send_email_notification ON leads;

-- Drop the problematic trigger functions
DROP FUNCTION IF EXISTS comprehensive_lead_notification();
DROP FUNCTION IF EXISTS trigger_send_lead_email();

-- Clean up any remaining references
-- This ensures lead insertion works without configuration errors