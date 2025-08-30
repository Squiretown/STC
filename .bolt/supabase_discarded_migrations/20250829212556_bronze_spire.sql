```sql
-- Remove redundant anonymous INSERT policies
DROP POLICY IF EXISTS "Allow anonymous lead submission" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_anon" ON public.leads;

-- Remove redundant authenticated SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;

-- Remove the overly permissive 'ALL' policy for authenticated users
-- This assumes the specific INSERT, SELECT, UPDATE, DELETE policies for authenticated users are sufficient.
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON public.leads;

-- CRITICAL: Remove the RLS policy that allows anonymous users to SELECT all leads
DROP POLICY IF EXISTS "leads_select_anon_after_insert" ON public.leads;

-- Optional: Rename the remaining anonymous insert policy for clarity if desired
-- ALTER POLICY "Allow anonymous lead insertion" ON public.leads RENAME TO "Allow anonymous lead submission";
```