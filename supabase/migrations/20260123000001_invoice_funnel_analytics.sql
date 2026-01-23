CREATE OR REPLACE FUNCTION public.log_invoice_funnel_event()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_name text;
  v_invoice_id text;
BEGIN
  v_invoice_id := NEW.id::text;

  IF TG_OP = 'INSERT' THEN
    v_event_name := 'invoice_created';
  ELSIF TG_OP = 'UPDATE' THEN
    IF (NEW.status IS DISTINCT FROM OLD.status) THEN
      IF NEW.status = 'sent' THEN
        v_event_name := 'invoice_sent';
      ELSIF NEW.status = 'paid' THEN
        v_event_name := 'invoice_paid';
      ELSE
        RETURN NEW;
      END IF;
    ELSE
      RETURN NEW;
    END IF;
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.app_analytics_events (
    event_name,
    user_id,
    user_email,
    path,
    referrer,
    anonymous_id,
    session_id,
    user_agent,
    ip,
    properties
  ) VALUES (
    v_event_name,
    NEW.user_id,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
      'invoice_id', v_invoice_id,
      'invoice_number', NEW.invoice_number,
      'workspace_id', NEW.workspace_id,
      'customer_id', NEW.customer_id,
      'status', NEW.status,
      'total', NEW.total,
      'currency', NEW.currency,
      'source', 'db_trigger'
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS invoices_funnel_analytics_trigger ON public.invoices;
CREATE TRIGGER invoices_funnel_analytics_trigger
AFTER INSERT OR UPDATE OF status ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.log_invoice_funnel_event();
