```sql
-- Remove the insecure RLS policy that allows anonymous users to select all leads
DROP POLICY IF EXISTS leads_select_anon_after_insert ON public.leads;

-- Remove the duplicate anonymous insert policy
-- Note: You might need to find the exact name if it's not 'Allow anonymous lead insertion'
-- You can check policy names in your Supabase dashboard under Authentication -> Policies
DROP POLICY IF EXISTS "leads_insert_anon" ON public.leads;

-- If you want to keep only one anonymous insert policy, ensure this one exists and is correct:
-- CREATE POLICY "Allow anonymous lead insertion" ON public.leads
--   FOR INSERT WITH CHECK (true);
-- (This policy should already exist based on your schema, so no need to re-add unless it was removed)

-- Ensure authenticated users can still insert leads (if needed for admin panel)
-- CREATE POLICY "Allow authenticated lead insertion" ON public.leads
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- (This policy should already exist based on your schema, so no need to re-add unless it was removed)

-- Verify that the remaining policies for authenticated users are sufficient for admin operations:
-- "Authenticated users can delete leads"
-- "Authenticated users can update leads"
-- "Authenticated users can view all leads"
```