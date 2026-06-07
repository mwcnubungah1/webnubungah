import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RouterProvider, RouteRenderer, useRouter } from './router';
import PublicLayout from './components/PublicLayout';
import { isSupabaseConfigured, supabase, supabaseFetchAll, supabaseUpsert, supabaseDelete } from './lib/supabase';

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
  AgendaMusyawarah,
  BeritaArtikel 
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
  const [role, setRole] = useState<UserRole>(() => {
    const stored = localStorage.getItem('mwc_user_role');
    return (stored as UserRole) || 'PUBLIK_WARGA';
  });

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
  const [beritaList, setBeritaList] = useState<BeritaArtikel[]>([]);

  // Load from Supabase (if configured) or fallback to LocalStorage/Seeds
  useEffect(() => {
    async function loadAllData() {
      const sMasuk = localStorage.getItem('mwc_surat_masuk');
      const sKeluar = localStorage.getItem('mwc_surat_keluar');
      const aDocs = localStorage.getItem('mwc_arsip_docs');
      const txs = localStorage.getItem('mwc_transaksi');
      const members = localStorage.getItem('mwc_anggota');
      const progs = localStorage.getItem('mwc_program_kerja');
      const docus = localStorage.getItem('mwc_dokumentasi');
      const locations = localStorage.getItem('mwc_lokasi_gis');
      const meetings = localStorage.getItem('mwc_agenda_musyawarah');
      const berita = localStorage.getItem('mwc_berita');

      // Initialize with caches or standard seeds
      let sm = sMasuk ? JSON.parse(sMasuk) : SEED_SURAT_MASUK;
      let sk = sKeluar ? JSON.parse(sKeluar) : SEED_SURAT_KELUAR;
      let ad = aDocs ? JSON.parse(aDocs) : SEED_ARSIP_DOKUMEN;
      let tx = txs ? JSON.parse(txs) : SEED_TRANSAKSI_KEUANGAN;
      let members_list = members ? JSON.parse(members) : SEED_ANGGOTA_PENGURUS;
      let pk = progs ? JSON.parse(progs) : SEED_PROGRAM_KERJA;
      let dk = docus ? JSON.parse(docus) : SEED_DOKUMENTASI;
      let lg = locations ? JSON.parse(locations) : SEED_LOKASI_GIS;
      let am = meetings ? JSON.parse(meetings) : SEED_AGENDAMUSYAWARAH;
      let ba = berita ? JSON.parse(berita) : SEED_BERITA;

      if (isSupabaseConfigured && supabase) {
        console.log("Supabase is configured. Syncing tables in background...");
        try {
          // Check if there is an active authenticated session
          let isAuth = false;
          try {
            const { data: { session } } = await supabase.auth.getSession();
            isAuth = !!session;
          } catch (sessionErr) {
            console.warn("Could not check active session:", sessionErr);
          }

          const [dbSM, dbSK, dbAD, dbTX, dbAP, dbPRG, dbDOC, dbLOC, dbAG, dbBRT] = await Promise.all([
            supabaseFetchAll('surat_masuk'),
            supabaseFetchAll('surat_keluar'),
            supabaseFetchAll('arsip_dokumen'),
            supabaseFetchAll('transaksi_keuangan'),
            supabaseFetchAll('anggota_pengurus'),
            supabaseFetchAll('program_kerja'),
            supabaseFetchAll('dokumentasi_kegiatan'),
            supabaseFetchAll('lokasi_gis'),
            supabaseFetchAll('agenda_musyawarah'),
            supabaseFetchAll('berita_artikel')
          ]);

          // Protect letters from being cleared to [] due to public RLS policies
          if (dbSM !== null) {
            if (isAuth || dbSM.length > 0) {
              sm = dbSM;
              saveState('mwc_surat_masuk', dbSM);
            }
          }
          if (dbSK !== null) {
            if (isAuth || dbSK.length > 0) {
              sk = dbSK;
              saveState('mwc_surat_keluar', dbSK);
            }
          }
          if (dbAD !== null) { ad = dbAD; saveState('mwc_arsip_docs', dbAD); }
          if (dbTX !== null) { tx = dbTX; saveState('mwc_transaksi', dbTX); }
          if (dbAP !== null) { members_list = dbAP; saveState('mwc_anggota', dbAP); }
          if (dbPRG !== null) { pk = dbPRG; saveState('mwc_program_kerja', dbPRG); }
          if (dbDOC !== null) { dk = dbDOC; saveState('mwc_dokumentasi', dbDOC); }
          if (dbLOC !== null) { lg = dbLOC; saveState('mwc_lokasi_gis', dbLOC); }
          if (dbAG !== null) { am = dbAG; saveState('mwc_agenda_musyawarah', dbAG); }
          if (dbBRT !== null) { ba = dbBRT; saveState('mwc_berita', dbBRT); }
          
          console.log("Data loaded and synced successfully with Supabase!");
        } catch (err) {
          console.warn("Could not fetch remote table records. Standard fallback assets will load:", err);
        }
      }

      setSuratMasuk(sm);
      setSuratKeluar(sk);
      setArsipDocs(ad);
      setTransaksiList(tx);
      setAnggotaList(members_list);
      setProgramList(pk);
      setDokumentasiList(dk);
      setLokasiList(lg);
      setAgendaList(am);
      setBeritaList(ba);
    }

    loadAllData();
  }, [role]);

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
    supabaseUpsert('surat_masuk', item);
  };

  const handleUpdateSuratMasuk = (id: string, updates: Partial<SuratMasuk>) => {
    const update = suratMasuk.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        supabaseUpsert('surat_masuk', updated);
        return updated;
      }
      return s;
    });
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
    supabaseUpsert('surat_keluar', item);
  };

  const handleUpdateSuratKeluar = (id: string, updates: Partial<SuratKeluar>) => {
    const update = suratKeluar.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        supabaseUpsert('surat_keluar', updated);
        return updated;
      }
      return s;
    });
    setSuratKeluar(update);
    saveState('mwc_surat_keluar', update);
  };

  const handleAddArsip = (newItem: Omit<ArsipDokumen, 'id'>) => {
    const item: ArsipDokumen = { ...newItem, id: `ARS-${Date.now()}` };
    const update = [item, ...arsipDocs];
    setArsipDocs(update);
    saveState('mwc_arsip_docs', update);
    supabaseUpsert('arsip_dokumen', item);
  };

  const handleDeleteArsip = (id: string) => {
    const update = arsipDocs.filter(a => a.id !== id);
    setArsipDocs(update);
    saveState('mwc_arsip_docs', update);
    supabaseDelete('arsip_dokumen', id);
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
    supabaseUpsert('transaksi_keuangan', item);
  };

  const handleUpdateTransaksi = (id: string, updates: Partial<TransaksiKeuangan>) => {
    const update = transaksiList.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        supabaseUpsert('transaksi_keuangan', updated);
        return updated;
      }
      return t;
    });
    setTransaksiList(update);
    saveState('mwc_transaksi', update);
  };

  const handleAddAnggota = (newItem: Omit<AnggotaPengurus, 'id'>) => {
    const item: AnggotaPengurus = { 
      ...newItem, 
      id: `MEMB-${Date.now()}`,
      fotoUrl: newItem.fotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    };
    const update = [item, ...anggotaList];
    setAnggotaList(update);
    saveState('mwc_anggota', update);
    supabaseUpsert('anggota_pengurus', item);
  };

  const handleUpdateAnggota = (id: string, updates: Partial<AnggotaPengurus>) => {
    const update = anggotaList.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        supabaseUpsert('anggota_pengurus', updated);
        return updated;
      }
      return a;
    });
    setAnggotaList(update);
    saveState('mwc_anggota', update);
  };

  const handleDeleteAnggota = (id: string) => {
    const update = anggotaList.filter(a => a.id !== id);
    setAnggotaList(update);
    saveState('mwc_anggota', update);
    supabaseDelete('anggota_pengurus', id);
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
    supabaseUpsert('program_kerja', item);
  };

  const handleUpdateProgram = (id: string, updates: Partial<ProgramKerja>) => {
    const update = programList.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        supabaseUpsert('program_kerja', updated);
        return updated;
      }
      return p;
    });
    setProgramList(update);
    saveState('mwc_program_kerja', update);
  };

  const handleAddDokumentasi = (newItem: Omit<DokumentasiKegiatan, 'id'>) => {
    const item: DokumentasiKegiatan = { ...newItem, id: `DOK-${Date.now()}` };
    const update = [item, ...dokumentasiList];
    setDokumentasiList(update);
    saveState('mwc_dokumentasi', update);
    supabaseUpsert('dokumentasi_kegiatan', item);
  };

  const handleAddLocation = (newItem: Omit<LokasiGIS, 'id'>) => {
    const item: LokasiGIS = { ...newItem, id: `LOC-${Date.now()}` };
    const update = [item, ...lokasiList];
    setLokasiList(update);
    saveState('mwc_lokasi_gis', update);
    supabaseUpsert('lokasi_gis', item);
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
    supabaseUpsert('agenda_musyawarah', item);
  };

  const handleUpdateAgenda = (id: string, updates: Partial<AgendaMusyawarah>) => {
    const update = agendaList.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        supabaseUpsert('agenda_musyawarah', updated);
        return updated;
      }
      return a;
    });
    setAgendaList(update);
    saveState('mwc_agenda_musyawarah', update);
  };

  const handleAddBerita = (newItem: Omit<BeritaArtikel, 'id' | 'bacaCount'>) => {
    const item: BeritaArtikel = {
      ...newItem,
      id: `BRT-${Date.now()}`,
      bacaCount: 0
    };
    const update = [item, ...beritaList];
    setBeritaList(update);
    saveState('mwc_berita', update);
    supabaseUpsert('berita_artikel', item);
  };

  const handleDeleteBerita = (id: string) => {
    const update = beritaList.filter(b => b.id !== id);
    setBeritaList(update);
    saveState('mwc_berita', update);
    supabaseDelete('berita_artikel', id);
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
    beritaList,

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
    onUpdateAgenda: handleUpdateAgenda,
    onAddBerita: handleAddBerita,
    onDeleteBerita: handleDeleteBerita
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
