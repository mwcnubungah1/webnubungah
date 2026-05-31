/**
 * Types definition for MWCNU Smart Governance
 */

export type UserRole = 'ADMIN_MWCNU' | 'SEKRETARIS' | 'KETUA' | 'PUBLIK_WARGA';

export interface SuratMasuk {
  id: string;
  nomorSurat: string;
  tanggal: string;
  pengirim: string;
  perihal: string;
  lampiran: string;
  statusDisposisi: 'Belum Disposisi' | 'Sudah Disposisi';
  disposisiKepada?: string;
  catatanDisposisi?: string;
  fileUrl?: string;
}

export interface SuratKeluar {
  id: string;
  nomorSurat: string; // e.g. 054/MWC-NU/A.I/V/2026
  tanggal: string;
  penerima: string;
  perihal: string;
  lampiran: string;
  status: 'Draft' | 'Diverifikasi Sekretaris' | 'Disetujui Ketua' | 'Diarsipkan';
  tandaTanganDigital?: string; // name / role signing
  content: string;
  tanggalDibuat: string;
  dibuatOleh: string;
  fileUrl?: string;
}

export interface ArsipDokumen {
  id: string;
  nama: string;
  kategori: 'SK' | 'AD/ART' | 'SOP' | 'Proposal' | 'LPJ' | 'Notulen' | 'Surat' | 'Lainnya';
  tanggal: string;
  tags: string[];
  versi: string;
  fileSize: string;
  deskripsi: string;
  fileUrl: string;
  publicAccess: boolean;
}

export interface TransaksiKeuangan {
  id: string;
  tanggal: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  kategori: 'Iuran' | 'Donasi' | 'Hibah' | 'Usaha' | 'Operasional' | 'Kegiatan' | 'Sosial' | 'Pendidikan';
  deskripsi: string;
  jumlah: number;
  buktiUrl?: string;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  disetujuiOleh?: string;
  auditTrail: string[]; // Logs of changes
}

export interface AnggotaPengurus {
  id: string;
  nomorAnggota: string; // NU-ID card format e.g. 35.15.02.XXXXX
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  pendidikan: string;
  pekerjaan: string;
  jabatanOrganisasi: string;
  struktur: 'Pengurus Harian' | 'Lembaga' | 'Banom' | 'Ranting';
  rantingId: string; // linked branch
  riwayatJabatan: string[];
  keahlian: string[];
  fotoUrl: string;
}

export interface ProgramKerja {
  id: string;
  nama: string;
  penanggungJawab: string; // Lembaga/Banom or Person
  anggaran: number;
  realisasiAnggaran: number;
  target: string;
  timelineMulai: string;
  timelineSelesai: string;
  status: 'Perencanaan' | 'Berjalan' | 'Selesai' | 'Tertunda';
  progress: number; // 0 to 100
  kegiatanTerbantu: string[]; // linked activity descriptions
  fileUrl?: string;
}

export interface DokumentasiKegiatan {
  id: string;
  judul: string;
  programKerjaId?: string; // linked program
  tanggal: string;
  deskripsi: string;
  lokasi: string;
  pengurusTerlibat: string[];
  videoUrl?: string;
  fotos: string[];
}

export interface LokasiGIS {
  id: string;
  nama: string;
  tipe: 'Ranting' | 'Masjid' | 'Mushalla' | 'Madrasah' | 'Pesantren';
  alamat: string;
  rantingId: string;
  lat: number;
  lng: number;
  pimpinan?: string;
  kontak?: string;
  keterangan?: string;
}

export interface VotingMusyawarah {
  id: string;
  pertanyaan: string;
  pilihan: {
    id: string;
    teks: string;
    suara: number;
  }[];
  status: 'Aktif' | 'Ditutup';
  totalSuara: number;
  waktuMulai: string;
  waktuSelesai?: string;
}

export interface AgendaMusyawarah {
  id: string;
  judul: string;
  tanggal: string;
  waktu: string;
  status: 'Belum Mulai' | 'Berlangsung' | 'Selesai';
  absensi: {
    nama: string;
    jabatan: string;
    kehadiran: 'Hadir' | 'Izin' | 'Sakit';
    waktuHadir?: string;
  }[];
  notulensi: string;
  keputusanHasil: string;
  voting?: VotingMusyawarah;
  fileUrl?: string;
}

export interface BeritaArtikel {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string;
  tanggal: string;
  kategori: 'Kegiatan' | 'Opini' | 'Pengumuman' | 'Warta Aswaja';
  penulis: string;
  fotoUrl: string;
  bacaCount: number;
}

