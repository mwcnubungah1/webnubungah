import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Mail, 
  FolderOpen, 
  DollarSign, 
  Users, 
  Briefcase, 
  Camera, 
  MapPin, 
  Vote, 
  Lock, 
  Menu, 
  X,
  ChevronDown,
  UserCheck,
  ArrowLeft,
  LifeBuoy
} from 'lucide-react';
import { useRouter } from '../../router';
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
} from '../../types';

// Modular view imports
import DashboardView from '../../components/DashboardView';
import LettersView from '../../components/LettersView';
import ArsipView from '../../components/ArsipView';
import KeuanganView from '../../components/KeuanganView';
import DatabaseAnggotaView from '../../components/DatabaseAnggotaView';
import ProgramKerjaView from '../../components/ProgramKerjaView';
import DokumentasiView from '../../components/DokumentasiView';
import MapGISView from '../../components/MapGISView';
import MusyawarahView from '../../components/MusyawarahView';

interface PageProps {
  userRole: UserRole;
  onLogout: () => void;

  // Persistent States
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  arsipDocs: ArsipDokumen[];
  transaksiList: TransaksiKeuangan[];
  anggotaList: AnggotaPengurus[];
  programList: ProgramKerja[];
  dokumentasiList: DokumentasiKegiatan[];
  lokasiList: LokasiGIS[];
  agendaList: AgendaMusyawarah[];

  // Setters wrap
  onAddSuratMasuk: (item: Omit<SuratMasuk, 'id'>) => void;
  onUpdateSuratMasuk: (id: string, updates: Partial<SuratMasuk>) => void;
  onAddSuratKeluar: (item: Omit<SuratKeluar, 'id' | 'tanggalDibuat'>) => void;
  onUpdateSuratKeluar: (id: string, updates: Partial<SuratKeluar>) => void;
  onAddArsip: (item: Omit<ArsipDokumen, 'id'>) => void;
  onDeleteArsip: (id: string) => void;
  onAddTransaksi: (item: Omit<TransaksiKeuangan, 'id' | 'auditTrail'>) => void;
  onUpdateTransaksi: (id: string, updates: Partial<TransaksiKeuangan>) => void;
  onAddAnggota: (item: Omit<AnggotaPengurus, 'id' | 'fotoUrl'>) => void;
  onDeleteAnggota: (id: string) => void;
  onAddProgram: (item: Omit<ProgramKerja, 'id' | 'realisasiAnggaran' | 'kegiatanTerbantu'>) => void;
  onUpdateProgram: (id: string, updates: Partial<ProgramKerja>) => void;
  onAddDokumentasi: (item: Omit<DokumentasiKegiatan, 'id'>) => void;
  onAddLokasi: (item: Omit<LokasiGIS, 'id'>) => void;
  onAddAgenda: (item: Omit<AgendaMusyawarah, 'id' | 'absensi'>) => void;
  onUpdateAgenda: (id: string, updates: Partial<AgendaMusyawarah>) => void;
}

export default function AdminWorkspace(props: PageProps) {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  // Guard Clause: If role is public member, show clean Lock screen redirector
  if (props.userRole === 'PUBLIK_WARGA') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="bg-amber-50 p-4 rounded-full text-[#C5A059] border">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-sm font-bold text-gray-800">Akses Masuk Terkunci</h2>
        <p className="text-3xs text-gray-550 max-w-sm font-sans leading-relaxed">
          Maaf, halaman ini hanya ditujukan untuk pengurus harian atau administrator MWCNU Smart Governance. Harap lakukan login terlebih dahulu.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-emerald-900 text-white font-bold text-xxs px-5 py-2.5 rounded-xl border border-emerald-950 text-[#D4AF37]"
        >
          Masuk Kredensial Pengurus
        </button>
      </div>
    );
  }

  // Admin menu links
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Statistik', icon: Layers, viewColors: 'text-emerald-700 bg-emerald-50' },
    { id: 'surat', name: 'E-Persuratan', icon: Mail, viewColors: 'text-blue-700 bg-blue-50' },
    { id: 'arsip', name: 'Arsip Digital Kantor', icon: FolderOpen, viewColors: 'text-amber-700 bg-amber-50' },
    { id: 'keuangan', name: 'E-Keuangan Kas', icon: DollarSign, viewColors: 'text-emerald-900 bg-emerald-90/10' },
    { id: 'anggota', name: 'Database KARTANU', icon: Users, viewColors: 'text-indigo-700 bg-indigo-50' },
    { id: 'proker', name: 'Program Kerja & LPJ', icon: Briefcase, viewColors: 'text-teal-700 bg-teal-50' },
    { id: 'album', name: 'Dokumentasi Album', icon: Camera, viewColors: 'text-rose-700 bg-rose-50' },
    { id: 'gis', name: 'Map GIS Wakaf NU', icon: MapPin, viewColors: 'text-purple-700 bg-purple-50' },
    { id: 'musyawarah', name: 'Bahtsul Masail', icon: Vote, viewColors: 'text-orange-700 bg-orange-50' },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            anggotaList={props.anggotaList}
            transaksiList={props.transaksiList}
            programList={props.programList}
            suratKeluarList={props.suratKeluar}
            rantingCount={10}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'surat':
        return (
          <LettersView 
            suratMasukList={props.suratMasuk}
            suratKeluarList={props.suratKeluar}
            role={props.userRole}
            onAddSuratMasuk={props.onAddSuratMasuk}
            onUpdateSuratMasuk={props.onUpdateSuratMasuk}
            onAddSuratKeluar={props.onAddSuratKeluar}
            onUpdateSuratKeluar={props.onUpdateSuratKeluar}
          />
        );
      case 'arsip':
        return (
          <ArsipView 
            arsipList={props.arsipDocs}
            role={props.userRole}
            onAddArsip={props.onAddArsip}
            onDeleteArsip={props.onDeleteArsip}
          />
        );
      case 'keuangan':
        return (
          <KeuanganView 
            transaksiList={props.transaksiList}
            role={props.userRole}
            onAddTransaksi={props.onAddTransaksi}
            onUpdateTransaksi={props.onUpdateTransaksi}
          />
        );
      case 'anggota':
        return (
          <DatabaseAnggotaView 
            anggotaList={props.anggotaList}
            role={props.userRole}
            onAddAnggota={props.onAddAnggota}
            onDeleteAnggota={props.onDeleteAnggota}
          />
        );
      case 'proker':
        return (
          <ProgramKerjaView 
            programList={props.programList}
            role={props.userRole}
            onAddProgram={props.onAddProgram}
            onUpdateProgram={props.onUpdateProgram}
          />
        );
      case 'album':
        return (
          <DokumentasiView 
            dokumentasiList={props.dokumentasiList}
            programList={props.programList}
            anggotaList={props.anggotaList}
            role={props.userRole}
            onAddDokumentasi={props.onAddDokumentasi}
          />
        );
      case 'gis':
        return (
          <MapGISView 
            lokasiList={props.lokasiList}
            role={props.userRole}
            onAddLocation={props.onAddLokasi}
          />
        );
      case 'musyawarah':
        return (
          <MusyawarahView 
            agendaList={props.agendaList}
            role={props.userRole}
            onAddAgenda={props.onAddAgenda}
            onUpdateAgenda={props.onUpdateAgenda}
          />
        );
      default:
        return <div className="text-xs">Pilihlah salah satu menu di sidebar harian.</div>;
    }
  };

  const getRoleLabel = () => {
    if (props.userRole === 'ADMIN_MWCNU') return 'Administrator Sistem';
    if (props.userRole === 'SEKRETARIS') return 'Sekretaris Tanfidziyah';
    if (props.userRole === 'KETUA') return 'Ketua Tanfidziyah';
    return 'Publik';
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title head board */}
      <div className="bg-slate-900 border-b-4 border-[#D4AF37] p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] text-4xs tracking-widest font-extrabold uppercase font-mono">WORKSPACE PENGURUS HARIAN</span>
            <span className="px-2 py-0.2 bg-emerald-850 border border-emerald-700 text-emerald-100 rounded text-[9px] font-bold font-mono">SECURE AREA</span>
          </div>
          <h1 className="text-sm md:text-md font-serif font-black tracking-tight mt-1">Pusat Administrasi Terpadu MWCNU Bungah</h1>
          <p className="text-[10px] text-gray-400 font-sans">Mengelola database klerikal, data KARTANU, kas keuangan, surat masuk, surat keluar harian.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs font-sans">
          <div className="h-8.5 w-8.5 bg-gradient-to-br from-emerald-800 to-emerald-950 text-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-xxs">
            NU
          </div>
          <div>
            <span className="text-gray-450 text-[10px] block font-mono">TIPE HAK AKSES:</span>
            <span className="text-[#D4AF37] font-semibold text-3xs uppercase tracking-wide block">{getRoleLabel()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white p-4 rounded-2xl border border-gray-150/50 shadow-xxs space-y-3">
            <h3 className="text-3xs uppercase tracking-widest font-black text-gray-400">Modul Konsolidasi</h3>
            
            <div className="flex flex-col gap-1 text-xs">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setAdminSidebarOpen(false);
                    }}
                    className={`w-full text-left font-semibold text-xxs px-3 py-2.8 rounded-xl transition duration-150 cursor-pointer flex items-center gap-2.5 ${
                      activeTab === item.id 
                        ? 'bg-emerald-990 font-bold text-white shadow-3xs' 
                        : 'text-gray-600 hover:bg-slate-50 border border-transparent hover:text-emerald-950 bg-white'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${activeTab === item.id ? 'text-[#D4AF37]' : 'text-gray-450'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t">
              <button
                onClick={props.onLogout}
                className="w-full text-left text-red-650 hover:bg-red-50 border border-transparent hover:border-red-100 font-bold text-xxs px-3 py-2 rounded-xl transition cursor-pointer"
              >
                Keluar Sesi Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Active admin dynamic panels view rendered */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-150/45 shadow-xxs">
          {renderActiveView()}
        </div>

      </div>

    </div>
  );
}
