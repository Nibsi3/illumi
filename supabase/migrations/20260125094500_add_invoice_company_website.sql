ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS company_website text;
