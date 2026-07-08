import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users2, 
  Coins, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Send,
  Eye,
  Building,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  Map,
  Sparkles,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart,
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ReferenceLine
} from 'recharts';

import { 
  Ranting, 
  Pengurus, 
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
  Aspirasi 
} from '../types';

interface PortalPagesProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rantings: Ranting[];
  pengurusList: Pengurus[];
  kaderList: Kader[];
  kegiatanList: Kegiatan[];
  kasList: TransparansiDana[];
  koinList: KoinS3[];
  suratList: Persuratan[];
  usahaList: Usaha[];
  saranaIbadahList: SaranaIbadah[];
  saranaPendidikanList: SaranaPendidikan[];
  beritaList: Berita[];
  dokumentasiList: Dokumentasi[];
  aspirasiList: Aspirasi[];
  addAspirasi: (aspirasi: Omit<Aspirasi, 'id' | 'date' | 'status'>) => void;
}

export default function PortalPages({
  activeTab,
  setActiveTab,
  rantings,
  pengurusList,
  kaderList,
  kegiatanList,
  kasList,
  koinList,
  suratList,
  usahaList,
  saranaIbadahList,
  saranaPendidikanList,
  beritaList,
  dokumentasiList,
  aspirasiList,
  addAspirasi
}: PortalPagesProps) {

  // For viewing full news
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Lifted states to prevent Hook ordering bugs
  const [profilFilterCategory, setProfilFilterCategory] = useState<'Semua' | 'MWC' | 'Ranting'>('Semua');
  const [profilSearchQuery, setProfilSearchQuery] = useState('');

  const [kaderSelectedBanom, setKaderSelectedBanom] = useState<string>('Semua');
  const [kaderSelectedRanting, setKaderSelectedRanting] = useState<string>('Semua');
  const [kaderSearchQuery, setKaderSearchQuery] = useState('');

  const [kegiatanStatusFilter, setKegiatanStatusFilter] = useState<'Semua' | 'Rencana' | 'Selesai'>('Semua');

  const [koinSelectedRanting, setKoinSelectedRanting] = useState<string>('Semua');
  const [koinSelectedMonth, setKoinSelectedMonth] = useState<string>('Semua');

  const [persuratanSearchQuery, setPersuratanSearchQuery] = useState('');
  const [persuratanSelectedType, setPersuratanSelectedType] = useState<string>('Semua');

  const [gallerySelectedCategory, setGallerySelectedCategory] = useState<string>('Semua');

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRantingId, setContactRantingId] = useState('r1');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactErrorMsg, setContactErrorMsg] = useState('');

  // Helper: Format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper: Translate Ranting ID to Name
  const getRantingName = (id?: string) => {
    if (!id) return 'Tingkat MWC';
    if (id === 'mwc') return 'Tingkat MWC';
    const r = rantings.find(item => item.id === id);
    return r ? r.name : 'Ranting NU';
  };

  // ==========================================
  // PAGE 0: HOME / BERANDA
  // ==========================================
  const renderHome = () => {
    // 1. Calculations for Home Stats
    const totalRanting = rantings.length - 1; // excluding mwc
    const totalKader = kaderList.length;
    
    // Total Koin S3 bulan ini (June 2026)
    const activeMonth = '2026-06';
    const totalKoinS3BulanIni = koinList
      .filter(k => k.month === activeMonth)
      .reduce((sum, k) => sum + k.amount, 0);

    const totalDanaSalurBulanIni = koinList
      .filter(k => k.month === activeMonth)
      .reduce((sum, k) => sum + k.distributionAmount, 0);

    // Kas non-S3 total masuk dan keluar
    const totalKasMasuk = kasList.filter(k => k.type === 'Masuk').reduce((sum, k) => sum + k.amount, 0);
    const totalKasKeluar = kasList.filter(k => k.type === 'Keluar').reduce((sum, k) => sum + k.amount, 0);
    const saldoKas = totalKasMasuk - totalKasKeluar;

    // 2. Prepare Chart Data for Koin S3
    const chartDataKoinS3 = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const koin = koinList.find(k => k.rantingId === r.id && k.month === activeMonth);
        return {
          name: r.village,
          'Perolehan S3 (Rp)': koin ? koin.amount : 0,
          'Penyaluran (Rp)': koin ? koin.distributionAmount : 0
        };
      });

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Banner Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-tosca-900 via-tosca-850 to-emerald-950 text-white rounded-2xl p-6 md:p-12 shadow-xl border border-tosca-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-tosca-200 border border-white/10 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Media Transparansi Publik Resmi</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
              Membangun Jam&apos;iyah Mandiri, Transparan & Akuntabel
            </h1>
            <p className="text-sm md:text-lg text-slate-200 max-w-2xl font-light leading-relaxed">
              Selamat datang di **Kanal Transparansi MWC NU Bungah**. Portal keterbukaan informasi publik yang mengintegrasikan akuntabilitas keuangan koin LAZISNU, inventarisasi aset wakaf, sarana pendidikan, serta manajemen kaderisasi secara berkala dan terpusat.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveTab('koin_s3')}
                className="px-5 py-2.5 bg-tosca-500 hover:bg-tosca-600 font-semibold text-white rounded-lg shadow-md transition-all text-sm flex items-center space-x-2"
              >
                <Coins className="w-4 h-4" />
                <span>Pantau Koin S3</span>
              </button>
              <button 
                onClick={() => setActiveTab('keuangan')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/25 border border-white/20 font-semibold text-white rounded-lg transition-all text-sm flex items-center space-x-2 backdrop-blur-md"
              >
                <DollarSign className="w-4 h-4" />
                <span>Lihat Laporan Arus Dana</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-tosca-50 rounded-xl text-tosca-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Ranting NU</span>
              <p className="text-xl font-bold text-gray-900">{totalRanting} Desa</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Kader Terdata</span>
              <p className="text-xl font-bold text-gray-900">{totalKader} Anggota</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Koin S3 ({activeMonth})</span>
              <p className="text-xl font-bold text-amber-600">{formatRupiah(totalKoinS3BulanIni)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Saldo Kas MWC</span>
              <p className="text-xl font-bold text-teal-600">{formatRupiah(saldoKas)}</p>
            </div>
          </div>
        </section>

        {/* Charts and Highlights Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Visualisasi Perolehan & Penyaluran Koin S3</h3>
                <p className="text-[10px] text-gray-500">Bulan Aktif: Juni 2026 (Per Pengurus Ranting NU se-Bungah)</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 bg-amber-50 text-amber-800 rounded font-bold uppercase">LAZISNU Care</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataKoinS3} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => `${v / 1000000}jt`} />
                  <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Perolehan S3 (Rp)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Penyaluran (Rp)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* S3 Quick Summary & Distribution target */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Sasaran Tasaruf Koin S3</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Uang koin receh seribu rupiah yang dikumpulkan para petugas (Gerakan S3) dari rumah ke rumah warga dilingkungan Ranting NU disalurkan secara berkala untuk 4 pilar kemaslahatan:
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-lg bg-tosca-50 flex items-center justify-center text-tosca-700 font-mono text-xs font-bold mt-0.5">1</div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Pilar Pendidikan</span>
                    <p className="text-[10px] text-gray-500">Membantu beasiswa siswa yatim/piatu dan stimulan insentif guru ngaji dhuafa.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 font-mono text-xs font-bold mt-0.5">2</div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Pilar Kesehatan</span>
                    <p className="text-[10px] text-gray-500">Layanan ambulans gratis MWC dan pembiayaan obat darurat warga prasejahtera.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-mono text-xs font-bold mt-0.5">3</div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Pilar Sosial Keagamaan</span>
                    <p className="text-[10px] text-gray-500">Santunan bencana alam, dana kematian warga, rehab ringan MCK rumah ibadah.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Rasio Penyelamatan</span>
                <span className="text-tosca-700 font-bold">
                  {((totalDanaSalurBulanIni / totalKoinS3BulanIni) * 100).toFixed(1)}% Penyaluran
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-tosca-600 h-2 rounded-full" 
                  style={{ width: `${(totalDanaSalurBulanIni / totalKoinS3BulanIni) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Latest News and Docs Log Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest News */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Kabar Berita Terkini</h3>
              <button 
                onClick={() => setActiveTab('berita')}
                className="text-xs text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"
              >
                <span>Lihat Semua Berita</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {beritaList.slice(0, 2).map((item) => (
                <div key={item.id} className="group cursor-pointer flex space-x-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0" onClick={() => { setSelectedNewsId(item.id); setActiveTab('berita'); }}>
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" 
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold text-tosca-700 uppercase tracking-wider">{item.category}</span>
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-tosca-600 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.content.replace(/[#*`>]/g, '').slice(0, 100)}...
                    </p>
                    <div className="flex items-center text-[10px] text-slate-400 space-x-2 pt-1">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Letters & Docs Log */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Log Persuratan Masuk & Keluar</h3>
                <button 
                  onClick={() => setActiveTab('persuratan')}
                  className="text-xs text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar -mx-6 px-6">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-2.5">Tanggal</th>
                      <th className="pb-2.5">Jenis</th>
                      <th className="pb-2.5">Perihal</th>
                      <th className="pb-2.5 text-right">No. Surat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suratList.slice(0, 3).map((s) => (
                      <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-2.5 text-slate-500 font-semibold">{s.date}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${s.type === 'Masuk' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                            {s.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-800 font-bold truncate max-w-[150px]">{s.subject}</td>
                        <td className="py-2.5 text-right font-mono text-[10px] text-slate-500">{s.letterNumber.split('/')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 bg-emerald-50/30 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <span className="text-[11px] text-emerald-900 font-semibold leading-relaxed">
                  Semua log surat tercatat transparan dan didistribusikan ke Ranting melalui arsip digital.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // ==========================================
  // PAGE 1: PROFIL JAMIYAH
  // ==========================================
  const renderProfil = () => {
    const filterCategory = profilFilterCategory;
    const setFilterCategory = setProfilFilterCategory;
    const searchQuery = profilSearchQuery;
    const setSearchQuery = setProfilSearchQuery;

    const filteredPengurus = pengurusList.filter(p => {
      const matchesCategory = filterCategory === 'Semua' || p.category === filterCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.education.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(['Semua', 'MWC', 'Ranting'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${filterCategory === cat 
                    ? 'bg-tosca-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {cat === 'Semua' ? 'Semua Jajaran' : cat === 'MWC' ? 'Pengurus MWC NU' : 'Pengurus Ranting (PRNU)'}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, jabatan, pendidikan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800"
            />
          </div>
        </div>

        {/* Executives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPengurus.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="p-5 flex items-start space-x-4">
                <img 
                  src={p.photoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} 
                  alt={p.name} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-contain border border-slate-200 bg-slate-50 shrink-0 shadow-xs" 
                />
                <div className="space-y-1">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                    ${p.category === 'MWC' ? 'bg-tosca-100 text-tosca-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {p.category === 'MWC' ? 'Pengurus MWC' : getRantingName(p.rantingId)}
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{p.name}</h4>
                  <p className="text-[11px] text-tosca-600 font-bold">{p.role}</p>
                </div>
              </div>
              
              <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-100 text-[10.5px] grid grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Pendidikan</span>
                  <span className="text-gray-700 font-semibold truncate block">{p.education}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Kaderisasi NU</span>
                  <span className="text-gray-700 font-semibold truncate block">{p.kaderisasiStatus}</span>
                </div>
                <div className="col-span-2 pt-1 flex items-center space-x-1.5 text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-tosca-600" />
                  <span className="font-mono">{p.phone}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredPengurus.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200">
              <p className="text-xs text-slate-500 font-bold">Pengurus tidak ditemukan. Silakan ganti kata kunci.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 2: DATA KADER
  // ==========================================
  const renderKader = () => {
    const selectedBanom = kaderSelectedBanom;
    const setSelectedBanom = setKaderSelectedBanom;
    const selectedRanting = kaderSelectedRanting;
    const setSelectedRanting = setKaderSelectedRanting;
    const searchQuery = kaderSearchQuery;
    const setSearchQuery = setKaderSearchQuery;

    const filteredKader = kaderList.filter(k => {
      const matchesBanom = selectedBanom === 'Semua' || k.banom === selectedBanom;
      const matchesRanting = selectedRanting === 'Semua' || k.rantingId === selectedRanting;
      const matchesSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            k.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBanom && matchesRanting && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Unsur / Badan Otonom</label>
              <select
                value={selectedBanom}
                onChange={(e) => setSelectedBanom(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Banom</option>
                <option value="IPNU">IPNU (Pelajar Putra)</option>
                <option value="IPPNU">IPPNU (Pelajar Putri)</option>
                <option value="Ansor">GP Ansor (Pemuda)</option>
                <option value="Fatayat">Fatayat NU (Wanita Muda)</option>
                <option value="Muslimat">Muslimat NU (Ibu-Ibu)</option>
                <option value="Banser">Banser (Barisan Ansor Serbaguna)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Wilayah Ranting</label>
              <select
                value={selectedRanting}
                onChange={(e) => setSelectedRanting(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Ranting</option>
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Pencarian Nama</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ketik nama kader..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total count indicator */}
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-xs">
          <span>Kader Terdaftar: {filteredKader.length} Orang</span>
          <span className="text-[10px] text-slate-400 font-medium">Tampilan Kartu Terpadu</span>
        </div>

        {/* Kader Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKader.map((k) => (
            <div key={k.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-tosca-300 transition-all">
              <div className="p-5 flex items-start space-x-4">
                <img 
                  src={k.photoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} 
                  alt={k.name} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-contain border border-slate-200 bg-slate-50 shrink-0 shadow-xs" 
                />
                <div className="space-y-1 overflow-hidden">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-tosca-50 text-tosca-800 border border-tosca-100">
                    {k.banom}
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-tight truncate">{k.name}</h4>
                  <p className="text-[11px] text-tosca-600 font-bold truncate">{k.role || 'Kader / Anggota'}</p>
                </div>
              </div>
              
              <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-100 text-[10.5px] grid grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Ranting Desa</span>
                  <span className="text-gray-700 font-semibold truncate block">{getRantingName(k.rantingId)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Tahun Gabung</span>
                  <span className="text-gray-700 font-semibold truncate block">{k.joinYear || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Jenis Kelamin</span>
                  <span className="text-gray-700 font-semibold truncate block">{k.gender}</span>
                </div>
                <div className="col-span-2 pt-1 flex items-center space-x-1.5 text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-tosca-600" />
                  <span className="font-mono">{k.phone}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredKader.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200">
              <p className="text-xs text-slate-500 font-bold">Kader tidak ditemukan. Silakan ganti kriteria pencarian.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 3: KEGIATAN JAMIYAH
  // ==========================================
  const renderKegiatan = () => {
    const statusFilter = kegiatanStatusFilter;
    const setStatusFilter = setKegiatanStatusFilter;

    const filteredKegiatan = kegiatanList.filter(e => {
      return statusFilter === 'Semua' || e.status === statusFilter;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex space-x-1">
            {(['Semua', 'Rencana', 'Selesai'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${statusFilter === status 
                    ? 'bg-tosca-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {status === 'Semua' ? 'Semua Agenda' : status === 'Rencana' ? 'Mendatang (Rencana)' : 'Telah Terlaksana'}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">Jumlah: {filteredKegiatan.length} Kegiatan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredKegiatan.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                {e.imageUrl && (
                  <img 
                    src={e.imageUrl} 
                    alt={e.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover bg-slate-50" 
                  />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-tosca-700 bg-tosca-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {e.organizer}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${e.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {e.status}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug hover:text-tosca-600 transition-colors">
                    {e.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {e.description}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-4 border-t border-slate-50 text-xs text-slate-600 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{e.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 truncate" />
                    <span className="truncate">{e.location.split(',')[0]}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100/50 pt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Sumber Biaya</span>
                    <span className="font-semibold text-slate-800">{e.fundingSource}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Anggaran Biaya</span>
                    <span className="font-bold text-tosca-700">{formatRupiah(e.budget)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 4: TRANSPARANSI DANA
  // ==========================================
  const renderKeuangan = () => {
    // 1. Calculations
    const incoming = kasList.filter(k => k.type === 'Masuk').reduce((sum, k) => sum + k.amount, 0);
    const outgoing = kasList.filter(k => k.type === 'Keluar').reduce((sum, k) => sum + k.amount, 0);
    const balance = incoming - outgoing;

    // 2. Prepare Category Pie Data
    const categorySummary = kasList.reduce((acc: { [key: string]: number }, cur) => {
      if (cur.type === 'Keluar') {
        acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
      }
      return acc;
    }, {});

    const pieData = Object.keys(categorySummary).map(cat => ({
      name: cat,
      value: categorySummary[cat]
    }));

    // 3. Prepare Monthly cashflow data for basic column chart
    const monthlySummary = kasList.reduce((acc: { [key: string]: { masuk: number; keluar: number } }, cur) => {
      const monthLabel = cur.date.slice(0, 7); // e.g., '2026-06'
      if (!acc[monthLabel]) {
        acc[monthLabel] = { masuk: 0, keluar: 0 };
      }
      if (cur.type === 'Masuk') {
        acc[monthLabel].masuk += cur.amount;
      } else {
        acc[monthLabel].keluar += cur.amount;
      }
      return acc;
    }, {});

    const chartData = Object.keys(monthlySummary).sort().map(month => ({
      name: month,
      Masuk: monthlySummary[month].masuk,
      Keluar: -monthlySummary[month].keluar,
      Saldo: monthlySummary[month].masuk - monthlySummary[month].keluar
    }));

    const COLORS = ['#0f766e', '#0d9488', '#14b8a6', '#5eead4', '#a7f3d0', '#f59e0b'];

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Quick Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Saldo Masuk</span>
              <p className="text-lg font-display font-extrabold text-emerald-600">{formatRupiah(incoming)}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Saldo Keluar</span>
              <p className="text-lg font-display font-extrabold text-red-600">{formatRupiah(outgoing)}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Saldo (Sisa)</span>
              <p className="text-lg font-display font-extrabold text-tosca-700">{formatRupiah(balance)}</p>
            </div>
            <div className="p-2.5 bg-tosca-50 rounded-xl text-tosca-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tingkat Penyerapan</span>
              <p className="text-lg font-display font-extrabold text-slate-800">
                {incoming > 0 ? `${((outgoing / incoming) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 font-bold text-xs">
              %
            </div>
          </div>
        </div>

        {/* Charts & Allocations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart: Alokasi Pengeluaran (Tujuan Penggunaan) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Tujuan Penggunaan Dana</h3>
              <p className="text-xs text-slate-500 mb-4">Rincian penggunaan kas berdasarkan kategori program dakwah & sosial</p>
            </div>
            
            {pieData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Labels Legend */}
                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-600 text-[11px] font-medium truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{formatRupiah(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">Belum ada data pengeluaran</p>
            )}
          </div>

          {/* Bar Chart: Arus Kas Bulanan */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Arus Keuangan Bulanan (Tingkat MWCNU)</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik komparasi bulanan antara saldo masuk, saldo keluar, dan saldo tersisa</p>
            </div>

            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} formatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                    <Bar dataKey="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Keluar" fill="#ef4444" radius={[0, 0, 4, 4]} />
                    <Line type="monotone" dataKey="Saldo" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">Belum ada tren data bulanan</p>
            )}
          </div>
        </div>

        {/* Transactions ledger */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Buku Transparansi Arus Kas Terkini</h3>
              <span className="text-[10px] text-slate-400 font-mono italic">Semua data terverifikasi auditor internal</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Kategori</th>
                    <th className="px-5 py-3">Tujuan / Rincian Keterangan</th>
                    <th className="px-5 py-3">PJ (PIC)</th>
                    <th className="px-5 py-3">Pemasukan (Masuk)</th>
                    <th className="px-5 py-3 text-right">Pengeluaran (Keluar)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kasList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-slate-500 font-mono font-medium">{k.date}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-700">{k.category}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 truncate max-w-[200px]" title={k.description}>
                        {k.description}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-semibold">{k.pic || '-'}</td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600">
                        {k.type === 'Masuk' ? formatRupiah(k.amount) : '-'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-red-600 text-right">
                        {k.type === 'Keluar' ? formatRupiah(k.amount) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Audited: Juni 2026</span>
            <button className="text-tosca-700 font-semibold hover:underline flex items-center space-x-1">
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Laporan PDF</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 5: KOIN S3 (LAZISNU)
  // ==========================================
  const renderKoinS3 = () => {
    const selectedRanting = koinSelectedRanting;
    const setSelectedRanting = setKoinSelectedRanting;

    const availableMonths = Array.from(new Set(koinList.map(k => k.month))).sort();

    const formatMonthLabel = (mLabel: string) => {
      if (!mLabel) return '';
      const [year, month] = mLabel.split('-');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const mIdx = parseInt(month, 10) - 1;
      return `${monthNames[mIdx] || month} ${year}`;
    };

    const filteredKoin = koinList.filter(k => {
      const matchRanting = selectedRanting === 'Semua' || k.rantingId === selectedRanting;
      const matchMonth = koinSelectedMonth === 'Semua' || k.month === koinSelectedMonth;
      return matchRanting && matchMonth;
    });

    const totalCollected = filteredKoin.reduce((sum, k) => sum + k.amount, 0);
    const totalDistributed = filteredKoin.reduce((sum, k) => sum + k.distributionAmount, 0);
    const totalBalance = totalCollected - totalDistributed;

    // 1. Prepare Ranting NU Accumulation Data - show all rantings and support month filtering
    const rantingSummaryData = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const rantingEntries = koinList.filter(k => {
          const matchRanting = k.rantingId === r.id;
          const matchMonth = koinSelectedMonth === 'Semua' || k.month === koinSelectedMonth;
          return matchRanting && matchMonth;
        });
        const collected = rantingEntries.reduce((sum, k) => sum + k.amount, 0);
        const distributed = rantingEntries.reduce((sum, k) => sum + k.distributionAmount, 0);
        const balance = collected - distributed;
        return {
          id: r.id,
          name: r.name.replace('PRNU ', ''),
          Perolehan: collected,
          Penyaluran: distributed,
          Saldo: balance
        };
      });

    // 2. Prepare Month NU Accumulation Data (for trend when single ranting is selected)
    // Always show full trend across all months for a single ranting, ignoring the monthly filter
    const trendKoin = koinList.filter(k => selectedRanting === 'Semua' || k.rantingId === selectedRanting);
    const monthlyRantingSummary = trendKoin.reduce((acc: { [key: string]: { collected: number; distributed: number } }, cur) => {
      if (!acc[cur.month]) {
        acc[cur.month] = { collected: 0, distributed: 0 };
      }
      acc[cur.month].collected += cur.amount;
      acc[cur.month].distributed += cur.distributionAmount;
      return acc;
    }, {});

    const monthlyChartData = Object.keys(monthlyRantingSummary).sort().map(month => ({
      name: month,
      Perolehan: monthlyRantingSummary[month].collected,
      Penyaluran: monthlyRantingSummary[month].distributed,
      Saldo: monthlyRantingSummary[month].collected - monthlyRantingSummary[month].distributed
    }));

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Banner Gerakan */}
        <section className="bg-gradient-to-r from-emerald-800 to-tosca-700 text-white rounded-2xl p-5 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md shadow-emerald-50/50">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-tosca-200">GERAKAN KOIN S3 LAZISNU</span>
            <h2 className="text-xl md:text-2xl font-display font-extrabold tracking-tight">Koin Sehari Seribu (S3)</h2>
            <p className="text-xs md:text-sm text-slate-100">
              Melalui gerakan kemandirian ini, koin kecil yang terkumpul dari seluruh keluarga Nahdliyin diseluruh Ranting NU se-Kecamatan Bungah diubah menjadi kekuatan sosial ekonomi dakwah yang maslahat untuk warga prasejahtera.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-tosca-200 uppercase font-bold tracking-wider animate-pulse">AKUMULASI S/D JUNI 2026</span>
            <p className="text-2xl font-display font-extrabold text-white mt-1">{formatRupiah(koinList.reduce((sum, k) => sum + k.amount, 0))}</p>
          </div>
        </section>

        {/* Filter & Summary Cards */}
        <div className="space-y-4">
          <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter Ranting</span>
                <select
                  value={selectedRanting}
                  onChange={(e) => setSelectedRanting(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-slate-700 font-semibold"
                >
                  <option value="Semua">Semua Ranting Desa (Tingkat MWCNU)</option>
                  {rantings.filter(r => r.id !== 'mwc').map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter Bulan</span>
                <select
                  value={koinSelectedMonth}
                  onChange={(e) => setKoinSelectedMonth(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-slate-700 font-semibold"
                >
                  <option value="Semua">Semua Bulan</option>
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{formatMonthLabel(m)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <span className="text-[10px] text-slate-400 font-mono font-bold">
              Status Laporan: <span className="text-emerald-600">AKTIF WAJIB BULANAN</span>
            </span>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Perolehan</span>
                <p className="text-lg font-display font-extrabold text-tosca-700">{formatRupiah(totalCollected)}</p>
              </div>
              <div className="p-2.5 bg-tosca-50 rounded-xl text-tosca-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Penyaluran (Tasaruf)</span>
                <p className="text-lg font-display font-extrabold text-amber-600">{formatRupiah(totalDistributed)}</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sisa Saldo</span>
                <p className="text-lg font-display font-extrabold text-emerald-600">{formatRupiah(totalBalance)}</p>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rasio Tasaruf</span>
                <p className="text-lg font-display font-extrabold text-slate-800">
                  {totalCollected > 0 ? `${((totalDistributed / totalCollected) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 font-bold text-xs">
                %
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {selectedRanting === 'Semua' ? (
          <div className="flex flex-col gap-6">
            {/* Chart 1: Perolehan vs Penyaluran Per Ranting */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Perolehan vs Penyaluran per Ranting NU</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik komparasi total dana koin S3 yang dihimpun dan ditasharufkan</p>
              {rantingSummaryData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rantingSummaryData} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 8 }} 
                        interval={0} 
                        angle={-45} 
                        textAnchor="end" 
                        height={75}
                      />
                      <YAxis tick={{ fontSize: 9 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="Perolehan" fill="#0d9488" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Penyaluran" fill="#d97706" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data ranting</p>
              )}
            </div>

            {/* Chart 2: Saldo Koin S3 Per Ranting */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Saldo Kas S3 per Ranting NU</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik sisa saldo simpanan koin S3 aktif di kas masing-masing ranting</p>
              {rantingSummaryData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rantingSummaryData} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 8 }} 
                        interval={0} 
                        angle={-45} 
                        textAnchor="end" 
                        height={75}
                      />
                      <YAxis tick={{ fontSize: 9 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="Saldo" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data ranting</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart for specific ranting: Monthly trend */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Tren Bulanan Perolehan & Penyaluran</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik transparansi setoran koin S3 bulanan untuk {getRantingName(selectedRanting)}</p>
              {monthlyChartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Perolehan" fill="#0d9488" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Penyaluran" fill="#d97706" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data bulanan</p>
              )}
            </div>

            {/* Chart for specific ranting: Cumulative Monthly Saldo */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Perkembangan Sisa Saldo Bulanan</h3>
              <p className="text-xs text-slate-500 mb-4">Visualisasi tren saldo tersimpan untuk {getRantingName(selectedRanting)}</p>
              {monthlyChartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Saldo" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data bulanan</p>
              )}
            </div>
          </div>
        )}

        {/* Laporan Akumulasi per Ranting (Tingkat MWCNU) - requested by user */}
        {selectedRanting === 'Semua' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Laporan Akumulasi Koin S3 Tingkat Ranting se-MWCNU Bungah</span>
              <span className="text-[10px] text-slate-400 font-mono">Tahun Buku 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="px-6 py-3">Nama Ranting Desa</th>
                    <th className="px-6 py-3">Total Perolehan</th>
                    <th className="px-6 py-3">Total Penyaluran</th>
                    <th className="px-6 py-3">Rasio Tasaruf</th>
                    <th className="px-6 py-3 text-right">Sisa Saldo Kas Ranting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rantingSummaryData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 font-medium">
                      <td className="px-6 py-3.5 text-slate-800 font-bold">{getRantingName(item.id)}</td>
                      <td className="px-6 py-3.5 text-tosca-700 font-bold">{formatRupiah(item.Perolehan)}</td>
                      <td className="px-6 py-3.5 text-amber-600 font-semibold">{formatRupiah(item.Penyaluran)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" style={{ width: `${Math.min((item.Penyaluran / item.Perolehan) * 100, 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-500">{((item.Penyaluran / item.Perolehan) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right text-emerald-700 font-bold font-mono">{formatRupiah(item.Saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Report Cards per Ranting & Month - requested by user */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-sm">Kartu Laporan Bulanan Ranting</h3>
            <span className="text-[10px] text-slate-400 font-mono">Menampilkan {filteredKoin.length} Laporan Transparan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKoin.map((k) => {
              const reportSaldo = k.amount - k.distributionAmount;
              const ratio = k.amount > 0 ? (k.distributionAmount / k.amount) * 100 : 0;
              return (
                <div key={k.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-200 transition-all p-5 space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                    <div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
                        {k.month}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">{getRantingName(k.rantingId)}</h4>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      Terlapor
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Pemasukan (Koin Masuk)</span>
                      <span className="font-bold text-tosca-700">{formatRupiah(k.amount)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Penyaluran (Tasaruf)</span>
                      <span className="font-bold text-amber-600">{formatRupiah(k.distributionAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-50 pt-2.5">
                      <span className="font-bold text-slate-700">Sisa Saldo</span>
                      <span className="font-extrabold text-emerald-600 font-mono">{formatRupiah(reportSaldo)}</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 space-y-1 border border-slate-100 mt-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Tujuan & Sasaran Penyaluran</span>
                      <p className="text-xs text-slate-700 italic font-medium leading-relaxed">&ldquo;{k.distributionTarget}&rdquo;</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Efisiensi Penyaluran</span>
                        <span className="font-bold text-slate-600">{ratio.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-1.5" style={{ width: `${Math.min(ratio, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredKoin.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-slate-100 rounded-2xl py-12 text-center text-slate-400 text-xs font-semibold">
                Belum ada data laporan koin S3 yang terdaftar untuk ranting ini.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 6: PERSURATAN
  // ==========================================
  const renderPersuratan = () => {
    const searchQuery = persuratanSearchQuery;
    const setSearchQuery = setPersuratanSearchQuery;
    const selectedType = persuratanSelectedType;
    const setSelectedType = setPersuratanSelectedType;

    const filteredSurat = suratList.filter(s => {
      const matchesType = selectedType === 'Semua' || s.type === selectedType;
      const matchesSearch = s.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.senderOrRecipient.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-1">
            {(['Semua', 'Masuk', 'Keluar'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${selectedType === type 
                    ? 'bg-tosca-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {type === 'Semua' ? 'Semua Surat' : `Surat ${type}`}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor surat, perihal, pengirim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="px-6 py-3">No. Surat</th>
                  <th className="px-6 py-3">Klasifikasi</th>
                  <th className="px-6 py-3">Jenis</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Pengirim / Penerima</th>
                  <th className="px-6 py-3">Perihal</th>
                  <th className="px-6 py-3">Tembusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSurat.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{s.letterNumber}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-600">{s.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                        ${s.type === 'Masuk' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{s.date}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">{s.senderOrRecipient}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{s.subject}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 italic truncate max-w-[150px]">{s.tembusan || '-'}</td>
                  </tr>
                ))}

                {filteredSurat.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Surat tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 7: USAHA JAMIYAH
  // ==========================================
  const renderUsaha = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="font-bold text-gray-900 mb-2 text-sm">Kemandirian Ekonomi Nahdliyin</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Untuk membiayai operasional organisasi dan dakwah tanpa terus bergantung pada sumbangan, MWC NU Bungah mendorong pembentukan unit-unit usaha otonom berbasis syariah dan kemitraan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usahaList.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                {u.imageUrl && (
                  <img 
                    src={u.imageUrl} 
                    alt={u.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-40 object-cover bg-slate-50" 
                  />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-tosca-700 bg-tosca-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {u.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                      ${u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {u.status}
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold text-slate-800 leading-snug">{u.name}</h4>
                  
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{u.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Penggerak: <strong className="text-slate-700 font-semibold">{u.manager}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimasi Omzet Bulanan</span>
                <span className="text-sm font-bold text-tosca-700 font-mono">{u.revenue > 0 ? formatRupiah(u.revenue) : 'Rp 0 (Offline)'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 8: SARANA IBADAH
  // ==========================================
  const renderSaranaIbadah = () => {
    const rantingSaranaStats = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const ibadahCount = saranaIbadahList.filter(si => si.rantingId === r.id).length;
        const pendidikanCount = saranaPendidikanList.filter(sp => sp.rantingId === r.id).length;
        return {
          id: r.id,
          name: r.name,
          ibadahCount,
          pendidikanCount,
          total: ibadahCount + pendidikanCount
        };
      })
      .filter(stat => stat.total > 0);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-5.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Inventarisasi Rumah Ibadah NU</h3>
            <p className="text-xs text-slate-500">Pendataan masjid, musholla, takmir, legalitas tanah, dan afiliasi amaliyah Aswaja.</p>
          </div>
          <span className="text-xs bg-tosca-50 text-tosca-700 font-bold px-3 py-1.5 rounded-xl border border-tosca-100">
            Total Tercatat: {saranaIbadahList.length} Sarana
          </span>
        </div>

        {/* Per-Ranting Distribution Cards */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Map className="w-4 h-4 text-tosca-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Distribusi Sarana per Ranting Desa</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {rantingSaranaStats.map(stat => (
              <div key={stat.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:border-tosca-200 hover:bg-tosca-50/10 transition-all">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider truncate" title={stat.name}>
                  {stat.name.replace('PRNU ', '')}
                </span>
                <div className="mt-2.5 flex justify-center space-x-2.5 text-xs">
                  <div className="text-center">
                    <span className="font-extrabold text-tosca-700 block">{stat.ibadahCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Ibadah</span>
                  </div>
                  <div className="border-r border-slate-200 h-5 my-auto" />
                  <div className="text-center">
                    <span className="font-extrabold text-emerald-700 block">{stat.pendidikanCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Sekolah</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {saranaIbadahList.map((si) => (
            <div key={si.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div>
                    <span className="text-[10px] bg-tosca-50 text-tosca-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {si.type}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 leading-snug mt-1">{si.name}</h4>
                  </div>
                  <Building className="w-5 h-5 text-slate-300" />
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Ketua Takmir</span>
                    <span className="font-bold text-slate-700">{si.takmir}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Asal Ranting</span>
                    <span className="font-bold text-slate-700">{getRantingName(si.rantingId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Imam Utama 1</span>
                    <span className="font-medium text-slate-600">{si.imam1}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Imam Utama 2</span>
                    <span className="font-medium text-slate-600">{si.imam2}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Alamat Lengkap</span>
                    <span className="text-slate-600 flex items-center mt-0.5"><MapPin className="w-3.5 h-3.5 text-slate-300 mr-1 shrink-0" />{si.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3.5 border-t border-slate-100 text-[10px] flex items-center justify-between rounded-b-2xl mt-4">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-600 font-bold">Status Wakaf: <strong className="text-slate-800">{si.landStatus}</strong></span>
                </div>
                <span className={`px-2 py-0.5 rounded font-bold
                  ${si.nuAffiliation === 'Milik NU' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {si.nuAffiliation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 9: SARANA PENDIDIKAN
  // ==========================================
  const renderSaranaPendidikan = () => {
    const rantingSaranaStats = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const ibadahCount = saranaIbadahList.filter(si => si.rantingId === r.id).length;
        const pendidikanCount = saranaPendidikanList.filter(sp => sp.rantingId === r.id).length;
        return {
          id: r.id,
          name: r.name,
          ibadahCount,
          pendidikanCount,
          total: ibadahCount + pendidikanCount
        };
      })
      .filter(stat => stat.total > 0);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-5.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Lembaga Pendidikan Ma&apos;arif NU</h3>
            <p className="text-xs text-slate-500">Kondisi fisik gedung, pimpinan, jenjang madrasah, dan statistik siswa se-Kecamatan Bungah.</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-100">
            Total Tercatat: {saranaPendidikanList.length} Sekolah
          </span>
        </div>

        {/* Per-Ranting Distribution Cards */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Map className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Distribusi Sarana per Ranting Desa</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {rantingSaranaStats.map(stat => (
              <div key={stat.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:border-emerald-200 hover:bg-emerald-50/10 transition-all">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider truncate" title={stat.name}>
                  {stat.name.replace('PRNU ', '')}
                </span>
                <div className="mt-2.5 flex justify-center space-x-2.5 text-xs">
                  <div className="text-center">
                    <span className="font-extrabold text-tosca-700 block">{stat.ibadahCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Ibadah</span>
                  </div>
                  <div className="border-r border-slate-200 h-5 my-auto" />
                  <div className="text-center">
                    <span className="font-extrabold text-emerald-700 block">{stat.pendidikanCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Sekolah</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {saranaPendidikanList.map((sp) => (
            <div key={sp.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider mr-1.5">
                      {sp.level}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-semibold">
                      {sp.status}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 leading-snug mt-1.5">{sp.name}</h4>
                  </div>
                  <BookOpen className="w-5 h-5 text-slate-300" />
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Kepala Sekolah / Pimpinan</span>
                    <span className="font-bold text-slate-700">{sp.principal}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Jumlah Siswa</span>
                    <span className="font-bold text-slate-700 font-mono">{sp.studentCount} Siswa</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Hubungi Telp</span>
                    <span className="text-slate-600 font-mono">{sp.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Kondisi Bangunan</span>
                    <span className={`font-semibold flex items-center space-x-1
                      ${sp.condition === 'Baik' ? 'text-emerald-600' : sp.condition === 'Butuh Renovasi' ? 'text-red-600 font-bold' : 'text-amber-600'}`}>
                      {sp.condition === 'Baik' ? <CheckCircle className="w-3.5 h-3.5 inline mr-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 inline mr-0.5" />}
                      <span>{sp.condition}</span>
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Alamat Lembaga</span>
                    <span className="text-slate-600 flex items-center mt-0.5"><MapPin className="w-3.5 h-3.5 text-slate-300 mr-1 shrink-0" />{sp.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-100 text-[10px] text-slate-500 rounded-b-2xl mt-4">
                Asal Ranting: <strong className="text-slate-700">{getRantingName(sp.rantingId)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 10: BERITA / NEWS
  // ==========================================
  const renderBerita = () => {
    // If viewing single news
    if (selectedNewsId) {
      const item = beritaList.find(b => b.id === selectedNewsId);
      if (!item) {
        setSelectedNewsId(null);
        return null;
      }

      return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-fadeIn space-y-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <button 
              onClick={() => setSelectedNewsId(null)}
              className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl shadow-2xs transition-all flex items-center space-x-1"
            >
              <span>← Kembali ke Daftar Berita</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">Diposting: {item.date}</span>
          </div>

          <div className="px-6 md:px-12 py-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-tosca-700 bg-tosca-50 px-2 py-1 rounded uppercase tracking-wider">
                {item.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 leading-tight">
                {item.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span>Penulis: <strong className="font-bold text-slate-700">{item.author}</strong></span>
                  <span>•</span>
                  <span>MWC NU Bungah Media</span>
                </div>
                {item.driveUrl && (
                  <a 
                    href={item.driveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Buka Drive Foto Berita</span>
                  </a>
                )}
              </div>
            </div>

            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover rounded-2xl bg-slate-50 border border-gray-100" 
              />
            )}

            {/* Custom Simple Markdown Renderer */}
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-4 max-w-4xl border-t border-slate-100 pt-6">
              {item.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('# ')) {
                  return <h2 key={pIdx} className="text-xl md:text-2xl font-bold text-slate-800 mt-6 mb-2">{trimmed.slice(2)}</h2>;
                }
                if (trimmed.startsWith('## ')) {
                  return <h3 key={pIdx} className="text-lg md:text-xl font-bold text-slate-800 mt-4 mb-2">{trimmed.slice(3)}</h3>;
                }
                if (trimmed.startsWith('> ')) {
                  return <blockquote key={pIdx} className="border-l-4 border-tosca-500 pl-4 italic text-slate-600 bg-tosca-50/50 py-2 rounded-r-lg my-4">{trimmed.slice(2)}</blockquote>;
                }
                if (trimmed.startsWith('1. ') || trimmed.startsWith('* ')) {
                  return (
                    <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-3 text-sm">
                      {trimmed.split('\n').map((li, lIdx) => (
                        <li key={lIdx} className="text-slate-700">{li.replace(/^(\d+\.|\*)\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                // Handle bold texts
                const parts = trimmed.split('**');
                if (parts.length > 1) {
                  return (
                    <p key={pIdx} className="text-slate-700">
                      {parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{p}</strong> : p)}
                    </p>
                  );
                }
                return <p key={pIdx} className="text-slate-700">{trimmed}</p>;
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritaList.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-tosca-200 hover:shadow-xs transition-all cursor-pointer group"
              onClick={() => setSelectedNewsId(item.id)}
            >
              <div>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover bg-slate-50 group-hover:scale-[1.015] transition-transform duration-300" 
                  />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-tosca-700 bg-tosca-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug group-hover:text-tosca-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-3">
                    {item.content.replace(/[#*`>]/g, '').slice(0, 150)}...
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3 border-t border-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Oleh: <strong className="text-slate-700 font-semibold">{item.author}</strong></span>
                <span className="text-tosca-600 font-bold group-hover:translate-x-1 transition-transform">Baca Selengkapnya →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 11: DOKUMENTASI / GALLERY
  // ==========================================
  const renderDokumentasi = () => {
    const selectedCategory = gallerySelectedCategory;
    const setSelectedCategory = setGallerySelectedCategory;

    const filteredGallery = dokumentasiList.filter(d => {
      return selectedCategory === 'Semua' || d.category === selectedCategory;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex-wrap gap-2">
          <div className="flex space-x-1">
            {['Semua', 'Kegiatan', 'Rapat', 'Pelantikan', 'Harlah'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${selectedCategory === cat 
                    ? 'bg-tosca-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-bold font-mono">Tercatat {filteredGallery.length} Media</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow group">
              <div className="relative overflow-hidden">
                <img 
                  src={d.url} 
                  alt={d.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover bg-slate-50 group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-md">
                  {d.category}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">{d.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>{d.date}</span>
                  <span className="text-tosca-600 font-bold uppercase">{d.type}</span>
                </div>
              </div>
              {d.driveUrl && (
                <div className="px-4 pb-4">
                  <a 
                    href={d.driveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[10px] py-2 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Lihat Album Drive</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 12: KONTAK & ASPIRASI
  // ==========================================
  const renderKontak = () => {
    // Local form states (bound to top-level lifted states to respect Rules of Hooks)
    const name = contactName;
    const setName = setContactName;
    const phone = contactPhone;
    const setPhone = setContactPhone;
    const email = contactEmail;
    const setEmail = setContactEmail;
    const rantingId = contactRantingId;
    const setRantingId = setContactRantingId;
    const subject = contactSubject;
    const setSubject = setContactSubject;
    const message = contactMessage;
    const setMessage = setContactMessage;
    const submitted = contactSubmitted;
    const setSubmitted = setContactSubmitted;
    const errorMsg = contactErrorMsg;
    const setErrorMsg = setContactErrorMsg;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !phone || !subject || !message) {
        setErrorMsg('Harap isi field wajib: Nama, No. Telp, Subjek, dan Pesan!');
        return;
      }
      setErrorMsg('');
      addAspirasi({
        name,
        phone,
        email: email || undefined,
        rantingId,
        subject,
        message
      });
      setSubmitted(true);
      // Reset fields
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');

      // Auto-clear success message after 5s
      setTimeout(() => setSubmitted(false), 5000);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeIn">
        {/* Contact Info & Mock Google Maps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Office Cards */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Sekretariat MWC NU Bungah</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Silakan kunjungi kantor pelayanan kami atau hubungi nomor kontak pengurus di bawah ini untuk layanan administrasi wakaf, rekomendasi kependidikan, dan LAZISNU.
            </p>

            <div className="space-y-3.5 text-xs text-slate-600 pt-2">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-tosca-600 shrink-0 mt-0.5" />
                <span>Gedung MWC NU Bungah Lt. 1-2, Jl. Raya Bungah No. 100, Kecamatan Bungah, Kabupaten Gresik, Jawa Timur, 61151</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-tosca-600" />
                <span className="font-mono">031-3948111 / 0812-3456-7802</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-tosca-600" />
                <span className="font-mono">mwc.bungah@nu.or.id</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Google Maps Styled in Green/Tosca */}
          <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Map className="w-4 h-4 text-tosca-600" />
                <span>Peta Lokasi Kantor MWC NU</span>
              </span>
              <span className="text-[10px] text-slate-400">Desa Bungah, Gresik</span>
            </div>

            {/* Custom styled clean map mockup */}
            <div className="h-56 bg-emerald-50/50 rounded-xl relative overflow-hidden border border-slate-100 flex items-center justify-center">
              {/* Abstract Map Lines representing rural streets */}
              <div className="absolute inset-0 opacity-15">
                <div className="absolute top-1/4 left-0 right-0 h-4 bg-slate-800 transform -rotate-6" />
                <div className="absolute bottom-1/3 left-0 right-0 h-6 bg-slate-800 transform rotate-12" />
                <div className="absolute left-1/3 top-0 bottom-0 w-5 bg-slate-800 transform -rotate-12" />
                <div className="absolute right-1/4 top-0 bottom-0 w-8 bg-slate-800 transform rotate-45" />
              </div>

              {/* Waterway representation (Bengawan Solo River next to Bungah) */}
              <div className="absolute right-0 bottom-0 top-0 w-16 bg-blue-100/50 -rotate-12 flex items-center justify-center">
                <span className="text-[8px] text-blue-400 font-mono tracking-widest uppercase rotate-90">S. BENGAWAN SOLO</span>
              </div>

              {/* Surrounding landmarks */}
              <div className="absolute top-4 left-6 text-[9px] bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-2xs font-bold text-slate-500">
                Alun-Alun Bungah
              </div>
              <div className="absolute bottom-6 right-24 text-[9px] bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-2xs font-bold text-slate-500">
                Jl. Raya Bungah-Gresik
              </div>

              {/* Pinpoint */}
              <div className="absolute flex flex-col items-center justify-center text-center animate-bounce">
                <MapPin className="w-8 h-8 text-tosca-700 fill-tosca-100" />
                <div className="mt-1 bg-tosca-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  Gedung MWC NU Bungah
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Aspiration Input form */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 text-base">Form Aspirasi & Pengaduan Warga</h3>
            <p className="text-xs text-slate-500 mt-1">
              Punya keluhan sarana ibadah rusak, butuh pendampingan sertifikasi wakaf, atau masukan program? Salurkan aspirasi Anda di sini. Aspirasi Anda akan masuk langsung ke dashboard CMS Pengurus MWC NU untuk segera diproses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span>Terima kasih! Aspirasi Anda berhasil dikirim dan tersimpan di database lokal. Pengurus akan segera memverifikasi laporan Anda.</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2.5">
                <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap (Wajib) *</label>
                <input
                  type="text"
                  placeholder="Ketik nama Anda..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nomor Telepon / WA (Wajib) *</label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Alamat Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="nama@email.com..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pilih Ranting Domisili Desa</label>
                <select
                  value={rantingId}
                  onChange={(e) => setRantingId(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
                >
                  {rantings.filter(r => r.id !== 'mwc').map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Subjek Aspirasi *</label>
              <input
                type="text"
                placeholder="Contoh: Pengaduan Atap Musholla Bocor / Bantuan Sosial..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Isi Pesan Lengkap *</label>
              <textarea
                rows={5}
                placeholder="Tuliskan secara detail perihal laporan atau aspirasi yang ingin disampaikan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 leading-relaxed font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-tosca-600 hover:bg-tosca-700 font-semibold text-white rounded-xl shadow-md transition-all text-xs flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Aspirasi Publik</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Main Page Router
  switch (activeTab) {
    case 'home': return renderHome();
    case 'profil': return renderProfil();
    case 'kader': return renderKader();
    case 'kegiatan': return renderKegiatan();
    case 'keuangan': return renderKeuangan();
    case 'koin_s3': return renderKoinS3();
    case 'persuratan': return renderPersuratan();
    case 'usaha': return renderUsaha();
    case 'sarana_ibadah': return renderSaranaIbadah();
    case 'sarana_pendidikan': return renderSaranaPendidikan();
    case 'berita': return renderBerita();
    case 'dokumentasi': return renderDokumentasi();
    case 'kontak': return renderKontak();
    default: return renderHome();
  }
}
