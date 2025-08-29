/*
  # Enable pg_net extension for HTTP requests

  This migration enables the pg_net extension which provides the net.http_post() 
  function required by the lead email notification trigger.

  1. Extensions
    - Enable pg_net extension for HTTP functionality
*/

-- Enable the pg_net extension for HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net;