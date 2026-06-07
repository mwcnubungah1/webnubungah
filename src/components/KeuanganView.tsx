import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  History,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  ChevronRight,
  Filter
} from 'lucide-react';
import { TransaksiKeuangan, UserRole } from '../types';
import CloudinaryUpload from './CloudinaryUpload';

interface KeuanganProps {
  transaksiList: TransaksiKeuangan[];
  role: UserRole;
  onAddTransaksi: (tx: Omit<TransaksiKeuangan, 'id' | 'auditTrail'>) => void;
  onUpdateTransaksi: (id: string, updates: Partial<TransaksiKeuangan>) => void;
}

export default function KeuanganView({
  transaksiList,
  role,
  onAddTransaksi,
  onUpdateTransaksi
}: KeuanganProps) {
  const [activeSubTab, setActiveSubTab] = useState<'buku-kas' | 'neraca' | 'persetujuan'>('buku-kas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Semua' | 'Pemasukan' | 'Pengeluaran'>('Semua');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [showAddTx, setShowAddTx] = useState(false);
  const [selectedTxAudit, setSelectedTxAudit] = useState<TransaksiKeuangan | null>(null);

  // Form states
  const [txTipe, setTxTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [txKategori, setTxKategori] = useState<TransaksiKeuangan['kategori']>('Iuran');
  const [txDeskripsi, setTxDeskripsi] = useState('');
  const [txJumlah, setTxJumlah] = useState<number>(0);
  const [txTanggal, setTxTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [uploadedBuktiUrl, setUploadedBuktiUrl] = useState('');

  const isAdminOrPresident = role === 'ADMIN_MWCNU' || role === 'KETUA';
  const isOfficer = role === 'SEKRETARIS' || role === 'ADMIN_MWCNU';

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const formatValueCompact = (value: number) => {
    if (Math.abs(value) >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
    }
    if (Math.abs(value) >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
    }
    if (Math.abs(value) >= 1_000) {
      return `Rp ${(value / 1_000).toFixed(0)} K`;
    }
    return `Rp ${value}`;
  };

  // Finance Aggregators
  const approvedTx = transaksiList.filter(t => t.status === 'Disetujui');
  const totalPemasukan = approvedTx
    .filter(t => t.tipe === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalPengeluaran = approvedTx
    .filter(t => t.tipe === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const kasSekarang = totalPemasukan - totalPengeluaran;
  const pendingTx = transaksiList.filter(t => t.status === 'Pending');

  // New Transaction Form Submission
  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDeskripsi || txJumlah <= 0) return;

    const initialStatus = 'Pending';

    onAddTransaksi({
      tanggal: txTanggal,
      tipe: txTipe,
      kategori: txKategori,
      deskripsi: txDeskripsi,
      jumlah: txJumlah,
      status: initialStatus,
      buktiUrl: uploadedBuktiUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=60'
    });

    // Reset Form
    setTxDeskripsi('');
    setTxJumlah(0);
    setUploadedBuktiUrl('');
    setShowAddTx(false);
  };

  // Trigger approvals (Ketua / Admin role)
  const handleApprove = (tx: TransaksiKeuangan) => {
    const updatedAudit = [
      ...tx.auditTrail,
      `Disetujui oleh ${role === 'KETUA' ? 'Ketua Tanfidziyah' : 'Administrator'} pada ${new Date().toISOString().split('T')[0]}`
    ];
    onUpdateTransaksi(tx.id, {
      status: 'Disetujui',
      disetujuiOleh: role === 'KETUA' ? 'H. Achmad Shofwan, S.Ag' : 'Admin Smart Governance',
      auditTrail: updatedAudit
    });
  };

  const handleDecline = (tx: TransaksiKeuangan) => {
    const updatedAudit = [
      ...tx.auditTrail,
      `Ditolak oleh ${role === 'KETUA' ? 'Ketua Tanfidziyah' : 'Administrator'} pada ${new Date().toISOString().split('T')[0]}`
    ];
    onUpdateTransaksi(tx.id, {
      status: 'Ditolak',
      auditTrail: updatedAudit
    });
  };

  // Filter & Search Logic
  const filteredLedger = transaksiList.filter(t => {
    const matchesSearch = t.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.kategori.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Semua' || t.tipe === filterType;
    const matchesKategori = filterKategori === 'Semua' || t.kategori === filterKategori;
    return matchesSearch && matchesType && matchesKategori;
  });

  // --- MODEL GRAFIK RENDERING CODE (SVG INTERACTIVE) ---
  const sortedApprovedTx = [...approvedTx].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  
  let currentAccum = 0;
  const rawChartPoints = sortedApprovedTx.map((tx) => {
    if (tx.tipe === 'Pemasukan') {
      currentAccum += tx.jumlah;
    } else {
      currentAccum -= tx.jumlah;
    }
    return {
      tanggal: tx.tanggal,
      deskripsi: tx.deskripsi,
      jumlah: tx.jumlah,
      tipe: tx.tipe,
      saldo: currentAccum,
      id: tx.id
    };
  });

  // Clean empty state fallback for line graph
  const chartPoints = rawChartPoints.length > 0 ? rawChartPoints : [
    { tanggal: '2026-05-01', deskripsi: 'Saldo Awal', jumlah: 0, tipe: 'Pemasukan', saldo: 0, id: 'INIT' },
    { tanggal: '2026-05-15', deskripsi: 'Simulasi Kas', jumlah: 15000000, tipe: 'Pemasukan', saldo: 15000000, id: 'INIT2' },
    { tanggal: '2026-05-28', deskripsi: 'Simulasi Penyaluran', jumlah: 5000000, tipe: 'Pengeluaran', saldo: 10000000, id: 'INIT3' }
  ];

  // SVG dimensions
  const chartWidth = 600;
  const chartHeight = 220;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const saldos = chartPoints.map(d => d.saldo);
  const maxSaldo = Math.max(...saldos, 100000);
  const minSaldo = Math.min(...saldos, 0);
  const rawRange = maxSaldo - minSaldo;
  const rangeBreather = rawRange === 0 ? 100000 : rawRange;
  
  const chartMax = maxSaldo + rangeBreather * 0.15;
  const chartMin = minSaldo < 0 ? minSaldo - rangeBreather * 0.15 : 0;
  const chartRange = chartMax - chartMin;

  const pathCoords = chartPoints.map((d, index) => {
    const x = paddingLeft + (chartPoints.length > 1 ? (index / (chartPoints.length - 1)) * (chartWidth - paddingLeft - paddingRight) : (chartWidth - paddingLeft - paddingRight) / 2);
    const ratio = (d.saldo - chartMin) / (chartRange || 1);
    const y = chartHeight - paddingBottom - ratio * (chartHeight - paddingTop - paddingBottom);
    return { ...d, x, y, index };
  });

  let linePathString = '';
  let areaPathString = '';
  if (pathCoords.length > 0) {
    linePathString = `M ${pathCoords[0].x} ${pathCoords[0].y} ` + pathCoords.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    areaPathString = `${linePathString} L ${pathCoords[pathCoords.length - 1].x} ${chartHeight - paddingBottom} L ${pathCoords[0].x} ${chartHeight - paddingBottom} Z`;
  }

  // Draw 4 auxiliary horizontal lines
  const gridLines = Array.from({ length: 4 }).map((_, i) => {
    const val = chartMin + (i / 3) * chartRange;
    const ratio = (val - chartMin) / (chartRange || 1);
    const y = chartHeight - paddingBottom - ratio * (chartHeight - paddingTop - paddingBottom);
    return { y, value: val };
  });

  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Get distinct categories to render filter options
  const existingCategories = Array.from(new Set(transaksiList.map(t => t.kategori)));

  return (
    <div className="space-y-6" id="simpel-finance-dashboard">
      
      {/* 1. VISUAL STATS GRID (Simple, Elegant, High-Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Pemasukan */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-emerald-100 transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] text-left flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-3xs uppercase font-extrabold tracking-widest text-gray-400 font-mono">Total Pemasukan</span>
            <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xl md:text-2xl font-mono font-bold text-gray-900 block tracking-tight">
              {formatIDR(totalPemasukan)}
            </span>
            <span className="text-[10px] text-gray-400 block mt-1">Akumulasi infaq, iuran &amp; donasi</span>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-red-50 transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] text-left flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-3xs uppercase font-extrabold tracking-widest text-gray-400 font-mono">Total Pengeluaran</span>
            <div className="bg-red-50 text-red-700 p-2 rounded-xl">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xl md:text-2xl font-mono font-bold text-gray-900 block tracking-tight">
              {formatIDR(totalPengeluaran)}
            </span>
            <span className="text-[10px] text-gray-400 block mt-1">Operasional &amp; penyaluran umat</span>
          </div>
        </div>

        {/* Saldo Kas Bersih (Featured) */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-5 rounded-2xl border border-emerald-900/40 shadow-md text-left flex flex-col justify-between relative overflow-hidden">
          {/* Subtle gold decoration pattern in corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-3xs uppercase font-extrabold tracking-widest text-[#D4AF37]/80 font-mono">Saldo Kas Bersih</span>
            <div className="bg-white/10 text-[#D4AF37] p-2 rounded-xl">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 z-10">
            <span className="text-2xl md:text-3xl font-mono font-black text-white block tracking-tight">
              {formatIDR(kasSekarang)}
            </span>
            <span className="text-[10px] text-emerald-200 block mt-1">Saldo mutlak siap diaudit &amp; disalurkan</span>
          </div>
        </div>

        {/* Menunggu Approval */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-amber-100 transition-all shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] text-left flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-3xs uppercase font-extrabold tracking-widest text-gray-400 font-mono">Menunggu Approval</span>
            <div className={`p-2 rounded-xl ${pendingTx.length > 0 ? 'bg-amber-55/15 text-amber-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xl md:text-2xl font-mono font-bold text-gray-900 block tracking-tight">
              {pendingTx.length} <span className="text-xs text-gray-400 font-sans font-semibold">Pengajuan</span>
            </span>
            <span className="text-[10px] text-gray-400 block mt-1">Verifikasi digital Ketua Tanfidziyah</span>
          </div>
        </div>

      </div>

      {/* 2. CHALKING BOARD: CUSTOM INTERACTIVE NET BALANCE CHART CARD */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-150/80 shadow-xs text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <h3 className="font-serif font-black text-gray-900 text-sm sm:text-base uppercase tracking-tight">
                Model Grafik Kondisi Keuangan Saldo Bersih
              </h3>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              Visualisasi historis akumulasi likuiditas kas masuk-keluar yang disetujui sah di Kecamatan Bungah.
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1 rounded-full bg-slate-100">
              {chartPoints.length} Titik Buku Kas
            </span>
          </div>
        </div>

        {/* SVG Container wrapping */}
        <div className="relative w-full overflow-x-auto select-none no-scrollbar">
          <div className="min-w-[600px] w-full">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible"
            >
              {/* Gradients declaration */}
              <defs>
                <linearGradient id="chartEmeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-Axis Labels */}
              {gridLines.map((line, i) => (
                <g key={i}>
                  <line 
                    x1={paddingLeft} 
                    y1={line.y} 
                    x2={chartWidth - paddingRight} 
                    y2={line.y} 
                    stroke="#f1f5f9" 
                    strokeWidth="1.2" 
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={line.y + 4} 
                    textAnchor="end" 
                    fill="#94a3b8" 
                    className="font-mono text-[9px] font-medium"
                  >
                    {formatValueCompact(line.value)}
                  </text>
                </g>
              ))}

              {/* Shaded Area under the Line */}
              {areaPathString && (
                <path 
                  d={areaPathString} 
                  fill="url(#chartEmeraldAreaGrad)" 
                />
              )}

              {/* Main Line Stroke */}
              {linePathString && (
                <path 
                  d={linePathString} 
                  fill="none" 
                  stroke="#059669" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points (interactive dots) */}
              {pathCoords.map((pt, i) => {
                const isHovered = hoveredPointIndex === i;
                return (
                  <g 
                    key={i}
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Outline indicator when hovered */}
                    {isHovered && (
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="8" 
                        fill="#059669" 
                        fillOpacity="0.2"
                      />
                    )}
                    {/* Core Point dot */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isHovered ? "5" : "3.5"} 
                      fill={pt.tipe === 'Pemasukan' ? '#10b981' : '#ef4444'} 
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {/* X-axis date labels */}
              {pathCoords.map((pt, i) => {
                // To keep X Axis neat, only show for endpoints & middle if too crowded
                const shouldShowLabel = 
                  pathCoords.length < 5 || 
                  i === 0 || 
                  i === pathCoords.length - 1 || 
                  (pathCoords.length > 2 && i === Math.floor(pathCoords.length / 2));

                if (!shouldShowLabel) return null;

                return (
                  <text 
                    key={i} 
                    x={pt.x} 
                    y={chartHeight - 15} 
                    textAnchor="middle" 
                    fill="#64748b" 
                    className="font-mono text-[9px]"
                  >
                    {pt.tanggal.split('-').slice(1).reverse().join('/')}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Beautiful Dynamic Contextual Tooltip */}
        <div className="mt-2 min-h-[50px] bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between transition-all">
          {hoveredPointIndex !== null ? (
            <div className="flex justify-between items-center w-full">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">
                  {pathCoords[hoveredPointIndex].tanggal} &bull; Transaksi No.{hoveredPointIndex + 1}
                </span>
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {pathCoords[hoveredPointIndex].deskripsi}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${pathCoords[hoveredPointIndex].tipe === 'Pemasukan' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-3xs text-gray-500 uppercase font-bold">
                    {pathCoords[hoveredPointIndex].tipe}: {formatIDR(pathCoords[hoveredPointIndex].jumlah)}
                  </span>
                </div>
              </div>
              <div className="text-right border-l pl-4 border-gray-200">
                <span className="text-3xs block text-gray-400 uppercase font-mono font-extrabold">Saldo Akumulasi</span>
                <span className="text-xs sm:text-sm font-mono font-black text-emerald-800">
                  {formatIDR(pathCoords[hoveredPointIndex].saldo)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xxs text-gray-400 py-1 font-sans">
              <Info className="h-4 w-4 text-[#D4AF37]" />
              <span>Arahkan kursor Anda atau sentuh node titik graph di atas untuk melihat rincian riwayat saldo kas bersangkutan.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. SIMPEL NAVIGATION PILLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 rounded-2xl border border-gray-150/70 shadow-xs">
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xxs w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('buku-kas')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg cursor-pointer transition-all duration-150 font-bold ${
              activeSubTab === 'buku-kas' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Buku Kas Umum
          </button>
          <button
            onClick={() => setActiveSubTab('neraca')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg cursor-pointer transition-all duration-150 font-bold ${
              activeSubTab === 'neraca' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Neraca Aset
          </button>
          {isAdminOrPresident && (
            <button
              onClick={() => setActiveSubTab('persetujuan')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg cursor-pointer relative transition-all duration-150 font-bold ${
                activeSubTab === 'persetujuan' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Approval
              {pendingTx.length > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-red-600 text-white font-mono font-bold text-[8px] h-3.5 w-3.5 flex justify-center items-center rounded-full animate-bounce">
                  {pendingTx.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Interactive Filters Area */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {activeSubTab === 'buku-kas' && (
            <>
              {/* Type Filter */}
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-slate-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xxs outline-none font-semibold text-gray-600 focus:border-emerald-600 focus:bg-white"
              >
                <option value="Semua">Tipe: Semua</option>
                <option value="Pemasukan">Pemasukan (Kredit)</option>
                <option value="Pengeluaran">Pengeluaran (Debet)</option>
              </select>

              {/* Kategori Filter */}
              <select 
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="bg-slate-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xxs outline-none font-semibold text-gray-600 focus:border-emerald-600 focus:bg-white"
              >
                <option value="Semua">Kategori: Semua</option>
                {existingCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Search text input */}
              <div className="relative flex-1 sm:w-44">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-2 py-1.5 w-full text-xxs rounded-xl border border-gray-200 outline-none focus:border-emerald-600 focus:bg-white bg-slate-50"
                />
              </div>
            </>
          )}

          {/* Record Button */}
          {role !== 'PUBLIK_WARGA' && (
            <button
              onClick={() => {
                setTxTipe('Pemasukan');
                setTxKategori('Donasi');
                setShowAddTx(true);
              }}
              className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xxs font-extrabold rounded-xl cursor-pointer w-full sm:w-auto shadow-xs active:scale-95 transition-all text-center"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Catat Kas</span>
            </button>
          )}
        </div>

      </div>

      {/* 4. TABLE VIEW ON DESKTOP & BEAUTIFUL LIST LISTING ON MOBILE (100% Mobile Friendly) */}
      {activeSubTab === 'buku-kas' && (
        <div>
          {/* A. MOBILE-FIRST VIEW (Active for small screens) */}
          <div className="block md:hidden space-y-3">
            {filteredLedger.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-gray-150/70 text-gray-400 text-xxs font-medium">
                Belum ada kas terdaftar yang cocok dengan filter atau pencarian Anda.
              </div>
            ) : (
              filteredLedger.map((tx) => {
                const isIncome = tx.tipe === 'Pemasukan';
                const isApproved = tx.status === 'Disetujui';

                return (
                  <div 
                    key={tx.id} 
                    className="bg-white p-4 rounded-xl border border-gray-150/70 shadow-xs flex flex-col gap-3 text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-tight block">
                          {tx.tanggal}
                        </span>
                        <span className="text-xxs font-extrabold text-[#D4AF37] uppercase bg-emerald-50 px-2 py-0.5 rounded mr-1.5 inline-block">
                          {tx.kategori}
                        </span>
                        <span className={`inline-block text-[9px] px-2 py-0.2 rounded-full font-bold uppercase ${
                          tx.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                          tx.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-sm font-black block ${
                          isApproved ? (isIncome ? 'text-emerald-600' : 'text-red-600') : 'text-gray-400 italic'
                        }`}>
                          {isIncome ? '+' : '-'}{formatIDR(tx.jumlah)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-gray-800 leading-normal">
                      {tx.deskripsi}
                    </p>

                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Kode: TX-{tx.id}</span>
                      <button
                        onClick={() => setSelectedTxAudit(tx)}
                        className="text-emerald-700 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer font-extrabold focus:underline"
                      >
                        <History className="h-3 w-3" />
                        <span>Audit Log</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* B. DESKTOP VIEW (Active on medium+ viewports) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-150/70 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-gray-150 text-xxs font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                    <th className="py-3 px-5">Tanggal &amp; Status</th>
                    <th className="py-3 px-5">Kategori / Deskripsi</th>
                    <th className="py-3 px-5 text-right">Pemasukan (Kredit)</th>
                    <th className="py-3 px-5 text-right">Pengeluaran (Debet)</th>
                    <th className="py-3 px-5 text-right">Riwayat Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-xs">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 text-xxs font-medium">
                        Belum ada transaksi terdaftar yang valid.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((tx) => {
                      const isIncome = tx.tipe === 'Pemasukan';
                      const approved = tx.status === 'Disetujui';

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5">
                            <span className="font-mono text-gray-500 block leading-none">{tx.tanggal}</span>
                            <span className={`inline-block text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase mt-1.5 ${
                              tx.status === 'Disetujui' ? 'bg-emerald-55/10 text-emerald-850' :
                              tx.status === 'Pending' ? 'bg-amber-55/10 text-amber-800' : 'bg-red-55/10 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 space-y-1">
                            <span className="text-3xs font-extrabold bg-[#D4AF37]/10 text-emerald-950 py-0.5 px-2 rounded font-mono uppercase tracking-wider inline-block">
                              {tx.kategori}
                            </span>
                            <span className="text-gray-900 font-bold block leading-tight">{tx.deskripsi}</span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            {isIncome ? (
                              <span className={`font-mono font-bold text-sm ${approved ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {formatIDR(tx.jumlah)}
                              </span>
                            ) : (
                              <span className="text-gray-300 font-mono">-</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            {!isIncome ? (
                              <span className={`font-mono font-bold text-sm ${approved ? 'text-red-650' : 'text-gray-400'}`}>
                                {formatIDR(tx.jumlah)}
                              </span>
                            ) : (
                              <span className="text-gray-300 font-mono">-</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => setSelectedTxAudit(tx)}
                              className="text-gray-500 hover:text-black hover:underline text-xxs inline-flex items-center gap-1 cursor-pointer font-bold bg-slate-50 hover:bg-slate-100 rounded-lg py-1 px-2 border.5 border-gray-200 transition-colors"
                            >
                              <History className="h-3.5 w-3.5 text-gray-400" /> 
                              <span>Log Audit</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NERACA TABS (Simple & Unified Balance Book) */}
      {activeSubTab === 'neraca' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aktiva (Assets) */}
          <div className="bg-white rounded-2xl border border-gray-150/80 shadow-xs overflow-hidden text-left">
            <div className="p-4 sm:p-5 bg-emerald-850 text-white flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Aktiva (Aset Organisasi)</h3>
              <span className="text-[10px] text-emerald-250 bg-emerald-950 px-2.5 py-0.5 rounded font-bold font-mono">MWCNU Bungah</span>
            </div>
            <div className="p-4 sm:p-5 space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-gray-650">Kas Lancar Organisasi</span>
                <span className="font-mono font-bold text-gray-950 text-sm">{formatIDR(kasSekarang)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-gray-650">Aset Tetap (Pembangunan Graha Lantai 1)</span>
                <span className="font-mono font-bold text-gray-950 text-sm">{formatIDR(245000000)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-gray-650">Kendaraan Siaga (Mobil Ambulans LAZISNU)</span>
                <span className="font-mono font-bold text-gray-950 text-sm">{formatIDR(185000000)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-emerald-800 pt-3 text-sm">
                <span className="font-serif font-black uppercase text-xs">Total Aktiva</span>
                <span className="font-mono text-base font-black">{formatIDR(kasSekarang + 245000000 + 185000000)}</span>
              </div>
            </div>
          </div>

          {/* Pasiva (Liabilities & Equity) */}
          <div className="bg-white rounded-2xl border border-gray-150/80 shadow-xs overflow-hidden text-left">
            <div className="p-4 sm:p-5 bg-emerald-950 border-l-4 border-[#D4AF37] text-white flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Pasiva (Kewajiban &amp; Ekuitas)</h3>
              <span className="text-[10px] text-emerald-200 bg-emerald-900/50 px-2.5 py-0.5 rounded font-extrabold uppercase font-mono">Buku Transparan</span>
            </div>
            <div className="p-4 sm:p-5 space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-gray-650">Hutang Operasional Kantor</span>
                <span className="font-mono font-bold text-gray-950 text-sm">{formatIDR(0)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-gray-650">Dana Terikat Pembangunan Graha</span>
                <span className="font-mono font-bold text-gray-950 text-sm">{formatIDR(245000000)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="text-gray-650">Ekuitas Dana Ummat (Kas LAZISNU &amp; KOIN)</span>
                <span className="font-mono font-bold text-gray-950 text-sm">{formatIDR(kasSekarang + 185000000)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-emerald-950 pt-3 text-sm">
                <span className="font-serif font-black uppercase text-xs">Total Pasiva</span>
                <span className="font-mono text-base font-black">{formatIDR(kasSekarang + 245000000 + 185000000)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERSATUAN APPROVAL DIGITAL */}
      {activeSubTab === 'persetujuan' && isAdminOrPresident && (
        <div className="bg-white rounded-2xl border border-gray-150/80 shadow-xs overflow-hidden text-left">
          <div className="p-4 bg-slate-50 border-b border-slate-150/70 flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] font-mono">
              Verifikasi &amp; Approval Finansial MWC NU Bungah
            </h3>
          </div>

          <div className="divide-y divide-slate-150">
            {pendingTx.length === 0 ? (
              <div className="py-12 p-4 text-center text-gray-400 text-xxs font-medium">
                Sempurna! Tidak ada pengajuan pengeluaran atau pemasukan yang berstatus pending/tertunda.
              </div>
            ) : (
              pendingTx.map((tx) => (
                <div key={tx.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded font-mono ${
                        tx.tipe === 'Pemasukan' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {tx.tipe} &mdash; {tx.kategori}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Nomor Ajuan: TX-{tx.id}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-950 block">{tx.deskripsi}</h4>
                    <span className="font-mono text-gray-500 block text-xxs">Diajukan tanggal: {tx.tanggal} &bull; Pemohon: Bendahara MWC</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 self-stretch justify-between md:justify-end">
                    <span className="font-mono font-black text-gray-950 text-base sm:text-lg text-left sm:text-right">{formatIDR(tx.jumlah)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecline(tx)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xxs font-bold cursor-pointer transition-colors"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleApprove(tx)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xxs font-bold cursor-pointer transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Setujui Ajuan</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* POP-UP: RECORD NEW TRANSACTION (Responsive and accessible modal) */}
      {showAddTx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm sm:text-base font-serif font-black text-emerald-950 uppercase tracking-tight">
                Pencatatan Baru Aliran Uang MWC NU
              </h3>
              <button 
                onClick={() => setShowAddTx(false)} 
                className="text-gray-400 hover:text-black font-serif text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitTx} className="space-y-4 text-xs text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-500 font-bold mb-1.5 uppercase tracking-wide">Tipe Aliran Uang</label>
                  <select
                    value={txTipe}
                    onChange={(e) => {
                      const type = e.target.value as 'Pemasukan' | 'Pengeluaran';
                      setTxTipe(type);
                      setTxKategori(type === 'Pemasukan' ? 'Iuran' : 'Operasional');
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs font-semibold"
                  >
                    <option value="Pemasukan">Pemasukan (Kredit)</option>
                    <option value="Pengeluaran">Pengeluaran (Debet)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1.5 uppercase tracking-wide">Kategori Anggaran</label>
                  <select
                    value={txKategori}
                    onChange={(e) => setTxKategori(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs font-semibold"
                  >
                    {txTipe === 'Pemasukan' ? (
                      <>
                        <option value="Iuran">Iuran Anggota / Ranting</option>
                        <option value="Donasi">Donasi Shadaqah (LAZIS)</option>
                        <option value="Hibah">Hibah Instansi Pemerintah</option>
                        <option value="Usaha">Wirausaha Mart Organisasi</option>
                      </>
                    ) : (
                      <>
                        <option value="Operasional">Listrik / Air / Internet / Kantor</option>
                        <option value="Kegiatan">Subsidi Program Kegiatan</option>
                        <option value="Sosial">Bantuan Dana Mustahik (Sosial)</option>
                        <option value="Pendidikan">Beasiswa Fatayat / IPNU / Ma&apos;arif</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1.5 uppercase tracking-wide">Deskripsi &amp; Perincian Transaksi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pembelian bahan bangunan Graha Lantai 1 Bungah"
                  value={txDeskripsi}
                  onChange={(e) => setTxDeskripsi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-500 font-bold mb-1.5 uppercase tracking-wide">Jumlah Rupiah (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000000"
                    value={txJumlah || ''}
                    onChange={(e) => setTxJumlah(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-mono text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1.5 uppercase tracking-wide">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={txTanggal}
                    onChange={(e) => setTxTanggal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50/50 border border-emerald-100 rounded-xl space-y-1">
                <span className="text-[10px] text-emerald-950 font-bold block">Prinsip Akuntabilitas:</span>
                <span className="text-[9.5px] text-slate-600 block leading-normal font-sans">
                  Semua transaksi yang dicatat akan berstatus <strong>Pending</strong>. Dibutuhkan verifikasi fungsional oleh Ketua Tanfidziyah MWC NU Kecamatan Bungah baru kemudian sah dicantumkan dalam buku kas umum secara transparan.
                </span>
              </div>

              <div>
                <CloudinaryUpload 
                  label="Unggah Kuitansi / Bukti Fisik Transfer (Cloudinary)" 
                  onUploadSuccess={(url) => setUploadedBuktiUrl(url)}
                  defaultUrl={uploadedBuktiUrl}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddTx(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 cursor-pointer font-bold transition-colors"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Ajukan &amp; Catat
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL LOG MODAL (Clean, elegant details popup) */}
      {selectedTxAudit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b pb-2.5">
              <span className="text-xxs font-extrabold uppercase tracking-widest text-[#C5A059] flex items-center gap-1 font-mono">
                <History className="h-4 w-4" />
                <span>Log Jalur Audit Transparan</span>
              </span>
              <button 
                onClick={() => setSelectedTxAudit(null)} 
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1 text-xs text-left">
              <span className="text-3xs uppercase font-extrabold bg-[#D4AF37]/10 text-emerald-900 px-2.5 py-0.5 rounded font-mono">
                TX-{selectedTxAudit.id}
              </span>
              <h4 className="font-bold text-gray-950 mt-1">{selectedTxAudit.deskripsi}</h4>
              <p className="font-mono text-[10px] text-gray-400">Tanggal Transaksi: {selectedTxAudit.tanggal}</p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-[10px] font-sans text-left text-gray-700 max-h-48 overflow-y-auto">
              <p className="font-extrabold text-xs text-emerald-950 border-b border-gray-200/50 pb-1.5 mb-2.5">Riwayat Sistem Keandalan Dana:</p>
              {selectedTxAudit.auditTrail.map((log, index) => (
                <div key={index} className="flex gap-2 items-start py-1 leading-relaxed">
                  <span className="text-emerald-700 font-extrabold">&bull;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div>
              <button
                onClick={() => setSelectedTxAudit(null)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Tutup Log
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
