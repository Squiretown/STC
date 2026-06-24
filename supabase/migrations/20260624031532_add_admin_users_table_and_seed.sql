/*
  # Add admin_users table and seed known admin

  - Creates admin_users to track provisioned admins
  - Replaces the existing is_admin() stub with a real implementation
  - Seeds info@squiretown.co as the initial admin
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages admin_users"
  ON admin_users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Update is_admin() to query the admin_users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Seed known admin
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'info@squiretown.co'
ON CONFLICT (user_id) DO NOTHING;
