```sql
-- Drop the existing trigger
DROP TRIGGER IF EXISTS send_lead_email_notification ON public.leads;

-- Recreate the trigger to execute the correct function
CREATE TRIGGER send_lead_email_notification
AFTER INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.trigger_send_lead_email();
```