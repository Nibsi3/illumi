CREATE TABLE IF NOT EXISTS public.app_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  event_name TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  anonymous_id TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip TEXT,
  properties JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS app_analytics_events_created_at_idx ON public.app_analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS app_analytics_events_event_name_idx ON public.app_analytics_events (event_name);
CREATE INDEX IF NOT EXISTS app_analytics_events_path_idx ON public.app_analytics_events (path);
CREATE INDEX IF NOT EXISTS app_analytics_events_user_id_idx ON public.app_analytics_events (user_id);
CREATE INDEX IF NOT EXISTS app_analytics_events_anonymous_id_idx ON public.app_analytics_events (anonymous_id);

ALTER TABLE public.app_analytics_events ENABLE ROW LEVEL SECURITY;
