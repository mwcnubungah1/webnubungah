import React from 'react';
import { 
  Award, 
  MapPin, 
  Layers, 
  BookOpen, 
  Globe, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Building2, 
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { AnggotaPengurus, ProgramKerja, TransaksiKeuangan, ArsipDokumen } from '../types';

interface PublicProps {
  anggotaList: AnggotaPengurus[];
  programList: ProgramKerja[];
  transaksiList: TransaksiKeuangan[];
  arsipList: ArsipDokumen[];
}

export default function PublikPortalView({
  anggotaList,
  programList,
  transaksiList,
  arsipList
}: PublicProps) {
  // Safe Aggregators
  const totalAnggota = anggotaList.length;
  const programsActiveCount = programList.filter(p => p.status === 'Berjalan').length;
  
  const approvedTx = transaksiList.filter(t => t.status === 'Disetujui');
  const totalPemasukan = approvedTx
    .filter(t => t.tipe === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalPengeluaran = approvedTx
    .filter(t => t.tipe === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const kasSekarang = totalPemasukan - totalPengeluaran;

  const publicDocs = arsipList.filter(d => d.publicAccess);

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-8" id="public-transparency-portal">
      
      {/* Visual Hero Greeting Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-800 text-white p-8 md:p-12 shadow-sm flex flex-col justify-between h-[280px]">
        {/* Subtle decorative background stars representing NU logo emblem style */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 max-w-xl text-left z-10">
          <span className="text-[#D4AF37] text-xxs font-extrabold uppercase tracking-widest bg-emerald-950/40 px-3 py-1 rounded-full border border-[#D4AF37]/30">Portal Transparansi Publik Warga NU</span>
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight mt-3">Portal Aswaja Majelis Wakil Cabang Nahdlatul Ulama</h1>
          <p className="text-emerald-100 text-xs leading-relaxed font-sans mt-2">
            Meningkatkan kepercayaan umat melalui transparansi digital program kerja, pertanggungjawaban dana, dan pendataan KARTANU terintegrasi se-Kecamatan Bungah.
          </p>
        </div>

        <div className="flex border-t border-emerald-700/40 pt-4 mt-4 justify-between items-center z-10 flex-wrap gap-4 text-3xs font-mono text-[#D4AF37]">
          <span>MUTU: TATA KELOLA AKUNTABEL, PROFESIONAL &amp; MANDIRI</span>
          <span>EST. 1926 &bull; BUNGAH</span>
        </div>
      </div>

      {/* Profil MWCNU & Visi Misi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs lg:col-span-2 text-left space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-850 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-700" />
            <span>Riwayat Singkat MWCNU Bungah</span>
          </h2>
          <p className="text-xs text-gray-650 leading-relaxed font-sans">
            Majelis Wakil Cabang Nahdlatul Ulama (MWCNU) Kecamatan Bungah merupakan pilar perjuangan dakwah Islam Ahlussunnah wal Jama’ah An-Nahdliyah yang mengoordinasikan puluhan ranting (desa), lembaga dakwah sosial, serta badan otonom seperti GP Ansor, Muslimat, Fatayat, dan IPNU-IPPNU. 
          </p>
          <p className="text-xs text-gray-650 leading-relaxed font-sans">
            Dengan komitmen tinggi mewujudkan program &quot;Smart Governance&quot;, kami menghimpun seluruh kekuatan zakat, infaq dan sedekah melalui LAZISNU guna dialirkan fungsional untuk kemaslahatan masyarakat dhuafa, beasiswa kader berprestasi, serta perbaikan sarana dakwah masjid-mushalla secara akuntabel.
          </p>

          <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xxs text-gray-550 leading-relaxed font-sans">
            <div className="p-3 bg-emerald-50/25 rounded-xl border border-emerald-50/50">
              <strong className="text-emerald-900 block mb-1">Visi Utama:</strong>
              <span>Menjadi pusat penggerak kemandirian umat, dakwah wasathiyah, dan tata kelola organisasi modern yang berafiliasi kuat dengan warisan para ulama sepuh Nahdlatul Ulama.</span>
            </div>
            <div className="p-3 bg-indigo-50/25 rounded-xl border border-indigo-50/50">
              <strong className="text-indigo-900 block mb-1">Misi Mulia:</strong>
              <span>1. Pendataan database KARTANU pintar terstruktur. <br/>2. Transparansi keuangan dana donasi umat. <br/>3. Pemberdayaan dakwah wasathiyah di era digitalisasi.</span>
            </div>
          </div>
        </div>

        {/* Board Structure Bento blocks */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-left space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] border-b pb-2 flex items-center gap-2">
            <Layers className="h-4.5 w-4.5" />
            <span>Pimpinan Struktural Harian</span>
          </h3>

          <div className="space-y-4 text-xs font-sans">
            {/* Rais Syuriyah */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-gray-100 shadow-xxs">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                alt="Rais" 
                className="h-10 w-10 rounded-full object-cover border" 
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded block self-start w-fit">Syuriyah</span>
                <span className="font-bold text-gray-900 block leading-tight mt-1">KH. Sholeh Qosim, M.Pd.I</span>
                <span className="text-[10px] text-gray-400">Rais Syuriyah MWC NU</span>
              </div>
            </div>

            {/* Tanfidziyah */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-gray-100 shadow-xxs">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" 
                alt="Tanfidziyah" 
                className="h-10 w-10 rounded-full object-cover border" 
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] bg-[#D4AF37]/10 text-emerald-950 font-bold px-1.5 py-0.2 rounded block self-start w-fit">Tanfidziyah</span>
                <span className="font-bold text-gray-900 block leading-tight mt-1">H. Achmad Shofwan, S.Ag</span>
                <span className="text-[10px] text-gray-400">Ketua Tanfidziyah MWC NU</span>
              </div>
            </div>

            {/* Sekretariat */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-gray-100 shadow-xxs">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" 
                alt="Sekretaris" 
                className="h-10 w-10 rounded-full object-cover border" 
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] bg-slate-200 text-gray-850 font-bold px-1.5 py-0.2 rounded block self-start w-fit">Sekretaris</span>
                <span className="font-bold text-gray-900 block leading-tight mt-1">Drs. H. Choirul Anam</span>
                <span className="text-[10px] text-gray-400">Sekretaris Tanfidziyah</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Public stats blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#FAFBF9] p-4 rounded-xl border border-emerald-50">
          <span className="text-xxs font-semibold uppercase tracking-wider text-gray-400 block">Kader Terdaftar</span>
          <span className="text-xl font-mono font-black text-emerald-700 block mt-1">{totalAnggota - 2} Orang</span>
        </div>

        <div className="bg-[#FAFBF9] p-4 rounded-xl border border-emerald-50">
          <span className="text-xxs font-semibold uppercase tracking-wider text-gray-400 block">Program Sedang Berjalan</span>
          <span className="text-xl font-mono font-black text-indigo-700 block mt-1">{programsActiveCount} Proker</span>
        </div>

        <div className="bg-[#FAFBF9] p-4 rounded-xl border border-emerald-50">
          <span className="text-xxs font-semibold uppercase tracking-wider text-gray-400 block">Total Transaksi Selesai</span>
          <span className="text-xl font-mono font-black text-emerald-800 block mt-1">{approvedTx.length} Verifikasi</span>
        </div>

        <div className="bg-[#FAFBF9] p-4 rounded-xl border border-emerald-50">
          <span className="text-xxs font-semibold uppercase tracking-wider text-gray-400 block">Kas Keuangan Transparan</span>
          <span className="text-xl font-mono font-black text-[#C5A059] block mt-1">{formatIDR(kasSekarang)}</span>
        </div>

      </div>

      {/* Public Documents Consult Center */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-left space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-2 border-b pb-2">
          <FileText className="h-5 w-5" />
          <span>Arsip & Dokumen Publik Transparan (Dapat Diunduh Bebas)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicDocs.map((doc) => (
            <div key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-gray-100 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">{doc.kategori}</span>
                  <span className="text-3xs text-gray-400 font-mono italic">Ukuran: {doc.fileSize} &bull; v{doc.versi}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 leading-tight block">{doc.nama}</h4>
                <p className="text-xxs text-gray-500 leading-normal font-sans">{doc.deskripsi}</p>
              </div>

              <div className="pt-3 border-t mt-4 flex justify-between items-center text-xxs font-bold text-emerald-700">
                <span className="text-[#C5A059] text-xxs block font-mono">Diterbitkan: {doc.tanggal}</span>
                <button 
                  onClick={() => alert(`Unduhan dokumen publik "${doc.nama}" berhasil disimulasikan!`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 text-3xs font-semibold cursor-pointer"
                >
                  Download Dokumen PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
