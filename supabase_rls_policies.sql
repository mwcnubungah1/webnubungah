-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) & POLICIES SCHEMA
-- MEDIA TRANSPARANSI MWC NU BUNGAH
-- ====================================================================
--
-- CARA PENGGUNAAN:
-- 1. Buka dashboard Supabase Anda (https://supabase.com).
-- 2. Pilih Proyek Supabase Anda.
-- 3. Masuk ke menu "SQL Editor" di panel kiri.
-- 4. Klik "New Query", salin seluruh isi file SQL ini, lalu klik "Run".
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. AKTIFKAN ROW LEVEL SECURITY (RLS) DI SELURUH TABEL
-- --------------------------------------------------------------------
ALTER TABLE public.kader ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kas_dana ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.koin_s3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persuratan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usaha ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sarana_ibadah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sarana_pendidikan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dokumentasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aspirasi ENABLE ROW LEVEL SECURITY;


-- --------------------------------------------------------------------
-- 2. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: KADER
-- --------------------------------------------------------------------
-- Publik / Pengunjung umum dapat melihat data kader (Read-Only)
CREATE POLICY "Kader dapat dilihat oleh publik secara transparan" 
ON public.kader FOR SELECT 
TO public 
USING (true);

-- Pengurus dengan akun terautentikasi dapat mengelola data kader (Write)
CREATE POLICY "Kader dapat dikelola oleh pengurus terautentikasi" 
ON public.kader FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 3. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: PENGURUS
-- --------------------------------------------------------------------
CREATE POLICY "Pengurus dapat dilihat oleh publik secara transparan" 
ON public.pengurus FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Pengurus dapat dikelola oleh pengurus terautentikasi" 
ON public.pengurus FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 4. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: KEGIATAN
-- --------------------------------------------------------------------
CREATE POLICY "Kegiatan dapat dilihat oleh publik secara transparan" 
ON public.kegiatan FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Kegiatan dapat dikelola oleh pengurus terautentikasi" 
ON public.kegiatan FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 5. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: KAS_DANA (KEUANGAN)
-- --------------------------------------------------------------------
CREATE POLICY "Arus Kas dapat dilihat oleh publik secara transparan" 
ON public.kas_dana FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Arus Kas dapat dikelola oleh pengurus terautentikasi" 
ON public.kas_dana FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 6. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: KOIN_S3
-- --------------------------------------------------------------------
CREATE POLICY "Laporan Koin S3 dapat dilihat oleh publik secara transparan" 
ON public.koin_s3 FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Laporan Koin S3 dapat dikelola oleh pengurus terautentikasi" 
ON public.koin_s3 FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 7. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: PERSURATAN
-- --------------------------------------------------------------------
-- Khusus persuratan, karena berisikan dokumen internal MWC, kita batasi:
-- HANYA pengurus terautentikasi yang bisa melihat & mengelola persuratan.
CREATE POLICY "Persuratan hanya dapat diakses oleh pengurus terautentikasi" 
ON public.persuratan FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 8. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: USAHA
-- --------------------------------------------------------------------
CREATE POLICY "Aset Usaha dapat dilihat oleh publik secara transparan" 
ON public.usaha FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Aset Usaha dapat dikelola oleh pengurus terautentikasi" 
ON public.usaha FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 9. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: SARANA_IBADAH
-- --------------------------------------------------------------------
CREATE POLICY "Sarana Ibadah dapat dilihat oleh publik secara transparan" 
ON public.sarana_ibadah FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Sarana Ibadah dapat dikelola oleh pengurus terautentikasi" 
ON public.sarana_ibadah FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 10. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: SARANA_PENDIDIKAN
-- --------------------------------------------------------------------
CREATE POLICY "Sarana Pendidikan dapat dilihat oleh publik secara transparan" 
ON public.sarana_pendidikan FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Sarana Pendidikan dapat dikelola oleh pengurus terautentikasi" 
ON public.sarana_pendidikan FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 11. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: BERITA
-- --------------------------------------------------------------------
CREATE POLICY "Berita dapat dilihat oleh publik secara transparan" 
ON public.berita FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Berita dapat dikelola oleh pengurus terautentikasi" 
ON public.berita FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 12. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: DOKUMENTASI
-- --------------------------------------------------------------------
CREATE POLICY "Dokumentasi dapat dilihat oleh publik secara transparan" 
ON public.dokumentasi FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Dokumentasi dapat dikelola oleh pengurus terautentikasi" 
ON public.dokumentasi FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- --------------------------------------------------------------------
-- 13. KEBIJAKAN AKSES (POLICIES) UNTUK TABEL: ASPIRASI
-- --------------------------------------------------------------------
-- Laporan aspirasi masuk:
-- 1. Publik / Warga dapat melakukan INSERT untuk mengirim aspirasi baru
-- 2. Pengurus terautentikasi dapat melakukan SELECT, UPDATE, DELETE untuk mengelolanya
CREATE POLICY "Warga dapat mengirimkan aspirasi baru" 
ON public.aspirasi FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Aspirasi hanya dapat dikelola oleh pengurus terautentikasi" 
ON public.aspirasi FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
