-- Improve invoices list performance (workspace-scoped pagination)

CREATE INDEX IF NOT EXISTS idx_invoices_workspace_created_at
ON public.invoices (workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_workspace_customer_created_at
ON public.invoices (workspace_id, customer_id, created_at DESC);
