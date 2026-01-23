-- Ensure the invoice funnel trigger can write to app_analytics_events even when RLS is enabled.
-- This uses SECURITY DEFINER so the function runs with the privileges of its owner (migration role).

ALTER FUNCTION public.log_invoice_funnel_event() SECURITY DEFINER;
ALTER FUNCTION public.log_invoice_funnel_event() SET search_path = public;

-- Recreate trigger defensively (no-op if it already exists as expected)
DROP TRIGGER IF EXISTS invoices_funnel_analytics_trigger ON public.invoices;
CREATE TRIGGER invoices_funnel_analytics_trigger
AFTER INSERT OR UPDATE OF status ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.log_invoice_funnel_event();
