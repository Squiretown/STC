/*
  # Enable pg_net extension for HTTP requests

  This migration enables the pg_net extension which provides the net.http_post function
  needed for database triggers to make HTTP requests to Edge Functions.

  1. Extensions
     - Enable pg_net extension (provides net.http_post function)
  
  2. Verification
     - Check that the extension is properly enabled
     - Verify net.http_post function is available
*/

-- Enable pg_net extension (allows HTTP requests from database)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA net TO postgres, anon, authenticated, service_role;

-- Create a simple test to verify the extension is working
DO $$
BEGIN
  -- Try to call the function to verify it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'http_post' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'net')
  ) THEN
    RAISE NOTICE 'pg_net extension successfully enabled - net.http_post function is available';
  ELSE
    RAISE WARNING 'pg_net extension may not be properly enabled - net.http_post function not found';
  END IF;
END $$;