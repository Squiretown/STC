/*
  # Fix admin SECURITY DEFINER function exposure and GraphQL table visibility

  ## Summary

  1. **Admin SECURITY DEFINER functions** — All 11 `admin_*` functions are callable by
     `anon` and `authenticated` via `/rest/v1/rpc/...`. These are admin-only operations
     (list leads, delete leads, dashboard stats, etc.) and must not be callable without
     explicit admin authorization. EXECUTE is revoked from PUBLIC (covers anon + authenticated)
     and re-granted only to `service_role`.

     The app's admin dashboard uses direct table queries via the `authenticated` role (not
     RPC calls to these functions), so revoking EXECUTE from anon/authenticated does not
     break any existing functionality.

  2. **GraphQL schema visibility for public tables** — `site_content`, `site_settings`, and
     `portfolio_projects` must remain SELECT-accessible to `anon` (public website reads them
     via useCMS / useProjects hooks). However, they can be hidden from the GraphQL introspection
     schema using pg_graphql comment directives, preventing enumeration via the GraphQL endpoint
     while leaving REST access intact.
*/

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Revoke EXECUTE on all admin_* SECURITY DEFINER functions from public roles
-- ─────────────────────────────────────────────────────────────────────────────

-- Revoke from PUBLIC first (covers all roles including future ones)
REVOKE EXECUTE ON FUNCTION public.admin_bulk_update_leads(uuid[], jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_create_lead_note(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_dashboard_stats() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_delete_lead(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_get_lead(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_activity_logs(integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_lead_activities(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_lead_notes(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_leads(text, text, text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_list_team_members() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_update_lead(uuid, jsonb) FROM PUBLIC, anon, authenticated;

-- Re-grant only to service_role (for any server-side or trusted internal usage)
GRANT EXECUTE ON FUNCTION public.admin_bulk_update_leads(uuid[], jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_create_lead_note(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_stats() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_delete_lead(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_get_lead(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_activity_logs(integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_lead_activities(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_lead_notes(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_leads(text, text, text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_team_members() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_update_lead(uuid, jsonb) TO service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Hide public tables from GraphQL introspection using pg_graphql directives
--    (REST API access via anon SELECT grants is preserved unchanged)
-- ─────────────────────────────────────────────────────────────────────────────

-- Hide site_content from GraphQL schema (still readable via REST /rest/v1/site_content)
COMMENT ON TABLE public.site_content IS E'@graphql({"totalCount": {"enabled": false},"select": {"visible": false},"insert": {"visible": false},"update": {"visible": false},"delete": {"visible": false}})';

-- Hide site_settings from GraphQL schema
COMMENT ON TABLE public.site_settings IS E'@graphql({"totalCount": {"enabled": false},"select": {"visible": false},"insert": {"visible": false},"update": {"visible": false},"delete": {"visible": false}})';

-- Hide portfolio_projects from GraphQL schema
COMMENT ON TABLE public.portfolio_projects IS E'@graphql({"totalCount": {"enabled": false},"select": {"visible": false},"insert": {"visible": false},"update": {"visible": false},"delete": {"visible": false}})';
