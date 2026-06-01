import React from 'react';
import { 
  Users, 
  MapPin, 
  Briefcase, 
  Award, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieIcon, 
  ArrowRight,
  ShieldCheck, 
  FileText
} from 'lucide-react';
import { AnggotaPengurus, TransaksiKeuangan, ProgramKerja, SuratKeluar } from '../types';

interface DashboardProps {
  anggotaList: AnggotaPengurus[];
  transaksiList: TransaksiKeuangan[];
  programList: ProgramKerja[];
  suratKeluarList: SuratKeluar[];
  rantingCount: number;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({
  anggotaList,
  transaksiList,
  programList,
  suratKeluarList,
  rantingCount,
  onNavigate
}: DashboardProps) {
  // Calculations
  const totalAnggota = anggotaList.length;
  const totalPengurus = anggotaList.filter(a => a.struktur === 'Pengurus Harian').length;
  const programBerjalan = programList.filter(p => p.status === 'Berjalan').length;
  const kegiatanTahunIni = programList.reduce((acc, curr) => acc + (curr.status === 'Selesai' ? 1 : 0) + curr.kegiatanTerbantu.length, 0);
  
  // Financial arithmetic
  const approvedTx = transaksiList.filter(t => t.status === 'Disetujui');
  const totalPemasukan = approvedTx
    .filter(t => t.tipe === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalPengeluaran = approvedTx
    .filter(t => t.tipe === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const kasSekarang = totalPemasukan - totalPengeluaran;

  // Percentage of documented reports submission
  const totalSurat = suratKeluarList.length;
  const suratArchived = suratKeluarList.filter(s => s.status === 'Diarsipkan' || s.status === 'Disetujui Ketua').length;
  const persentaseArsip = totalSurat > 0 ? Math.round((suratArchived / totalSurat) * 100) : 100;

  // Formatter for Currency
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Helper for generating points on custom SVG charts
  const memberHistory = [65, 82, 110, 145, 178, totalAnggota + 140]; // simulated monthly trend
  const maxAnggota = Math.max(...memberHistory);
  const minAnggota = Math.min(...memberHistory);
  const svgWidth = 400;
  const svgHeight = 120;
  
  const points = memberHistory.map((val, idx) => {
    const x = (idx / (memberHistory.length - 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - 15 - ((val - minAnggota) / (maxAnggota - minAnggota || 1)) * (svgHeight - 40);
    return `${x},${y}`;
  }).join(' ');

  // Categorized Income Breakdown
  const categories = ['Iuran', 'Donasi', 'Hibah', 'Usaha'];
  const incomeByCategory = categories.map(cat => ({
    name: cat,
    val: approvedTx.filter(t => t.tipe === 'Pemasukan' && t.kategori === cat).reduce((acc, curr) => acc + curr.jumlah, 0)
  }));
  const maxCatVal = Math.max(...incomeByCategory.map(c => c.val)) || 1;

  return (
    <div className="space-y-6" id="dashboard-main-view">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900 text-white p-6 rounded-2xl shadow-sm border border-emerald-800">
        <div>
          <h1 className="text-2xl font-serif font-black tracking-tight text-[#D4AF37]">MWCNU BUNGAH</h1>
          <p className="text-emerald-200 text-sm mt-1">
            Sistem Tata Kelola Administrasi Elektronik, Transparansi Keuangan, dan Pengambilan Keputusan Majelis Wakil Cabang Nahdlatul Ulama.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-800/80 px-4 py-2 rounded-xl text-xs md:text-sm shadow-inner self-start md:self-auto border border-emerald-700">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Sistem Resmi Terverifikasi</span>
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-start gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <span className="text-gray-500 text-xs font-medium block">Ranting Aktif</span>
            <span className="text-2xl font-mono font-bold text-gray-900 block mt-0.5">{rantingCount}</span>
            <span className="text-emerald-600 text-xxs font-medium block mt-1 hover:underline cursor-pointer" onClick={() => onNavigate('gis')}>Lihat Peta Ranting &rarr;</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-start gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-gray-500 text-xs font-medium block">Database Kader</span>
            <span className="text-2xl font-mono font-bold text-gray-900 block mt-0.5">{totalAnggota}</span>
            <span className="text-gray-400 text-xxs block mt-1">Harian: {totalPengurus} Pengurus</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-start gap-3">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-700">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-gray-500 text-xs font-medium block">Program Aktif</span>
            <span className="text-2xl font-mono font-bold text-gray-900 block mt-0.5">{programBerjalan}</span>
            <span className="text-indigo-600 text-xxs font-medium block mt-1">Kegiatan berjalan: {kegiatanTahunIni}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-start gap-3">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-700">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <span className="text-gray-500 text-xs font-medium block">Kas Konsolidasi</span>
            <span className="text-lg md:text-xl font-mono font-bold text-amber-600 truncate block mt-0.5">{formatIDR(kasSekarang)}</span>
            <span className="text-gray-400 text-xxs block mt-1 truncate">Pemasukan: {formatIDR(totalPemasukan)}</span>
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Perkembangan Anggota (Custom SVG) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-medium text-sm text-gray-700">Perkembangan Anggota (KARTANU)</h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 py-0.5 px-2 rounded-full font-medium">Bulan Ini +{totalAnggota - 3}</span>
          </div>
          <div className="relative mt-2">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto text-emerald-600 bg-emerald-50/20 rounded-xl p-2 border border-emerald-50/50">
              {/* Grid Lines */}
              <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="#E5E7EB" strokeDasharray="3,3" />
              <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="#E5E7EB" strokeDasharray="3,3" />
              <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="#E5E7EB" strokeDasharray="3,3" />
              
              {/* Connection Line */}
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              
              {/* Dots & Labels */}
              {memberHistory.map((val, idx) => {
                const x = (idx / (memberHistory.length - 1)) * (svgWidth - 40) + 20;
                const y = svgHeight - 15 - ((val - minAnggota) / (maxAnggota - minAnggota || 1)) * (svgHeight - 40);
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" className="fill-white stroke-emerald-600 stroke-2" />
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10" className="font-mono fill-gray-600 font-bold">
                      {val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-xxs text-gray-400 mt-3 text-center">Data kumulatif pendaftaran KARTANU pintar 6 bulan terakhir</p>
        </div>

        {/* Chart 2: Keuangan Organisasi */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-medium text-sm text-gray-700">Profil Pemasukan Bulanan</h3>
            <span className="text-xs text-gray-400">Arus Kas Resmi</span>
          </div>

          <div className="space-y-3 mt-4">
            {incomeByCategory.map((category, index) => {
              const pct = Math.round((category.val / maxCatVal) * 100) || 3;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">{category.name}</span>
                    <span className="font-mono text-gray-900">{formatIDR(category.val)}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Program Rate & Fast Links */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-medium text-sm text-gray-700">Kelancaran Administrasi</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              <span>{persentaseArsip}% Arsip</span>
            </div>
          </div>

          <div className="flex flex-col h-[150px] justify-between">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Dokumen Terarsip Hijau</span>
                <span>{suratArchived} / {totalSurat} Surat Keluar</span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-emerald-100">
                  <div 
                    style={{ width: `${persentaseArsip}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-600 font-bold transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => onNavigate('surat')} 
                className="flex items-center gap-1.5 justify-center py-2 px-3 text-xxs font-medium bg-emerald-50 text-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100"
              >
                <FileText className="h-3 w-3" />
                <span>Buat Surat</span>
              </button>
              <button 
                onClick={() => onNavigate('anggota')} 
                className="flex items-center gap-1.5 justify-center py-2 px-3 text-xxs font-medium bg-indigo-50 text-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                <Users className="h-3 w-3" />
                <span>Cetak Kartu</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Program Kerja Realisasi & Kegiatan Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Program Highlights */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <h3 className="font-sans font-semibold text-sm text-gray-800">Progres Kegiatan Prioritas</h3>
            </div>
            <button 
              onClick={() => onNavigate('program')} 
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Semua Program</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {programList.slice(0, 3).map((prog) => {
              const progressColor = 
                prog.status === 'Selesai' ? 'bg-emerald-600' :
                prog.status === 'Berjalan' ? 'bg-indigo-600' : 'bg-amber-500';

              return (
                <div key={prog.id} className="py-3 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-[70%]">
                    <span className="text-xs font-semibold text-gray-800 block leading-tight">{prog.nama}</span>
                    <span className="text-gray-400 text-xxs block leading-none">PJ: {prog.penanggungJawab}</span>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden block">
                      <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${prog.progress}%` }} />
                    </div>
                    <span className="text-xs font-mono text-gray-600 w-8 text-right font-semibold">{prog.progress}%</span>
                    <span className={`text-xxs px-2 py-0.5 rounded-full font-bold ${
                      prog.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' :
                      prog.status === 'Berjalan' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {prog.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Musyawarah dan Agenda Rapat Terbaru */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <h3 className="font-sans font-semibold text-sm text-gray-800">Sistem Musyawarah Kerja</h3>
            </div>
            <button 
              onClick={() => onNavigate('musyawarah')} 
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Buka Rapat</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="bg-emerald-50/30 border border-emerald-50 rounded-xl p-3 flex items-start gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-lg text-center min-w-[50px] font-mono">
              <span className="block text-xxs font-light">JUN</span>
              <span className="block text-lg font-bold leading-none">05</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xxs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-extrabold">BELUM MULAI</span>
                <span className="text-xxs text-gray-400">19:30 - 22:00 WIB</span>
              </div>
              <h4 className="text-xs font-semibold text-gray-800 leading-tight">Rapat Pleno Persiapan Bahtsul Masail Waqi’iyah Ke-6</h4>
              <p className="text-xxs text-gray-500">Membahas fatwa hukum khutbah jumat Generative AI & koin kripto syariah.</p>
              <div className="pt-2">
                <button 
                  onClick={() => onNavigate('musyawarah')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xxs px-3 py-1.5 rounded-lg font-medium shadow-xs"
                >
                  Lihat Rincian & Persiapan Voting
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
