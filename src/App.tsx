import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RouterProvider, RouteRenderer, useRouter } from './router';
import PublicLayout from './components/PublicLayout';

// Types and Seed Data
import { 
  UserRole, 
  SuratMasuk, 
  SuratKeluar, 
  ArsipDokumen, 
  TransaksiKeuangan, 
  AnggotaPengurus, 
  ProgramKerja, 
  DokumentasiKegiatan, 
  LokasiGIS, 
  AgendaMusyawarah 
} from './types';
import { 
  SEED_SURAT_MASUK, 
  SEED_SURAT_KELUAR, 
  SEED_ARSIP_DOKUMEN, 
  SEED_TRANSAKSI_KEUANGAN, 
  SEED_ANGGOTA_PENGURUS, 
  SEED_PROGRAM_KERJA, 
  SEED_DOKUMENTASI, 
  SEED_LOKASI_GIS, 
  SEED_AGENDAMUSYAWARAH,
  SEED_BERITA
} from './data/seedData';

function AppContent() {
  const { pathname, navigate } = useRouter();
  const [role, setRole] = useState<UserRole>('ADMIN_MWCNU');

  // Unified persistent State arrays
  const [suratMasuk, setSuratMasuk] = useState<SuratMasuk[]>([]);
  const [suratKeluar, setSuratKeluar] = useState<SuratKeluar[]>([]);
  const [arsipDocs, setArsipDocs] = useState<ArsipDokumen[]>([]);
  const [transaksiList, setTransaksiList] = useState<TransaksiKeuangan[]>([]);
  const [anggotaList, setAnggotaList] = useState<AnggotaPengurus[]>([]);
  const [programList, setProgramList] = useState<ProgramKerja[]>([]);
  const [dokumentasiList, setDokumentasiList] = useState<DokumentasiKegiatan[]>([]);
  const [lokasiList, setLokasiList] = useState<LokasiGIS[]>([]);
  const [agendaList, setAgendaList] = useState<AgendaMusyawarah[]>([]);

  // Load from LocalStorage or seed if empty
  useEffect(() => {
    const sMasuk = localStorage.getItem('mwc_surat_masuk');
    const sKeluar = localStorage.getItem('mwc_surat_keluar');
    const aDocs = localStorage.getItem('mwc_arsip_docs');
    const txs = localStorage.getItem('mwc_transaksi');
    const members = localStorage.getItem('mwc_anggota');
    const progs = localStorage.getItem('mwc_program_kerja');
    const docus = localStorage.getItem('mwc_dokumentasi');
    const locations = localStorage.getItem('mwc_lokasi_gis');
    const meetings = localStorage.getItem('mwc_agenda_musyawarah');
    const storedRole = localStorage.getItem('mwc_user_role');

    setSuratMasuk(sMasuk ? JSON.parse(sMasuk) : SEED_SURAT_MASUK);
    setSuratKeluar(sKeluar ? JSON.parse(sKeluar) : SEED_SURAT_KELUAR);
    setArsipDocs(aDocs ? JSON.parse(aDocs) : SEED_ARSIP_DOKUMEN);
    setTransaksiList(txs ? JSON.parse(txs) : SEED_TRANSAKSI_KEUANGAN);
    setAnggotaList(members ? JSON.parse(members) : SEED_ANGGOTA_PENGURUS);
    setProgramList(progs ? JSON.parse(progs) : SEED_PROGRAM_KERJA);
    setDokumentasiList(docus ? JSON.parse(docus) : SEED_DOKUMENTASI);
    setLokasiList(locations ? JSON.parse(locations) : SEED_LOKASI_GIS);
    setAgendaList(meetings ? JSON.parse(meetings) : SEED_AGENDAMUSYAWARAH);
    
    if (storedRole) {
      setRole(storedRole as UserRole);
    } else {
      // Default as public so they see the public-facing landing page first
      setRole('PUBLIK_WARGA');
    }
  }, []);

  // Save to LocalStorage helpers upon trigger changes
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('mwc_user_role', newRole);
  };

  // State Change Operations wrapped cleanly
  const handleAddSuratMasuk = (newItem: Omit<SuratMasuk, 'id'>) => {
    const item: SuratMasuk = { ...newItem, id: `SM-INDX-${suratMasuk.length + 1}` };
    const update = [item, ...suratMasuk];
    setSuratMasuk(update);
    saveState('mwc_surat_masuk', update);
  };

  const handleUpdateSuratMasuk = (id: string, updates: Partial<SuratMasuk>) => {
    const update = suratMasuk.map(s => s.id === id ? { ...s, ...updates } : s);
    setSuratMasuk(update);
    saveState('mwc_surat_masuk', update);
  };

  const handleAddSuratKeluar = (newItem: Omit<SuratKeluar, 'id' | 'tanggalDibuat'>) => {
    const item: SuratKeluar = { 
      ...newItem, 
      id: `SK-INDX-${suratKeluar.length + 1}`,
      tanggalDibuat: new Date().toISOString().split('T')[0]
    };
    const update = [item, ...suratKeluar];
    setSuratKeluar(update);
    saveState('mwc_surat_keluar', update);
  };

  const handleUpdateSuratKeluar = (id: string, updates: Partial<SuratKeluar>) => {
    const update = suratKeluar.map(s => s.id === id ? { ...s, ...updates } : s);
    setSuratKeluar(update);
    saveState('mwc_surat_keluar', update);
  };

  const handleAddArsip = (newItem: Omit<ArsipDokumen, 'id'>) => {
    const item: ArsipDokumen = { ...newItem, id: `ARS-${Date.now()}` };
    const update = [item, ...arsipDocs];
    setArsipDocs(update);
    saveState('mwc_arsip_docs', update);
  };

  const handleDeleteArsip = (id: string) => {
    const update = arsipDocs.filter(a => a.id !== id);
    setArsipDocs(update);
    saveState('mwc_arsip_docs', update);
  };

  const handleAddTransaksi = (newItem: Omit<TransaksiKeuangan, 'id' | 'auditTrail'>) => {
    const item: TransaksiKeuangan = { 
      ...newItem, 
      id: `TX-${transaksiList.length + 10}`,
      auditTrail: [`Rincian baru dicatat pada ${new Date().toISOString().split('T')[0]}`]
    };
    const update = [item, ...transaksiList];
    setTransaksiList(update);
    saveState('mwc_transaksi', update);
  };

  const handleUpdateTransaksi = (id: string, updates: Partial<TransaksiKeuangan>) => {
    const update = transaksiList.map(t => t.id === id ? { ...t, ...updates } : t);
    setTransaksiList(update);
    saveState('mwc_transaksi', update);
  };

  const handleAddAnggota = (newItem: Omit<AnggotaPengurus, 'id' | 'fotoUrl'>) => {
    const item: AnggotaPengurus = { 
      ...newItem, 
      id: `MEMB-${Date.now()}`,
      fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
    const update = [item, ...anggotaList];
    setAnggotaList(update);
    saveState('mwc_anggota', update);
  };

  const handleUpdateAnggota = (id: string, updates: Partial<AnggotaPengurus>) => {
    const update = anggotaList.map(a => a.id === id ? { ...a, ...updates } : a);
    setAnggotaList(update);
    saveState('mwc_anggota', update);
  };

  const handleDeleteAnggota = (id: string) => {
    const update = anggotaList.filter(a => a.id !== id);
    setAnggotaList(update);
    saveState('mwc_anggota', update);
  };

  const handleAddProgram = (newItem: Omit<ProgramKerja, 'id' | 'realisasiAnggaran' | 'kegiatanTerbantu'>) => {
    const item: ProgramKerja = { 
      ...newItem, 
      id: `PRG-INDX-${programList.length + 1}`,
      realisasiAnggaran: 0,
      kegiatanTerbantu: []
    };
    const update = [item, ...programList];
    setProgramList(update);
    saveState('mwc_program_kerja', update);
  };

  const handleUpdateProgram = (id: string, updates: Partial<ProgramKerja>) => {
    const update = programList.map(p => p.id === id ? { ...p, ...updates } : p);
    setProgramList(update);
    saveState('mwc_program_kerja', update);
  };

  const handleAddDokumentasi = (newItem: Omit<DokumentasiKegiatan, 'id'>) => {
    const item: DokumentasiKegiatan = { ...newItem, id: `DOK-${Date.now()}` };
    const update = [item, ...dokumentasiList];
    setDokumentasiList(update);
    saveState('mwc_dokumentasi', update);
  };

  const handleAddLocation = (newItem: Omit<LokasiGIS, 'id'>) => {
    const item: LokasiGIS = { ...newItem, id: `LOC-${Date.now()}` };
    const update = [item, ...lokasiList];
    setLokasiList(update);
    saveState('mwc_lokasi_gis', update);
  };

  const handleAddAgenda = (newItem: Omit<AgendaMusyawarah, 'id' | 'absensi'>) => {
    const item: AgendaMusyawarah = { 
      ...newItem, 
      id: `AG-${agendaList.length + 1}`,
      absensi: [
        { nama: 'KH. Sholeh Qosim, M.Pd.I', jabatan: 'Rais Syuriyah', kehadiran: 'Izin' },
        { nama: 'H. Achmad Shofwan, S.Ag', jabatan: 'Ketua Tanfidziyah', kehadiran: 'Izin' },
        { nama: 'Drs. H. Choirul Anam', jabatan: 'Sekretaris', kehadiran: 'Izin' },
        { nama: 'H. Mukhlis Al-Hakim, S.E.', jabatan: 'Bendahara', kehadiran: 'Izin' }
      ]
    };
    const update = [item, ...agendaList];
    setAgendaList(update);
    saveState('mwc_agenda_musyawarah', update);
  };

  const handleUpdateAgenda = (id: string, updates: Partial<AgendaMusyawarah>) => {
    const update = agendaList.map(a => a.id === id ? { ...a, ...updates } : a);
    setAgendaList(update);
    saveState('mwc_agenda_musyawarah', update);
  };

  const handleLogout = () => {
    handleSetRole('PUBLIK_WARGA');
    navigate('/');
  };

  // Compile unified properties to deliver down to page components automatically
  const compiledProps = {
    userRole: role,
    onLogin: handleSetRole,
    onLogout: handleLogout,

    // Collections
    suratMasuk,
    suratKeluar,
    arsipDocs,
    transaksiList,
    anggotaList,
    programList,
    dokumentasiList,
    lokasiList,
    agendaList,
    beritaList: SEED_BERITA,

    // Mutation Event Callbacks
    onAddSuratMasuk: handleAddSuratMasuk,
    onUpdateSuratMasuk: handleUpdateSuratMasuk,
    onAddSuratKeluar: handleAddSuratKeluar,
    onUpdateSuratKeluar: handleUpdateSuratKeluar,
    onAddArsip: handleAddArsip,
    onDeleteArsip: handleDeleteArsip,
    onAddTransaksi: handleAddTransaksi,
    onUpdateTransaksi: handleUpdateTransaksi,
    onAddAnggota: handleAddAnggota,
    onUpdateAnggota: handleUpdateAnggota,
    onDeleteAnggota: handleDeleteAnggota,
    onAddProgram: handleAddProgram,
    onUpdateProgram: handleUpdateProgram,
    onAddDokumentasi: handleAddDokumentasi,
    onAddLokasi: handleAddLocation,
    onAddAgenda: handleAddAgenda,
    onUpdateAgenda: handleUpdateAgenda
  };

  const isPlainPage = pathname === '/login' || pathname.startsWith('/admin');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="min-h-screen text-slate-900 bg-slate-50/50 flex flex-col font-sans"
      >
        {isPlainPage ? (
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
            <RouteRenderer pageProps={compiledProps} />
          </div>
        ) : (
          <PublicLayout userRole={role} onLogout={handleLogout}>
            <RouteRenderer pageProps={compiledProps} />
          </PublicLayout>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
