import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  User, 
  Key, 
  AlertCircle, 
  CheckCircle, 
  Menu, 
  LogOut, 
  UserCheck, 
  ShieldAlert, 
  Eye,
  Info
} from 'lucide-react';

import { 
  Role, 
  Ranting, 
  Kader, 
  Kegiatan, 
  TransparansiDana, 
  KoinS3, 
  Persuratan, 
  Usaha, 
  SaranaIbadah, 
  SaranaPendidikan, 
  Berita, 
  Dokumentasi, 
  Aspirasi,
  ModelType,
  Pengurus
} from './types';

import { 
  mockRantings, 
  mockPengurus, 
  mockKader, 
  mockKegiatan, 
  mockTransparansiDana, 
  mockKoinS3, 
  mockPersuratan, 
  mockUsaha, 
  mockSaranaIbadah, 
  mockSaranaPendidikan, 
  mockBerita, 
  mockDokumentasi, 
  mockAspirasi 
} from './data/mockData';

import { isSupabaseConfigured, fetchTableData, insertTableData, supabase } from './lib/supabaseClient';

// Modular layouts
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PortalPages from './components/PortalPages';
import AdminCMS from './components/AdminCMS';
import TechnicalSpecs from './components/TechnicalSpecs';
import LoginView from './components/LoginView';

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<ModelType>('kader');

  // Authentication states
  const [userRole, setUserRole] = useState<Role>('guest');
  const [selectedRantingId, setSelectedRantingId] = useState<string>('mwc');

  // Database collections with LocalStorage/Supabase persistence
  const [rantings, setRantings] = useState<Ranting[]>([]);
  const [kaderList, setKaderList] = useState<Kader[]>([]);
  const [pengurusList, setPengurusList] = useState<Pengurus[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [kasList, setKasList] = useState<TransparansiDana[]>([]);
  const [koinList, setKoinList] = useState<KoinS3[]>([]);
  const [suratList, setSuratList] = useState<Persuratan[]>([]);
  const [usahaList, setUsahaList] = useState<Usaha[]>([]);
  const [saranaIbadahList, setSaranaIbadahList] = useState<SaranaIbadah[]>([]);
  const [saranaPendidikanList, setSaranaPendidikanList] = useState<SaranaPendidikan[]>([]);
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [dokumentasiList, setDokumentasiList] = useState<Dokumentasi[]>([]);
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);

  // Prevent data from being re-initialized on every userRole change (critical fix for data reverting)
  const dataInitializedRef = useRef(false);

  // Listen to Supabase Auth state changes to keep userRole in sync
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          const email = session.user.email;
          let role: Role = 'guest';
          if (email === 'maghfurmunif@gmail.com') {
            role = 'super_admin';
          } else if (email === 'ahmadazkia@gmail.com') {
            role = 'admin_lazisnu';
          } else if (session.user.user_metadata?.role) {
            role = session.user.user_metadata.role;
          }
          setUserRole(role);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          const email = session.user.email;
          let role: Role = 'guest';
          if (email === 'maghfurmunif@gmail.com') {
            role = 'super_admin';
          } else if (email === 'ahmadazkia@gmail.com') {
            role = 'admin_lazisnu';
          } else if (session.user.user_metadata?.role) {
            role = session.user.user_metadata.role;
          }
          setUserRole(role);
        } else {
          setUserRole('guest');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Initialize DB from Supabase or LocalStorage/mockData — runs ONCE on mount only.
  // Previously this depended on [userRole], which caused all data to be overwritten on every login.
  useEffect(() => {
    if (dataInitializedRef.current) return;
    dataInitializedRef.current = true;

    async function initData() {
      if (isSupabaseConfigured && supabase) {
        try {
          const [
            kader,
            kegiatan,
            kas,
            koin,
            surat,
            usaha,
            saranaIbadah,
            saranaPendidikan,
            berita,
            dokumentasi,
            aspirasi,
            pengurus
          ] = await Promise.all([
            fetchTableData('kader').catch(() => []),
            fetchTableData('kegiatan').catch(() => []),
            fetchTableData('keuangan').catch(() => []),
            fetchTableData('koin_s3').catch(() => []),
            fetchTableData('persuratan').catch(() => []),
            fetchTableData('usaha').catch(() => []),
            fetchTableData('sarana_ibadah').catch(() => []),
            fetchTableData('sarana_pendidikan').catch(() => []),
            fetchTableData('berita').catch(() => []),
            fetchTableData('dokumentasi').catch(() => []),
            fetchTableData('aspirasi').catch(() => []),
            fetchTableData('pengurus').catch(() => [])
          ]);

          // Trust Supabase data — even if a table is empty, that's valid.
          // Do NOT fall back to localStorage/mocked data when Supabase is configured,
          // as that causes local changes to reappear and overwrite Supabase state.
          setKaderList(kader);
          setPengurusList(pengurus);
          setKegiatanList(kegiatan);
          setKasList(kas);
          setKoinList(koin);
          setSuratList(surat);
          setUsahaList(usaha);
          setSaranaIbadahList(saranaIbadah);
          setSaranaPendidikanList(saranaPendidikan);
          setBeritaList(berita);
          setDokumentasiList(dokumentasi);
          setAspirasiList(aspirasi);
          setRantings(getStoredRantings());
          return;
        } catch (error) {
          console.error("Failed to load from Supabase, falling back to local storage", error);
        }
      }

      // Fallback: local storage (only when Supabase is NOT configured)
      const loadOrInit = <T,>(key: string, defaultData: T[]): T[] => {
        const stored = localStorage.getItem(`mwc_nu_${key}`);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error(`Error parsing ${key}`, e);
          }
        }
        localStorage.setItem(`mwc_nu_${key}`, JSON.stringify(defaultData));
        return defaultData;
      };

      setKaderList(loadOrInit('kader', mockKader));
      setPengurusList(loadOrInit('pengurus', mockPengurus));
      setKegiatanList(loadOrInit('kegiatan', mockKegiatan));
      setKasList(loadOrInit('kas', mockTransparansiDana));
      setKoinList(loadOrInit('koin_s3', mockKoinS3));
      setSuratList(loadOrInit('persuratan', mockPersuratan));
      setUsahaList(loadOrInit('usaha', mockUsaha));
      setSaranaIbadahList(loadOrInit('sarana_ibadah', mockSaranaIbadah));
      setSaranaPendidikanList(loadOrInit('sarana_pendidikan', mockSaranaPendidikan));
      setBeritaList(loadOrInit('berita', mockBerita));
      setDokumentasiList(loadOrInit('dokumentasi', mockDokumentasi));
      setAspirasiList(loadOrInit('aspirasi', mockAspirasi));
      setRantings(loadOrInit('rantings', mockRantings));
    }

    function getStoredRantings(): Ranting[] {
      const stored = localStorage.getItem('mwc_nu_rantings');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
      return mockRantings;
    }

    initData();
  }, []);

  // Sync state back to LocalStorage on changes (only when not using Supabase to save storage space/avoid race conditions, or as redundancy)
  useEffect(() => {
    if (kaderList.length > 0) localStorage.setItem('mwc_nu_kader', JSON.stringify(kaderList));
  }, [kaderList]);
  useEffect(() => {
    if (pengurusList.length > 0) localStorage.setItem('mwc_nu_pengurus', JSON.stringify(pengurusList));
  }, [pengurusList]);
  useEffect(() => {
    if (kegiatanList.length > 0) localStorage.setItem('mwc_nu_kegiatan', JSON.stringify(kegiatanList));
  }, [kegiatanList]);
  useEffect(() => {
    if (kasList.length > 0) localStorage.setItem('mwc_nu_kas', JSON.stringify(kasList));
  }, [kasList]);
  useEffect(() => {
    if (koinList.length > 0) localStorage.setItem('mwc_nu_koin_s3', JSON.stringify(koinList));
  }, [koinList]);
  useEffect(() => {
    if (suratList.length > 0) localStorage.setItem('mwc_nu_persuratan', JSON.stringify(suratList));
  }, [suratList]);
  useEffect(() => {
    if (usahaList.length > 0) localStorage.setItem('mwc_nu_usaha', JSON.stringify(usahaList));
  }, [usahaList]);
  useEffect(() => {
    if (saranaIbadahList.length > 0) localStorage.setItem('mwc_nu_sarana_ibadah', JSON.stringify(saranaIbadahList));
  }, [saranaIbadahList]);
  useEffect(() => {
    if (saranaPendidikanList.length > 0) localStorage.setItem('mwc_nu_sarana_pendidikan', JSON.stringify(saranaPendidikanList));
  }, [saranaPendidikanList]);
  useEffect(() => {
    if (beritaList.length > 0) localStorage.setItem('mwc_nu_berita', JSON.stringify(beritaList));
  }, [beritaList]);
  useEffect(() => {
    if (dokumentasiList.length > 0) localStorage.setItem('mwc_nu_dokumentasi', JSON.stringify(dokumentasiList));
  }, [dokumentasiList]);
  useEffect(() => {
    if (aspirasiList.length > 0) localStorage.setItem('mwc_nu_aspirasi', JSON.stringify(aspirasiList));
  }, [aspirasiList]);
  useEffect(() => {
    if (rantings.length > 0) localStorage.setItem('mwc_nu_rantings', JSON.stringify(rantings));
  }, [rantings]);

  // Handler: Add Public Aspiration
  const handleAddAspirasi = async (newAspirasi: Omit<Aspirasi, 'id' | 'date' | 'status'>) => {
    const fullAspirasi: Aspirasi = {
      ...newAspirasi,
      id: `as-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Masuk'
    };

    let savedAspirasi = fullAspirasi;
    if (isSupabaseConfigured) {
      try {
        savedAspirasi = await insertTableData('aspirasi', fullAspirasi);
      } catch (e) {
        console.error("Failed to insert aspirasi into Supabase", e);
      }
    }

    const updated = [savedAspirasi, ...aspirasiList];
    setAspirasiList(updated);
    localStorage.setItem('mwc_nu_aspirasi', JSON.stringify(updated));
  };

  // Handler: Simulate Logout
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }
    }
    setUserRole('guest');
    setSelectedRantingId('mwc');
    setActiveTab('home');
    setSuratList([]); // Clear private document list on logout
  };

  // Path-based client-side routing synchronization
  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path) {
        if (path === 'admin' && userRole === 'guest') {
          setActiveTab('login');
        } else {
          setActiveTab(path);
        }
      } else {
        setActiveTab('home');
      }
    };

    // Run on initial load
    handlePathChange();

    // Listen to history popstate (back/forward navigation)
    window.addEventListener('popstate', handlePathChange);
    return () => {
      window.removeEventListener('popstate', handlePathChange);
    };
  }, [userRole]);

  // Sync activeTab state changes to the URL path
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\//, '') || 'home';
    if (currentPath !== activeTab) {
      const targetPath = activeTab === 'home' ? '/' : `/${activeTab}`;
      window.history.pushState(null, '', targetPath);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole={userRole}
        onLogout={handleLogout}
        activeModel={activeModel}
        setActiveModel={setActiveModel}
      />

      {/* Main app contents area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72">
        <Header 
          activeTab={activeTab} 
          setSidebarOpen={setSidebarOpen} 
          userRole={userRole}
          setUserRole={setUserRole}
          selectedRantingId={selectedRantingId}
          setSelectedRantingId={setSelectedRantingId}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Page router */}
        <main id="main-content-view" className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          {activeTab === 'login' && (
            <LoginView 
              setUserRole={setUserRole} 
              setSelectedRantingId={setSelectedRantingId} 
              setActiveTab={setActiveTab} 
            />
          )}
          
          {activeTab === 'admin' && (
            userRole !== 'guest' ? (
              <AdminCMS 
                userRole={userRole}
                rantings={rantings}
                kaderList={kaderList}
                setKaderList={setKaderList}
                kegiatanList={kegiatanList}
                setKegiatanList={setKegiatanList}
                kasList={kasList}
                setKasList={setKasList}
                koinList={koinList}
                setKoinList={setKoinList}
                suratList={suratList}
                setSuratList={setSuratList}
                usahaList={usahaList}
                setUsahaList={setUsahaList}
                saranaIbadahList={saranaIbadahList}
                setSaranaIbadahList={setSaranaIbadahList}
                saranaPendidikanList={saranaPendidikanList}
                setSaranaPendidikanList={setSaranaPendidikanList}
                beritaList={beritaList}
                setBeritaList={setBeritaList}
                dokumentasiList={dokumentasiList}
                setDokumentasiList={setDokumentasiList}
                aspirasiList={aspirasiList}
                setAspirasiList={setAspirasiList}
                pengurusList={pengurusList}
                setPengurusList={setPengurusList}
                activeModel={activeModel}
                setActiveModel={setActiveModel}
              />
            ) : (
              <LoginView 
                setUserRole={setUserRole} 
                setSelectedRantingId={setSelectedRantingId} 
                setActiveTab={setActiveTab} 
              />
            )
          )}

          {activeTab === 'specs' && <TechnicalSpecs />}

          {/* Render regular public pages */}
          {activeTab !== 'login' && activeTab !== 'admin' && activeTab !== 'specs' && (
            <PortalPages 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              rantings={rantings}
              setRantings={setRantings}
              userRole={userRole}
              pengurusList={pengurusList}
              kaderList={kaderList}
              setKaderList={setKaderList}
              kegiatanList={kegiatanList}
              kasList={kasList}
              koinList={koinList}
              suratList={suratList}
              setSuratList={setSuratList}
              usahaList={usahaList}
              saranaIbadahList={saranaIbadahList}
              setSaranaIbadahList={setSaranaIbadahList}
              saranaPendidikanList={saranaPendidikanList}
              setSaranaPendidikanList={setSaranaPendidikanList}
              beritaList={beritaList}
              dokumentasiList={dokumentasiList}
              setDokumentasiList={setDokumentasiList}
              aspirasiList={aspirasiList}
              addAspirasi={handleAddAspirasi}
            />
          )}
        </main>
      </div>
    </div>
  );
}
