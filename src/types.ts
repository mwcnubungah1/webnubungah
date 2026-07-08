export type Role = 'guest' | 'super_admin' | 'admin_ranting' | 'admin_lazisnu';

export interface User {
  username: string;
  role: Role;
  rantingId?: string; // If admin_ranting, specifies which ranting they belong to
}

export interface Ranting {
  id: string;
  name: string; // e.g., "PRNU Bungah", "PRNU Sidorejo", etc.
  village: string;
  established: string;
}

export interface Pengurus {
  id: string;
  name: string;
  role: string; // e.g., "Syuriah", "Tanfidziyah", "Ketua", "Sekretaris"
  category: 'MWC' | 'Ranting';
  rantingId?: string;
  phone: string;
  email?: string;
  kaderisasiStatus: string; // e.g., "MKNU", "PD-PKPNU", "Belum"
  education: string; // e.g., "S1", "S2", "SMA", "Pesantren"
  photoUrl?: string;
}

export interface Kader {
  id: string;
  name: string;
  pob: string; // Place of birth
  dob: string; // Date of birth
  gender: 'Laki-laki' | 'Perempuan';
  banom: 'IPNU' | 'IPPNU' | 'Ansor' | 'Fatayat' | 'Muslimat' | 'Banser' | 'Pagar Nusa' | 'Lainnya';
  role: string; // Jabatan di Banom/Organisasi
  rantingId: string;
  phone: string;
  joinYear: number;
  photoUrl?: string;
}

export interface Kegiatan {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string; // e.g., "MWC NU", "LAZISNU", "PRNU Bungah"
  targetGroup: string;
  fundingSource: 'Koin S3' | 'Kas Jamiyah' | 'Donatur' | 'Sponsor';
  budget: number;
  status: 'Rencana' | 'Selesai';
  imageUrl?: string;
  description: string;
}

export interface TransparansiDana {
  id: string;
  date: string;
  type: 'Masuk' | 'Keluar';
  category: 'Iuran Anggota' | 'Donasi Publik' | 'Operasional Kantor' | 'Bantuan Sosial' | 'Program Keagamaan' | 'Lainnya';
  amount: number;
  description: string;
  pic: string; // Person In Charge
  imageUrl?: string;
}

export interface KoinS3 {
  id: string;
  month: string; // e.g., "2026-06", "2026-05"
  rantingId: string;
  amount: number;
  distributionTarget: string; // e.g., "Santunan Anak Yatim", "Bantuan Sembako"
  distributionAmount: number;
  imageUrl?: string;
}

export interface Persuratan {
  id: string;
  letterNumber: string;
  type: 'Masuk' | 'Keluar';
  code: string; // Kode klasifikasi surat
  senderOrRecipient: string;
  date: string;
  subject: string;
  attachmentUrl?: string;
  tembusan?: string;
}

export interface Usaha {
  id: string;
  name: string;
  type: 'Toko' | 'Jasa' | 'Pertanian' | 'Kuliner' | 'Lainnya';
  location: string;
  manager: string; // Penggerak
  status: 'Aktif' | 'Non-aktif';
  revenue: number; // Omzet bulanan
  imageUrl?: string;
}

export interface SaranaIbadah {
  id: string;
  name: string; // e.g., "Masjid Jami' Bungah"
  type: 'Masjid' | 'Musholla';
  takmir: string;
  imam1: string;
  imam2: string;
  nuAffiliation: 'Milik NU' | 'Afiliasi NU' | 'Simpatisan';
  landStatus: 'Wakaf NU' | 'Wakaf Pribadi' | 'Sertifikat Hak Milik';
  address: string;
  rantingId: string;
  imageUrl?: string;
}

export interface SaranaPendidikan {
  id: string;
  name: string;
  level: 'PAUD' | 'TK/RA' | 'MI' | 'MTs' | 'MA' | 'Madin' | 'TPQ' | 'Pesantren';
  status: 'Swasta NU' | 'Negeri' | 'Swasta Non-NU';
  principal: string;
  studentCount: number;
  phone: string;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Butuh Renovasi';
  address: string;
  rantingId: string;
  imageUrl?: string;
}

export interface Berita {
  id: string;
  title: string;
  category: 'Pengumuman' | 'Warta Jamiyah' | 'Dakwah' | 'Opini';
  content: string; // Markdown supported content
  imageUrl?: string;
  date: string;
  author: string;
  driveUrl?: string;
}

export interface Dokumentasi {
  id: string;
  title: string;
  type: 'Foto' | 'Video';
  url: string;
  date: string;
  category: 'Kegiatan' | 'Rapat' | 'Pelantikan' | 'Harlah';
  driveUrl?: string;
}

export interface Aspirasi {
  id: string;
  name: string;
  phone: string;
  email?: string;
  rantingId?: string;
  subject: string;
  message: string;
  date: string;
  status: 'Masuk' | 'Proses' | 'Selesai';
  imageUrl?: string;
}

export type ModelType = 
  | 'kader' 
  | 'kegiatan' 
  | 'keuangan' 
  | 'koin_s3' 
  | 'persuratan' 
  | 'usaha' 
  | 'sarana_ibadah' 
  | 'sarana_pendidikan' 
  | 'berita' 
  | 'dokumentasi' 
  | 'aspirasi'
  | 'pengurus';

