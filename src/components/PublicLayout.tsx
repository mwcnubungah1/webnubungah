import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Building2, 
  ArrowRight,
  Home,
  User,
  BookOpen,
  Mail,
  FileText,
  Briefcase,
  DollarSign,
  Camera,
  Lock,
  Globe
} from 'lucide-react';
import { Link, useRouter } from '../router';

interface PublicLayoutProps {
  children: React.ReactNode;
  userRole: string;
  onLogout?: () => void;
}

export default function PublicLayout({ children, userRole, onLogout }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useRouter();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Profil', path: '/profil', icon: User },
    { name: 'Berita', path: '/berita', icon: BookOpen },
    { name: 'Persuratan', path: '/persuratan', icon: Mail },
    { name: 'Program Kerja', path: '/program-kerja', icon: Briefcase },
    { name: 'Arsip', path: '/arsip', icon: FileText },
    { name: 'Keuangan', path: '/keuangan', icon: DollarSign },
    { name: 'Album Dokumentasi', path: '/album-dokumentasi', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-gray-800">
      
      {/* Top Green Accent bar */}
      <div className="bg-emerald-950 text-emerald-100 text-[10px] py-2 px-4 flex justify-between items-center font-mono border-b border-emerald-900/40 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
          <span>SISTEM INFORMASI ADMINISTRASI &amp; TRANSPARANSI MWCNU BUNGAH</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>CALL CENTER: +62 812-3456-7890</span>
          <span>EST. 1926</span>
        </div>
      </div>

      {/* Main Luxurious Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-150/70 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Visual Bran Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-emerald-50 p-1.5 rounded-xl border border-emerald-100 flex items-center justify-center shadow-2xs h-10 w-10 overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/dkirp8utp/image/upload/q_auto/f_auto/v1780232375/logo-nu-40177_wrpdez.png" 
                  alt="Logo NU" 
                  className="h-full w-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <span className="text-emerald-900 font-serif font-black tracking-tight text-xs block leading-tight select-none">
                  MWCNU SMART GOVERNANCE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block leading-none mt-0.5 font-sans">
                  Kecamatan Bungah
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Link Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 transition-all duration-200 hover:text-emerald-900 hover:bg-emerald-50/50"
                    activeClassName="bg-emerald-50 text-emerald-900 font-extrabold shadow-3xs"
                  >
                    <Icon className="h-3.5 w-3.5 opacity-80" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Admin Authentication portal Portal button */}
            <div className="hidden lg:flex items-center gap-3">
              {userRole !== 'PUBLIK_WARGA' ? (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/admin" 
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-xs"
                  >
                    <Lock className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>Dashboard Admin</span>
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="border border-red-200 hover:bg-red-50 text-red-650 font-semibold text-xs px-3 py-2 rounded-xl transition"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition hover:scale-[1.02] shadow-xs cursor-pointer border border-emerald-950 text-[#D4AF37]"
                >
                  <Lock className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Login Pengurus</span>
                </Link>
              )}
            </div>

            {/* Tablet/Mobile menu controller */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 ml-1 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none"
              >
                <Menu className="h-5.5 w-5.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-over */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col z-50">
            <div className="flex justify-between items-center px-4 py-4 border-b">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://res.cloudinary.com/dkirp8utp/image/upload/q_auto/f_auto/v1780232375/logo-nu-40177_wrpdez.png" 
                    alt="Logo NU" 
                    className="h-6 w-auto object-contain mr-1" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-gray-900">MAIN MENUS</span>
                </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation links inside drawer */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-950 transition"
                    activeClassName="bg-emerald-50 text-emerald-900 font-extrabold"
                  >
                    <Icon className="h-4.5 w-4.5 text-emerald-700" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* CTA action bottom drawer */}
            <div className="border-t p-4 bg-slate-50">
              {userRole !== 'PUBLIK_WARGA' ? (
                <div className="space-y-2">
                  <Link 
                    to="/admin" 
                    className="w-full justify-center bg-emerald-850 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 text-center"
                    activeClassName=""
                  >
                    <Lock className="h-4 w-4" />
                    <span>Dashboard Admin</span>
                  </Link>
                  <button 
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center border text-red-650 hover:bg-red-50 text-xs px-4 py-2 rounded-xl"
                  >
                    Keluar Admin
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full justify-center bg-emerald-900 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 transition shadow-md border border-emerald-950 text-[#D4AF37]"
                >
                  <Lock className="h-4 w-4 text-[#D4AF37]" />
                  <span>Login Pengurus</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main page content layout view */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer copyright */}
      <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/50 pt-12 pb-8 mt-auto select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex items-center justify-center h-8 w-8 overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/dkirp8utp/image/upload/q_auto/f_auto/v1780232375/logo-nu-40177_wrpdez.png" 
                  alt="Logo NU" 
                  className="h-full w-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-serif font-heading font-extrabold text-xs tracking-wider text-white">MWCNU BUNGAH</span>
            </div>
            <p className="text-3xs text-emerald-250 leading-relaxed font-sans max-w-xs">
              Badan hukum resmi Nahdlatul Ulama Majelis Wakil Cabang Kecamatan Bungah. Melayani warga mudi-muda, syuriyah, lazisnu, lembaga dan banom terstruktur.
            </p>
          </div>

          <div className="text-left space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Pintas Tautan</h4>
            <div className="grid grid-cols-2 gap-2 text-3xs font-semibold text-emerald-200">
              <Link to="/profil" className="hover:text-white transition">Profil Organisasi</Link>
              <Link to="/berita" className="hover:text-white transition">Warta &amp; Berita</Link>
              <Link to="/persuratan" className="hover:text-white transition">Arsip E-Surat</Link>
              <Link to="/program-kerja" className="hover:text-white transition">Program Kerja</Link>
              <Link to="/arsip" className="hover:text-white transition">Perpustakaan Dokumen</Link>
              <Link to="/keuangan" className="hover:text-white transition">Kas &amp; Keuangan</Link>
            </div>
          </div>

          <div className="text-left space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Kantor &amp; Kontak</h4>
            <p className="text-3xs text-emerald-200 leading-normal font-sans">
              Jl. Raya Bungah No. 15, Bungah, Gresik, Jawa Timur 61151. <br />
              Email: info@mwcnu-sidokerto.or.id <br />
              Tlp: +62 812-3456-7890
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-900/60 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-3xs font-mono text-emerald-350">
          <span>&copy; {new Date().getFullYear()} MWCNU Bungah. Hak cipta dilindungi undang-undang.</span>
          <span>Teknologi Smart Governance Digital</span>
        </div>
      </footer>

    </div>
  );
}
