ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS hide_illumi_branding boolean NOT NULL DEFAULT false;
