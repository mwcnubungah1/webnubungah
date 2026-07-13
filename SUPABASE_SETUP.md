# Panduan Reset & Setup Database Supabase + Unggah CSV Data Kader
Dokumen ini berisi panduan teknis bagi Pengurus / Administrator untuk mengatur ulang database Supabase dari awal (reset) serta mengunggah seluruh data kader dengan lancar.

---

## 1. Setup Awal atau Reset Total Database (Sangat Direkomendasikan)
Kami telah menyediakan berkas SQL lengkap di dalam sistem bernama `/SUPABASE_RESET_AND_SETUP.sql` yang melakukan tiga hal penting sekaligus:
1. Menghapus seluruh tabel dan relasi lama yang berkonflik (Reset Total).
2. Membuat 12 tabel baru terstruktur yang 100% kompatibel dengan sistem Portal Transparansi MWC NU Bungah.
3. Mengaktifkan Row Level Security (RLS) & Polisi Keamanan demi melindungi kerahasiaan data internal.
4. Memasukkan data awal (seed data) yang representatif.

### Langkah-langkah menjalankan script reset:
1. Buka berkas `/SUPABASE_RESET_AND_SETUP.sql` di editor proyek Anda dan salin (Copy) seluruh isinya.
2. Masuk ke Dashboard Supabase Anda: [https://supabase.com](https://supabase.com).
3. Di panel kiri, klik menu **SQL Editor**.
4. Klik **New Query**, beri nama (misal: "Reset & Setup MWC NU"), tempelkan (Paste) seluruh script SQL tadi, lalu klik **Run** di pojok kanan bawah.
5. Selesai! Seluruh struktur database kini bersih, aman, dan siap digunakan secara optimal.

---

## 2. Cara Impor CSV Langsung di Supabase Dashboard (Untuk 364+ Kader)
Jika Anda ingin mengunggah seluruh **364 entri kader** secara instan ke database online Supabase Anda:

1. Di Dashboard Supabase Anda, pilih menu **Table Editor** di bilah kiri.
2. Klik tabel bernama `kader`.
3. Di bagian atas kanan tabel, klik tombol **"Insert"** lalu pilih **"Import data from CSV"**.
4. Tarik (Drag & Drop) berkas `Data Kader.csv` Anda ke area unggah.
5. **Pemetaan Kolom (Column Mapping)**: Supabase akan mendeteksi nama kolom secara otomatis. Pastikan kolom-kolom berikut terpetakan dengan benar:
   * `NO` -> abaikan saja
   * `NAMA` -> `name`
   * `TEMPAT_TGL_LAHIR` -> masukkan ke `pob` (sistem portal web akan memilah tempat/tanggal lahir secara cerdas)
   * `UNSUR` -> `unsur`
   * `JABATAN` -> `role`
   * `ALAMAT` -> `address`
   * `RANTING` -> `ranting_id` (aplikasi web akan otomatis memetakan nama seperti "Abar-Abir" ke kode ranting desa seperti `r1`)
   * `NO_TELP` -> `phone`
   * `JK` -> `gender` (sistem otomatis mengubah 'L' menjadi Laki-laki dan 'P' menjadi Perempuan)
   * `ANGKATAN` -> `angkatan`
6. Klik **"Import Data"**. Seluruh data kader kini telah online dan tersinkronisasi!

---

## 3. Fitur Alternatif: Impor CSV Mandiri via Aplikasi Web
Untuk kemudahan di masa depan, Anda tidak perlu membuka dashboard Supabase setiap kali ada penambahan kader massal. Kami sudah membangun **Fitur Impor CSV Otomatis** di halaman Portal Admin:

1. Masuk ke halaman **Admin CMS** di aplikasi.
2. Klik tab **Data Kader**.
3. Klik tombol **"Unggah CSV Kader"** (ikon upload berwarna abu-abu) di sebelah kanan tombol Tambah Baru.
4. Pilih file `.csv` dari perangkat Anda.
5. Sistem akan otomatis mem-parsing seluruh baris, mengonversi singkatan unsur, memetakan ranting desa ke ID yang sesuai, menghitung tahun bergabung berdasarkan angkatan Romawi, dan menyimpannya langsung ke database Supabase (jika terhubung) secara real-time!

---
*Keamanan data terjamin. Jika Anda mengalami kendala teknis atau memiliki pertanyaan lanjutan, silakan hubungi tim TI MWC NU Bungah.*
