/*
  # Enable pg_net Extension for HTTP Requests

  1. Extension Setup
    - Enable pg_net extension to provide net.http_post() function
    - Required for database triggers to make HTTP requests to Edge Functions

  2. Security
    - Grant usage permissions to authenticated users
*/

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;