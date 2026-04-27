/*
  # Fix GraphQL schema exposure, storage listing, and SECURITY DEFINER function access

  ## Summary
  Addresses all security advisor findings:

  1. **Table-level grants tightened** — Supabase's default `GRANT ALL ON ALL TABLES` gives every
     role every privilege at the table level; RLS then governs row access, but the broad grants
     still expose tables in the GraphQL schema to roles that should not see them.
     This migration revokes all table-level privileges and re-grants only the minimum needed:
     - `anon`: INSERT on leads (contact form), SELECT on site_content / site_settings /
       portfolio_projects (public CMS read)
     - `authenticated`: SELECT/INSERT/UPDATE/DELETE only on tables the admin dashboard uses
     - `service_role` is unaffected (bypasses RLS by design)

  2. **Storage listing removed** — The "Authenticated users can view logos" SELECT policy on
     storage.objects for the logos bucket is dropped. The bucket is already public so object
     URLs work without a policy; the SELECT policy was the only thing that allowed clients to
     enumerate (list) all files in the bucket.

  3. **SECURITY DEFINER function EXECUTE revoked** — `log_activity` and `notify_new_lead` are
     called exclusively by triggers with superuser context. Neither should be callable directly
     via REST (`/rest/v1/rpc/...`) by anon or authenticated users. EXECUTE is revoked from
     PUBLIC (which covers both anon and authenticated), then re-granted only to service_role
     so trigger infrastructure continues to work.

  ## Tables modified
  - leads, activity_logs, lead_activities, lead_notes, team_members,
    portfolio_projects, site_content, site_settings

  ## Storage modified
  - Drops policy "Authenticated users can view logos" on storage.objects

  ## Functions modified
  - log_activity: REVOKE EXECUTE FROM PUBLIC, GRANT to service_role only
  - notify_new_lead: REVOKE EXECUTE FROM PUBLIC, GRANT to service_role only

  ## Notes
  - RLS policies are unchanged; this only adjusts table-level privilege grants
  - The anon SELECT grants on site_content, site_settings, portfolio_projects are required
    for the public-facing React app (useCMS hook, useProjects hook) which runs unauthenticated
  - anon INSERT on leads is required for the contact form submission
*/

-- ─────────────────────────────────────────────────────────────
-- 1. Revoke all existing broad grants, then re-grant minimally
-- ─────────────────────────────────────────────────────────────

-- leads: anon can only INSERT (contact form); authenticated has full CRUD (admin dashboard)
REVOKE ALL ON public.leads FROM anon, authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;

-- activity_logs: internal audit table — only service_role and authenticated admin should touch it
REVOKE ALL ON public.activity_logs FROM anon, authenticated;
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;

-- lead_activities: admin-only
REVOKE ALL ON public.lead_activities FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_activities TO authenticated;

-- lead_notes: admin-only
REVOKE ALL ON public.lead_notes FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_notes TO authenticated;

-- team_members: admin-only
REVOKE ALL ON public.team_members FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;

-- portfolio_projects: public read for the Work page; admin can manage
REVOKE ALL ON public.portfolio_projects FROM anon, authenticated;
GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;

-- site_content: public read for CMS-driven pages; admin can manage
REVOKE ALL ON public.site_content FROM anon, authenticated;
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;

-- site_settings: public read for CMS settings; admin can manage
REVOKE ALL ON public.site_settings FROM anon, authenticated;
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;

-- ─────────────────────────────────────────────────────────────
-- 2. Remove storage listing policy for logos bucket
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can view logos" ON storage.objects;

-- ─────────────────────────────────────────────────────────────
-- 3. Revoke EXECUTE on SECURITY DEFINER functions from public roles
-- ─────────────────────────────────────────────────────────────

-- log_activity is called only by trigger infrastructure
REVOKE EXECUTE ON FUNCTION public.log_activity(
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_details jsonb
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.log_activity(
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_details jsonb
) TO service_role;

-- notify_new_lead is a trigger function, not a callable RPC
REVOKE EXECUTE ON FUNCTION public.notify_new_lead() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.notify_new_lead() TO service_role;
