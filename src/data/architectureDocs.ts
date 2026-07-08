export const postgresSchemaDDL = `-- ====================================================================
-- SKEMA DATABASE POSTGRESQL (DDL) - KANAL TRANSPARANSI MWC NU BUNGAH
-- ====================================================================

-- 1. TABEL PENGURUS RANTING NU (PRNU) & MWC
CREATE TABLE ranting (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    village VARCHAR(100) NOT NULL,
    established DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing Ranting
CREATE INDEX idx_ranting_village ON ranting(village);

-- 2. TABEL PENGURUS JAMIYAH
CREATE TYPE user_role AS ENUM ('super_admin', 'admin_ranting', 'admin_lazisnu');

CREATE TABLE pengurus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(100) NOT NULL, -- e.g., 'Syuriah', 'Tanfidziyah', 'Ketua'
    category VARCHAR(20) NOT NULL CHECK (category IN ('MWC', 'Ranting')),
    ranting_id VARCHAR(50) REFERENCES ranting(id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    kaderisasi_status VARCHAR(100) NOT NULL, -- e.g., 'MKNU', 'PD-PKPNU', 'Belum'
    education VARCHAR(100) NOT NULL, -- e.g., 'S1', 'Pesantren'
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing Pengurus
CREATE INDEX idx_pengurus_category ON pengurus(category);
CREATE INDEX idx_pengurus_ranting ON pengurus(ranting_id);

-- 3. TABEL DATA KADER (TERPADU BANOM & LEMBAGA)
CREATE TYPE gender_type AS ENUM ('Laki-laki', 'Perempuan');
CREATE TYPE banom_type AS ENUM ('IPNU', 'IPPNU', 'Ansor', 'Fatayat', 'Muslimat', 'Banser', 'Pagar Nusa', 'Lainnya');

CREATE TABLE kader (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    pob VARCHAR(100) NOT NULL, -- Place of birth
    dob DATE NOT NULL, -- Date of birth
    gender gender_type NOT NULL,
    banom banom_type NOT NULL,
    role VARCHAR(150) NOT NULL, -- Jabatan spesifik di Banom
    ranting_id VARCHAR(50) REFERENCES ranting(id) ON DELETE RESTRICT,
    phone VARCHAR(20) NOT NULL,
    join_year INT CHECK (join_year >= 1950 AND join_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing Kader
CREATE INDEX idx_kader_ranting ON kader(ranting_id);
CREATE INDEX idx_kader_banom ON kader(banom);
CREATE INDEX idx_kader_join_year ON kader(join_year);

-- 4. TABEL KEGIATAN JAMIYAH
CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(250) NOT NULL,
    organizer VARCHAR(150) NOT NULL,
    target_group VARCHAR(200) NOT NULL,
    funding_source VARCHAR(50) NOT NULL CHECK (funding_source IN ('Koin S3', 'Kas Jamiyah', 'Donatur', 'Sponsor')),
    budget DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Rencana', 'Selesai')),
    image_url TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kegiatan_date ON kegiatan(date);
CREATE INDEX idx_kegiatan_organizer ON kegiatan(organizer);

-- 5. TABEL TRANSPARANSI DANA (ARUS KAS NON-S3)
CREATE TABLE kas_dana (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('Masuk', 'Keluar')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Iuran Anggota', 'Donasi Publik', 'Operasional Kantor', 'Bantuan Sosial', 'Program Keagamaan', 'Lainnya')),
    amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    description TEXT NOT NULL,
    pic VARCHAR(150) NOT NULL, -- Person In Charge
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kas_date ON kas_dana(date);
CREATE INDEX idx_kas_type ON kas_dana(type);

-- 6. TABEL KOIN SEHARI SERIBU (S3) LAZISNU (AKUNTABILITAS BULANAN)
CREATE TABLE koin_s3 (
    id SERIAL PRIMARY KEY,
    month VARCHAR(7) NOT NULL, -- Format 'YYYY-MM'
    ranting_id VARCHAR(50) REFERENCES ranting(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    distribution_target VARCHAR(250) NOT NULL,
    distribution_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_month_ranting UNIQUE (month, ranting_id)
);

CREATE INDEX idx_koin_month ON koin_s3(month);
CREATE INDEX idx_koin_ranting ON koin_s3(ranting_id);

-- 7. TABEL PERSURATAN (LOG INTEGRASI)
CREATE TABLE persuratan (
    id SERIAL PRIMARY KEY,
    letter_number VARCHAR(150) UNIQUE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('Masuk', 'Keluar')),
    code VARCHAR(50) NOT NULL, -- e.g., 'A.I', 'B.II'
    sender_or_recipient VARCHAR(250) NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(250) NOT NULL,
    attachment_url TEXT,
    tembusan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_persuratan_date ON persuratan(date);
CREATE INDEX idx_persuratan_type ON persuratan(type);

-- 8. TABEL USAHA JAMIYAH (KEMANDIRIAN EKONOMI)
CREATE TABLE usaha (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Toko', 'Jasa', 'Pertanian', 'Kuliner', 'Lainnya')),
    location VARCHAR(250) NOT NULL,
    manager VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Aktif', 'Non-aktif')),
    revenue DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABEL SARANA IBADAH
CREATE TABLE sarana_ibadah (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Masjid', 'Musholla')),
    takmir VARCHAR(150) NOT NULL,
    imam1 VARCHAR(150) NOT NULL,
    imam2 VARCHAR(150) NOT NULL,
    nu_affiliation VARCHAR(30) NOT NULL CHECK (nu_affiliation IN ('Milik NU', 'Afiliasi NU', 'Simpatisan')),
    land_status VARCHAR(50) NOT NULL CHECK (land_status IN ('Wakaf NU', 'Wakaf Pribadi', 'Sertifikat Hak Milik')),
    address TEXT NOT NULL,
    ranting_id VARCHAR(50) REFERENCES ranting(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sarana_ibadah_ranting ON sarana_ibadah(ranting_id);

-- 10. TABEL SARANA PENDIDIKAN
CREATE TABLE sarana_pendidikan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('PAUD', 'TK/RA', 'MI', 'MTs', 'MA', 'Madin', 'TPQ', 'Pesantren')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Swasta NU', 'Negeri', 'Swasta Non-NU')),
    principal VARCHAR(150) NOT NULL,
    student_count INT NOT NULL DEFAULT 0,
    phone VARCHAR(30),
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('Baik', 'Rusak Ringan', 'Rusak Sedang', 'Butuh Renovasi')),
    address TEXT NOT NULL,
    ranting_id VARCHAR(50) REFERENCES ranting(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sarana_pendidikan_ranting ON sarana_pendidikan(ranting_id);

-- 11. TABEL BERITA (CMS PORTAL)
CREATE TABLE berita (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Pengumuman', 'Warta Jamiyah', 'Dakwah', 'Opini')),
    content TEXT NOT NULL, -- Markdown format
    image_url TEXT,
    date DATE NOT NULL,
    author VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. TABEL DOKUMENTASI (GALERI)
CREATE TABLE dokumentasi (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('Foto', 'Video')),
    url TEXT NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Kegiatan', 'Rapat', 'Pelantikan', 'Harlah')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. TABEL ASPIRASI & KONTAK
CREATE TABLE aspirasi (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    ranting_id VARCHAR(50) REFERENCES ranting(id) ON DELETE SET NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Masuk' CHECK (status IN ('Masuk', 'Proses', 'Selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. TABEL USERS (RBAC AUTH)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    ranting_id VARCHAR(50) REFERENCES ranting(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- AUTO-UPDATE TRIGGER UNTUK UPDATE_AT TIMESTAMP
-- ====================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ranting_modtime BEFORE UPDATE ON ranting FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_pengurus_modtime BEFORE UPDATE ON pengurus FOR EACH ROW EXECUTE PROCEDURE update_modified_column();


-- ====================================================================
-- KUMPULAN QUERY INSERT DATA AWAL (SEEDING) BERDASARKAN DATA APLIKASI
-- ====================================================================

-- 1. SEED DATA RANTING
INSERT INTO ranting (id, name, village, established) VALUES
('mwc', 'MWC NU BUNGAH', 'Bungah', '1965-08-15'),
('r1', 'PRNU ABAR-ABIR', 'Abar-Abir', '1970-03-12'),
('r2', 'PRNU MELIRANG', 'Melirang', '1972-11-05'),
('r3', 'PR NU BEDANTEN', 'Bedanten', '1975-01-20'),
('r4', 'PRNU PEGUNDAN', 'Pegundan', '1978-05-18'),
('r5', 'PRNU SIDOKUMPUL', 'Sidokumpul', '1974-09-22'),
('r6', 'PRNU KISIK', 'Kisik', '1980-02-10'),
('r7', 'PRNU GROGOL', 'Grogol', '1982-06-14'),
('r8', 'PRNU MASANGAN', 'Masangan', '1979-04-30'),
('r9', 'PRNU LEBAK', 'Lebak', '1985-08-11'),
('r10', 'PRNU SUNGONLEGOWO', 'Sungonlegowo', '1977-10-01'),
('r11', 'PRNU WATUAGUNG', 'Watuagung', '1983-12-15'),
('r12', 'RANTING NU MOJOPURO WETAN', 'Mojopuro Wetan', '1986-07-20'),
('r13', 'Roudlotut Thoyyibah', 'Bungah', '1984-05-25'),
('r14', 'PRNU KARANGLIMAN', 'Karangliman', '1987-11-03'),
('r15', 'PRNU MOJOPUROGEDE', 'Mojopurogede', '1981-01-14'),
('r16', 'PRNU PERENG KULON', 'Pereng Kulon', '1988-04-22'),
('r17', 'PRNU BUNGAH', 'Bungah', '1970-01-01'),
('r18', 'PRNU PERENG WETAN', 'Pereng Wetan', '1989-08-30'),
('r19', 'PRNU GUMENG', 'Gumeng', '1982-12-12'),
('r20', 'PRNU KRAMAT', 'Kramat', '1985-06-15'),
('r21', 'PRNU TAJUNGWIDORO', 'Tajungwidoro', '1983-09-09'),
('r22', 'PRNU SIDOMUKTI', 'Sidomukti', '1980-05-18'),
('r23', 'PRNU SUKOWATI', 'Sukowati', '1984-11-11'),
('r24', 'PRNU RACI WETAN', 'Raci Wetan', '1986-02-28'),
('r25', 'PRNU RACI DELANYAR', 'Raci Delanyar', '1988-07-07'),
('r26', 'PRNU SIDOREJO', 'Sidorejo', '1981-12-25'),
('r27', 'PRNU SUKOREJO', 'Sukorejo', '1983-04-10'),
('r28', 'PRNU Indrodelik', 'Indrodelik', '1985-08-11')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED DATA USERS (RBAC AUTH) DENGAN UID & EMAIL REKOMENDASI USER
INSERT INTO users (id, email, password_hash, role, ranting_id) VALUES
('bec40ceb-b514-43e7-8428-04c742bbef5b', 'maghfurmunif@gmail.com', 'mwc123', 'super_admin', 'mwc')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED DATA PENGURUS
INSERT INTO pengurus (name, role, category, ranting_id, phone, email, kaderisasi_status, education) VALUES
('KH. Soeratin Abbas', 'Syuriah (Rais)', 'MWC', 'mwc', '08123260605', 'soeratin@mwc.org', 'Penyetaraan', 'Pesantren'),
('KH. Muhammad Ala''uddin, LC, M.SEI', 'Tanfidziyah (Ketua)', 'MWC', 'mwc', '087854116511', 'alauddin@mwc.org', 'MKNU', 'S2'),
('KH FATKHAN ANWARI, S.Ag.', 'Rois Syuriyah', 'Ranting', 'r1', '081543445767', 'fatkhan@ranting.org', 'Belum', 'S1'),
('MUHAMMAD YASIN, ST', 'Tanfidziyah', 'Ranting', 'r1', '082132317474', 'yasin@ranting.org', 'Belum', 'S1'),
('KH. Rofiqul Amin, S.Pd.', 'Rois Syuriyah', 'Ranting', 'r3', '081332570991', 'rofiq@ranting.org', 'PD-PKPNU', 'S1'),
('Syukri Ghozali, S.Pd.', 'Tanfidziyah', 'Ranting', 'r3', '081357334667', 'syukri@ranting.org', 'PD-PKPNU', 'S1'),
('H. Nur Syahid', 'Rois Syuriyah', 'Ranting', 'r17', '085101266542', 'nursyahid@ranting.org', 'PD-PKPNU', 'S1'),
('Hamdi Ahmadi Mushzabi, M.Pd.', 'Tanfidziyah', 'Ranting', 'r17', '081292928115', 'hamdi@ranting.org', 'PD-PKPNU', 'S2');

-- 4. SEED DATA KADER
INSERT INTO kader (name, pob, dob, gender, banom, role, ranting_id, phone, join_year) VALUES
('Alek Salim, M.Pd', 'Gresik', '1985-05-15', 'Laki-laki', 'Ansor', 'Ketua PAC GP Anshor MWC NU BUNGAH', 'mwc', '0815515224710', 2010),
('Ainul Mahmudah, M.Pd.I', 'Gresik', '1988-08-20', 'Perempuan', 'Fatayat', 'Ketua PAC Fatayat MWC NU BUNGAH', 'mwc', '085105113443', 2012),
('M. Baihaqi Alamsyah', 'Gresik', '2001-11-12', 'Laki-laki', 'IPNU', 'Ketua PAC IPNU MWC NU BUNGAH', 'mwc', '0858595242877', 2018),
('Erniawati', 'Gresik', '2002-04-18', 'Perempuan', 'IPPNU', 'Ketua PAC IPPNU MWC NU BUNGAH', 'mwc', '085755920527', 2019),
('AYATULLAH KAUNANG', 'Abar-Abir', '1990-10-10', 'Laki-laki', 'Ansor', 'Ketua Ranting Anshor Abar-Abir', 'r1', '081937881756', 2015),
('WIWIN RAHMAWATI', 'Abar-Abir', '1992-02-14', 'Perempuan', 'Fatayat', 'Ketua Ranting Fatayat Abar-Abir', 'r1', '085607473193', 2016);

-- 5. SEED DATA KEGIATAN
INSERT INTO kegiatan (title, date, location, organizer, target_group, funding_source, budget, status, description) VALUES
('RTL PD PKP 40 MWC NU Bungah', '2025-01-11', 'Gedung MWCNU Bungah', 'MWC NU BUNGAH', 'Kader PKP 40 (93 orang)', 'Kas Jamiyah', 2700000, 'Selesai', 'Rencana Tindak Lanjut Pendidikan Kader Penggerak angkatan ke-40 se-Kecamatan Bungah.'),
('Pendidikan Kader Penggerak (PD PKP 40)', '2025-01-03', 'Gedung MWCNU Bungah', 'MWC NU BUNGAH', 'Panitia dan Peserta MWCNU (93 orang)', 'Kas Jamiyah', 27400000, 'Selesai', 'Pendidikan kader penggerak utama untuk memperkokoh militansi kader di MWC NU Bungah.');

-- 6. SEED DATA KAS DANA (TRANSPARANSI ARUS KAS)
INSERT INTO kas_dana (date, type, category, amount, description, pic) VALUES
('2026-07-01', 'Masuk', 'Iuran Anggota', 15000000.00, 'Iuran wajib bulanan seluruh pengurus ranting dan MWC', 'Bendahara MWC'),
('2026-07-03', 'Keluar', 'Operasional Kantor', 2450000.00, 'Pembayaran listrik, internet, air, dan ATK sekretariat', 'Sekretaris MWC'),
('2026-07-05', 'Masuk', 'Donasi Publik', 8500000.00, 'Donasi hamba Allah untuk renovasi aula pertemuan', 'Ketua LAZISNU'),
('2026-07-06', 'Keluar', 'Bantuan Sosial', 3500000.00, 'Santunan dhuafa dan anak yatim Desa Bungah', 'Koordinator Lazisnu');

-- 7. SEED DATA KOIN S3 (SEHARI SERIBU) LAZISNU
INSERT INTO koin_s3 (month, ranting_id, amount, distribution_target, distribution_amount) VALUES
('2026-06', 'r1', 4850000.00, 'Sembako kaum dhuafa & beasiswa yatim', 4500000.00),
('2026-06', 'r2', 3900000.00, 'Pengobatan warga sakit & renovasi mushola', 3500000.00),
('2026-06', 'r3', 4200000.00, 'Sembako kaum dhuafa & santunan yatim', 4000000.00);

-- 8. SEED DATA PERSURATAN
INSERT INTO persuratan (letter_number, type, code, sender_or_recipient, date, subject) VALUES
('023/MWC-NU/A.I/VII/2026', 'Masuk', 'A.I', 'PCNU Kabupaten Gresik', '2026-07-02', 'Undangan Rapat Pleno Koordinasi Harlah NU'),
('142/MWC-NU/B.II/VII/2026', 'Keluar', 'B.II', 'Seluruh Ranting NU se-Kecamatan Bungah', '2026-07-04', 'Instruksi Penggalangan Koin S3 Bulan Juli');

-- 9. SEED DATA USAHA JAMIYAH
INSERT INTO usaha (name, type, location, manager, status, revenue) VALUES
('NUtama Minimarket Bungah', 'Toko', 'Jl. Raya Bungah No. 45', 'H. Ahmad Sholih', 'Aktif', 45000000.00),
('Pertanian Gabah Berkah NU', 'Pertanian', 'Lahan Wakaf Desa Melirang', 'Kiai Ali Murtadlo', 'Aktif', 28000000.00);

-- 10. SEED DATA SARANA IBADAH
INSERT INTO sarana_ibadah (name, type, takmir, imam1, imam2, nu_affiliation, land_status, address, ranting_id) VALUES
('Masjid Jami'' Raden Santri', 'Masjid', 'KH. Shobihun Luthfi', 'Kiai Hasbullah', 'Ust. Mustofa', 'Milik NU', 'Wakaf NU', 'Desa Bedanten, Bungah', 'r3'),
('Musholla Roudlotut Thoyyibah', 'Musholla', 'KH. Munif', 'Ust. Zainal', 'Ust. Syarif', 'Afiliasi NU', 'Wakaf Pribadi', 'Desa Bungah, Bungah', 'r17');

-- 11. SEED DATA SARANA PENDIDIKAN
INSERT INTO sarana_pendidikan (name, level, status, principal, student_count, condition, address, ranting_id) VALUES
('MI Ma''arif Bungah', 'MI', 'Swasta NU', 'H. Solichin, S.Pd', 340, 'Baik', 'Jl. Pendidikan No. 12 Bungah', 'r17'),
('MTs Ma''arif Bedanten', 'MTs', 'Swasta NU', 'Hj. Aminah, S.Pd.I', 210, 'Baik', 'Jl. Masjid No. 05 Bedanten', 'r3');

-- 12. SEED DATA BERITA
INSERT INTO berita (title, category, content, date, author) VALUES
('Pelantikan Pengurus Baru PRNU Abar-Abir Periode 2026-2031', 'Warta Jamiyah', 'Pelantikan berlangsung khidmat dipimpin oleh Ketua MWCNU Bungah...', '2026-07-02', 'Sekretariat MWC'),
('Pengumuman Pelaksanaan Istighosah Kubro MWC NU Bungah', 'Pengumuman', 'Istighosah akan dilaksanakan pada hari Ahad manis mendatang...', '2026-07-05', 'Lembaga Dakwah');

-- 13. SEED DATA DOKUMENTASI
INSERT INTO dokumentasi (title, type, url, date, category) VALUES
('Dokumentasi RTL PD PKP 40', 'Foto', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', '2025-01-11', 'Kegiatan'),
('Rapat Kerja MWCNU Bungah', 'Foto', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', '2025-01-03', 'Rapat');

-- 14. SEED DATA ASPIRASI
INSERT INTO aspirasi (name, phone, email, ranting_id, subject, message, status) VALUES
('M. Sholahuddin', '081234567890', 'sholah@gmail.com', 'r17', 'Penggalangan Koin S3', 'Usul agar kotak koin S3 ditaruh di toko-toko kelontong strategis.', 'Masuk');
`;

export const apiSpecifications = [
  {
    category: 'Authentication',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        desc: 'Login admin dengan enkripsi JWT, validasi rate limiting, dan pembagian hak akses (role).',
        payload: {
          username: 'admin_ranting_bungah',
          password: 'secretpassword123'
        },
        response: {
          status: 'success',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 12,
            username: 'admin_ranting_bungah',
            role: 'admin_ranting',
            rantingId: 'r1'
          }
        }
      }
    ]
  },
  {
    category: 'Kader & Pengurus',
    endpoints: [
      {
        method: 'GET',
        path: '/api/kader',
        desc: 'Mengambil data kader terfilter berdasarkan ranting, banom, angkatan, dan pencarian nama.',
        queryParams: '?ranting_id=r1&banom=Ansor&search=Ahmad',
        response: {
          status: 'success',
          count: 1,
          data: [
            {
              id: 1,
              name: 'Ahmad Sholihuddin',
              pob: 'Gresik',
              dob: '1995-04-12',
              gender: 'Laki-laki',
              banom: 'Ansor',
              role: 'Ketua PAC GP Ansor Bungah',
              ranting_id: 'r1',
              phone: '085733322211',
              join_year: 2015
            }
          ]
        }
      },
      {
        method: 'POST',
        path: '/api/kader',
        desc: 'Menambahkan data kader baru (Terbatas untuk Admin Ranting [untuk rantingnya] atau Super Admin).',
        payload: {
          name: 'Muhammad Ilham',
          pob: 'Gresik',
          dob: '1999-12-01',
          gender: 'Laki-laki',
          banom: 'Ansor',
          role: 'Wakil Ketua Hubungan Masyarakat',
          ranting_id: 'r1',
          phone: '085600011122',
          join_year: 2020
        },
        response: {
          status: 'success',
          message: 'Data kader berhasil ditambahkan',
          id: 42
        }
      }
    ]
  },
  {
    category: 'Transparansi & Koin S3',
    endpoints: [
      {
        method: 'GET',
        path: '/api/koin-s3/rekap',
        desc: 'Rekapitulasi perolehan koin S3 LAZISNU bulanan per desa (ranting) dan target penyaluran kemaslahatan.',
        response: {
          status: 'success',
          total_akumulasi: 48500000,
          bulan_aktif: '2026-06',
          data: [
            {
              ranting_id: 'r1',
              ranting_name: 'PRNU Bungah',
              amount_collected: 4850000,
              distribution_target: 'Sembako kaum dhuafa',
              distribution_amount: 3000000
            }
          ]
        }
      },
      {
        method: 'POST',
        path: '/api/koin-s3',
        desc: 'Menginput perolehan koin S3 bulanan (Hanya diizinkan untuk Admin LAZISNU atau Super Admin).',
        payload: {
          month: '2026-07',
          ranting_id: 'r2',
          amount: 3500000,
          distribution_target: 'Bantuan Beasiswa Pendidikan Santri',
          distribution_amount: 250000
        },
        response: {
          status: 'success',
          message: 'Data Koin S3 berhasil disimpan'
        }
      }
    ]
  },
  {
    category: 'Aset & Sarana',
    endpoints: [
      {
        method: 'GET',
        path: '/api/sarana-ibadah',
        desc: 'Mendapatkan daftar masjid & musholla, status afiliasi NU, dan legalitas tanah wakaf.',
        response: {
          status: 'success',
          data: [
            {
              id: 1,
              name: 'Masjid Jami Raden Santri Bedanten',
              type: 'Masjid',
              takmir: 'KH. Shobihun Luthfi',
              nu_affiliation: 'Milik NU',
              land_status: 'Wakaf NU',
              address: 'RT 03 RW 01 Desa Bedanten, Bungah'
            }
          ]
        }
      }
    ]
  }
];

export const architectureRecommendations = {
  stack: {
    frontend: 'React 18/19 + Vite + Tailwind CSS v4',
    backend: 'Laravel 10/11 (menggunakan Laravel Filament untuk panel admin cepat) atau Node.js Express + TS',
    database: 'PostgreSQL 14+ (Optimal untuk relasi kompleks, indexing spatial, dan agregasi finansial)',
    cache: 'Redis (Menyimpan cache rekapitulasi Koin S3, data pengurus, dan cache berita utama guna menghemat bandwidth)'
  },
  bandwidthOptimizations: [
    {
      title: 'Caching di Sisi Klien (Local Cache & Service Workers)',
      desc: 'Mengingat sinyal internet di daerah pedesaan (misal wilayah pesisir Bungah) terkadang tidak stabil, aplikasi wajib mengimplementasikan Progressive Web App (PWA) dengan service workers dan penyimpanan localStorage/IndexedDB. Data statistik, profil Jamiyah, dan data kader yang jarang berubah dapat disinkronisasi di awal, lalu dibaca secara luring (offline-first).'
    },
    {
      title: 'Kompresi Gambar Agresif & WebP',
      desc: 'Setiap foto kegiatan, usaha jamiyah, dan sarana ibadah yang diunggah wajib dikompresi di sisi server (misal dengan library sharp di Node.js atau Intervention Image di Laravel) ke format WebP dengan resolusi maksimal lebar 800px dan kompresi kualitas 75% untuk menghemat kuota internet warga.'
    },
    {
      title: 'Query Agregasi Terindeks (Database Level)',
      desc: 'Bandingkan kalkulasi Koin S3 bulanan menggunakan query JOIN terindeks dengan komposit index (month, ranting_id) daripada menjumlahkannya secara mentah di kode server. Ini menjamin load halaman di bawah 100ms.'
    }
  ]
};
