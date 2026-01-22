-- Improve invoices list performance (workspace-scoped pagination)

CREATE INDEX IF NOT EXISTS idx_invoices_workspace_created_at
ON public.invoices (workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_workspace_customer_created_at
ON public.invoices (workspace_id, customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_workspace_issue_date
ON public.invoices (workspace_id, issue_date DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_workspace_status
ON public.invoices (workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_invoices_workspace_invoice_number
ON public.invoices (workspace_id, invoice_number);

CREATE INDEX IF NOT EXISTS idx_expenses_workspace_expense_date
ON public.expenses (workspace_id, expense_date DESC);

CREATE INDEX IF NOT EXISTS idx_customers_workspace
ON public.customers (workspace_id);

CREATE INDEX IF NOT EXISTS idx_products_workspace
ON public.products (workspace_id);
