-- MC-Check: Supabase table for MC verifications
-- Run this in the Supabase SQL Editor to create the table and RLS policies.

-- Table: mc_verifications
CREATE TABLE IF NOT EXISTS public.mc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mc_number TEXT NOT NULL,
  carrier TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  approved BOOLEAN NOT NULL DEFAULT false,
  entered_by TEXT NOT NULL,
  notes TEXT,
  date_entered DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for sorting by created_at (list view)
CREATE INDEX IF NOT EXISTS idx_mc_verifications_created_at
  ON public.mc_verifications (created_at DESC);

-- Index for search (MC#, carrier, entered_by)
CREATE INDEX IF NOT EXISTS idx_mc_verifications_mc_number
  ON public.mc_verifications (mc_number);
CREATE INDEX IF NOT EXISTS idx_mc_verifications_carrier
  ON public.mc_verifications (carrier);
CREATE INDEX IF NOT EXISTS idx_mc_verifications_entered_by
  ON public.mc_verifications (entered_by);
CREATE INDEX IF NOT EXISTS idx_mc_verifications_date_entered
  ON public.mc_verifications (date_entered DESC);

-- If you already created the table without notes/date_entered, run this instead:
-- ALTER TABLE public.mc_verifications ADD COLUMN IF NOT EXISTS notes TEXT;
-- ALTER TABLE public.mc_verifications ADD COLUMN IF NOT EXISTS date_entered DATE NOT NULL DEFAULT CURRENT_DATE;

-- Optional: enable Row Level Security (RLS)
ALTER TABLE public.mc_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: allow anonymous read/write for development (replace with auth later if needed)
CREATE POLICY "Allow all for mc_verifications"
  ON public.mc_verifications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Or for authenticated users only (uncomment and remove the policy above if you use auth):
-- CREATE POLICY "Authenticated users can do all"
--   ON public.mc_verifications
--   FOR ALL
--   TO authenticated
--   USING (true)
--   WITH CHECK (true);
