-- Fix infinite recursion between workspaces and workspace_members RLS policies
-- Root cause: workspaces SELECT policy references workspace_members, while workspace_members SELECT policy references workspaces.
-- This migration introduces a SECURITY DEFINER helper and rewrites SELECT policies to avoid circular evaluation.

-- Helper: check if the current user belongs to a workspace without triggering RLS recursion
DROP POLICY IF EXISTS "Users can view workspaces they own or are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Members can view their workspace members" ON public.workspace_members;

CREATE OR REPLACE FUNCTION public.is_workspace_member(p_workspace_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = p_workspace_id
      AND wm.user_id = p_user_id
      AND wm.status IN ('active', 'pending')
  );
$$;

-- Workspaces: rewrite SELECT policy to use the helper function
CREATE POLICY "Users can view workspaces they own or are members of" ON public.workspaces
  FOR SELECT USING (
    auth.uid() = owner_id OR
    public.is_workspace_member(id, auth.uid())
  );

-- Workspace members: rewrite SELECT policy to use helper + direct owner check
CREATE POLICY "Members can view their workspace members" ON public.workspace_members
  FOR SELECT USING (
    public.is_workspace_member(workspace_id, auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM public.workspaces w
      WHERE w.id = workspace_id
        AND w.owner_id = auth.uid()
    )
  );
