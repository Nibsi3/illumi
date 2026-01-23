-- CRITICAL SECURITY FIX: Remove overly permissive RLS policies that expose all data
-- Issue: "Anyone can view invoices by id for payment" policy uses USING (true), allowing
-- any authenticated or anonymous user to see ALL invoices across ALL workspaces.
-- Same issue exists for invoice_items.

-- ============================================
-- FIX INVOICES TABLE RLS
-- ============================================

-- Drop the dangerous "anyone can view" policy
DROP POLICY IF EXISTS "Anyone can view invoices by id for payment" ON public.invoices;

-- Drop existing user-based policies to recreate with proper workspace isolation
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can view invoices in their workspaces" ON public.invoices;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can insert invoices in their workspaces" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update invoices in their workspaces" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete invoices in their workspaces" ON public.invoices;

-- Create proper workspace-isolated SELECT policy for authenticated users
CREATE POLICY "Users can view invoices in their workspaces" ON public.invoices
  FOR SELECT USING (
    -- User owns the invoice directly
    auth.uid() = user_id
    OR
    -- User is a member of the workspace (owner or member)
    (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

-- INSERT: User must be authenticated and either own or be member of workspace
CREATE POLICY "Users can insert invoices in their workspaces" ON public.invoices
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      workspace_id IS NULL
      OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
      OR public.is_workspace_member(workspace_id, auth.uid())
    )
  );

-- UPDATE: Same workspace isolation
CREATE POLICY "Users can update invoices in their workspaces" ON public.invoices
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

-- DELETE: Same workspace isolation
CREATE POLICY "Users can delete invoices in their workspaces" ON public.invoices
  FOR DELETE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

-- ============================================
-- FIX INVOICE_ITEMS TABLE RLS
-- ============================================

-- Drop the dangerous "anyone can view" policy
DROP POLICY IF EXISTS "Anyone can view invoice items for payment" ON public.invoice_items;

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Users can view their invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can view invoice items for accessible invoices" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can insert their invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can insert invoice items for accessible invoices" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update their invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update invoice items for accessible invoices" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete their invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete invoice items for accessible invoices" ON public.invoice_items;

-- SELECT: Must have access to the parent invoice
CREATE POLICY "Users can view invoice items for accessible invoices" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_id 
      AND (
        i.user_id = auth.uid()
        OR (
          i.workspace_id IS NOT NULL 
          AND (
            EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = i.workspace_id AND w.owner_id = auth.uid())
            OR public.is_workspace_member(i.workspace_id, auth.uid())
          )
        )
      )
    )
  );

-- INSERT: Must have access to parent invoice
CREATE POLICY "Users can insert invoice items for accessible invoices" ON public.invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_id 
      AND (
        i.user_id = auth.uid()
        OR (
          i.workspace_id IS NOT NULL 
          AND (
            EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = i.workspace_id AND w.owner_id = auth.uid())
            OR public.is_workspace_member(i.workspace_id, auth.uid())
          )
        )
      )
    )
  );

-- UPDATE: Must have access to parent invoice
CREATE POLICY "Users can update invoice items for accessible invoices" ON public.invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_id 
      AND (
        i.user_id = auth.uid()
        OR (
          i.workspace_id IS NOT NULL 
          AND (
            EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = i.workspace_id AND w.owner_id = auth.uid())
            OR public.is_workspace_member(i.workspace_id, auth.uid())
          )
        )
      )
    )
  );

-- DELETE: Must have access to parent invoice
CREATE POLICY "Users can delete invoice items for accessible invoices" ON public.invoice_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_id 
      AND (
        i.user_id = auth.uid()
        OR (
          i.workspace_id IS NOT NULL 
          AND (
            EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = i.workspace_id AND w.owner_id = auth.uid())
            OR public.is_workspace_member(i.workspace_id, auth.uid())
          )
        )
      )
    )
  );

-- ============================================
-- FIX PRODUCTS TABLE RLS (add workspace isolation)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can view products in their workspaces" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products in their workspaces" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update products in their workspaces" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete products in their workspaces" ON public.products;

CREATE POLICY "Users can view products in their workspaces" ON public.products
  FOR SELECT USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

CREATE POLICY "Users can insert products in their workspaces" ON public.products
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      workspace_id IS NULL
      OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
      OR public.is_workspace_member(workspace_id, auth.uid())
    )
  );

CREATE POLICY "Users can update products in their workspaces" ON public.products
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

CREATE POLICY "Users can delete products in their workspaces" ON public.products
  FOR DELETE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

-- ============================================
-- FIX CUSTOMERS TABLE RLS (ensure workspace isolation)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view customers in their workspaces" ON public.customers;
DROP POLICY IF EXISTS "Users can insert their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert customers in their workspaces" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers in their workspaces" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers in their workspaces" ON public.customers;

CREATE POLICY "Users can view customers in their workspaces" ON public.customers
  FOR SELECT USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

CREATE POLICY "Users can insert customers in their workspaces" ON public.customers
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      workspace_id IS NULL
      OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
      OR public.is_workspace_member(workspace_id, auth.uid())
    )
  );

CREATE POLICY "Users can update customers in their workspaces" ON public.customers
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

CREATE POLICY "Users can delete customers in their workspaces" ON public.customers
  FOR DELETE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

-- ============================================
-- FIX PAYMENTS TABLE RLS
-- ============================================

DROP POLICY IF EXISTS "Users can view their payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view payments for accessible invoices" ON public.payments;

CREATE POLICY "Users can view payments for accessible invoices" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_id 
      AND (
        i.user_id = auth.uid()
        OR (
          i.workspace_id IS NOT NULL 
          AND (
            EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = i.workspace_id AND w.owner_id = auth.uid())
            OR public.is_workspace_member(i.workspace_id, auth.uid())
          )
        )
      )
    )
  );

-- ============================================
-- FIX EXPENSES TABLE RLS (add workspace isolation)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can view expenses in their workspaces" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert expenses in their workspaces" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update expenses in their workspaces" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete expenses in their workspaces" ON public.expenses;

CREATE POLICY "Users can view expenses in their workspaces" ON public.expenses
  FOR SELECT USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

CREATE POLICY "Users can insert expenses in their workspaces" ON public.expenses
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      workspace_id IS NULL
      OR EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
      OR public.is_workspace_member(workspace_id, auth.uid())
    )
  );

CREATE POLICY "Users can update expenses in their workspaces" ON public.expenses
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

CREATE POLICY "Users can delete expenses in their workspaces" ON public.expenses
  FOR DELETE USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL 
      AND (
        EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
        OR public.is_workspace_member(workspace_id, auth.uid())
      )
    )
  );

-- ============================================
-- FIX WORKSPACE_PAYGATE_SETTINGS RLS (ensure owner access)
-- ============================================

DROP POLICY IF EXISTS "Workspace members can view paygate settings" ON public.workspace_paygate_settings;
DROP POLICY IF EXISTS "Workspace owners can manage paygate settings" ON public.workspace_paygate_settings;

CREATE POLICY "Workspace members can view paygate settings" ON public.workspace_paygate_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
    OR public.is_workspace_member(workspace_id, auth.uid())
  );

-- Allow workspace owners to insert/update/delete paygate settings
CREATE POLICY "Workspace owners can manage paygate settings" ON public.workspace_paygate_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
  );
