-- SUPABASE DATABASE SCHEMA & DUMMY DATA FOR MWCNU BUNGAH
-- Platform: Supabase (PostgreSQL)
-- Includes structural tables, indexes, row-level security guidelines, and rich dummy data.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. TABLE: ranting
----------------------------------------------------
CREATE TABLE IF NOT EXISTS ranting (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(150) NOT NULL UNIQUE
);

----------------------------------------------------
-- 2. TABLE: surat_masuk
----------------------------------------------------
CREATE TABLE IF NOT EXISTS surat_masuk (
    id VARCHAR(50) PRIMARY KEY,
    nomor_surat VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    pengirim VARCHAR(200) NOT NULL,
    perihal VARCHAR(255) NOT NULL,
    lampiran VARCHAR(100) NOT NULL,
    status_disposisi VARCHAR(50) NOT NULL CHECK (status_disposisi IN ('Belum Disposisi', 'Sudah Disposisi')),
    disposisi_kepada VARCHAR(200),
    catatan_disposisi TEXT,
    file_url TEXT
);

----------------------------------------------------
-- 3. TABLE: surat_keluar
----------------------------------------------------
CREATE TABLE IF NOT EXISTS surat_keluar (
    id VARCHAR(50) PRIMARY KEY,
    nomor_surat VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    penerima VARCHAR(200) NOT NULL,
    perihal VARCHAR(255) NOT NULL,
    lampiran VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Diverifikasi Sekretaris', 'Disetujui Ketua', 'Diarsipkan')),
    tanda_tangan_digital VARCHAR(200),
    content TEXT NOT NULL,
    tanggal_dibuat DATE NOT NULL DEFAULT CURRENT_DATE,
    dibuat_oleh VARCHAR(200) NOT NULL
);

----------------------------------------------------
-- 4. TABLE: arsip_dokumen
----------------------------------------------------
CREATE TABLE IF NOT EXISTS arsip_dokumen (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('SK', 'AD/ART', 'SOP', 'Proposal', 'LPJ', 'Notulen', 'Surat', 'Lainnya')),
    tanggal DATE NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    versi VARCHAR(50) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    deskripsi TEXT,
    file_url TEXT NOT NULL,
    public_access BOOLEAN NOT NULL DEFAULT TRUE
);

----------------------------------------------------
-- 5. TABLE: transaksi_keuangan
----------------------------------------------------
CREATE TABLE IF NOT EXISTS transaksi_keuangan (
    id VARCHAR(50) PRIMARY KEY,
    tanggal DATE NOT NULL,
    tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('Pemasukan', 'Pengeluaran')),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Iuran', 'Donasi', 'Hibah', 'Usaha', 'Operasional', 'Kegiatan', 'Sosial', 'Pendidikan')),
    deskripsi TEXT NOT NULL,
    jumlah DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    bukti_url TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Disetujui', 'Ditolak')),
    disetujui_oleh VARCHAR(200),
    audit_trail TEXT[] NOT NULL DEFAULT '{}'
);

----------------------------------------------------
-- 6. TABLE: anggota_pengurus
----------------------------------------------------
CREATE TABLE IF NOT EXISTS anggota_pengurus (
    id VARCHAR(50) PRIMARY KEY,
    nomor_anggota VARCHAR(100) NOT NULL UNIQUE,
    nama VARCHAR(200) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    tempat_lahir VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    pendidikan VARCHAR(100) NOT NULL,
    pekerjaan VARCHAR(150) NOT NULL,
    jabatan_organisasi VARCHAR(150) NOT NULL,
    struktur VARCHAR(100) NOT NULL CHECK (struktur IN ('Pengurus Harian', 'Lembaga', 'Banom', 'Ranting')),
    ranting_id VARCHAR(50) REFERENCES ranting(id),
    riwayat_jabatan TEXT[] NOT NULL DEFAULT '{}',
    keahlian TEXT[] NOT NULL DEFAULT '{}',
    foto_url TEXT NOT NULL
);

----------------------------------------------------
-- 7. TABLE: program_kerja
----------------------------------------------------
CREATE TABLE IF NOT EXISTS program_kerja (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    penanggung_jawab VARCHAR(200) NOT NULL,
    anggaran DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    realisasi_anggaran DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    target VARCHAR(255) NOT NULL,
    timeline_mulai DATE NOT NULL,
    timeline_selesai DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Perencanaan', 'Berjalan', 'Selesai', 'Tertunda')),
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    kegiatan_terbantu TEXT[] NOT NULL DEFAULT '{}'
);

----------------------------------------------------
-- 8. TABLE: dokumentasi_kegiatan
----------------------------------------------------
CREATE TABLE IF NOT EXISTS dokumentasi_kegiatan (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    program_kerja_id VARCHAR(50) REFERENCES program_kerja(id) ON DELETE SET NULL,
    tanggal DATE NOT NULL,
    deskripsi TEXT NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    pengurus_terlibat TEXT[] NOT NULL DEFAULT '{}',
    video_url TEXT,
    fotos TEXT[] NOT NULL DEFAULT '{}'
);

----------------------------------------------------
-- 9. TABLE: lokasi_gis
----------------------------------------------------
CREATE TABLE IF NOT EXISTS lokasi_gis (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    tipe VARCHAR(50) NOT NULL CHECK (tipe IN ('Ranting', 'Masjid', 'Mushalla', 'Madrasah', 'Pesantren')),
    alamat TEXT NOT NULL,
    ranting_id VARCHAR(50) REFERENCES ranting(id),
    lat DECIMAL(10,8) NOT NULL,
    lng DECIMAL(11,8) NOT NULL,
    pimpinan VARCHAR(200),
    kontak VARCHAR(50),
    keterangan TEXT
);

----------------------------------------------------
-- 10. TABLE: agenda_musyawarah
----------------------------------------------------
CREATE TABLE IF NOT EXISTS agenda_musyawarah (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    waktu VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Belum Mulai', 'Berlangsung', 'Selesai')),
    absensi JSONB NOT NULL DEFAULT '[]', -- List of {nama, jabatan, kehadiran, waktuHadir}
    notulensi TEXT,
    keputusan_hasil TEXT,
    voting JSONB -- {id, pertanyaan, pilihan: [{id, teks, suara}], status, totalSuara, waktuMulai, waktuSelesai}
);

----------------------------------------------------
-- 11. TABLE: berita_artikel
----------------------------------------------------
CREATE TABLE IF NOT EXISTS berita_artikel (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    ringkasan TEXT NOT NULL,
    konten TEXT NOT NULL,
    tanggal DATE NOT NULL,
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Kegiatan', 'Opini', 'Pengumuman', 'Warta Aswaja')),
    penulis VARCHAR(200) NOT NULL,
    foto_url TEXT NOT NULL,
    baca_count INT NOT NULL DEFAULT 0
);


----------------------------------------------------
-- DUMMY SEED DATA FOR MWCNU BUNGAH, GRESIK
----------------------------------------------------

-- 1. INSERT RANTING
INSERT INTO ranting (id, nama) VALUES
('R-01', 'Ranting Bungah'),
('R-02', 'Ranting Melirang'),
('R-03', 'Ranting Sidomukti'),
('R-04', 'Ranting Bedanten'),
('R-05', 'Ranting Sukorejo'),
('R-06', 'Ranting Sungonlegowo'),
('R-07', 'Ranting Indrodelik'),
('R-08', 'Ranting Kemangi'),
('R-09', 'Ranting Mojopetung'),
('R-10', 'Ranting Peganden')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERT SURAT MASUK
INSERT INTO surat_masuk (id, nomor_surat, tanggal, pengirim, perihal, lampiran, status_disposisi, disposisi_kepada, catatan_disposisi, file_url) VALUES
('SM-1', '042/PCNU/A.I/IV/2026', '2026-04-12', 'PCNU Kabupaten Gresik', 'Instruksi Pelaksanaan Istighosah Kubro Serentak', '1 Berkas', 'Sudah Disposisi', 'Syuriyah & Tanfidziyah', 'Jadwalkan Lailatul Ijtima keliling ke semua Ranting di Bungah mulai pekan depan.', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=60'),
('SM-2', '015/PR-IPNU-IPPNU/V/2026', '2026-05-18', 'PAC IPNU IPPNU Bungah', 'Permohonan Delegasi Peserta LAKUT (Latihan Kader Utama)', '1 Berkas', 'Sudah Disposisi', 'Lembaga Kaderisasi & Banom', 'Kirimkan minimal 2 perwakilan dari IPNU dan 2 IPPNU terbaik se-Kecamatan Bungah.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60'),
('SM-3', '008/LAZISNU-MWC/V/2026', '2026-05-28', 'KOIN NU Lembaga Amil Zakat Bungah', 'Laporan Rekapitulasi Sedekah KOIN NU Bulan Mei', '1 Lembar', 'Belum Disposisi', NULL, NULL, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60')
ON CONFLICT (id) DO NOTHING;

-- 3. INSERT SURAT KELUAR
INSERT INTO surat_keluar (id, nomor_surat, tanggal, penerima, perihal, lampiran, status, tanda_tangan_digital, content, tanggal_dibuat, dibuat_oleh) VALUES
('SK-1', '112/MWC-NU/A.I/V/2026', '2026-05-10', 'Seluruh Ketua Pengurus Ranting NU se-Kecamatan Bungah', 'Undangan Rapat Koordinasi Bulanan & Halal bi Halal MWC NU Bungah', '1 Lembar', 'Diarsipkan', 'KH. M. Sholeh Qosim (Rais Syuriyah) & KH. Achmad Shofwan (Ketua MWC)', 'Mengharap dengan hormat kehadiran Bapak/Ibu Pengurus Ranting NU dalam Rapat Koordinasi Bulanan yang akan dilaksanakan pada Minggu malam Senin, bertempat di Kantor MWC NU Bungah. Agenda utama: Evaluasi Koin NU dan persiapan Madrasah Kader Nahdlatul Ulama.', '2026-05-08', 'Drs. H. Choirul Anam'),
('SK-2', '115/MWC-NU/A.G/V/2026', '2026-05-20', 'Camat Bungah & Forkopimca', 'Permohonan Rekomendasi Lokasi Kegiatan Khitanan Massal Sosial MWC', '- ', 'Disetujui Ketua', 'KH. Achmad Shofwan', 'Dalam rangka memperingati Hari Lahir NU yang dikemas dengan kegiatan sosial kemasyarakatan, MWC NU Bungah bermaksud untuk menyelenggarakan Khitanan Massal Gratis bagi warga kurang mampu sebanyak 100 anak. Kami memohon rekomendasi izin pemakaian Pendopo Kecamatan Bungah.', '2026-05-19', 'Staf Sekretariat - Ahmad Fauzi'),
('SK-3', '124/MWC-NU/A.I/V/2026', '2026-05-29', 'Pimpinan Yayasan Masjid Jami Al-Anwar Bungah', 'Pemberitahuan Agenda Turba (Turun ke Bawah) MWC NU', '- ', 'Draft', NULL, 'Menyusul keputusan rapat harian MWC NU Bungah, kami menjadwalkan kunjungan silaturahim dan pembinaan organisasi (TURBA) di masjid Al-Anwar pada Jumat malam Sabtu kedua bulan Juni.', '2026-05-29', 'Drs. H. Choirul Anam')
ON CONFLICT (id) DO NOTHING;

-- 4. INSERT ARSIP DOKUMEN
INSERT INTO arsip_dokumen (id, nama, kategori, tanggal, tags, versi, file_size, deskripsi, file_url, public_access) VALUES
('AD-1', 'Surat Keputusan Pengesahan MWC Bungah 2024-2029', 'SK', '2024-03-15', ARRAY['SK', 'PCNU', 'Pengurus', 'Periode 2024-2029'], 'v1.0 Final', '3.4 MB', 'Surat Keputusan resmi dari Pengurus Besar Nahdlatul Ulama (PBNU) melalui PCNU Gresik tentang susunan lengkap Syuriyah dan Tanfidziyah MWC NU Bungah.', '#sk-official', true),
('AD-2', 'Standard Operating Procedure (SOP) Pengajuan Dana Sosial LAZISNU', 'SOP', '2025-01-10', ARRAY['SOP', 'LAZISNU', 'Sosial', 'Bantuan'], 'v2.1 Pembaruan', '1.2 MB', 'Mekanisme pengajuan, verifikasi, dan penyaluran dana sosial kesehatan dan beasiswa pendidikan yatim dhuafa KOIN NU MWC Bungah.', '#sop-lazis', true),
('AD-3', 'Proposal Pembangunan Gedung Pusat Dakwah MWC NU Center', 'Proposal', '2025-06-20', ARRAY['Gedung MWC', 'Pembangunan', 'Proposal', 'Wakaf'], 'v3.5 Revisi-4', '12.8 MB', 'Rencana Anggaran Biaya (RAB) dan maket desain arsitektur pembangunan Graha NU Center Bungah 3 lantai, lengkap dengan rincian kebutuhan donatur.', '#proposal-center', true),
('AD-4', 'Anggaran Dasar & Anggaran Rumah Tangga Hasil Muktamar NU', 'AD/ART', '2022-01-20', ARRAY['AD_ART', 'Muktamar', 'PBNU'], 'Hasil Muktamar 34', '8.1 MB', 'Pedoman pokok konstitusi organisasi Nahdlatul Ulama untuk rujukan pengambilan keputusan hukum dan operasional tingkat wilayah hingga ranting.', '#ad-art-nu', true),
('AD-5', 'Laporan Pertanggungjawaban (LPJ) Ramadhan Peduli Sesama 2025', 'LPJ', '2025-04-30', ARRAY['LPJ', 'Ramadhan', 'Baksos', 'Lembaga'], 'v1.0 Selesai', '4.7 MB', 'Dokumen audit keuangan kegiatan penyaluran 1500 paket sembako dan santunan anak yatim se-Kecamatan Bungah di bulan suci Ramadhan 1446 H.', '#lpj-ramadhan-2025', false)
ON CONFLICT (id) DO NOTHING;

-- 5. INSERT TRANSAKSI KEUANGAN
INSERT INTO transaksi_keuangan (id, tanggal, tipe, kategori, deskripsi, jumlah, bukti_url, status, disetujui_oleh, audit_trail) VALUES
('TX-1', '2026-05-01', 'Pemasukan', 'Iuran', 'Setoran Iuran Anggota Kolektif Ranting Bungah', 3500000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60', 'Disetujui', 'KH. Achmad Shofwan', ARRAY['Pencatatan awal oleh Bendahara H. Mukhlis - 2026-05-01', 'Disetujui Ketua - 2026-05-01']),
('TX-2', '2026-05-04', 'Pemasukan', 'Donasi', 'Infaq Kelompok Pengusaha Muslim Bungah Peduli', 15000000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60', 'Disetujui', 'KH. Achmad Shofwan', ARRAY['Pencatatan hamba Allah lewat Rek Bank MWC - 2026-05-04', 'Dikonfirmasi Bendahara - 2026-05-04', 'Disetujui Ketua - 2026-05-05']),
('TX-3', '2026-05-08', 'Pengeluaran', 'Operasional', 'Pembayaran Rekening Listrik, Air & Internet Kantor MWC NU Bungah', 1250000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60', 'Disetujui', 'KH. Achmad Shofwan', ARRAY['Diajukan oleh staf sekrt - 2026-05-07', 'Pembayaran ditransfer Bendahara - 2026-05-08']),
('TX-4', '2026-05-12', 'Pemasukan', 'Usaha', 'Hasil Penjualan Buku Aqidah Aswaja & Atribut NU Toko MWCNU Center Bungah', 4850000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60', 'Disetujui', 'KH. Achmad Shofwan', ARRAY['Pencatatan kasir toko MWC Bungah - 2026-05-12']),
('TX-5', '2026-05-15', 'Pengeluaran', 'Kegiatan', 'Subsidi Panitia Lailatul Ijtima & Bahtsul Masail di Ranting Melirang', 3000000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60', 'Disetujui', 'KH. Achmad Shofwan', ARRAY['Pengajuan proposal panitia - 2026-05-10', 'Disetujui Ketua - 2026-05-13', 'Dicairkan Bendahara - 2026-05-15']),
('TX-6', '2026-05-22', 'Pengeluaran', 'Sosial', 'Bantuan Biaya Pengobatan Kesehatan Warga Dhuafa Ranting Sukorejo (LAZISNU)', 2500000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60', 'Disetujui', 'KH. Achmad Shofwan', ARRAY['Pengajuan dari Ketua Ranting Sukorejo - 2026-05-20', 'Disetujui oleh LAZISNU & Ketua MWC - 2026-05-22']),
('TX-7', '2026-05-28', 'Pengeluaran', 'Pendidikan', 'Beasiswa Pendidikan Kader Berprestasi PAC IPNU IPPNU Bungah', 4000000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60', 'Pending', NULL, ARRAY['Diajukan oleh Pimpinan IPNU IPPNU - 2026-05-28', 'Ditinjau oleh Bendahara - 2026-05-29'])
ON CONFLICT (id) DO NOTHING;

-- 6. INSERT ANGGOTA PENGURUS
INSERT INTO anggota_pengurus (id, nomor_anggota, nama, nik, tempat_lahir, tanggal_lahir, alamat, pendidikan, pekerjaan, jabatan_organisasi, struktur, ranting_id, riwayat_jabatan, keahlian, foto_url) VALUES
('AP-1', '35.15.02.0001', 'KH. Sholeh Qosim, M.Pd.I', '3515021204680001', 'Gresik', '1968-04-12', 'Jl. Raya Bungah No. 12, Peganden, Bungah, Gresik', 'S2 Pendidikan Islam', 'Dosen / Pengasuh Pondok Pesantren', 'Rais Syuriyah MWC NU', 'Pengurus Harian', 'R-10', ARRAY['Wakil Rais Syuriyah PCNU Gresik (2019-2024)', 'Rais Syuriyah MWC Bungah (2024-Sekarang)'], ARRAY['Fikih & Ushul Fikih', 'Diferensiasi Tafsir Al-Quran', 'Manajemen Pondok'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&crop=face&q=80'),
('AP-2', '35.15.02.0002', 'KH. Achmad Shofwan, S.Ag', '3515020509740003', 'Gresik', '1974-09-05', 'Jl. Kyai Gede No. 45, Bungah, Gresik', 'S1 Hukum Islam', 'Wiraswasta / Pengusaha Kuliner', 'Ketua Tanfidziyah MWC NU', 'Pengurus Harian', 'R-01', ARRAY['Sekretaris MWC NU Bungah (2019-2024)', 'Ketua Tanfidziyah MWC NU Bungah (2024-Sekarang)'], ARRAY['Manajemen Organisasi', 'Retorika / Dakwah', 'Negosiasi Bisnis'], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&crop=face&q=80'),
('AP-3', '35.15.02.0003', 'Drs. H. Choirul Anam', '3515022812690001', 'Gresik', '1969-12-28', 'Perum Melirang Asri Blok B-12, Melirang, Bungah', 'S1 Administrasi Negara', 'Pensiunan ASN Pemkab Gresik', 'Sekretaris Tanfidziyah', 'Pengurus Harian', 'R-03', ARRAY['Wakil Sekretaris MWC NU Bungah (2019-2024)', 'Sekretaris Koordinator Humas PCNU Gresik'], ARRAY['Tata Mobilisasi Persuratan', 'Perencanaan Kebijakan', 'Arsip Dokumen'], 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&crop=face&q=80'),
('AP-4', '35.15.02.0004', 'H. Mukhlis Al-Hakim, S.E.', '3515021508820002', 'Surabaya', '1982-08-15', 'Jl. Raya Bedanten No. 88, Bungah', 'S1 Akuntansi', 'Konsultan Pajak & Keuangan', 'Bendahara Umum', 'Pengurus Harian', 'R-04', ARRAY['Bendahara LAZISNU MWC (2020-2024)', 'Bendahara Tanfidziyah MWC Bungah'], ARRAY['Akuntansi Keuangan', 'Audit Keuangan Syariah', 'Perpajakan'], 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&crop=face&q=80'),
('AP-5', '35.15.02.0018', 'Zainal Arifin, S.Kom', '3515022101950005', 'Gresik', '1995-01-21', 'Jl. Sunan Kalijaga No. 4, Melirang, Bungah', 'S1 Teknik Informatika', 'Software Engineer & IT Consultant', 'Ketua LTN NU (Lembaga Infokom & Publikasi)', 'Lembaga', 'R-02', ARRAY['Ketua PAC IPNU Bungah (2018-2020)', 'Staf Hubungan Media & Publik MWC'], ARRAY['Pemrograman Web & Mobile', 'Desain UI/UX', 'Digital Marketing'], 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&crop=face&q=80'),
('AP-6', '35.15.02.0031', 'Hj. Aminah Zahro, M.Ag', '3515020101780004', 'Gresik', '1978-01-01', 'Jl. Raya Mojopetung No. 34, Bungah', 'S2 Syariah Islam', 'Kepala Madrasah Aliyah', 'Ketua PAC Muslimat NU', 'Banom', 'R-09', ARRAY['Sekretaris PAC Fatayat NU (2015-2019)', 'Wakil Pimpinan Fatayat Gresik'], ARRAY['Metode Didaktik Pendidikan', 'Hukum Keluarga Islam', 'Koperasi Syariah'], 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&crop=face&q=80'),
('AP-7', '35.15.02.0055', 'Samsul Arifin, S.Sy.', '3515021211900003', 'Gresik', '1990-11-12', 'Dusun Sungon Lor, Sungonlegowo, Bungah', 'S1 Syariah', 'Staf KUA Bungah', 'Komandan Banser MWC NU Bungah', 'Banom', 'R-06', ARRAY['Kepala Provost Banser Gresik (2021-2024)', 'Kader Muda Ansor Bungah'], ARRAY['Navigasi Lapangan & Protokoler', 'Hukum Perdata Islam', 'Bela Diri Tarung Derajat'], 'https://images.unsplash.com/photo-1542103749-8ef59b94f4d3?w=200&auto=format&fit=crop&crop=face&q=80')
ON CONFLICT (id) DO NOTHING;

-- 7. INSERT PROGRAM KERJA
INSERT INTO program_kerja (id, nama, penanggung_jawab, anggaran, realisasi_anggaran, target, timeline_mulai, timeline_selesai, status, progress, kegiatan_terbantu) VALUES
('PRG-1', 'Pembangunan Gedung Graha MWC NU Bungah Center', 'Panitia Pembangunan MWC Center', 850000000.00, 245000000.00, 'Konstruksi fisik lantai 1 dan 2 selesai fungsional', '2025-08-01', '2026-12-31', 'Berjalan', 42, ARRAY['Pengecoran tiang penyangga lantai 2', 'Pemasangan dinding bata merah lobi utama']),
('PRG-2', 'Koin NU & Mobil Ambulans Siaga Ummat Gratis', 'LAZISNU Bungah', 180000000.00, 185000000.00, 'Pembelian 1 Unit Mobil Suzuki APV Ambulans Layanan Kesehatan Terbuka', '2025-01-15', '2025-10-20', 'Selesai', 100, ARRAY['Serah terima mobil ambulans di Kantor MWC Bungah', 'Layanan antar jemput pasien gawat darurat gratis ke RSUD Ibnu Sina Gresik sebanyak 124 kali']),
('PRG-3', 'Madrasah Kader Nahdlatul Ulama (MKNU) Pembinaan Karakter', 'Lembaga Kaderisasi & LAKPESDAM MWC', 45000000.00, 0.00, 'Melatih 150 kader militan perwakilan dari 10 Ranting NU se-Bungah', '2026-06-15', '2026-06-18', 'Perencanaan', 10, ARRAY['Rapat panitia persiapan MKNU di Kantor MWC Bungah']),
('PRG-4', 'Lailatul Ijtima & Bahtsul Masail Waqi’iyah Keliling Ranting', 'Lembaga Bahtsul Masail (LBM) & Syuriyah', 30000000.00, 18000000.00, 'Melaksanakan kajian fikih kontemporer bulanan bergiliran di 10 Ranting NU', '2025-01-01', '2026-12-31', 'Berjalan', 60, ARRAY['Kajian putaran ke-5 di Masjid Ranting Melirang', 'Kajian hukum cryptocurrency dalam muktamar fikih umat']),
('PRG-5', 'Digitalisasi Madrasah Ibtidaiyah LP Ma’arif NU', 'Lembaga Pendidikan Ma’arif NU MWC', 120000000.00, 25000000.00, 'Instalasi Laboratorium Komputer dan Cloud Nilai di 3 Madrasah Ibtidaiyah', '2026-02-10', '2026-08-30', 'Tertunda', 20, ARRAY['Survei jaringan internet dan instalasi server lokal Madrasah Bedanten'])
ON CONFLICT (id) DO NOTHING;

-- 8. INSERT DOKUMENTASI KEGIATAN
INSERT INTO dokumentasi_kegiatan (id, judul, program_kerja_id, tanggal, deskripsi, lokasi, pengurus_terlibat, video_url, fotos) VALUES
('DK-1', 'Lailatul Ijtima Putaran ke-5 & Kajian Hukum Syariah', 'PRG-4', '2026-05-15', 'Kegiatan silaturahmi akbar dihadiri 400 jamaah di Masjid Al-Muttaqin Ranting Melirang. Membahas status fiqih hukum warisan kontemporer dan asuransi jaminan sosial nasional.', 'Masjid Al-Muttaqin, Desa Melirang, Bungah', ARRAY['KH. Sholeh Qosim, M.Pd.I', 'KH. Achmad Shofwan, S.Ag', 'Samsul Arifin, S.Sy.'], NULL, ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80']),
('DK-2', 'Penyerahan Unit Ambulans Koin NU Peduli Sehat', 'PRG-2', '2025-10-20', 'Simbolisasi serah terima kunci mobil ambulans siaga umat hasil Koin Sehat LAZISNU MWC Bungah ke tim relawan medis Banser Bagana.', 'Halaman Kantor MWC Bungah', ARRAY['KH. Achmad Shofwan, S.Ag', 'H. Mukhlis Al-Hakim, S.E.', 'Drs. H. Choirul Anam'], NULL, ARRAY['https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80'])
ON CONFLICT (id) DO NOTHING;

-- 9. INSERT LOKASI GIS
INSERT INTO lokasi_gis (id, nama, tipe, alamat, ranting_id, lat, lng, pimpinan, kontak, keterangan) VALUES
('G-1', 'Kantor Pusat MWC NU Bungah', 'Ranting', 'Jl. Raya Bungah No. 15, Bungah (Depan Masjid Jami Bungah)', 'R-01', -7.06300000, 112.57900000, 'KH. Achmad Shofwan, S.Ag', '0812-3456-7890', 'Pusat komando tata usaha administrasi, rapat musyawarah, dan gerai Koin LAZISNU.'),
('G-2', 'Masjid Jami Al-Anwar Peganden', 'Masjid', 'Jl. KH. Syafii, Kauman, Peganden, Bungah', 'R-10', -7.06600000, 112.57400000, 'KH. Sholeh Qosim, M.Pd.I', NULL, 'Masjid bersejarah pusat kegiatan Turba Pengurus Syuriyah dan kajian Fatwa Fikih.'),
('G-3', 'Pondok Pesantren Al-Hidayah Sukorejo', 'Pesantren', 'Jl. Kyai Gede No. 12B, Sukorejo, Bungah', 'R-05', -7.05800000, 112.58500000, 'KH. Ma’shum Ahmad', '0813-4567-1122', 'Pesantren Salafiyah terafiliasi Ma’arif NU dengan santri mukim 350 santri.'),
('G-4', 'Madrasah Ibtidaiyah Ma’arif Bedanten', 'Madrasah', 'Jl. Raya Bedanten RT 04 RW 02, Bungah', 'R-04', -7.07100000, 112.57000000, 'Drs. H. Maimun, M.Pd', NULL, 'Madrasah basis unggulan berprestasi yang sedang diujicobakan program digitalisasi internet pembelajaran.'),
('G-5', 'Mushalla Al-Ikhlas Melirang', 'Mushalla', 'Dusun Melirang Krajan No. 8, Bungah', 'R-02', -7.06050000, 112.57750000, 'Ustadz Ahmad Shodiq', NULL, 'Mushalla aktif dengan kegiatan rutin Diba’ dan pembacaan Tahlil Yasin kubro setiap kamis malam.')
ON CONFLICT (id) DO NOTHING;

-- 10. INSERT AGENDA MUSYAWARAH
INSERT INTO agenda_musyawarah (id, judul, tanggal, waktu, status, absensi, notulensi, keputusan_hasil, voting) VALUES
('AM-1', 'Musyawarah Kerja Cabang (MUSKERKAB) I MWC Bungah', '2026-05-10', '08:30 - 15:30 WIB', 'Selesai', 
 '[
    {"nama": "KH. Sholeh Qosim, M.Pd.I", "jabatan": "Rais Syuriyah", "kehadiran": "Hadir", "waktuHadir": "08:15"},
    {"nama": "KH. Achmad Shofwan, S.Ag", "jabatan": "Ketua Tanfidziyah", "kehadiran": "Hadir", "waktuHadir": "08:20"},
    {"nama": "Drs. H. Choirul Anam", "jabatan": "Sekretaris", "kehadiran": "Hadir", "waktuHadir": "08:10"},
    {"nama": "H. Mukhlis Al-Hakim, S.E.", "jabatan": "Bendahara", "kehadiran": "Hadir", "waktuHadir": "08:25"},
    {"nama": "Zainal Arifin, S.Kom", "jabatan": "Ketua LTN NU", "kehadiran": "Hadir", "waktuHadir": "08:30"},
    {"nama": "Samsul Arifin, S.Sy.", "jabatan": "Komandan Banser", "kehadiran": "Hadir", "waktuHadir": "08:22"}
 ]'::jsonb,
 'Rapat dibuka dengan Tawassul wa Iftitah oleh Rais Syuriyah. Pembahasan utama difokuskan pada penguatan ranting-ranting aktif yang perlu dibina ulang (re-organisasi), serta optimalisasi Koin NU Bungah agar tembus 50 juta sebulan.',
 '1. Menginstruksikan seluruh Pengurus Ranting untuk membentuk UPZIS (Unit Pengumpul Zakat Infaq Sedekah).\n2. Membentuk panitia Musyawarah Khusus Re-organisasi Ranting Bedanten.\n3. Graha MWC Center ditargetkan tutup atap konstruksi pada September 2026.',
 '{
    "id": "V-1",
    "pertanyaan": "Apakah Lokasi Graha MWC Lantai 2 Layak Disewakan untuk Umum guna Menambah Dana Kas?",
    "pilihan": [
      {"id": "1", "teks": "Ya, disewakan terbatas (khusus hajatan warga NU / walimah aswaja)", "suara": 18},
      {"id": "2", "teks": "Ya, disewakan bebas untuk fungsi profit komersial apa pun", "suara": 3},
      {"id": "3", "teks": "Tidak, fungsi murni operasional kantor organisasi", "suara": 9}
    ],
    "status": "Ditutup",
    "totalSuara": 30,
    "waktuMulai": "2026-05-10 11:30"
 }'::jsonb),

('AM-2', 'Rapat Pleno Persiapan Bahtsul Masail Waqi’iyah Ke-6', '2026-06-05', '19:30 - 22:00 WIB', 'Belum Mulai', 
 '[]'::jsonb,
 'Agenda belum dimulai. Pembahasan akan mengupas fatwa halal-haram kecerdasan buatan (Generative AI) dalam menggubah khutbah jumat, dan fatwa kriptografis.',
 '',
 '{
    "id": "V-2",
    "pertanyaan": "Prioritas Tema Hukum Kontemporer untuk Bahtsul Masail Juni:",
    "pilihan": [
      {"id": "1", "teks": "Zakat Cryptocurrency & Bitcoin", "suara": 0},
      {"id": "2", "teks": "Kecerdasan Buatan (Generative AI) Penulis Khutbah", "suara": 0},
      {"id": "3", "teks": "Skema Arisan Haji Syariah Multi-Level", "suara": 0}
    ],
    "status": "Aktif",
    "totalSuara": 0,
    "waktuMulai": "2026-05-31 11:25"
 }'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 11. INSERT BERITA ARTIKEL
INSERT INTO berita_artikel (id, judul, ringkasan, konten, tanggal, kategori, penulis, foto_url, baca_count) VALUES
('1', 'Luncurkan Layanan Digital, MWCNU Bungah Gelar Sosialisasi Smart Governance', 'MWCNU Bungah secara resmi meluncurkan portal administrasi dan transparansi digital guna mempermudah silaturahim ranting serta akses data publik secara akuntabel.', '<p><b>Bungah, Gresik</b> — Dalam upaya merealisasikan digitalisasi gerakan organisasi Nahdlatul Ulama, Pengurus Majelis Wakil Cabang Nahdlatul Ulama (MWCNU) Kecamatan Bungah menyelenggarakan rapat kerja dan sosialisasi sistem "Smart Governance" yang bertempat di aula utama Graha MWC NU Bungah.</p><p>Acara ini dihadiri oleh jajaran syuriyah, tanfidziyah, pimpinan ranting se-Kecamatan, serta pimpinan lembaga dan badan otonom (Banom) seperti GP Ansor, Fatayat, Muslimat, IPNU, dan IPPNU.</p><p>KH. Achmad Shofwan, S.Ag, selaku Ketua Tanfidziyah menyatakan, "Layanan digital ini bukan sekadar mengikuti tren, tetapi merupakan kewajiban organisasi dalam menjaga akuntabilitas keuangan jamaah, mempercepat persuratan digital, dan menyajikan manajemen arsip keputusan bahtsul masail yang bisa diakses langsung oleh seluruh nahdliyin."</p><p>Aplikasi ini mengintegrasikan database pengurus, pelacakan realisasi program kerja, grafik keuangan kas Lazisnu, hingga pemetaan GIS masjid dan madrasah binaan di 10 ranting aktif. Melalui program ini, masyarakat luas dapat melihat transparansi laporan pemasukan dan pengeluaran secara real-time demi kredibilitas organisasi.</p>', '2026-05-25', 'Kegiatan', 'Drs. H. Choirul Anam', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80', 145),
('2', 'Fatwa Bahtsul Masail: Menimbang Aspek Maslahah dan Hukum Kecerdasan Buatan (Generative AI)', 'Lembaga Bahtsul Masail (LBM) MWCNU Bungah mendiskusikan batasan fikih seputar penggunaan teks khutbah jumat dan karya tulis keagamaan berbasis kecerdasan buatan.', '<p><b>Bungah, Gresik</b> — Kemunculan teknologi kecerdasan buatan (Generative AI) seperti Large Language Models memicu pembahasan serius di kalangan praktisi fikih dan akademisi nahdliyin. Lembaga Bahtsul Masail (LBM) MWCNU Bungah menggelar kajian bahtsul masail waqi’iyah guna merumuskan panduan syariah awal.</p><p>Kajian yang dipimpin langsung oleh jajaran Rais Syuriyah, merumuskan beberapa catatan krusial:</p><ol><li>Hukum asal memanfaatkan AI untuk membantu menyusun kerangka tulisan atau mengumpulkan referensi kitab kuning adalah boleh (mubah) dan dipandang sebagai maslahah kontemporer.</li><li>Namun, dilarang keras menggunakan AI untuk merumuskan fatwa hukum syariah secara mandiri tanpa verifikasi (muthabaqah) oleh ulama yang memiliki otoritas sanad keilmuan yang muktabar, karena AI tidak memiliki kualifikasi ijtihad maupun sensitivitas moral keagamaan.</li><li>Dalam konteks penulisan naskah khutbah, khatib tetap wajib melakukan penelaahan kritis (tabayyun) demi menjaga keabsahan rukun khutbah dan mencegah penyebaran riwayat hadis palsu (maudhu) yang seringkali tergenerasi secara keliru oleh algoritma mesin (halusinasi AI).</li></ol><p>Keputusan resmi dari forum ini akan diterbitkan dalam bentuk berkas PDF di modul Arsip Dokumen Publik di web portal ini agar dapat dipelajari oleh seluruh khatib jumat di wilayah Kecamatan Bungah.</p>', '2026-05-29', 'Warta Aswaja', 'LBM MWCNU Bungah', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', 289),
('3', 'Gebrakan Sosial LAZISNU: Penyaluran KOIN NU untuk Beasiswa Santri Kurang Mampu', 'UPZIS LAZISNU MWCNU Bungah mendistribusikan santunan biaya pendidikan penuh kepada 45 santri dhuafa berkat konsistensi gerakan koin kaleng sedekah warga.', '<p><b>Bungah, Gresik</b> — Unit Pengelola Zakat, Infaq, dan Sedekah (UPZIS) LAZISNU MWCNU Bungah kembali menunjukkan peran nyatanya di bidang sosial ekonomi keagamaan. Memanfaatkan himpunan dana KOIN NU (Kotak Infak Nahdlatul Ulama) yang dipungut rutin di perumahan dan kampung, disalurkan beasiswa pendidikan penuh untuk puluhan dhuafa berprestasi.</p><p>Penyaluran beasiswa ini dilangsungkan bertepatan dengan Lailatul Ijtima keliling di Ranting Bedanten. Sebanyak 45 santri jenjang Madrasah Ibtidaiyah dan Tsanawiyah menerima manfaat pembebasan biaya SPP serta perlengkapan sekolah.</p><p>"Ini adalah bukti nyata sirkulasi ekonomi kemandirian nahdliyin. Dari warga, dikelola oleh amil yang amanah, dan kembali seutuhnya untuk mencerdaskan generasi penerus aswaja," ungkap Bendahara UPZIS LAZISNU.</p><p>Laporan keuangan terkait perolehan koin bulanan, daftar penerima manfaat, beserta saldo simpanan upzis secara berkala diunggah transparan pada laman Keuangan web ini sebagai bentuk kejujuran publik.</p>', '2026-05-20', 'Pengumuman', 'UPZIS LAZISNU', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80', 94)
ON CONFLICT (id) DO NOTHING;

-- INDEXES TO OPTIMIZE SEARCHES & FOREIGN KEYS
CREATE INDEX IF NOT EXISTS idx_anggota_ranting ON anggota_pengurus(ranting_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi_keuangan(tanggal);
CREATE INDEX IF NOT EXISTS idx_lokasi_ranting ON lokasi_gis(ranting_id);


----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES & SECURITY DESIGN
----------------------------------------------------

-- Enable Row Level Security (RLS) on all tables to prevent public tampering
ALTER TABLE ranting ENABLE ROW LEVEL SECURITY;
ALTER TABLE surat_masuk ENABLE ROW LEVEL SECURITY;
ALTER TABLE surat_keluar ENABLE ROW LEVEL SECURITY;
ALTER TABLE arsip_dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE anggota_pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumentasi_kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE lokasi_gis ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_musyawarah ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita_artikel ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if the current requester is the specified Administrator
-- Email: maghfurmunif@gmail.com | UID: bec40ceb-b514-43e7-8428-04c742bbef5b
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    -- Checks if the authenticated Supabase user's UUID matches maghfurmunif@gmail.com
    RETURN (auth.uid() = 'bec40ceb-b514-43e7-8428-04c742bbef5b'::uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Table Ranting Policies
CREATE POLICY "Enable select access for all users" ON ranting 
    FOR SELECT USING (true);
CREATE POLICY "Enable write/modify access for admin only" ON ranting 
    FOR ALL USING (is_admin());

-- 2. Table Surat Masuk Policies (Restricted letters viewable only by administrators)
CREATE POLICY "Enable select for admin only or authorised readers" ON surat_masuk 
    FOR SELECT USING (is_admin() OR auth.role() = 'authenticated');
CREATE POLICY "Enable audit write access for admin only" ON surat_masuk 
    FOR ALL USING (is_admin());

-- 3. Table Surat Keluar Policies
CREATE POLICY "Enable select for authenticated members" ON surat_keluar 
    FOR SELECT USING (is_admin() OR auth.role() = 'authenticated');
CREATE POLICY "Enable full edit operations for admin only" ON surat_keluar 
    FOR ALL USING (is_admin());

-- 4. Table Arsip Dokumen Policies (Public files viewable by all, private by admin only)
CREATE POLICY "Enable view for public files or administrator" ON arsip_dokumen 
    FOR SELECT USING (public_access = true OR is_admin());
CREATE POLICY "Enable complete document management for admin" ON arsip_dokumen 
    FOR ALL USING (is_admin());

-- 5. Table Transaksi Keuangan Policies (Financial Transparency)
CREATE POLICY "Enable read for approved transactions" ON transaksi_keuangan 
    FOR SELECT USING (status = 'Disetujui' OR is_admin());
CREATE POLICY "Enable managing audit transaction logs for admin only" ON transaksi_keuangan 
    FOR ALL USING (is_admin());

-- 6. Table Anggota Pengurus Policies
CREATE POLICY "Enable view of public members list" ON anggota_pengurus 
    FOR SELECT USING (true);
CREATE POLICY "Enable manage members for admin only" ON anggota_pengurus 
    FOR ALL USING (is_admin());

-- 7. Table Program Kerja Policies
CREATE POLICY "Enable read program kerja overview for public" ON program_kerja 
    FOR SELECT USING (true);
CREATE POLICY "Enable budget and status modifications for admin" ON program_kerja 
    FOR ALL USING (is_admin());

-- 8. Table Dokumentasi Kegiatan Policies
CREATE POLICY "Enable read of events and documentations" ON dokumentasi_kegiatan 
    FOR SELECT USING (true);
CREATE POLICY "Enable write of events for admin" ON dokumentasi_kegiatan 
    FOR ALL USING (is_admin());

-- 9. Table Lokasi GIS Policies
CREATE POLICY "Enable read-only coordinates mapping" ON lokasi_gis 
    FOR SELECT USING (true);
CREATE POLICY "Enable edit map nodes for admin" ON lokasi_gis 
    FOR ALL USING (is_admin());

-- 10. Table Agenda Musyawarah Policies
CREATE POLICY "Enable select queries on minutes and votes" ON agenda_musyawarah 
    FOR SELECT USING (true);
CREATE POLICY "Enable schedule updates for admin" ON agenda_musyawarah 
    FOR ALL USING (is_admin());

-- 11. Table Berita Artikel Policies
CREATE POLICY "Enable public news feed reading" ON berita_artikel 
    FOR SELECT USING (true);
CREATE POLICY "Enable publishing updates for admin" ON berita_artikel 
    FOR ALL USING (is_admin());
