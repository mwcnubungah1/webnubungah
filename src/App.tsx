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
  mockAspirasi,
  rantingNameToSlug,
  slugToRantingId
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
  // Sub-path for nested routes like /profil/mwc/banom/gp-ansor
  const [profileSubPath, setProfileSubPath] = useState<string>('');

  // Authentication states
  const [userRole, setUserRole] = useState<Role>('guest');
  const [selectedRantingId, setSelectedRantingId] = useState<string>('mwc');

  // Database collections — all sourced from Supabase
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

  // Loading state: true while initial data is being fetched from Supabase
  const [isLoading, setIsLoading] = useState(true);

  // Track whether initial fetch has completed to avoid double-fetch
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

  // Fetch ALL data from Supabase — runs ONCE on mount.
  // No localStorage fallback; Supabase is the single source of truth.
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
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
          pengurus,
          rantingData
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
          fetchTableData('pengurus').catch(() => []),
          fetchTableData('ranting').catch(() => [])
        ]);

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
        // If ranting table has data, use it; otherwise fallback to mock data
        setRantings(rantingData.length > 0 ? rantingData : mockRantings);
      } else {
        // Supabase not configured — use mock data as static fallback (read-only mode)
        setKaderList(mockKader);
        setPengurusList(mockPengurus);
        setKegiatanList(mockKegiatan);
        setKasList(mockTransparansiDana);
        setKoinList(mockKoinS3);
        setSuratList(mockPersuratan);
        setUsahaList(mockUsaha);
        setSaranaIbadahList(mockSaranaIbadah);
        setSaranaPendidikanList(mockSaranaPendidikan);
        setBeritaList(mockBerita);
        setDokumentasiList(mockDokumentasi);
        setAspirasiList(mockAspirasi);
        setRantings(mockRantings);
      }
    } catch (error) {
      console.error("Failed to fetch data from Supabase:", error);
      // On error, use mock data as last resort so the app still renders
      setKaderList(mockKader);
      setPengurusList(mockPengurus);
      setKegiatanList(mockKegiatan);
      setKasList(mockTransparansiDana);
      setKoinList(mockKoinS3);
      setSuratList(mockPersuratan);
      setUsahaList(mockUsaha);
      setSaranaIbadahList(mockSaranaIbadah);
      setSaranaPendidikanList(mockSaranaPendidikan);
      setBeritaList(mockBerita);
      setDokumentasiList(mockDokumentasi);
      setAspirasiList(mockAspirasi);
      setRantings(mockRantings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataInitializedRef.current) return;
    dataInitializedRef.current = true;
    fetchAllData();
  }, []);



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
      const fullPath = window.location.pathname.replace(/^\//, '');
      if (fullPath) {
        if (fullPath === 'admin' && userRole === 'guest') {
          setActiveTab('login');
          setProfileSubPath('');
        } else {
          // Check for nested routes: e.g. 'profil/mwc/banom/gp-ansor' or 'profil/ranting-bungah/banom/gp-ansor'
          const firstSegment = fullPath.split('/')[0];
          const remaining = fullPath.split('/').slice(1).join('/');
          if (firstSegment === 'profil') {
            setActiveTab('profil');
            // Convert ranting slug back to ID: 'ranting-bungah/banom/gp-ansor' → 'r17/banom/gp-ansor'
            if (remaining) {
              const rParts = remaining.split('/');
              const slugOrId = rParts[0] || '';
              const rantingId = slugToRantingId(slugOrId, rantings);
              const rest = rParts.slice(1).join('/');
              setProfileSubPath(rest ? `${rantingId}/${rest}` : rantingId);
            } else {
              setProfileSubPath('');
            }
          } else {
            setActiveTab(fullPath);
            setProfileSubPath('');
          }
        }
      } else {
        setActiveTab('home');
        setProfileSubPath('');
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
  // profileSubPath may contain ranting IDs (e.g. 'mwc/banom/gp-ansor')
  // We convert the ranting ID to a name slug for the URL.
  useEffect(() => {
    const currentFull = window.location.pathname.replace(/^\//, '');
    let targetPath: string;
    if (activeTab === 'home') {
      targetPath = '/';
    } else if (activeTab === 'profil' && profileSubPath) {
      // Convert ranting ID in subPath to slug: 'mwc/banom/gp-ansor' → 'mwc/banom/gp-ansor'
      // 'r17/banom/gp-ansor' → 'ranting-bungah/banom/gp-ansor'
      const parts = profileSubPath.split('/');
      const rantingId = parts[0] || '';
      const ranting = rantings.find(r => r.id === rantingId);
      const slug = ranting ? rantingNameToSlug(ranting.name) : rantingId;
      const rest = parts.slice(1).join('/');
      targetPath = rest ? `/profil/${slug}/${rest}` : `/profil/${slug}/`;
    } else {
      targetPath = `/${activeTab}`;
    }
    if (currentFull !== targetPath.replace(/^\//, '')) {
      window.history.pushState(null, '', targetPath);
    }
  }, [activeTab, profileSubPath, rantings]);

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
          {/* Loading overlay while data is being fetched from Supabase */}
          {isLoading && (
            <div className="flex items-center justify-center py-20 animate-fadeIn">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 border-4 border-tosca-200 border-t-tosca-600 rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">Memuat data dari database...</p>
                  <p className="text-[11px] text-slate-400 mt-1">Mengambil data terbaru dari Supabase</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <LoginView 
              setUserRole={setUserRole} 
              setSelectedRantingId={setSelectedRantingId} 
              setActiveTab={setActiveTab} 
            />
          )}
          
          {activeTab === 'admin' && !isLoading && (
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
                refetchData={fetchAllData}
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
          {activeTab !== 'login' && activeTab !== 'admin' && activeTab !== 'specs' && !isLoading && (
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
              setKegiatanList={setKegiatanList}
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
              refetchData={fetchAllData}
              profileSubPath={profileSubPath}
              setProfileSubPath={setProfileSubPath}
              setPengurusList={setPengurusList}
            />
          )}
        </main>
      </div>
    </div>
  );
}
