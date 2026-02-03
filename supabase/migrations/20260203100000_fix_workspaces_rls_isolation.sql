-- CRITICAL SECURITY FIX: Ensure workspaces are properly isolated per user
-- Issue: Workspaces are visible across all accounts
-- This migration drops all existing workspace policies and recreates them with strict isolation

-- ============================================
-- DROP ALL EXISTING WORKSPACE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view workspaces they own or are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can delete their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Anyone can view workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Public can view workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Authenticated users can view workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.workspaces;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.workspaces;
DROP POLICY IF EXISTS "Enable update for users based on owner_id" ON public.workspaces;
DROP POLICY IF EXISTS "Enable delete for users based on owner_id" ON public.workspaces;

-- Ensure RLS is enabled
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner (important for service role queries via RPC if needed)
ALTER TABLE public.workspaces FORCE ROW LEVEL SECURITY;

-- ============================================
-- RECREATE STRICT WORKSPACE POLICIES
-- ============================================

-- SELECT: User must own the workspace OR be an active member
CREATE POLICY "workspaces_select_policy" ON public.workspaces
  FOR SELECT USING (
    auth.uid() = owner_id 
    OR public.is_workspace_member(id, auth.uid())
  );

-- INSERT: User can only create workspaces they own
CREATE POLICY "workspaces_insert_policy" ON public.workspaces
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
  );

-- UPDATE: Only owner can update
CREATE POLICY "workspaces_update_policy" ON public.workspaces
  FOR UPDATE USING (
    auth.uid() = owner_id
  );

-- DELETE: Only owner can delete
CREATE POLICY "workspaces_delete_policy" ON public.workspaces
  FOR DELETE USING (
    auth.uid() = owner_id
  );

-- ============================================
-- ALSO FIX WORKSPACE_MEMBERS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Members can view their workspace members" ON public.workspace_members;
DROP POLICY IF EXISTS "Owners and admins can invite members" ON public.workspace_members;
DROP POLICY IF EXISTS "Owners can update members" ON public.workspace_members;
DROP POLICY IF EXISTS "Owners can remove members" ON public.workspace_members;
DROP POLICY IF EXISTS "Anyone can view workspace members" ON public.workspace_members;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.workspace_members;

-- Ensure RLS is enabled
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members FORCE ROW LEVEL SECURITY;

-- SELECT: Can view if you're the workspace owner, or if you're a member of that workspace
CREATE POLICY "workspace_members_select_policy" ON public.workspace_members
  FOR SELECT USING (
    -- User is the workspace owner
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
    OR
    -- User is themselves a member (by user_id or email)
    user_id = auth.uid()
    OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- INSERT: Only workspace owner can invite
CREATE POLICY "workspace_members_insert_policy" ON public.workspace_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
  );

-- UPDATE: Only workspace owner can update members
CREATE POLICY "workspace_members_update_policy" ON public.workspace_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
  );

-- DELETE: Only workspace owner can remove members
CREATE POLICY "workspace_members_delete_policy" ON public.workspace_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.owner_id = auth.uid())
  );
