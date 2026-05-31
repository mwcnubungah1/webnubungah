# PANDUAN DEPLOYMENT & INTEGRASI CLOUDFLARE, SUPABASE & CLOUDINARY
### MWCNU Bungah Smart Governance

Panduan ini mendeskripsi langkah-langkah lengkap untuk melakukan deployment aplikasi web **MWCNU Bungah Smart Governance** menggunakan layanan **Cloudflare Pages**, database **Supabase**, dan CDN **Cloudinary**.

---

## 1. Integrasi Database Supabase

### A. Eksekusi SQL Query & Row-Level Security (RLS)
Lakukan import file `supabase-schema.sql` yang sudah diperbarui dengan aturan RLS lengkap ke dalam Supabase SQL Editor Anda:
1. Masuk ke [Supabase Dashboard](https://supabase.com).
2. Pilih proyek database Anda.
3. Klik tombol **SQL Editor** di sidebar kiri.
4. Klik **New Query**, copy paste seluruh isi file `supabase-schema.sql` dari repositori ini, lalu klik **Run**.
5. Script tersebut akan otomatis menginisialisasi 11 tabel relasional lengkap dengan data bibit (seed data) wilayah Kecamatan Bungah, mengaktifkan RLS, serta membuat fungsi pembatas admin `is_admin()`.

### B. Konfigurasi Admin Akun Utama
Aturan RLS khusus menetapkan email **`maghfurmunif@gmail.com`** dengan UID **`bec40ceb-b514-43e7-8428-04c742bbef5b`** sebagai Administrator Terverifikasi. Untuk menyelaraskan data autentikasi dengan akun nyata Anda di Supabase Auth:
* Jika mendaftar pengguna baru via Supabase Auth, Anda bisa menyamakan atau mengaitkan ID pengguna di tabel `auth.users` dengan UID tersebut, atau memperbarui UUID fungsi pembatas `is_admin()` di SQL Editor Anda dengan UUID asli Anda:
```sql
-- Ganti UUID di bawah dengan UUID asli yang Anda dapatkan setelah mendaftar di Supabase Auth
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.uid() = 'YOUR_REAL_UUID_HERE'::uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 2. Setting Deployment Cloudflare Pages (via GitHub)

Ada dua metode mudah untuk mendeploy aplikasi ini ke Cloudflare Pages:

### Metode A: Hubungkan Repositori GitHub Langsung di Dashboard Cloudflare (Sangat Direkomendasikan)
Metode ini adalah opsi termudah karena Cloudflare akan memantau commits Anda secara otomatis.
1. Daftarkan dan hubungkan akun GitHub Anda ke [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Pergi ke menu **Workers & Pages** -> pilih tab **Pages** -> Klik tombol **Connect to Git** atau **Create application**.
3. Pilih Repositori GitHub untuk aplikasi ini.
4. Pada bagian **Build Settings**, konfigurasikan sebagai berikut:
   * **Framework preset**: `Vite` (atau *None*)
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
5. Pada bagian **Environment Variables**, tambahkan variabel runtime berikut:
   * `VITE_SUPABASE_URL` = *(Salin dari Supabase -> Project Settings -> API)*
   * `VITE_SUPABASE_ANON_KEY` = *(Salin dari Supabase -> Project Settings -> API)*
   * `VITE_CLOUDINARY_URL` = *(Salin alamat instansi Cloudinary Anda)*
6. Klik **Save and Deploy**. Cloudflare akan mendeploy aplikasi Anda secara instan dalam beberapa detik.

### Metode B: Deployment Otomatis via GitHub Actions
Kami telah menyiapkan file Workflow otomatis di koordinat `/.github/workflows/cloudflare-pages.yml`. Jika Anda ingin mendeploy melalui GitHub pipeline:
1. Di repositori GitHub Anda, pergi ke tab **Settings** -> **Secrets and variables** -> **Actions**.
2. Daftarkan tiga Secrets baru:
   * `CLOUDFLARE_API_TOKEN`: Buat API token baru di dashboard Cloudflare Anda dengan izin *Cloudflare Pages Edit*.
   * `CLOUDFLARE_ACCOUNT_ID`: Ambil ID Akun Anda dari URL halaman Workers/Pages Cloudflare.
   * `VITE_SUPABASE_URL`: Alamat endpoint API Supabase Anda.
   * `VITE_SUPABASE_ANON_KEY`: Kunci anonim umum Supabase Anda.
3. Setiap kali Anda melakukan `git push` ke cabang `main`, GitHub Actions akan otomatis merakit berkas produksi dan mendorong rilis terbaru langsung ke domain Cloudflare Pages Anda.

---

## 3. Integrasi Media Cloudinary

Untuk mengunggah gambar kegiatan, foto pengurus, dan tanda tangan digital secara real-time ke penyimpanan Cloudinary Anda:
1. Hubungkan input unggah media Anda dengan Cloudinary API di sisi klien atau server.
2. Semua tautan logo organisasi telah diarahkan secara tetap ke alamat hosting Cloudinary berkinerja tinggi Anda:
   `https://res.cloudinary.com/dkirp8utp/image/upload/q_auto/f_auto/v1780232375/logo-nu-40177_wrpdez.png`
3. Konfigurasikan optimasi otomatis di Cloudinary Management Console Anda dengan parameter kompresi pintar `q_auto,f_auto` agar pemuatan media di portal warga terasa cepat dan responsif.
