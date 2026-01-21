-- Allow workspace members (not just owners) to read shared workspace data.
-- Fixes: invited members seeing client names as "Unknown" due to RLS blocking customers/invoices.

-- Customers: expand SELECT policy to include workspace membership
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
CREATE POLICY "Users can view their own customers" ON public.customers
  FOR SELECT USING (
    auth.uid() = user_id OR
    (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
  );

-- Invoices: expand SELECT policy to include workspace membership
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT USING (
    auth.uid() = user_id OR
    (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
  );
