/*
  # Fix Security Issues: Anon SELECT Grants and Storage Bucket Listing

  ## Summary
  Addresses two classes of security issues identified in the security audit:

  1. **Revoke anon SELECT on admin-only tables**
     Tables `activity_logs`, `lead_activities`, `lead_notes`, `leads`, and `team_members`
     are only meant to be accessed by authenticated admin users. The `anon` role had a
     broad SELECT grant, making these tables (names, columns, relationships) visible via
     the public pg_graphql introspection endpoint at `/graphql/v1`.
     Fix: revoke SELECT from anon on all five tables.

  2. **Hide public-content tables from GraphQL introspection**
     Tables `portfolio_projects`, `site_content`, and `site_settings` are intentionally
     public (the website reads them as unauthenticated visitors). We keep the anon SELECT
     grant so PostgREST can serve them, but we hide them from pg_graphql introspection
     using the `@omit` directive comment so they do not appear in the public GraphQL schema.

  3. **Narrow storage SELECT policy for logos bucket**
     The existing "Public can view logos" policy allows listing all files in the bucket.
     This is replaced with a policy that restricts SELECT to authenticated users only
     for listing, while object URLs remain publicly accessible via the CDN without
     requiring a signed URL or this policy at all.

  ## Tables Modified
  - `activity_logs` — REVOKE SELECT FROM anon
  - `lead_activities` — REVOKE SELECT FROM anon
  - `lead_notes` — REVOKE SELECT FROM anon
  - `leads` — REVOKE SELECT FROM anon
  - `team_members` — REVOKE SELECT FROM anon
  - `portfolio_projects` — hidden from GraphQL introspection via @omit comment
  - `site_content` — hidden from GraphQL introspection via @omit comment
  - `site_settings` — hidden from GraphQL introspection via @omit comment

  ## Storage Changes
  - Drop broad "Public can view logos" SELECT policy
  - Add narrower policy allowing authenticated users to list/read logos objects
    (public CDN URLs continue to work without any policy)

  ## Notes
  1. Revoking the grant does NOT affect RLS policies — existing authenticated-only
     policies remain in place and continue to work for admin users.
  2. The anon INSERT policy on `leads` is intentionally kept (contact form submissions).
  3. Public CDN access to logo files does not go through storage.objects RLS at all —
     it uses the bucket's public flag — so removing the broad SELECT policy does not
     break the logo display on the site.
*/

-- ────────────────────────────────────────────────────────────
-- 1. Revoke anon SELECT on admin-only tables
-- ────────────────────────────────────────────────────────────
REVOKE SELECT ON public.activity_logs   FROM anon;
REVOKE SELECT ON public.lead_activities FROM anon;
REVOKE SELECT ON public.lead_notes      FROM anon;
REVOKE SELECT ON public.leads           FROM anon;
REVOKE SELECT ON public.team_members    FROM anon;

-- ────────────────────────────────────────────────────────────
-- 2. Hide public-content tables from pg_graphql introspection
--    The @omit directive tells pg_graphql to exclude these from
--    the public schema while PostgREST REST access is unaffected.
-- ────────────────────────────────────────────────────────────
COMMENT ON TABLE public.portfolio_projects IS E'@graphql({"totalCount": {"enabled": true}})';
COMMENT ON TABLE public.site_content       IS E'@graphql({"totalCount": {"enabled": true}})';
COMMENT ON TABLE public.site_settings      IS E'@graphql({"totalCount": {"enabled": true}})';

DO $$
BEGIN
  -- Hide portfolio_projects from graphql
  EXECUTE $q$
    COMMENT ON TABLE public.portfolio_projects IS E'@omit'
  $q$;
  -- Hide site_content from graphql
  EXECUTE $q$
    COMMENT ON TABLE public.site_content IS E'@omit'
  $q$;
  -- Hide site_settings from graphql
  EXECUTE $q$
    COMMENT ON TABLE public.site_settings IS E'@omit'
  $q$;
END $$;

-- ────────────────────────────────────────────────────────────
-- 3. Narrow storage SELECT policy for logos bucket
--    Drop the broad "Public can view logos" policy that allows
--    any client to list all files. Replace with authenticated-only.
--    Public CDN object URLs work via the bucket's public flag
--    and do not require this policy.
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;

CREATE POLICY "Authenticated users can view logos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'logos');
