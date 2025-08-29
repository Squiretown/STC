```sql
-- Create the pg_net extension if it doesn't already exist
-- This extension is required to make HTTP requests from your database.
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage on the net schema to the postgres, anon, and authenticated roles.
-- This allows these roles to access functions within the pg_net extension.
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated;

-- Grant execute permission on the net.http_post function to the postgres, anon, and authenticated roles.
-- This specifically allows these roles to call the http_post function.
GRANT EXECUTE ON FUNCTION net.http_post(text, json, jsonb) TO postgres, anon, authenticated;

-- Optionally, if you have other pg_net functions you plan to use, you might grant execute on them as well.
-- For example:
-- GRANT EXECUTE ON FUNCTION net.http_get(text, jsonb) TO postgres, anon, authenticated;
-- GRANT EXECUTE ON FUNCTION net.http_post(text, jsonb, jsonb, text) TO postgres, anon, authenticated;

-- Verify the extension is enabled (optional, for debugging)
-- SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- Verify the function exists and permissions (optional, for debugging)
-- SELECT proname, proargnames, proargtypes::regtype[], proacl FROM pg_proc WHERE proname = 'http_post' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'net');
```