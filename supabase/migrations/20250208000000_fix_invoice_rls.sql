-- Fix: Remove overly permissive RLS policies on invoices and invoice_items
-- that allow ANY authenticated user to read ALL rows.
-- Replace with workspace-member-scoped policies for team collaboration.

-- ============================================
-- INVOICES: Remove "Anyone can view" policy
-- ============================================
DROP POLICY IF EXISTS "Anyone can view invoices by id for payment" ON public.invoices;

-- Replace with workspace-member-scoped policy so team members can
-- view invoices within their workspace, but NOT invoices from other workspaces.
CREATE POLICY "Workspace members can view workspace invoices" ON public.invoices
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = invoices.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.status = 'active'
    )
  );

-- ============================================
-- INVOICE ITEMS: Remove "Anyone can view" policy
-- ============================================
DROP POLICY IF EXISTS "Anyone can view invoice items for payment" ON public.invoice_items;

-- Replace with workspace-member-scoped policy
CREATE POLICY "Workspace members can view workspace invoice items" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_items.invoice_id
      AND (
        i.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.workspace_members wm
          WHERE wm.workspace_id = i.workspace_id
          AND wm.user_id = auth.uid()
          AND wm.status = 'active'
        )
      )
    )
  );
