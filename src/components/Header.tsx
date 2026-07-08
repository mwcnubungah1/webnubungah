import React from 'react';
import { Menu, LogIn, LogOut, ShieldAlert, CheckCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
  userRole: Role;
  setUserRole: (role: Role) => void;
  selectedRantingId: string;
  setSelectedRantingId: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Header({
  activeTab,
  setSidebarOpen,
  userRole,
  setUserRole,
  selectedRantingId,
  setSelectedRantingId,
  setActiveTab
}: HeaderProps) {
  
  // Format Indonesian date
  const dateStr = 'Selasa, 7 Juli 2026';

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'Kanal Transparansi Publik MWC NU Bungah';
      case 'profil': return 'Profil Pengurus & Jamiyah';
      case 'kader': return 'Database Kader Terpadu';
      case 'kegiatan': return 'Kegiatan & Agenda Jamiyah';
      case 'keuangan': return 'Transparansi Arus Keuangan';
      case 'koin_s3': return 'Koin S3 LAZISNU (Sehari Seribu)';
      case 'persuratan': return 'Log Persuratan Jamiyah';
      case 'usaha': return 'Ekonomi & Usaha Jamiyah';
      case 'sarana_ibadah': return 'Inventaris Sarana Ibadah';
      case 'sarana_pendidikan': return 'Inventaris Lembaga Pendidikan';
      case 'berita': return 'Kabar & Publikasi Berita';
      case 'dokumentasi': return 'Galeri Dokumentasi';
      case 'kontak': return 'Layanan Hubungi Kami & Aspirasi';
      case 'specs': return 'Arsitektur & Spesifikasi Database SQL';
      case 'login': return 'Login Portal Pengurus';
      case 'admin': return 'Dashboard CMS Admin MWC NU';
      default: return 'Kanal Transparansi';
    }
  };

  const handleRoleQuickChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as Role;
    setUserRole(role);
    if (role === 'admin_ranting') {
      setSelectedRantingId('r1'); // Default to PRNU Bungah
    } else {
      setSelectedRantingId('mwc');
    }
  };

  return (
    <header 
      id="app-header"
      className="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0"
    >
      <div className="flex items-center space-x-3.5">
        {/* Mobile Hamburger toggle */}
        <button
          id="hamburger-menu-btn"
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors border border-gray-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <div className="flex items-center gap-2.5">
          {activeTab !== 'admin' && (
            <>
              <div className="hidden sm:block">
                <h2 className="text-xs font-bold text-gray-900 leading-none">
                  {getPageTitle()}
                </h2>
              </div>
              <div className="sm:hidden">
                <h2 className="text-xs font-bold text-gray-900 leading-none truncate max-w-[150px]">
                  {getPageTitle()}
                </h2>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {userRole === 'guest' ? (
          <button
            id="header-login-btn"
            onClick={() => setActiveTab('login')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-tosca-600 hover:bg-tosca-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login Admin</span>
          </button>
        ) : (
          <button
            id="header-logout-btn"
            onClick={() => {
              setUserRole('guest');
              setSelectedRantingId('mwc');
              setActiveTab('home');
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}

        {/* Current Role Badge */}
        <div className="hidden md:flex items-center space-x-1.5 bg-tosca-50 border border-tosca-100/60 rounded-full pl-2 pr-3 py-1 shrink-0">
          <div className="w-2 h-2 rounded-full bg-tosca-500 animate-pulse" />
          <span className="text-[10px] font-bold text-tosca-800 capitalize tracking-wide">
            {userRole === 'guest' 
              ? 'Warga Publik' 
              : userRole === 'super_admin' 
                ? 'Super Admin' 
                : userRole === 'admin_lazisnu'
                  ? 'LAZISNU'
                  : 'PRNU Bungah'}
          </span>
        </div>
      </div>
    </header>
  );
}
