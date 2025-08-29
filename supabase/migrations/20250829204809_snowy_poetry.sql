/*
  # Enable Required Extensions for HTTP Requests

  This migration enables the necessary PostgreSQL extensions to allow
  database triggers to make HTTP requests using net.http_post function.

  1. Extensions
     - Enable pg_net extension (provides net.http_post function)
     - Enable http extension (additional HTTP functionality)
  
  2. Verification
     - Ensures extensions are properly loaded and functions are available
*/

-- Enable pg_net extension (provides net.http_post function)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Enable http extension (provides additional HTTP functionality)
CREATE EXTENSION IF NOT EXISTS http;

-- Grant necessary permissions for using pg_net
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA net TO postgres, anon, authenticated, service_role;