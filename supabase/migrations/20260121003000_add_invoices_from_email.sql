ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS from_email text;
