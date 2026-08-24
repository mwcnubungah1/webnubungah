-- ====================================================================
-- MIGRATION: Menambahkan kolom kader_id ke tabel pengurus
-- Jalankan script ini di SQL Editor Supabase Dashboard Anda
-- ====================================================================

-- 1. Tambah kolom kader_id (nullable, untuk link ke tabel kader)
ALTER TABLE public.pengurus ADD COLUMN IF NOT EXISTS kader_id TEXT;

-- 2. Tambah index untuk performa query
CREATE INDEX IF NOT EXISTS idx_pengurus_kader_id ON public.pengurus(kader_id);

-- 3. Optional: Tambah foreign key constraint (uncomment jika ingin enforce referential integrity)
-- ALTER TABLE public.pengurus ADD CONSTRAINT fk_pengurus_kader 
--   FOREIGN KEY (kader_id) REFERENCES public.kader(id) ON DELETE SET NULL;
