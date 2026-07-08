import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Lock, 
  Building2, 
  Coins, 
  DollarSign, 
  Users, 
  UserCheck, 
  Calendar, 
  BookOpen, 
  Building, 
  Image, 
  Mail, 
  FileText, 
  ShoppingBag, 
  Database,
  ArrowRight,
  ShieldAlert,
  User
} from 'lucide-react';
import { Role } from '../types';

interface HomeNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: Role;
  setUserRole: (role: Role) => void;
  onLogout: () => void;
}

export default function HomeNavbar({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onLogout
}: HomeNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [transparansiOpen, setTransparansiOpen] = useState(false);

  // Quick Demo Role Switcher Handler
  const handleRoleQuickChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as Role;
    setUserRole(role);
  };

  const menuItems = [
    { id: 'profil', label: 'Profil Jamiyah', icon: Users, description: 'Sejarah, struktur pengurus & jajaran ranting.' },
    { id: 'kader', label: 'Data Kader', icon: UserCheck, description: 'Database anggota terintegrasi seluruh banom.' },
    { id: 'kegiatan', label: 'Kegiatan', icon: Calendar, description: 'Rencana kerja dan agenda syiar yang terlaksana.' },
    { id: 'berita', label: 'Kabar Berita', icon: BookOpen, description: 'Publikasi kegiatan & informasi seputar NU.' },
    { id: 'kontak', label: 'Aspirasi & Hubungi', icon: Mail, description: 'Layanan aspirasi pengaduan publik langsung.' },
  ];

  const adminMenuDocs = [
    { id: 'keuangan', label: 'Transparansi Dana', icon: DollarSign, description: 'Laporan arus kas masuk & keluar secara real-time.' },
    { id: 'koin_s3', label: 'Koin S3 LAZISNU', icon: Coins, description: 'Gerakan Sehari Seribu untuk program kemaslahatan umat.' },
    { id: 'usaha', label: 'Usaha Jamiyah', icon: ShoppingBag, description: 'Unit ekonomi, BUMNU, & kemitraan ritel.' },
    { id: 'persuratan', label: 'Log Persuratan', icon: FileText, description: 'Arsip administrasi surat menyurat organisasi.' },
    { id: 'sarana_ibadah', label: 'Sarana Ibadah', icon: Building, description: 'Sertifikasi wakaf, peta masjid, & musholla.' },
    { id: 'sarana_pendidikan', label: 'Sarana Pendidikan', icon: Building2, description: 'Inventarisasi madrasah, TPQ, & lembaga pendidikan.' },
    { id: 'specs', label: 'Arsitektur Specs', icon: Database, description: 'Detail teknis database & relasi database SQL.' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <img 
              src="https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png" 
              referrerPolicy="no-referrer" 
              className="w-11 h-11 object-contain rounded-2xl shrink-0 transition-transform hover:scale-105" 
              alt="Logo PRNU Bungah" 
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-base leading-tight text-tosca-700 tracking-tight">MWC NU BUNGAH</h1>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full tracking-wider uppercase leading-none">PORTAL</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mt-1">Kabupaten Gresik • Jawa Timur</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all
                ${activeTab === 'home' 
                  ? 'bg-tosca-50 text-tosca-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Beranda
            </button>

            {/* General Pages */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5
                    ${activeTab === item.id 
                      ? 'bg-tosca-50 text-tosca-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Dropdown for Transparansi & Administrasi */}
            <div className="relative">
              <button
                onClick={() => setTransparansiOpen(!transparansiOpen)}
                onBlur={() => setTimeout(() => setTransparansiOpen(false), 200)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5
                  ${adminMenuDocs.some(d => d.id === activeTab)
                    ? 'bg-tosca-50 text-tosca-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <span>Akuntabilitas & Layanan</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${transparansiOpen ? 'rotate-180' : ''}`} />
              </button>

              {transparansiOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1.5 z-50 animate-fadeIn">
                  <div className="px-3.5 py-1.5 border-b border-gray-100">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">ADMINISTRASI & TRANSPARANSI</span>
                  </div>
                  {adminMenuDocs.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveTab(subItem.id);
                          setTransparansiOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all
                          ${activeTab === subItem.id 
                            ? 'bg-tosca-50 text-tosca-600' 
                            : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        <div className={`p-1.5 rounded-lg ${activeTab === subItem.id ? 'bg-tosca-100 text-tosca-600' : 'bg-gray-100 text-gray-500'}`}>
                          <SubIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{subItem.label}</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{subItem.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right side settings (Demo switcher & CMS login button) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Demo Switcher */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 flex items-center space-x-2.5 shadow-2xs">
              <div className="flex flex-col text-right leading-none">
                <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase block mb-0.5">DEMO ROLE</span>
                <span className="text-[10px] text-tosca-700 font-extrabold block">Uji Akses</span>
              </div>
              <select
                id="landing-role-select"
                value={userRole}
                onChange={handleRoleQuickChange}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 font-bold text-gray-700"
              >
                <option value="guest">Guest (Publik)</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin_ranting">PRNU Bungah</option>
                <option value="admin_lazisnu">LAZISNU</option>
              </select>
            </div>

            {/* Portal Button */}
            {userRole === 'guest' ? (
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl text-xs transition-all flex items-center space-x-1.5 shadow-sm shadow-gray-200 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login Pengurus</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-4 py-2.5 bg-tosca-600 hover:bg-tosca-700 text-white font-bold rounded-2xl text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-teal-100 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Dashboard CMS</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl text-red-600 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Mobile quick role info badge */}
            <div className="bg-tosca-50 border border-tosca-100 px-2.5 py-1 rounded-xl text-[10px] font-bold text-tosca-800">
              {userRole === 'guest' ? 'Publik' : userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin_lazisnu' ? 'LAZISNU' : 'Ranting'}
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md py-4 px-6 space-y-5 animate-slideDown shadow-lg absolute left-0 right-0 z-40">
          {/* Main Links */}
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase block pb-1">MENU UTAMA</span>
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all
                ${activeTab === 'home' ? 'bg-tosca-50 text-tosca-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Beranda</span>
            </button>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all
                    ${activeTab === item.id ? 'bg-tosca-50 text-tosca-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Akuntabilitas & Layanan */}
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase block pb-1">AKUNTABILITAS & LAYANAN</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-gray-50 p-2 rounded-2xl border border-gray-100">
              {adminMenuDocs.map((subItem) => {
                const SubIcon = subItem.icon;
                return (
                  <button
                    key={subItem.id}
                    onClick={() => { setActiveTab(subItem.id); setMobileMenuOpen(false); }}
                    className={`flex items-center space-x-2.5 p-2 rounded-xl text-left text-xs font-bold transition-all
                      ${activeTab === subItem.id ? 'text-tosca-600 bg-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <SubIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{subItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Demo Switcher on mobile */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-gray-500">Uji Akses (Demo Switcher)</span>
              <select
                value={userRole}
                onChange={handleRoleQuickChange}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-hidden font-bold text-gray-700"
              >
                <option value="guest">Guest (Publik)</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin_ranting">PRNU Bungah</option>
                <option value="admin_lazisnu">LAZISNU</option>
              </select>
            </div>

            {/* CMS Portal Button */}
            {userRole === 'guest' ? (
              <button
                onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Lock className="w-4 h-4" />
                <span>Portal Login Pengurus</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 bg-tosca-600 hover:bg-tosca-700 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <span>Dashboard CMS Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-2xl"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
