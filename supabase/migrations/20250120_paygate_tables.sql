-- Paygate settings table (public config, RLS enabled)
CREATE TABLE IF NOT EXISTS workspace_paygate_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    active_provider TEXT DEFAULT 'payfast',
    test_mode BOOLEAN DEFAULT true,
    connected_providers TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(workspace_id)
);

-- Paygate keys table (secrets, no client access - service role only)
CREATE TABLE IF NOT EXISTS workspace_paygate_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('test', 'live')),
    key_name TEXT NOT NULL,
    key_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(workspace_id, provider, mode, key_name)
);

-- Enable RLS on settings table
ALTER TABLE workspace_paygate_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for settings (workspace members can read)
CREATE POLICY "Workspace members can view paygate settings"
    ON workspace_paygate_settings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = workspace_paygate_settings.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Enable RLS on keys table but NO policies (service role only)
ALTER TABLE workspace_paygate_keys ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_paygate_settings_workspace ON workspace_paygate_settings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_paygate_keys_workspace_provider ON workspace_paygate_keys(workspace_id, provider, mode);
