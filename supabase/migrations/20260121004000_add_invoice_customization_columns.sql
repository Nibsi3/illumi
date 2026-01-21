ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS template text,
ADD COLUMN IF NOT EXISTS invoice_mode text,
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS logo_bg text,
ADD COLUMN IF NOT EXISTS send_copy_to_self boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS recurring_end_type text,
ADD COLUMN IF NOT EXISTS recurring_end_count integer;
