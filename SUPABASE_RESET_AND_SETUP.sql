-- ====================================================================
-- SUPABASE RESET & CLEAN SETUP SQL SCRIPT
-- MEDIA TRANSPARANSI MWC NU BUNGAH
-- ====================================================================
--
-- CARA PENGGUNAAN:
-- 1. Buka dashboard Supabase Anda (https://supabase.com).
-- 2. Pilih Proyek Supabase Anda.
-- 3. Masuk ke menu "SQL Editor" di panel kiri.
-- 4. Klik "New Query", hapus isi editor kosong, lalu tempelkan (paste) seluruh kode script SQL ini.
-- 5. Klik tombol "Run" di kanan bawah.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. HAPUS SEMUA TABEL DAN POLISI LAMA (RESET TOTAL KECUALI KOIN S3)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS public.kader CASCADE;
DROP TABLE IF EXISTS public.pengurus CASCADE;
DROP TABLE IF EXISTS public.kegiatan CASCADE;
DROP TABLE IF EXISTS public.kas_dana CASCADE;
-- public.koin_s3 dipertahankan dan tidak di-DROP agar datanya tetap aman!
DROP TABLE IF EXISTS public.persuratan CASCADE;
DROP TABLE IF EXISTS public.usaha CASCADE;
DROP TABLE IF EXISTS public.sarana_ibadah CASCADE;
DROP TABLE IF EXISTS public.sarana_pendidikan CASCADE;
DROP TABLE IF EXISTS public.berita CASCADE;
DROP TABLE IF EXISTS public.dokumentasi CASCADE;
DROP TABLE IF EXISTS public.aspirasi CASCADE;
DROP TABLE IF EXISTS public.ranting CASCADE;


-- --------------------------------------------------------------------
-- 2. MEMBUAT ULANG STRUKTUR TABEL DENGAN KOLOM SNAKE_CASE YANG PRESISI
-- --------------------------------------------------------------------

-- TABEL: KADER (Untuk menyimpan database 364+ kader)
CREATE TABLE public.kader (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pob TEXT,
  dob TEXT,
  gender TEXT DEFAULT 'Laki-laki',
  banom TEXT DEFAULT 'Lainnya',
  role TEXT,
  ranting_id TEXT,
  phone TEXT,
  join_year INTEGER DEFAULT 2020,
  photo_url TEXT,
  unsur TEXT,
  address TEXT,
  angkatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: PENGURUS (MWC & Ranting)
CREATE TABLE public.pengurus (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  category TEXT DEFAULT 'Ranting',
  ranting_id TEXT,
  phone TEXT,
  email TEXT,
  kaderisasi_status TEXT DEFAULT 'Belum',
  education TEXT,
  photo_url TEXT,
  group_type TEXT,
  group_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: KEGIATAN
CREATE TABLE public.kegiatan (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  location TEXT,
  organizer TEXT,
  target_group TEXT,
  funding_source TEXT,
  budget DOUBLE PRECISION DEFAULT 0,
  status TEXT DEFAULT 'Rencana',
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: KAS_DANA (Transparansi Arus Keuangan)
CREATE TABLE public.kas_dana (
  id TEXT PRIMARY KEY,
  date TEXT,
  type TEXT,
  category TEXT,
  amount DOUBLE PRECISION DEFAULT 0,
  description TEXT,
  pic TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: KOIN_S3 (Laporan Koin Sehat Sejahtera Sosial)
-- Dibuat menggunakan CREATE TABLE IF NOT EXISTS agar tidak error saat deploy awal & data tetap aman jika sudah ada
CREATE TABLE IF NOT EXISTS public.koin_s3 (
  id TEXT PRIMARY KEY,
  month TEXT,
  ranting_id TEXT,
  amount DOUBLE PRECISION DEFAULT 0,
  distribution_target TEXT,
  distribution_amount DOUBLE PRECISION DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: PERSURATAN (Log Surat Masuk & Keluar)
CREATE TABLE public.persuratan (
  id TEXT PRIMARY KEY,
  letter_number TEXT,
  type TEXT,
  code TEXT,
  sender_or_recipient TEXT,
  date TEXT,
  subject TEXT,
  attachment_url TEXT,
  tembusan TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: USAHA (Aset Wirausaha Jamiyah)
CREATE TABLE public.usaha (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  location TEXT,
  manager TEXT,
  status TEXT DEFAULT 'Aktif',
  revenue DOUBLE PRECISION DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: SARANA_IBADAH (Masjid & Musholla Afiliasi NU)
CREATE TABLE public.sarana_ibadah (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  takmir TEXT,
  imam1 TEXT,
  imam2 TEXT,
  nu_affiliation TEXT,
  land_status TEXT,
  address TEXT,
  ranting_id TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: SARANA_PENDIDIKAN (Sekolah, TPQ, Ponpes LP Ma'arif NU)
CREATE TABLE public.sarana_pendidikan (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT,
  status TEXT,
  principal TEXT,
  student_count INTEGER DEFAULT 0,
  phone TEXT,
  condition TEXT,
  address TEXT,
  ranting_id TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: BERITA (Warta Keagamaan & Pengumuman MWC)
CREATE TABLE public.berita (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  content TEXT,
  image_url TEXT,
  date TEXT,
  author TEXT,
  drive_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: DOKUMENTASI (Galeri Foto & Video)
CREATE TABLE public.dokumentasi (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  url TEXT,
  date TEXT,
  category TEXT,
  drive_url TEXT,
  additional_images TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABEL: ASPIRASI (Aspirasi Warga masuk ke Admin)
CREATE TABLE public.aspirasi (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  ranting_id TEXT,
  subject TEXT,
  message TEXT,
  date TEXT,
  status TEXT DEFAULT 'Masuk',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- --------------------------------------------------------------------
-- 3. MENGAKTIFKAN ROW LEVEL SECURITY (RLS) DI SETIAP TABEL
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
-- 4. MEMBUAT KEBIJAKAN AKSES KEAMANAN (POLICIES)
-- --------------------------------------------------------------------

-- Kebijakan: KADER (Publik bisa melihat secara transparan, Pengurus bisa mengelola penuh)
CREATE POLICY "Kader dapat dilihat oleh publik secara transparan" ON public.kader FOR SELECT TO public USING (true);
CREATE POLICY "Kader dapat dikelola oleh pengurus terautentikasi" ON public.kader FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: PENGURUS
CREATE POLICY "Pengurus dapat dilihat oleh publik secara transparan" ON public.pengurus FOR SELECT TO public USING (true);
CREATE POLICY "Pengurus dapat dikelola oleh pengurus terautentikasi" ON public.pengurus FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: KEGIATAN
CREATE POLICY "Kegiatan dapat dilihat oleh publik secara transparan" ON public.kegiatan FOR SELECT TO public USING (true);
CREATE POLICY "Kegiatan dapat dikelola oleh pengurus terautentikasi" ON public.kegiatan FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: KAS_DANA
CREATE POLICY "Arus Kas dapat dilihat oleh publik secara transparan" ON public.kas_dana FOR SELECT TO public USING (true);
CREATE POLICY "Arus Kas dapat dikelola oleh pengurus terautentikasi" ON public.kas_dana FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: KOIN_S3
DROP POLICY IF EXISTS "Laporan Koin S3 dapat dilihat oleh publik secara transparan" ON public.koin_s3;
DROP POLICY IF EXISTS "Laporan Koin S3 dapat dikelola oleh pengurus terautentikasi" ON public.koin_s3;
CREATE POLICY "Laporan Koin S3 dapat dilihat oleh publik secara transparan" ON public.koin_s3 FOR SELECT TO public USING (true);
CREATE POLICY "Laporan Koin S3 dapat dikelola oleh pengurus terautentikasi" ON public.koin_s3 FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: PERSURATAN (Hanya Admin Pengurus Terautentikasi yang bisa melihat atau mengelola surat internal)
CREATE POLICY "Persuratan hanya dapat diakses oleh pengurus terautentikasi" ON public.persuratan FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: USAHA
CREATE POLICY "Aset Usaha dapat dilihat oleh publik secara transparan" ON public.usaha FOR SELECT TO public USING (true);
CREATE POLICY "Aset Usaha dapat dikelola oleh pengurus terautentikasi" ON public.usaha FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: SARANA_IBADAH
CREATE POLICY "Sarana Ibadah dapat dilihat oleh publik secara transparan" ON public.sarana_ibadah FOR SELECT TO public USING (true);
CREATE POLICY "Sarana Ibadah dapat dikelola oleh pengurus terautentikasi" ON public.sarana_ibadah FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: SARANA_PENDIDIKAN
CREATE POLICY "Sarana Pendidikan dapat dilihat oleh publik secara transparan" ON public.sarana_pendidikan FOR SELECT TO public USING (true);
CREATE POLICY "Sarana Pendidikan dapat dikelola oleh pengurus terautentikasi" ON public.sarana_pendidikan FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: BERITA
CREATE POLICY "Berita dapat dilihat oleh publik secara transparan" ON public.berita FOR SELECT TO public USING (true);
CREATE POLICY "Berita dapat dikelola oleh pengurus terautentikasi" ON public.berita FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: DOKUMENTASI
CREATE POLICY "Dokumentasi dapat dilihat oleh publik secara transparan" ON public.dokumentasi FOR SELECT TO public USING (true);
CREATE POLICY "Dokumentasi dapat dikelola oleh pengurus terautentikasi" ON public.dokumentasi FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Kebijakan: ASPIRASI (Warga Umum bisa mengirim / insert, Pengurus bisa membaca / mengelola)
CREATE POLICY "Warga dapat mengirimkan aspirasi baru" ON public.aspirasi FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Aspirasi hanya dapat dikelola oleh pengurus terautentikasi" ON public.aspirasi FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- --------------------------------------------------------------------
-- 5. MEMASUKKAN SEED DATA DUMMY AWAL (SEEDS) LANGSUNG KE SUPABASE
-- --------------------------------------------------------------------

-- SEED DATA: KADER (5 Data Kader Teratas dari CSV)
INSERT INTO public.kader (id, name, pob, dob, gender, banom, role, ranting_id, phone, join_year, unsur, address, angkatan) VALUES
('k-csv-1', 'ABDUL MUJIB', 'GRESIK', '10 JULI 1972', 'Laki-laki', 'Lainnya', 'PENGURUS', 'r6', '', 2016, 'MWC NU', 'KISIK BUNGAH GRESIK', 'II'),
('k-csv-2', 'AHMAD RIFQI BADRUZZAMAN', 'GRESIK', '20 JULI 1989', 'Laki-laki', 'Lainnya', 'PENGURUS', 'r17', '085733170030', 2016, 'PC LPBI SERNU', 'BUNGAH GRESIK', 'II'),
('k-csv-3', 'AZHARUR ROFIQI', 'GRESIK', '27 MARET 1985', 'Laki-laki', 'Lainnya', 'WAKIL SEKRETARIS', 'r3', '085646437416', 2016, 'PC PERGUNU', 'BEDANTEN BUNGAH GRESIK', 'II'),
('k-csv-4', 'M. DHIYAUDDIN', 'GRESIK', '06 JANUARI 1986', 'Laki-laki', 'Lainnya', 'WAKIL KETUA', 'r19', '085859666601', 2016, 'PC LESBUMI', 'GUMENG BUNGAH GRESIK', 'II'),
('k-csv-5', 'M. NAWAWI', 'GRESIK', '15 APRIL 1957', 'Laki-laki', 'Lainnya', 'A''WAN', 'r17', '085707014140', 2016, 'PCNU', 'BUNGAH GRESIK', 'II');

-- SEED DATA: PENGURUS
INSERT INTO public.pengurus (id, name, role, category, ranting_id, phone, email, kaderisasi_status, education, photo_url) VALUES
('p1', 'KH. Soeratin Abbas', 'Syuriah (Rais)', 'MWC', 'mwc', '08123260605', 'rais@mwcnubungah.or.id', 'Penyetaraan', 'Pesantren', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('p2', 'KH. Muhammad Ala''uddin, LC, M.SEI', 'Tanfidziyah (Ketua)', 'MWC', 'mwc', '087854116511', 'ketua@mwcnubungah.or.id', 'MKNU', 'S2', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
('p3', 'KH FATKHAN ANWARI, S.Ag.', 'Rois Syuriyah', 'Ranting', 'r1', '081543445767', 'fathan@mail.com', 'BELUM', 'S1', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'),
('p4', 'MUHAMMAD YASIN, ST', 'Tanfidziyah', 'Ranting', 'r1', '082132317474', 'yasin@mail.com', 'BELUM', 'S1', NULL),
('p5', 'KH. Rofiqul Amin, S.Pd.', 'Rois Syuriyah', 'Ranting', 'r3', '081332570991', 'rofiq@mail.com', 'PD-PKPNU', 'S1', NULL);

-- SEED DATA: KEGIATAN
INSERT INTO public.kegiatan (id, title, date, location, organizer, target_group, funding_source, budget, status, image_url, description) VALUES
('e1', 'RTL PD PKP 40 MWC NU Bungah', '2025-01-11', 'Gedung MWCNU Bungah', 'MWC NU BUNGAH', 'Kader PKP 40 (93 orang)', 'Kas Jamiyah', 2700000, 'Selesai', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80', 'Rencana Tindak Lanjut Pendidikan Kader Penggerak angkatan ke-40 se-Kecamatan Bungah.'),
('e2', 'Pendidikan Kader Penggerak (PD PKP 40)', '2025-01-03', 'Gedung MWCNU Bungah', 'MWC NU BUNGAH', 'Panitia dan Peserta MWCNU (93 orang)', 'Kas Jamiyah', 27400000, 'Selesai', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80', 'Pendidikan kader penggerak utama untuk memperkokoh militansi kader di MWC NU Bungah.'),
('e3', 'PD-PKPNU Angkatan 35', '2024-08-09', 'UNIVERSITAS QOMARUDDIN', 'MWC NU BUNGAH', 'Kader MWC Bungah (63 orang)', 'Kas Jamiyah', 21300000, 'Selesai', 'https://images.unsplash.com/photo-1531206715517-5c0ba140e2b8?w=800&auto=format&fit=crop&q=80', 'Pendidikan Kader Penggerak Nahdlatul Ulama tingkat MWC yang bertempat di kompleks Universitas Qomaruddin.');

-- SEED DATA: KAS_DANA (Keuangan)
INSERT INTO public.kas_dana (id, date, type, category, amount, description, pic, image_url) VALUES
('f1', '2026-06-01', 'Masuk', 'Iuran Anggota', 12500000, 'Iuran wajib syahriyah dari jajaran PRNU se-Kecamatan Bungah', 'H. Khoirul Anam', NULL),
('f2', '2026-06-10', 'Masuk', 'Donasi Publik', 7500000, 'Infaq kotak amal kantor MWC NU dan donatur tetap bulanan', 'Zainul Arifin, M.Pd.I.', NULL),
('f3', '2026-06-12', 'Keluar', 'Operasional Kantor', 1800000, 'Pembayaran tagihan listrik, internet kantor, dan ATK operasional sekretariat MWC', 'Sekretariat', NULL);

-- SEED DATA: KOIN_S3 (Menggunakan ON CONFLICT DO NOTHING agar data koin S3 Laziznu yang sudah ada tidak terhapus atau tertimpa!)
INSERT INTO public.koin_s3 (id, month, ranting_id, amount, distribution_target, distribution_amount, image_url) VALUES
('s1', '2026-06', 'mwc', 350000000, 'RSNU PCNU GRESIK', 250000000, NULL),
('s2', '2026-06', 'r1', 10000000, 'Santunan & Pendidikan JAM''IYAH ABAR-ABIR', 10000000, NULL),
('s3', '2026-06', 'r3', 8000000, 'Rumah dhuafa Bedanten', 6000000, NULL)
ON CONFLICT (id) DO NOTHING;

-- SEED DATA: PERSURATAN
INSERT INTO public.persuratan (id, letter_number, type, code, sender_or_recipient, date, subject, attachment_url, tembusan) VALUES
('sr1', '112/MWC.NU-Bungah/A.I/VI/2026', 'Keluar', 'A.I (Internal)', 'Seluruh Pimpinan Ranting NU se-Kecamatan Bungah', '2026-06-28', 'Undangan Rapat Pleno Rutin Evaluasi Triwulan Koin S3 LAZISNU', NULL, 'PCNU Gresik'),
('sr2', 'PC-11/A-V/G-31/V/2026', 'Masuk', 'A-V (Instruksi PCNU)', 'PCNU Kabupaten Gresik', '2026-06-24', 'Instruksi Pengerahan Pasukan Banser Pengamanan Istighosah Kubro', NULL, NULL);

-- SEED DATA: USAHA
INSERT INTO public.usaha (id, name, type, location, manager, status, revenue, image_url) VALUES
('u1', 'RSI MABARROT MWCNU BUNGAH', 'Jasa', 'Jl. Raya Masangan no. 1D', 'MWC NU BUNGAH', 'Aktif', 900000000, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'),
('u2', 'KBIHU MWCNU Bungah', 'Jasa', 'Jl. Raya Bungah No. 63', 'MWC NU BUNGAH', 'Aktif', 100000000, 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80'),
('u3', 'ST SCALA TECNIQUE JASA ENGINEERING', 'Jasa', 'DESA ABAR-ABIR, BUNGAH', 'PRNU ABAR-ABIR', 'Aktif', 2500000000, 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80');

-- SEED DATA: SARANA_IBADAH
INSERT INTO public.sarana_ibadah (id, name, type, takmir, imam1, imam2, nu_affiliation, land_status, address, ranting_id, image_url) VALUES
('si1', 'MASJID BAITUL ABROR', 'Masid', 'KH FATKHAN ANWARI, S.Ag.', 'KH FATKHAN ANWARI, S.Ag', 'FAIDIR ROHMAN, S.Ag.', 'Milik NU', 'Wakaf NU', 'Desa Abar-Abir, Bungah, Gresik', 'r1', NULL),
('si2', 'Masjid Baitul Muttaqin', 'Masjid', 'KH. Rofiqul Amin', 'H. Suyuti', 'H. Nur Halim', 'Milik NU', 'Wakaf NU', 'PRNU Bedanten, Bungah', 'r3', NULL),
('si3', 'Masjid Jami'' Kiai Gede', 'Masjid', 'Drs. K.H. M. Nawawi, M.Ag.', 'K.H. Masykuri Hasan', 'K.H. Ali Mustofa', 'Milik NU', 'Wakaf NU', 'PRNU Bungah, Gresik', 'r17', NULL);

-- SEED DATA: SARANA_PENDIDIKAN
INSERT INTO public.sarana_pendidikan (id, name, level, status, principal, student_count, phone, condition, address, ranting_id, image_url) VALUES
('se1', 'KBMNU 47 AL ANWAR', 'TK/RA', 'Swasta NU', 'SAYIDAH DIANA. S.Ag', 50, '81543445767', 'Baik', 'PRNU ABAR-ABIR', 'r1', NULL),
('se2', 'MI AL MA''ARIF ABAR-ABIR', 'MI', 'Swasta NU', 'SULISTIANAH', 250, '85745510965', 'Baik', 'PRNU ABAR-ABIR', 'r1', NULL),
('se3', 'RAM NU 67 WALISONGO ABAR ABIR', 'TK/RA', 'Swasta NU', 'ZUNIA PUTRI', 100, '82143679494', 'Baik', 'PRNU ABAR-ABIR', 'r1', NULL);

-- SEED DATA: BERITA
INSERT INTO public.berita (id, title, category, content, image_url, date, author, drive_url) VALUES
('n1', 'Laporan Konsolidasi Database Integrasi Jamiyah MWC NU Bungah 2026', 'Warta Jamiyah', '# Integrasi Data Terpadu MWC NU Bungah 2026\n\nBungah, Gresik — Pengurus Majelis Wakil Cabang Nahdlatul Ulama (MWC NU) Bungah mempublikasikan dokumen resmi konsolidasi database organisasi, aset, sarana, pembinaan, dan kelembagaan tahun akumulasi 2026.\n\n## Langkah Strategis Kemandirian Organisasi\nKetua Tanfidziyah MWC NU Bungah menekankan pentingnya pengarsipan digital yang terpadu demi transparansi dana koin kemaslahatan, log persuratan yang tertib, serta perlindungan aset tanah wakaf NU.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', '2026-07-07', 'Admin MWC NU Bungah', NULL);

-- SEED DATA: DOKUMENTASI
INSERT INTO public.dokumentasi (id, title, type, url, date, category, drive_url) VALUES
('d1', 'Rapat Kerja Pengurus MWC NU Bungah', 'Foto', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80', '2026-07-02', 'Rapat', NULL),
('d2', 'Penyaluran Koin Sehat RSNU Gresik', 'Foto', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80', '2026-06-25', 'Kegiatan', NULL);

-- SEED DATA: ASPIRASI
INSERT INTO public.aspirasi (id, name, phone, email, ranting_id, subject, message, date, status, image_url) VALUES
('as1', 'Ahmad Muzakki', '085731110099', 'muzakki@gmail.com', 'r1', 'Pengadaan Paving Halaman TPQ', 'Kami dari pengurus TPQ memohon izin mengajukan stimulan dana koin S3 untuk perbaikan dan pemasangan paving halaman TPQ agar nyaman bagi santri saat musim hujan.', '2026-07-06', 'Masuk', NULL);
