import React from 'react';
import { 
  Building2, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  MousePointerClick,
  Users,
  Award,
  DollarSign,
  TrendingUp,
  Newspaper
} from 'lucide-react';
import { Link, useRouter } from '../router';
import { AnggotaPengurus, ProgramKerja, TransaksiKeuangan, BeritaArtikel } from '../types';
import PublicLayout from '../components/PublicLayout';

interface PageProps {
  anggotaList: AnggotaPengurus[];
  programList: ProgramKerja[];
  transaksiList: TransaksiKeuangan[];
  beritaList: BeritaArtikel[];
}

export default function Home({
  anggotaList,
  programList,
  transaksiList,
  beritaList
}: PageProps) {
  const { navigate } = useRouter();

  // Aggregate stats
  const totalAnggota = anggotaList.length;
  const runningPrograms = programList.filter(p => p.status === 'Berjalan').length;
  
  const approvedTx = transaksiList.filter(t => t.status === 'Disetujui');
  const totalPemasukan = approvedTx
    .filter(t => t.tipe === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalPengeluaran = approvedTx
    .filter(t => t.tipe === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const cashOnHand = totalPemasukan - totalPengeluaran;

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-12">
      {/* High-Concept Aesthetic Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-[#0c311c] text-white p-8 md:p-16 flex flex-col justify-between shadow-lg h-[400px]">
        {/* Intricate glowing circular geometry to emulate the NU Logo globe lines */}
        <div className="absolute top-[-50px] right-[-50px] w-96 h-96 border border-[#D4AF37]/15 rounded-full pointer-events-none" />
        <div className="absolute top-[-30px] right-[-30px] w-[340px] h-[340px] border border-dashed border-[#D4AF37]/10 rounded-full pointer-events-none" />
        <div className="absolute top-[-10px] right-[-10px] w-[280px] h-[280px] border border-[#D4AF37]/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl text-left z-10 space-y-4 my-auto">
          <span className="text-[#D4AF37] text-3xs tracking-widest font-extrabold uppercase bg-emerald-950/70 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full">
            OFFICIAL PORTAL &bull; SMART GOVERNANCE DIGITAL
          </span>
          <h1 className="text-2xl md:text-4xl font-serif font-black tracking-tight leading-tight pt-2">
            Majelis Wakil Cabang Nahdlatul Ulama Bungah
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm leading-relaxed font-sans font-light max-w-xl">
            Pusat tata kelola administrasi modern, rekapitulasi data KARTANU terpadu, program pemberdayaan ekonomi umat, dan transparansi laporan dana publik demi kemaslahatan nahdliyin Bungah.
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link 
              to="/profil" 
              className="bg-[#D4AF37] hover:bg-[#c5a03b] text-emerald-950 font-bold text-xs px-5 py-3 rounded-2xl inline-flex items-center gap-2 transition hover:scale-[1.02]"
            >
              <span>Pelajari Profil Kami</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/keuangan" 
              className="bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-5 py-3 rounded-2xl inline-flex items-center gap-2 transition"
            >
              <span>Laporan Transparansi</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-emerald-800/50 pt-4 flex flex-wrap justify-between items-center z-10 gap-2 text-3xs font-mono text-emerald-350 tracking-wider">
          <span>NAHDLATUL ULAMA: MERAWAT JAGAT MEMBANGUN PERADABAN</span>
          <span>ESTABLISHED 1926</span>
        </div>
      </div>

      {/* Aggregate Stats Dashboard Bento Blocks */}
      <section className="space-y-4">
        <div className="text-left">
          <h3 className="text-3xs uppercase tracking-widest text-[#D4AF37] font-extrabold">TRANSPARANSI KUNCI</h3>
          <h2 className="text-lg font-serif font-black text-emerald-950">Statistik Utama Akuntabilitas Publik</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-xxs text-left hover:shadow-xs transition duration-200">
            <span className="text-3xs font-extrabold uppercase tracking-widest block text-gray-400">Total Kader Kartanu</span>
            <span className="text-2xl font-mono font-black text-emerald-800 block mt-1">{totalAnggota} Orang</span>
            <span className="text-[10px] text-gray-400 block mt-1 leading-normal font-sans">Terintegrasi di 10 Ranting Aktif</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-xxs text-left hover:shadow-xs transition duration-200">
            <span className="text-3xs font-extrabold uppercase tracking-widest block text-gray-400">Program Berjalan</span>
            <span className="text-2xl font-mono font-black text-indigo-700 block mt-1">{runningPrograms} Proker</span>
            <span className="text-[10px] text-gray-400 block mt-1 leading-normal font-sans">Dikelola Lembaga &amp; Banom</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-xxs text-left hover:shadow-xs transition duration-200">
            <span className="text-3xs font-extrabold uppercase tracking-widest block text-gray-400">Keuangan Terverifikasi</span>
            <span className="text-2xl font-mono font-black text-emerald-700 block mt-1">{formatIDR(cashOnHand)}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1 leading-normal font-sans">Kas Bersih Organisasi Terbuka</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-xxs text-left hover:shadow-xs transition duration-200">
            <span className="text-3xs font-extrabold uppercase tracking-widest block text-gray-400">Arsip Publik Terbuka</span>
            <span className="text-2xl font-mono font-black text-[#C5A059] block mt-1">100% PDF</span>
            <span className="text-[10px] text-gray-400 block mt-1 leading-normal font-sans">Dokumen SK &amp; LPJ Bebas Akses</span>
          </div>
        </div>
      </section>

      {/* Grid: News Highlight & Struktural Board List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Recent News */}
        <div className="lg:col-span-2 space-y-6 text-left">
          <div className="flex justify-between items-end border-b pb-3 border-gray-100">
            <div>
              <h3 className="text-3xs uppercase tracking-widest text-emerald-800 font-extrabold">WARTA TERKINI</h3>
              <h2 className="text-lg font-serif font-black text-emerald-950">Kabar Utama &amp; Kegiatan Nahdliyin</h2>
            </div>
            <Link 
              to="/berita" 
              className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1 hover:text-emerald-900 transition"
            >
              <span>Semua Berita</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beritaList.slice(0, 2).map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-gray-150/50 overflow-hidden shadow-2xs hover:shadow-xs transition duration-300 flex flex-col h-full"
              >
                <div className="h-40 overflow-hidden relative">
                  <span className="absolute top-3 left-3 bg-emerald-900 text-[#D4AF37] text-4xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md z-10">
                    {item.kategori}
                  </span>
                  <img 
                    src={item.fotoUrl} 
                    alt={item.judul} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-4xs text-gray-400 block font-mono">{item.tanggal} &bull; Oleh {item.penulis}</span>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 hover:text-emerald-800 transition">
                      <Link to={`/berita/${item.id}`}>{item.judul}</Link>
                    </h4>
                    <p className="text-3xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                      {item.ringkasan}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/berita/${item.id}`)}
                    className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer w-fit self-start pt-2 border-t border-gray-50 w-full"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Structural Pimpinan */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-3xs text-left space-y-6">
          <div className="border-b pb-3 border-gray-100">
            <h3 className="text-3xs uppercase tracking-widest text-[#C5A059] font-extrabold">PELAYAN MATAN</h3>
            <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wide mt-1">Struktur Pimpinan Harian</h2>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Rais Syuriyah */}
            <div className="flex items-center gap-3.5 bg-slate-50 p-3 rounded-xl border border-gray-150/30">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80" 
                alt="Syuriyah" 
                className="h-10 w-10 rounded-full object-cover border border-emerald-100" 
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <span className="inline-block text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded uppercase">Syuriyah</span>
                <h5 className="font-bold text-gray-950 block leading-tight pt-1">KH. Sholeh Qosim, M.Pd.I</h5>
                <span className="text-[10px] text-gray-400 block font-normal">Rais Syuriyah MWC NU Bungah</span>
              </div>
            </div>

            {/* Tanfidziyah */}
            <div className="flex items-center gap-3.5 bg-slate-50 p-3 rounded-xl border border-gray-150/30">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=80" 
                alt="Ketua" 
                className="h-10 w-10 rounded-full object-cover border border-[#D4AF37]/30" 
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <span className="inline-block text-[9px] bg-amber-50 text-[#C5A059] font-extrabold px-1.5 py-0.2 rounded uppercase">Tanfidziyah</span>
                <h5 className="font-bold text-gray-950 block leading-tight pt-1">H. Achmad Shofwan, S.Ag</h5>
                <span className="text-[10px] text-gray-400 block font-normal">Ketua Tanfidziyah MWC NU Bungah</span>
              </div>
            </div>

            {/* Sekretaris */}
            <div className="flex items-center gap-3.5 bg-slate-50 p-3 rounded-xl border border-gray-150/30">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&auto=format&fit=crop&q=80" 
                alt="Sekretaris" 
                className="h-10 w-10 rounded-full object-cover border border-slate-200" 
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <span className="inline-block text-[9px] bg-slate-100 text-gray-700 font-extrabold px-1.5 py-0.2 rounded uppercase">Sekretaris</span>
                <h5 className="font-bold text-gray-950 block leading-tight pt-1">Drs. H. Choirul Anam</h5>
                <span className="text-[10px] text-gray-400 block font-normal">Sekretaris Tanfidziyah</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/45 p-4 rounded-xl border border-emerald-50 text-3xs leading-relaxed text-emerald-850 font-sans">
            Telah berafiliasi resmi dengan Pengurus Cabang Nahdlatul Ulama (PCNU) Kabupaten Gresik untuk menyatukan khidmat kemanusiaan yang berkesinambungan.
          </div>
        </div>

      </div>

      {/* Program and GIS Maps quick pointers */}
      <section className="bg-slate-100/50 rounded-2xl p-6 border border-gray-150/30 text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <span className="text-3xs uppercase tracking-widest text-[#D4AF37] font-black">PENDATAAN GEOGRAFIS</span>
          <h3 className="text-md font-serif font-black text-emerald-950">
            Sistem Informasi Geografis (GIS) Rumah Wakaf &amp; Binaan NU
          </h3>
          <p className="text-3xs text-gray-500 leading-relaxed font-sans">
            Kami melakukan pelacakan dan plot digital sarana peribadahan Masjid, Mushalla, Madrasah Ibtidaiyah/Thariqah, Pondok Pesantren, serta Ranting NU binaan di seluruh Kecamatan Bungah demi kemudahan pelayanan masyarakat.
          </p>
          <div className="pt-2">
            <Link 
              to="/program-kerja" 
              className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold text-3xs px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <span>Pelajari Proker &amp; Program</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <div className="h-44 bg-white rounded-xl border border-gray-200 overflow-hidden relative shadow-3xs hover:scale-[1.01] transition duration-300">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=80" 
            alt="Map Preview" 
            className="w-full h-full object-cover filter brightness-[0.9] saturate-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/20" />
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-3 rounded-lg border flex justify-between items-center text-3xs">
            <div>
              <strong className="block text-gray-900">GIS Sektor Bungah</strong>
              <span className="text-gray-400">Terdaftar masjid-madrasah binaan</span>
            </div>
            <Link to="/program-kerja" className="text-emerald-700 font-extrabold flex items-center gap-0.5">
              <span>Buka</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
