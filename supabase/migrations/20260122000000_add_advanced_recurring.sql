-- Add advanced recurring invoice fields
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS recurring_day_of_week INTEGER CHECK (recurring_day_of_week BETWEEN 0 AND 6),
ADD COLUMN IF NOT EXISTS recurring_day_of_month INTEGER CHECK (recurring_day_of_month BETWEEN 1 AND 31),
ADD COLUMN IF NOT EXISTS recurring_week_of_month TEXT CHECK (recurring_week_of_month IN ('first', 'second', 'third', 'fourth', 'last')),
ADD COLUMN IF NOT EXISTS recurring_custom_interval INTEGER CHECK (recurring_custom_interval > 0),
ADD COLUMN IF NOT EXISTS recurring_custom_unit TEXT CHECK (recurring_custom_unit IN ('days', 'weeks', 'months'));

-- First, update any existing invalid recurring_interval values to valid ones
-- This handles any legacy data that might exist
UPDATE public.invoices 
SET recurring_interval = 'monthly' 
WHERE recurring_interval IS NOT NULL 
  AND recurring_interval NOT IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'semi-annually', 'yearly', 'custom');

-- Update the recurring_interval constraint to include new options
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_recurring_interval_check;
ALTER TABLE public.invoices ADD CONSTRAINT invoices_recurring_interval_check 
CHECK (recurring_interval IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'semi-annually', 'yearly', 'custom'));

-- Comment on new columns
COMMENT ON COLUMN public.invoices.recurring_day_of_week IS 'Day of week for weekly/bi-weekly recurring (0=Sunday, 6=Saturday)';
COMMENT ON COLUMN public.invoices.recurring_day_of_month IS 'Day of month for monthly/quarterly/semi-annually/yearly recurring (1-31)';
COMMENT ON COLUMN public.invoices.recurring_week_of_month IS 'Week of month for monthly recurring (e.g., "fourth Thursday")';
COMMENT ON COLUMN public.invoices.recurring_custom_interval IS 'Custom interval number (e.g., 3 for "every 3 days")';
COMMENT ON COLUMN public.invoices.recurring_custom_unit IS 'Custom interval unit (days, weeks, months)';
