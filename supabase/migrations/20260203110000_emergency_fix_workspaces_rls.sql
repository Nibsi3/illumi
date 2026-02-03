-- EMERGENCY FIX: Restore workspace access
-- The previous migration broke access because is_workspace_member function may not exist
-- or the policy is too restrictive. This restores simple owner-based access.

-- Drop the broken policies
DROP POLICY IF EXISTS "workspaces_select_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_insert_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_update_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_delete_policy" ON public.workspaces;

-- Also drop any other potential policies
DROP POLICY IF EXISTS "Users can view workspaces they own or are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can delete their workspaces" ON public.workspaces;

-- Ensure RLS is enabled but NOT forced (so service role can bypass)
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Remove FORCE RLS so service role client can work
ALTER TABLE public.workspaces NO FORCE ROW LEVEL SECURITY;

-- Create simple, working policies
-- SELECT: Owner can see their workspaces, OR user_id matches in workspace_members
CREATE POLICY "workspaces_select_owner" ON public.workspaces
  FOR SELECT USING (
    auth.uid() = owner_id
  );

-- Also allow viewing if user is a member (separate policy to avoid function dependency)
CREATE POLICY "workspaces_select_member" ON public.workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = id
        AND (wm.user_id = auth.uid() OR wm.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
        AND wm.status IN ('active', 'pending')
    )
  );

-- INSERT: Only owner can create
CREATE POLICY "workspaces_insert_owner" ON public.workspaces
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
  );

-- UPDATE: Only owner can update
CREATE POLICY "workspaces_update_owner" ON public.workspaces
  FOR UPDATE USING (
    auth.uid() = owner_id
  );

-- DELETE: Only owner can delete
CREATE POLICY "workspaces_delete_owner" ON public.workspaces
  FOR DELETE USING (
    auth.uid() = owner_id
  );
