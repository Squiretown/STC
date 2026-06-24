-- Re-grant the missing privileges on leads to the authenticated role.
-- The authenticated role needs full CRUD for the admin dashboard.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;

-- Also verify the other admin tables are correct while we're here
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_activities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;