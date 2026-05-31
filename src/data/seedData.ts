import {
  SuratMasuk,
  SuratKeluar,
  ArsipDokumen,
  TransaksiKeuangan,
  AnggotaPengurus,
  ProgramKerja,
  DokumentasiKegiatan,
  LokasiGIS,
  AgendaMusyawarah,
  BeritaArtikel
} from '../types';

export const SEED_RANTING = [
  { id: 'R-01', nama: 'Ranting Bungah' },
  { id: 'R-02', nama: 'Ranting Melirang' },
  { id: 'R-03', nama: 'Ranting Sidomukti' },
  { id: 'R-04', nama: 'Ranting Bedanten' },
  { id: 'R-05', nama: 'Ranting Sukorejo' },
  { id: 'R-06', nama: 'Ranting Sungonlegowo' },
  { id: 'R-07', nama: 'Ranting Indrodelik' },
  { id: 'R-08', nama: 'Ranting Kemangi' },
  { id: 'R-09', nama: 'Ranting Mojopetung' },
  { id: 'R-10', nama: 'Ranting Peganden' }
];

export const SEED_SURAT_MASUK: SuratMasuk[] = [
  {
    id: 'SM-1',
    nomorSurat: '042/PCNU/A.I/IV/2026',
    tanggal: '2026-04-12',
    pengirim: 'PCNU Kabupaten Gresik',
    perihal: 'Instruksi Pelaksanaan Istighosah Kubro Serentak',
    lampiran: '1 Berkas',
    statusDisposisi: 'Sudah Disposisi',
    disposisiKepada: 'Syuriyah & Tanfidziyah',
    catatanDisposisi: 'Jadwalkan Lailatul Ijtima keliling ke semua Ranting di Bungah mulai pekan depan.',
    fileUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'SM-2',
    nomorSurat: '015/PR-IPNU-IPPNU/V/2026',
    tanggal: '2026-05-18',
    pengirim: 'PAC IPNU IPPNU Bungah',
    perihal: 'Permohonan Delegasi Peserta LAKUT (Latihan Kader Utama)',
    lampiran: '1 Berkas',
    statusDisposisi: 'Sudah Disposisi',
    disposisiKepada: 'Lembaga Kaderisasi & Banom',
    catatanDisposisi: 'Kirimkan minimal 2 perwakilan dari IPNU dan 2 IPPNU terbaik se-Kecamatan Bungah.',
    fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'SM-3',
    nomorSurat: '008/LAZISNU-MWC/V/2026',
    tanggal: '2026-05-28',
    pengirim: 'KOIN NU Lembaga Amil Zakat Bungah',
    perihal: 'Laporan Rekapitulasi Sedekah KOIN NU Bulan Mei',
    lampiran: '1 Lembar',
    statusDisposisi: 'Belum Disposisi',
    fileUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60'
  }
];

export const SEED_SURAT_KELUAR: SuratKeluar[] = [
  {
    id: 'SK-1',
    nomorSurat: '112/MWC-NU/A.I/V/2026',
    tanggal: '2026-05-10',
    penerima: 'Seluruh Ketua Pengurus Ranting NU se-Kecamatan Bungah',
    perihal: 'Undangan Rapat Koordinasi Bulanan & Halal bi Halal MWC NU Bungah',
    lampiran: '1 Lembar',
    status: 'Diarsipkan',
    tandaTanganDigital: 'KH. Sholeh Qosim (Rais Syuriyah) & KH. Achmad Shofwan (Ketua MWC)',
    content: 'Mengharap dengan hormat kehadiran Bapak/Ibu Pengurus Ranting NU dalam Rapat Koordinasi Bulanan yang akan dilaksanakan pada Minggu malam Senin, bertempat di Kantor MWC NU Bungah. Agenda utama: Evaluasi Koin NU dan persiapan Madrasah Kader Nahdlatul Ulama.',
    tanggalDibuat: '2026-05-08',
    dibuatOleh: 'Drs. H. Choirul Anam'
  },
  {
    id: 'SK-2',
    nomorSurat: '115/MWC-NU/A.G/V/2026',
    tanggal: '2026-05-20',
    penerima: 'Camat Bungah & Forkopimca',
    perihal: 'Permohonan Rekomendasi Lokasi Kegiatan Khitanan Massal Sosial MWC',
    lampiran: '- ',
    status: 'Disetujui Ketua',
    tandaTanganDigital: 'KH. Achmad Shofwan',
    content: 'Dalam rangka memperingati Hari Lahir NU yang dikemas dengan kegiatan sosial kemasyarakatan, MWC NU Bungah bermaksud untuk menyelenggarakan Khitanan Massal Gratis bagi warga kurang mampu sebanyak 100 anak. Kami memohon rekomendasi izin pemakaian Pendopo Kecamatan Bungah.',
    tanggalDibuat: '2026-05-19',
    dibuatOleh: 'Staf Sekretariat - Ahmad Fauzi'
  },
  {
    id: 'SK-3',
    nomorSurat: '124/MWC-NU/A.I/V/2026',
    tanggal: '2026-05-29',
    penerima: 'Pimpinan Yayasan Masjid Jami Al-Anwar Bungah',
    perihal: 'Pemberitahuan Agenda Turba (Turun ke Bawah) MWC NU',
    lampiran: '- ',
    status: 'Draft',
    content: 'Menyusul keputusan rapat harian MWC NU Bungah, kami menjadwalkan kunjungan silaturahim dan pembinaan organisasi (TURBA) di masjid Al-Anwar pada Jumat malam Sabtu kedua bulan Juni.',
    tanggalDibuat: '2026-05-29',
    dibuatOleh: 'Drs. H. Choirul Anam'
  }
];

export const SEED_ARSIP_DOKUMEN: ArsipDokumen[] = [
  {
    id: 'AD-1',
    nama: 'Surat Keputusan Pengesahan MWC Bungah 2024-2029',
    kategori: 'SK',
    tanggal: '2024-03-15',
    tags: ['SK', 'PCNU', 'Pengurus', 'Periode 2024-2029'],
    versi: 'v1.0 Final',
    fileSize: '3.4 MB',
    deskripsi: 'Surat Keputusan resmi dari Pengurus Besar Nahdlatul Ulama (PBNU) melalui PCNU Gresik tentang susunan lengkap Syuriyah dan Tanfidziyah MWC NU Bungah.',
    fileUrl: '#sk-official',
    publicAccess: true
  },
  {
    id: 'AD-2',
    nama: 'Standard Operating Procedure (SOP) Pengajuan Dana Sosial LAZISNU',
    kategori: 'SOP',
    tanggal: '2025-01-10',
    tags: ['SOP', 'LAZISNU', 'Sosial', 'Bantuan'],
    versi: 'v2.1 Pembaruan',
    fileSize: '1.2 MB',
    deskripsi: 'Mekanisme pengajuan, verifikasi, dan penyaluran dana sosial kesehatan dan beasiswa pendidikan yatim dhuafa KOIN NU MWC Bungah.',
    fileUrl: '#sop-lazis',
    publicAccess: true
  },
  {
    id: 'AD-3',
    nama: 'Proposal Pembangunan Gedung Pusat Dakwah MWC NU Center',
    kategori: 'Proposal',
    tanggal: '2025-06-20',
    tags: ['Gedung MWC', 'Pembangunan', 'Proposal', 'Wakaf'],
    versi: 'v3.5 Revisi-4',
    fileSize: '12.8 MB',
    deskripsi: 'Rencana Anggaran Biaya (RAB) dan maket desain arsitektur pembangunan Graha NU Center Bungah 3 lantai, lengkap dengan rincian kebutuhan donatur.',
    fileUrl: '#proposal-center',
    publicAccess: true
  },
  {
    id: 'AD-4',
    nama: 'Anggaran Dasar & Anggaran Rumah Tangga Hasil Muktamar NU',
    kategori: 'AD/ART',
    tanggal: '2022-01-20',
    tags: ['AD_ART', 'Muktamar', 'PBNU'],
    versi: 'Hasil Muktamar 34',
    fileSize: '8.1 MB',
    deskripsi: 'Pedoman pokok konstitusi organisasi Nahdlatul Ulama untuk rujukan pengambilan keputusan hukum dan operasional tingkat wilayah hingga ranting.',
    fileUrl: '#ad-art-nu',
    publicAccess: true
  },
  {
    id: 'AD-5',
    nama: 'Laporan Pertanggungjawaban (LPJ) Ramadhan Peduli Sesama 2025',
    kategori: 'LPJ',
    tanggal: '2025-04-30',
    tags: ['LPJ', 'Ramadhan', 'Baksos', 'Lembaga'],
    versi: 'v1.0 Selesai',
    fileSize: '4.7 MB',
    deskripsi: 'Dokumen audit keuangan kegiatan penyaluran 1500 paket sembako dan santunan anak yatim se-Kecamatan Bungah di bulan suci Ramadhan 1446 H.',
    fileUrl: '#lpj-ramadhan-2025',
    publicAccess: false
  }
];

export const SEED_TRANSAKSI_KEUANGAN: TransaksiKeuangan[] = [
  {
    id: 'TX-1',
    tanggal: '2026-05-01',
    tipe: 'Pemasukan',
    kategori: 'Iuran',
    deskripsi: 'Setoran Iuran Anggota Kolektif Ranting Bungah',
    jumlah: 3500000,
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60',
    status: 'Disetujui',
    disetujuiOleh: 'KH. Achmad Shofwan',
    auditTrail: ['Pencatatan awal oleh Bendahara H. Mukhlis - 2026-05-01', 'Disetujui Ketua - 2026-05-01']
  },
  {
    id: 'TX-2',
    tanggal: '2026-05-04',
    tipe: 'Pemasukan',
    kategori: 'Donasi',
    deskripsi: 'Infaq Kelompok Pengusaha Muslim Bungah Peduli',
    jumlah: 15000000,
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60',
    status: 'Disetujui',
    disetujuiOleh: 'KH. Achmad Shofwan',
    auditTrail: ['Pencatatan hamba Allah lewat Rek Bank MWC - 2026-05-04', 'Dikonfirmasi Bendahara - 2026-05-04', 'Disetujui Ketua - 2026-05-05']
  },
  {
    id: 'TX-3',
    tanggal: '2026-05-08',
    tipe: 'Pengeluaran',
    kategori: 'Operasional',
    deskripsi: 'Pembayaran Rekening Listrik, Air & Internet Kantor MWC NU Bungah',
    jumlah: 1250000,
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60',
    status: 'Disetujui',
    disetujuiOleh: 'KH. Achmad Shofwan',
    auditTrail: ['Diajukan oleh staf sekrt - 2026-05-07', 'Pembayaran ditransfer Bendahara - 2026-05-08']
  },
  {
    id: 'TX-4',
    tanggal: '2026-05-12',
    tipe: 'Pemasukan',
    kategori: 'Usaha',
    deskripsi: 'Hasil Penjualan Buku Aqidah Aswaja & Atribut NU Toko MWCNU Center Bungah',
    jumlah: 4850000,
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60',
    status: 'Disetujui',
    disetujuiOleh: 'KH. Achmad Shofwan',
    auditTrail: ['Pencatatan kasir toko MWC Bungah - 2026-05-12']
  },
  {
    id: 'TX-5',
    tanggal: '2026-05-15',
    tipe: 'Pengeluaran',
    kategori: 'Kegiatan',
    deskripsi: 'Subsidi Panitia Lailatul Ijtima & Bahtsul Masail di Ranting Melirang',
    jumlah: 3000000,
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60',
    status: 'Disetujui',
    disetujuiOleh: 'KH. Achmad Shofwan',
    auditTrail: ['Pengajuan proposal panitia - 2026-05-10', 'Disetujui Ketua - 2026-05-13', 'Dicairkan Bendahara - 2026-05-15']
  },
  {
    id: 'TX-6',
    tanggal: '2026-05-22',
    tipe: 'Pengeluaran',
    kategori: 'Sosial',
    deskripsi: 'Bantuan Biaya Pengobatan Kesehatan Warga Dhuafa Ranting Sukorejo (LAZISNU)',
    jumlah: 2500000,
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60',
    status: 'Disetujui',
    disetujuiOleh: 'KH. Achmad Shofwan',
    auditTrail: ['Pengajuan dari Ketua Ranting Sukorejo - 2026-05-20', 'Disetujui oleh LAZISNU & Ketua MWC - 2026-05-22']
  },
  {
    id: 'TX-7',
    tanggal: '2026-05-28',
    tipe: 'Pengeluaran',
    kategori: 'Pendidikan',
    deskripsi: 'Beasiswa Pendidikan Kader Berprestasi PAC IPNU IPPNU Bungah',
    jumlah: 4000000,
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=60',
    status: 'Pending',
    auditTrail: ['Diajukan oleh Pimpinan IPNU IPPNU - 2026-05-28', 'Ditinjau oleh Bendahara - 2026-05-29']
  }
];

export const SEED_ANGGOTA_PENGURUS: AnggotaPengurus[] = [
  {
    id: 'AP-1',
    nomorAnggota: '35.15.02.0001',
    nama: 'KH. Sholeh Qosim, M.Pd.I',
    nik: '3515021204680001',
    tempatLahir: 'Gresik',
    tanggalLahir: '1968-04-12',
    alamat: 'Jl. Raya Bungah No. 12, Peganden, Bungah, Gresik',
    pendidikan: 'S2 Pendidikan Islam',
    pekerjaan: 'Dosen / Pengasuh Pondok Pesantren',
    jabatanOrganisasi: 'Rais Syuriyah MWC NU',
    struktur: 'Pengurus Harian',
    rantingId: 'R-10',
    riwayatJabatan: ['Wakil Rais Syuriyah PCNU Gresik (2019-2024)', 'Rais Syuriyah MWC Bungah (2024-Sekarang)'],
    keahlian: ['Fikih & Ushul Fikih', 'Diferensiasi Tafsir Al-Quran', 'Manajemen Pondok'],
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&crop=face&q=80'
  },
  {
    id: 'AP-2',
    nomorAnggota: '35.15.02.0002',
    nama: 'KH. Achmad Shofwan, S.Ag',
    nik: '3515020509740003',
    tempatLahir: 'Gresik',
    tanggalLahir: '1974-09-05',
    alamat: 'Jl. Kyai Gede No. 45, Bungah, Gresik',
    pendidikan: 'S1 Hukum Islam',
    pekerjaan: 'Wiraswasta / Pengusaha Kuliner',
    jabatanOrganisasi: 'Ketua Tanfidziyah MWC NU',
    struktur: 'Pengurus Harian',
    rantingId: 'R-01',
    riwayatJabatan: ['Sekretaris MWC NU Bungah (2019-2024)', 'Ketua Tanfidziyah MWC NU Bungah (2024-Sekarang)'],
    keahlian: ['Manajemen Organisasi', 'Retorika / Dakwah', 'Negosiasi Bisnis'],
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&crop=face&q=80'
  },
  {
    id: 'AP-3',
    nomorAnggota: '35.15.02.0003',
    nama: 'Drs. H. Choirul Anam',
    nik: '3515022812690001',
    tempatLahir: 'Gresik',
    tanggalLahir: '1969-12-28',
    alamat: 'Perum Melirang Asri Blok B-12, Melirang, Bungah',
    pendidikan: 'S1 Administrasi Negara',
    pekerjaan: 'Pensiunan ASN Pemkab Gresik',
    jabatanOrganisasi: 'Sekretaris Tanfidziyah',
    struktur: 'Pengurus Harian',
    rantingId: 'R-03',
    riwayatJabatan: ['Wakil Sekretaris MWC NU Bungah (2019-2024)', 'Sekretaris Koordinator Humas PCNU Gresik'],
    keahlian: ['Tata Mobilisasi Persuratan', 'Perencanaan Kebijakan', 'Arsip Dokumen'],
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&crop=face&q=80'
  },
  {
    id: 'AP-4',
    nomorAnggota: '35.15.02.0004',
    nama: 'H. Mukhlis Al-Hakim, S.E.',
    nik: '3515021508820002',
    tempatLahir: 'Surabaya',
    tanggalLahir: '1982-08-15',
    alamat: 'Jl. Raya Bedanten No. 88, Bungah',
    pendidikan: 'S1 Akuntansi',
    pekerjaan: 'Konsultan Pajak & Keuangan',
    jabatanOrganisasi: 'Bendahara Umum',
    struktur: 'Pengurus Harian',
    rantingId: 'R-04',
    riwayatJabatan: ['Bendahara LAZISNU MWC (2020-2024)', 'Bendahara Tanfidziyah MWC Bungah'],
    keahlian: ['Akuntansi Keuangan', 'Audit Keuangan Syariah', 'Perpajakan'],
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&crop=face&q=80'
  },
  {
    id: 'AP-5',
    nomorAnggota: '35.15.02.0018',
    nama: 'Zainal Arifin, S.Kom',
    nik: '3515022101950005',
    tempatLahir: 'Gresik',
    tanggalLahir: '1995-01-21',
    alamat: 'Jl. Sunan Kalijaga No. 4, Melirang, Bungah',
    pendidikan: 'S1 Teknik Informatika',
    pekerjaan: 'Software Engineer & IT Consultant',
    jabatanOrganisasi: 'Ketua LTN NU (Lembaga Infokom & Publikasi)',
    struktur: 'Lembaga',
    rantingId: 'R-02',
    riwayatJabatan: ['Ketua PAC IPNU Bungah (2018-2020)', 'Staf Hubungan Media & Publik MWC'],
    keahlian: ['Pemrograman Web & Mobile', 'Desain UI/UX', 'Digital Marketing'],
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&crop=face&q=80'
  },
  {
    id: 'AP-6',
    nomorAnggota: '35.15.02.0031',
    nama: 'Hj. Aminah Zahro, M.Ag',
    nik: '3515020101780004',
    tempatLahir: 'Gresik',
    tanggalLahir: '1978-01-01',
    alamat: 'Jl. Raya Mojopetung No. 34, Bungah',
    pendidikan: 'S2 Syariah Islam',
    pekerjaan: 'Kepala Madrasah Aliyah',
    jabatanOrganisasi: 'Ketua PAC Muslimat NU',
    struktur: 'Banom',
    rantingId: 'R-09',
    riwayatJabatan: ['Sekretaris PAC Fatayat NU (2015-2019)', 'Wakil Pimpinan Fatayat Gresik'],
    keahlian: ['Metode Didaktik Pendidikan', 'Hukum Keluarga Islam', 'Koperasi Syariah'],
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&crop=face&q=80'
  },
  {
    id: 'AP-7',
    nomorAnggota: '35.15.02.0055',
    nama: 'Samsul Arifin, S.Sy.',
    nik: '3515021211900003',
    tempatLahir: 'Gresik',
    tanggalLahir: '1990-11-12',
    alamat: 'Dusun Sungon Lor, Sungonlegowo, Bungah',
    pendidikan: 'S1 Syariah',
    pekerjaan: 'Staf KUA Bungah',
    jabatanOrganisasi: 'Komandan Banser MWC NU Bungah',
    struktur: 'Banom',
    rantingId: 'R-06',
    riwayatJabatan: ['Kepala Provost Banser Gresik (2021-2024)', 'Kader Muda Ansor Bungah'],
    keahlian: ['Navigasi Lapangan & Protokoler', 'Hukum Perdata Islam', 'Bela Diri Tarung Derajat'],
    fotoUrl: 'https://images.unsplash.com/photo-1542103749-8ef59b94f4d3?w=200&auto=format&fit=crop&crop=face&q=80'
  }
];

export const SEED_PROGRAM_KERJA: ProgramKerja[] = [
  {
    id: 'PRG-1',
    nama: 'Pembangunan Gedung Graha MWC NU Bungah Center',
    penanggungJawab: 'Panitia Pembangunan MWC Center',
    anggaran: 850000000,
    realisasiAnggaran: 245000000,
    target: 'Konstruksi fisik lantai 1 dan 2 selesai fungsional',
    timelineMulai: '2025-08-01',
    timelineSelesai: '2026-12-31',
    status: 'Berjalan',
    progress: 42,
    kegiatanTerbantu: ['Pengecoran tiang penyangga lantai 2', 'Pemasangan dinding bata merah lobi utama']
  },
  {
    id: 'PRG-2',
    nama: 'Koin NU & Mobil Ambulans Siaga Ummat Gratis',
    penanggungJawab: 'LAZISNU Bungah',
    anggaran: 180000000,
    realisasiAnggaran: 185000000,
    target: 'Pembelian 1 Unit Mobil Suzuki APV Ambulans Layanan Kesehatan Terbuka',
    timelineMulai: '2025-01-15',
    timelineSelesai: '2025-10-20',
    status: 'Selesai',
    progress: 100,
    kegiatanTerbantu: ['Serah terima mobil ambulans di Kantor MWC Bungah', 'Layanan antar jemput pasien gawat darurat gratis ke RSUD Ibnu Sina Gresik sebanyak 124 kali']
  },
  {
    id: 'PRG-3',
    nama: 'Madrasah Kader Nahdlatul Ulama (MKNU) Pembinaan Karakter',
    penanggungJawab: 'Lembaga Kaderisasi & LAKPESDAM MWC',
    anggaran: 45000000,
    realisasiAnggaran: 0,
    target: 'Melatih 150 kader militan perwakilan dari 10 Ranting NU se-Bungah',
    timelineMulai: '2026-06-15',
    timelineSelesai: '2026-06-18',
    status: 'Perencanaan',
    progress: 10,
    kegiatanTerbantu: ['Rapat panitia persiapan MKNU di Kantor MWC Bungah']
  },
  {
    id: 'PRG-4',
    nama: 'Lailatul Ijtima & Bahtsul Masail Waqi’iyah Keliling Ranting',
    penanggungJawab: 'Lembaga Bahtsul Masail (LBM) & Syuriyah',
    anggaran: 30000000,
    realisasiAnggaran: 18000000,
    target: 'Melaksanakan kajian fikih kontemporer bulanan bergiliran di 10 Ranting NU',
    timelineMulai: '2025-01-01',
    timelineSelesai: '2026-12-31',
    status: 'Berjalan',
    progress: 60,
    kegiatanTerbantu: ['Kajian putaran ke-5 di Masjid Ranting Melirang', 'Kajian hukum cryptocurrency dalam muktamar fikih umat']
  },
  {
    id: 'PRG-5',
    nama: 'Digitalisasi Madrasah Ibtidaiyah LP Ma’arif NU',
    penanggungJawab: 'Lembaga Pendidikan Ma’arif NU MWC',
    anggaran: 120000000,
    realisasiAnggaran: 25000000,
    target: 'Instalasi Laboratorium Komputer dan Cloud Nilai di 3 Madrasah Ibtidaiyah',
    timelineMulai: '2026-02-10',
    timelineSelesai: '2026-08-30',
    status: 'Tertunda',
    progress: 20,
    kegiatanTerbantu: ['Survei jaringan internet dan instalasi server lokal Madrasah Bedanten']
  }
];

export const SEED_DOKUMENTASI: DokumentasiKegiatan[] = [
  {
    id: 'DK-1',
    judul: 'Lailatul Ijtima Putaran ke-5 & Kajian Hukum Syariah',
    programKerjaId: 'PRG-4',
    tanggal: '2026-05-15',
    deskripsi: 'Kegiatan silaturahmi akbar dihadiri 400 jamaah di Masjid Al-Muttaqin Ranting Melirang. Membahas status fiqih hukum warisan kontemporer dan asuransi jaminan sosial nasional.',
    lokasi: 'Masjid Al-Muttaqin, Desa Melirang, Bungah',
    pengurusTerlibat: ['KH. Sholeh Qosim, M.Pd.I', 'KH. Achmad Shofwan, S.Ag', 'Samsul Arifin, S.Sy.'],
    fotos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'DK-2',
    judul: 'Penyerahan Unit Ambulans Koin NU Peduli Sehat',
    programKerjaId: 'PRG-2',
    tanggal: '2025-10-20',
    deskripsi: 'Simbolisasi serah terima kunci mobil ambulans siaga umat hasil Koin Sehat LAZISNU MWC Bungah ke tim relawan medis Banser Bagana.',
    lokasi: 'Halaman Kantor MWC Bungah',
    pengurusTerlibat: ['KH. Achmad Shofwan, S.Ag', 'H. Mukhlis Al-Hakim, S.E.', 'Drs. H. Choirul Anam'],
    fotos: [
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80'
    ]
  }
];

export const SEED_LOKASI_GIS: LokasiGIS[] = [
  {
    id: 'G-1',
    nama: 'Kantor Pusat MWC NU Bungah',
    tipe: 'Ranting',
    alamat: 'Jl. Raya Bungah No. 15, Bungah (Depan Masjid Jami Bungah)',
    rantingId: 'R-01',
    lat: -7.0630,
    lng: 112.5790,
    pimpinan: 'KH. Achmad Shofwan, S.Ag',
    kontak: '0812-3456-7890',
    keterangan: 'Pusat komando tata usaha administrasi, rapat musyawarah, dan gerai Koin LAZISNU.'
  },
  {
    id: 'G-2',
    nama: 'Masjid Jami Al-Anwar Peganden',
    tipe: 'Masjid',
    alamat: 'Jl. KH. Syafii, Kauman, Peganden, Bungah',
    rantingId: 'R-10',
    lat: -7.0660,
    lng: 112.5740,
    pimpinan: 'KH. Sholeh Qosim, M.Pd.I',
    keterangan: 'Masjid bersejarah pusat kegiatan Turba Pengurus Syuriyah dan kajian Fatwa Fikih.'
  },
  {
    id: 'G-3',
    nama: 'Pondok Pesantren Al-Hidayah Sukorejo',
    tipe: 'Pesantren',
    alamat: 'Jl. Kyai Gede No. 12B, Sukorejo, Bungah',
    rantingId: 'R-05',
    lat: -7.0580,
    lng: 112.5850,
    pimpinan: 'KH. Ma’shum Ahmad',
    kontak: '0813-4567-1122',
    keterangan: 'Pesantren Salafiyah terafiliasi Ma’arif NU dengan santri mukim 350 santri.'
  },
  {
    id: 'G-4',
    nama: 'Madrasah Ibtidaiyah Ma’arif Bedanten',
    tipe: 'Madrasah',
    alamat: 'Jl. Raya Bedanten RT 04 RW 02, Bungah',
    rantingId: 'R-04',
    lat: -7.0710,
    lng: 112.5700,
    pimpinan: 'Drs. H. Maimun, M.Pd',
    keterangan: 'Madrasah basis unggulan berprestasi yang sedang diujicobakan program digitalisasi internet pembelajaran.'
  },
  {
    id: 'G-5',
    nama: 'Mushalla Al-Ikhlas Melirang',
    tipe: 'Mushalla',
    alamat: 'Dusun Melirang Krajan No. 8, Bungah',
    rantingId: 'R-02',
    lat: -7.0605,
    lng: 112.5775,
    pimpinan: 'Ustadz Ahmad Shodiq',
    keterangan: 'Mushalla aktif dengan kegiatan rutin Diba’ dan pembacaan Tahlil Yasin kubro setiap kamis malam.'
  }
];

export const SEED_AGENDAMUSYAWARAH: AgendaMusyawarah[] = [
  {
    id: 'AM-1',
    judul: 'Musyawarah Kerja Cabang (MUSKERKAB) I MWC Bungah',
    tanggal: '2026-05-10',
    waktu: '08:30 - 15:30 WIB',
    status: 'Selesai',
    absensi: [
      { nama: 'KH. Sholeh Qosim, M.Pd.I', jabatan: 'Rais Syuriyah', kehadiran: 'Hadir', waktuHadir: '08:15' },
      { nama: 'KH. Achmad Shofwan, S.Ag', jabatan: 'Ketua Tanfidziyah', kehadiran: 'Hadir', waktuHadir: '08:20' },
      { nama: 'Drs. H. Choirul Anam', jabatan: 'Sekretaris', kehadiran: 'Hadir', waktuHadir: '08:10' },
      { nama: 'H. Mukhlis Al-Hakim, S.E.', jabatan: 'Bendahara', kehadiran: 'Hadir', waktuHadir: '08:25' },
      { nama: 'Zainal Arifin, S.Kom', jabatan: 'Ketua LTN NU', kehadiran: 'Hadir', waktuHadir: '08:30' },
      { nama: 'Samsul Arifin, S.Sy.', jabatan: 'Komandan Banser', kehadiran: 'Hadir', waktuHadir: '08:22' }
    ],
    notulensi: 'Rapat dibuka dengan Tawassul wa Iftitah oleh Rais Syuriyah. Pembahasan utama difokuskan pada penguatan ranting-ranting aktif yang perlu dibina ulang (re-organisasi), serta optimalisasi Koin NU Bungah agar tembus 50 juta sebulan.',
    keputusanHasil: '1. Menginstruksikan seluruh Pengurus Ranting untuk membentuk UPZIS (Unit Pengumpul Zakat Infaq Sedekah).\n2. Membentuk panitia Musyawarah Khusus Re-organisasi Ranting Bedanten.\n3. Graha MWC Center ditargetkan tutup atap konstruksi pada September 2026.',
    voting: {
      id: 'V-1',
      pertanyaan: 'Apakah Lokasi Graha MWC Lantai 2 Layak Disewakan untuk Umum guna Menambah Dana Kas?',
      pilihan: [
        { id: '1', teks: 'Ya, disewakan terbatas (khusus hajatan warga NU / walimah aswaja)', suara: 18 },
        { id: '2', teks: 'Ya, disewakan bebas untuk fungsi profit komersial apa pun', suara: 3 },
        { id: '3', teks: 'Tidak, fungsi murni operasional kantor organisasi', suara: 9 }
      ],
      status: 'Ditutup',
      totalSuara: 30,
      waktuMulai: '2026-05-10 11:30'
    }
  },
  {
    id: 'AM-2',
    judul: 'Rapat Pleno Persiapan Bahtsul Masail Waqi’iyah Ke-6',
    tanggal: '2026-06-05',
    waktu: '19:30 - 22:00 WIB',
    status: 'Belum Mulai',
    absensi: [],
    notulensi: 'Agenda belum dimulai. Pembahasan akan mengupas fatwa halal-haram kecerdasan buatan (Generative AI) dalam menggubah khutbah jumat, dan fatwa kriptografis.',
    keputusanHasil: '',
    voting: {
      id: 'V-2',
      pertanyaan: 'Prioritas Tema Hukum Kontemporer untuk Bahtsul Masail Juni:',
      pilihan: [
        { id: '1', teks: 'Zakat Cryptocurrency & Bitcoin', suara: 0 },
        { id: '2', teks: 'Kecerdasan Buatan (Generative AI) Penulis Khutbah', suara: 0 },
        { id: '3', teks: 'Skema Arisan Haji Syariah Multi-Level', suara: 0 }
      ],
      status: 'Aktif',
      totalSuara: 0,
      waktuMulai: '2026-05-31 11:25'
    }
  }
];

export const SEED_BERITA: BeritaArtikel[] = [
  {
    id: '1',
    judul: 'Luncurkan Layanan Digital, MWCNU Bungah Gelar Sosialisasi Smart Governance',
    ringkasan: 'MWCNU Bungah secara resmi meluncurkan portal administrasi dan transparansi digital guna mempermudah silaturahim ranting serta akses data publik secara akuntabel.',
    konten: '<p><b>Bungah, Gresik</b> — Dalam upaya merealisasikan digitalisasi gerakan organisasi Nahdlatul Ulama, Pengurus Majelis Wakil Cabang Nahdlatul Ulama (MWCNU) Kecamatan Bungah menyelenggarakan rapat kerja dan sosialisasi sistem "Smart Governance" yang bertempat di aula utama Graha MWC NU Bungah.</p><p>Acara ini dihadiri oleh jajaran syuriyah, tanfidziyah, pimpinan ranting se-Kecamatan, serta pimpinan lembaga dan badan otonom (Banom) seperti GP Ansor, Fatayat, Muslimat, IPNU, dan IPPNU.</p><p>KH. Achmad Shofwan, S.Ag, selaku Ketua Tanfidziyah menyatakan, "Layanan digital ini bukan sekadar mengikuti tren, tetapi merupakan kewajiban organisasi dalam menjaga akuntabilitas keuangan jamaah, mempercepat persuratan digital, dan menyajikan manajemen arsip keputusan bahtsul masail yang bisa diakses langsung oleh seluruh nahdliyin."</p><p>Aplikasi ini mengintegrasikan database pengurus, pelacakan realisasi program kerja, grafik keuangan kas Lazisnu, hingga pemetaan GIS masjid dan madrasah binaan di 10 ranting aktif. Melalui program ini, masyarakat luas dapat melihat transparansi laporan pemasukan dan pengeluaran secara real-time demi kredibilitas organisasi.</p>',
    tanggal: '2026-05-25',
    kategori: 'Kegiatan',
    penulis: 'Drs. H. Choirul Anam',
    fotoUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    bacaCount: 145
  },
  {
    id: '2',
    judul: 'Fatwa Bahtsul Masail: Menimbang Aspek Maslahah dan Hukum Kecerdasan Buatan (Generative AI)',
    ringkasan: 'Lembaga Bahtsul Masail (LBM) MWCNU Bungah mendiskusikan batasan fikih seputar penggunaan teks khutbah jumat dan karya tulis keagamaan berbasis kecerdasan buatan.',
    konten: '<p><b>Bungah, Gresik</b> — Kemunculan teknologi kecerdasan buatan (Generative AI) seperti Large Language Models memicu pembahasan serius di kalangan praktisi fikih dan akademisi nahdliyin. Lembaga Bahtsul Masail (LBM) MWCNU Bungah menggelar kajian bahtsul masail waqi’iyah guna merumuskan panduan syariah awal.</p><p>Kajian yang dipimpin langsung oleh jajaran Rais Syuriyah, merumuskan beberapa catatan krusial:</p><ol><li>Hukum asal memanfaatkan AI untuk membantu menyusun kerangka tulisan atau mengumpulkan referensi kitab kuning adalah boleh (mubah) dan dipandang sebagai maslahah kontemporer.</li><li>Namun, dilarang keras menggunakan AI untuk merumuskan fatwa hukum syariah secara mandiri tanpa verifikasi (muthabaqah) oleh ulama yang memiliki otoritas sanad keilmuan yang muktabar, karena AI tidak memiliki kualifikasi ijtihad maupun sensitivitas moral keagamaan.</li><li>Dalam konteks penulisan naskah khutbah, khatib tetap wajib melakukan penelaahan kritis (tabayyun) demi menjaga keabsahan rukun khutbah dan mencegah penyebaran riwayat hadis palsu (maudhu) yang seringkali tergenerasi secara keliru oleh algoritma mesin (halusinasi AI).</li></ol><p>Keputusan resmi dari forum ini akan diterbitkan dalam bentuk berkas PDF di modul Arsip Dokumen Publik di web portal ini agar dapat dipelajari oleh seluruh khatib jumat di wilayah Kecamatan Bungah.</p>',
    tanggal: '2026-05-29',
    kategori: 'Warta Aswaja',
    penulis: 'LBM MWCNU Bungah',
    fotoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    bacaCount: 289
  },
  {
    id: '3',
    judul: 'Gebrakan Sosial LAZISNU: Penyaluran KOIN NU untuk Beasiswa Santri Kurang Mampu',
    ringkasan: 'UPZIS LAZISNU MWCNU Bungah mendistribusikan santunan biaya pendidikan penuh kepada 45 santri dhuafa berkat konsistensi gerakan koin kaleng sedekah warga.',
    konten: '<p><b>Bungah, Gresik</b> — Unit Pengelola Zakat, Infaq, dan Sedekah (UPZIS) LAZISNU MWCNU Bungah kembali menunjukkan peran nyatanya di bidang sosial ekonomi keagamaan. Memanfaatkan himpunan dana KOIN NU (Kotak Infak Nahdlatul Ulama) yang dipungut rutin di perumahan dan kampung, disalurkan beasiswa pendidikan penuh untuk puluhan dhuafa berprestasi.</p><p>Penyaluran beasiswa ini dilangsungkan bertepatan dengan Lailatul Ijtima keliling di Ranting Bedanten. Sebanyak 45 santri jenjang Madrasah Ibtidaiyah dan Tsanawiyah menerima manfaat pembebasan biaya SPP serta perlengkapan sekolah.</p><p>"Ini adalah bukti nyata sirkulasi ekonomi kemandirian nahdliyin. Dari warga, dikelola oleh amil yang amanah, dan kembali seutuhnya untuk mencerdaskan generasi penerus aswaja," ungkap Bendahara UPZIS LAZISNU.</p><p>Laporan keuangan terkait perolehan koin bulanan, daftar penerima manfaat, beserta saldo simpanan upzis secara berkala diunggah transparan pada laman Keuangan web ini sebagai bentuk kejujuran publik.</p>',
    tanggal: '2026-05-20',
    kategori: 'Pengumuman',
    penulis: 'UPZIS LAZISNU',
    fotoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80',
    bacaCount: 94
  }
];
