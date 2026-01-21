DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'oauth_access_tokens'
  ) THEN
    EXECUTE 'ALTER TABLE public.oauth_access_tokens ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.oauth_access_tokens FORCE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.oauth_access_tokens FROM anon, authenticated';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users_on_team'
  ) THEN
    EXECUTE 'ALTER TABLE public.users_on_team ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.users_on_team FORCE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.users_on_team FROM anon, authenticated';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invoice_comments'
  ) THEN
    EXECUTE 'ALTER TABLE public.invoice_comments ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.invoice_comments FORCE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.invoice_comments FROM anon, authenticated';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inbox_embeddings'
  ) THEN
    EXECUTE 'ALTER TABLE public.inbox_embeddings ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.inbox_embeddings FORCE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.inbox_embeddings FROM anon, authenticated';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transaction_match_suggestions'
  ) THEN
    EXECUTE 'ALTER TABLE public.transaction_match_suggestions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.transaction_match_suggestions FORCE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.transaction_match_suggestions FROM anon, authenticated';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transaction_embeddings'
  ) THEN
    EXECUTE 'ALTER TABLE public.transaction_embeddings ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.transaction_embeddings FORCE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.transaction_embeddings FROM anon, authenticated';
  END IF;
END
$$;
