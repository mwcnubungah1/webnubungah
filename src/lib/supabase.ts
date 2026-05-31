import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Exports a lazy or gracefully unguarded client. 
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Bidirectional mappings between standard camelCase properties and database snake_case tables
const mappings: Record<string, Record<string, string>> = {
  surat_masuk: {
    id: 'id',
    nomorSurat: 'nomor_surat',
    tanggal: 'tanggal',
    pengirim: 'pengirim',
    perihal: 'perihal',
    lampiran: 'lampiran',
    statusDisposisi: 'status_disposisi',
    disposisiKepada: 'disposisi_kepada',
    catatanDisposisi: 'catatan_disposisi',
    fileUrl: 'file_url',
  },
  surat_keluar: {
    id: 'id',
    nomorSurat: 'nomor_surat',
    tanggal: 'tanggal',
    penerima: 'penerima',
    perihal: 'perihal',
    lampiran: 'lampiran',
    status: 'status',
    tandaTanganDigital: 'tanda_tangan_digital',
    content: 'content',
    tanggalDibuat: 'tanggal_dibuat',
    dibuatOleh: 'dibuat_oleh',
  },
  arsip_dokumen: {
    id: 'id',
    nama: 'nama',
    kategori: 'kategori',
    tanggal: 'tanggal',
    tags: 'tags',
    versi: 'versi',
    fileSize: 'file_size',
    deskripsi: 'deskripsi',
    fileUrl: 'file_url',
    publicAccess: 'public_access',
  },
  transaksi_keuangan: {
    id: 'id',
    tanggal: 'tanggal',
    tipe: 'tipe',
    kategori: 'kategori',
    deskripsi: 'deskripsi',
    jumlah: 'jumlah',
    buktiUrl: 'bukti_url',
    status: 'status',
    disetujuiOleh: 'disetujui_oleh',
    auditTrail: 'audit_trail',
  },
  anggota_pengurus: {
    id: 'id',
    nomorAnggota: 'nomor_anggota',
    nama: 'nama',
    nik: 'nik',
    tempatLahir: 'tempat_lahir',
    tanggalLahir: 'tanggal_lahir',
    alamat: 'alamat',
    pendidikan: 'pendidikan',
    pekerjaan: 'pekerjaan',
    jabatanOrganisasi: 'jabatan_organisasi',
    struktur: 'struktur',
    rantingId: 'ranting_id',
    riwayatJabatan: 'riwayat_jabatan',
    keahlian: 'keahlian',
    fotoUrl: 'foto_url',
  },
  program_kerja: {
    id: 'id',
    nama: 'nama',
    penanggungJawab: 'penanggung_jawab',
    anggaran: 'anggaran',
    realisasiAnggaran: 'realisasi_anggaran',
    target: 'target',
    timelineMulai: 'timeline_mulai',
    timelineSelesai: 'timeline_selesai',
    status: 'status',
    progress: 'progress',
    kegiatanTerbantu: 'kegiatan_terbantu',
  },
  dokumentasi_kegiatan: {
    id: 'id',
    judul: 'judul',
    programKerjaId: 'program_kerja_id',
    tanggal: 'tanggal',
    deskripsi: 'deskripsi',
    lokasi: 'lokasi',
    pengurusTerlibat: 'pengurus_terlibat',
    videoUrl: 'video_url',
    fotos: 'fotos',
  },
  lokasi_gis: {
    id: 'id',
    nama: 'nama',
    tipe: 'tipe',
    alamat: 'alamat',
    rantingId: 'ranting_id',
    lat: 'lat',
    lng: 'lng',
    pimpinan: 'pimpinan',
    kontak: 'kontak',
    keterangan: 'keterangan',
  },
  agenda_musyawarah: {
    id: 'id',
    judul: 'judul',
    tanggal: 'tanggal',
    waktu: 'waktu',
    status: 'status',
    absensi: 'absensi',
    notulensi: 'notulensi',
    keputusanHasil: 'keputusan_hasil',
    voting: 'voting',
  },
  berita_artikel: {
    id: 'id',
    judul: 'judul',
    ringkasan: 'ringkasan',
    konten: 'konten',
    tanggal: 'tanggal',
    kategori: 'kategori',
    penulis: 'penulis',
    fotoUrl: 'foto_url',
    bacaCount: 'baca_count',
  },
};

// Convert camelCase object models to database snake_case columns with specific white list filtering
export function toSnakeCase(obj: any, table: string): any {
  const mapping = mappings[table];
  if (!mapping) return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const dbKey = mapping[key];
    if (dbKey !== undefined) {
      result[dbKey] = value;
    }
  }
  return result;
}

// Convert database snake_case columns back to clean camelCase application objects
export function fromSnakeCase(dbObj: any, table: string): any {
  const mapping = mappings[table];
  if (!mapping) return dbObj;
  
  // Create reverse mapping (dbKey -> jsKey)
  const reverse: Record<string, string> = {};
  for (const [jsKey, dbKey] of Object.entries(mapping)) {
    reverse[dbKey] = jsKey;
  }

  const result: any = {};
  for (const [key, value] of Object.entries(dbObj)) {
    const jsKey = reverse[key];
    if (jsKey) {
      result[jsKey] = value;
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Global robust database mutation helpers
export async function supabaseUpsert(table: string, item: any) {
  if (!isSupabaseConfigured || !supabase) return null;
  const dbPayload = toSnakeCase(item, table);
  try {
    const { data, error } = await supabase
      .from(table)
      .upsert(dbPayload)
      .select();
    if (error) {
      console.error(`Error saving to table ${table} in Supabase:`, error.message, error.details);
      return null;
    }
    return data && data[0] ? fromSnakeCase(data[0], table) : null;
  } catch (err) {
    console.error(`Unexpected error upserting to ${table}:`, err);
    return null;
  }
}

export async function supabaseDelete(table: string, id: string) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Error deleting from ${table} in Supabase:`, error.message);
    }
  } catch (err) {
    console.error(`Unexpected error deleting from ${table}:`, err);
  }
}

export async function supabaseFetchAll(table: string) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');
    if (error) {
      console.warn(`Query on table "${table}" failed, we will fallback to local storage / seeds:`, error.message);
      return null;
    }
    return data ? data.map(dbObj => fromSnakeCase(dbObj, table)) : [];
  } catch (err) {
    console.warn(`Unexpected error querying table "${table}":`, err);
    return null;
  }
}
