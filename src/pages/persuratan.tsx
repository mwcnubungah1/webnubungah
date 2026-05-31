import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  ShieldAlert, 
  Lock, 
  ArrowRight,
  TrendingUp,
  FolderOpen
} from 'lucide-react';
import { Link, useRouter } from '../router';
import { SuratMasuk, SuratKeluar } from '../types';

interface PageProps {
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  userRole: string;
}

export default function Persuratan({ suratMasuk, suratKeluar, userRole }: PageProps) {
  const { navigate } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'MASUK' | 'KELUAR'>('KELUAR');

  // Filter lists based on outer public identifiers (non-confidential perihals)
  const filteredMasuk = suratMasuk.filter(s => 
    s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKeluar = suratKeluar.filter(s => 
    s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.penerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      
      {/* Title banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#12311c] p-8 rounded-2xl text-white space-y-2 relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xxs uppercase font-extrabold text-[#D4AF37] tracking-widest block font-mono">E-PERSURATAN TRANSPARAN</span>
        <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight">Pelacakan &amp; Arsip Nomor Surat Organisasi</h1>
        <p className="text-3xs md:text-xxs text-emerald-100 max-w-2xl leading-relaxed">
          Sistem transparansi indeks surat keluar dan surat masuk untuk menghindari tumpang tindih dan manipulasi persuratan klerikal di jajaran MWC Bungah.
        </p>
      </div>

      {/* Grid: Overview with restrict layout banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Statistics & security banner */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-150/45 shadow-xxs space-y-4">
            <h3 className="text-xs font-bold uppercase text-emerald-850">Statistik E-Surat</h3>
            
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-slate-50 p-4 rounded-xl border">
                <span className="text-4xs font-mono uppercase text-gray-400 block">Surat Masuk</span>
                <span className="text-lg font-mono font-black text-emerald-800 block mt-1">{suratMasuk.length} Lembar</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border">
                <span className="text-4xs font-mono uppercase text-gray-400 block">Surat Keluar</span>
                <span className="text-lg font-mono font-black text-indigo-800 block mt-1">{suratKeluar.length} Lembar</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-5 rounded-2xl border border-amber-200 shadow-xxs text-left space-y-3">
            <div className="bg-amber-100 p-2 rounded-lg text-[#C5A059] w-fit">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-extrabold text-[#c5a03b] uppercase tracking-wide leading-tight">Konfidensialitas Dokumen</h4>
            <p className="text-[10px] text-gray-650 leading-relaxed font-sans">
              Demi menjaga integritas sirkulasi klerikal serta kerahasiaan isi disposisi syuriyah, detail naskah surat dan unduhan berkas fisik lampiran <b>hanya dapat diakses oleh Pengurus terotentikasi</b>.
            </p>
            {userRole === 'PUBLIK_WARGA' && (
              <div className="pt-2">
                <Link 
                  to="/login"
                  className="bg-emerald-900 text-white font-bold text-3xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs border border-emerald-950 text-[#D4AF37]"
                >
                  <Lock className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Login Pengurus</span>
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Outer Index List for searchable transparency */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-150/45 p-6 shadow-xxs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            
            <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl border">
              <button
                onClick={() => setActiveSubTab('KELUAR')}
                className={`px-3 py-1.5 rounded-lg text-3xs font-extrabold uppercase transition cursor-pointer ${
                  activeSubTab === 'KELUAR' 
                    ? 'bg-emerald-900 text-white shadow-3xs' 
                    : 'text-gray-500 hover:text-emerald-900'
                }`}
              >
                Surat Keluar
              </button>
              <button
                onClick={() => setActiveSubTab('MASUK')}
                className={`px-3 py-1.5 rounded-lg text-3xs font-extrabold uppercase transition cursor-pointer ${
                  activeSubTab === 'MASUK' 
                    ? 'bg-emerald-900 text-white shadow-3xs' 
                    : 'text-gray-500 hover:text-emerald-900'
                }`}
              >
                Surat Masuk
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari nomor atau perihal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[11px] border rounded-xl bg-slate-50 outline-hidden"
              />
              <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

          </div>

          <div className="space-y-4">
            {activeSubTab === 'KELUAR' ? (
              filteredKeluar.map((s) => (
                <div key={s.id} className="p-4 bg-slate-50/50 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-4xs text-indigo-700 bg-indigo-50 border border-indigo-100 font-mono px-2 py-0.5 rounded uppercase font-bold">
                        {s.status}
                      </span>
                      <span className="text-4xs text-gray-400 font-mono italic">{s.tanggal}</span>
                    </div>
                    <h4 className="font-bold text-gray-900">{s.perihal}</h4>
                    <p className="text-3xs text-gray-500">
                      <b>Nomor:</b> <span className="font-mono text-[10px]">{s.nomorSurat}</span> &bull; <b>Penerima:</b> {s.penerima}
                    </p>
                  </div>
                  <button 
                    onClick={() => alert('Isi lengkap surat keluar bersandi dan dilarang diakses oleh publik tanpa otentikasi login.')}
                    className="flex-none bg-slate-200 hover:bg-slate-25 text-gray-600 font-bold text-3xs px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Naskah Terkunci</span>
                  </button>
                </div>
              ))
            ) : (
              filteredMasuk.map((s) => (
                <div key={s.id} className="p-4 bg-slate-50/50 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-4xs text-emerald-800 bg-emerald-50 border border-emerald-100 font-mono px-2 py-0.5 rounded uppercase font-bold">
                        {s.statusDisposisi}
                      </span>
                      <span className="text-4xs text-gray-400 font-mono italic">{s.tanggal}</span>
                    </div>
                    <h4 className="font-bold text-gray-900">{s.perihal}</h4>
                    <p className="text-3xs text-gray-500">
                      <b>Nomor:</b> <span className="font-mono text-[10px]">{s.nomorSurat}</span> &bull; <b>Pengirim:</b> {s.pengirim}
                    </p>
                  </div>
                  <button 
                    onClick={() => alert('Informasi disposisi rawan dimanipulasi secara bebas. Harap melakukan login untuk melihat disposisi.')}
                    className="flex-none bg-slate-200 hover:bg-slate-25 text-gray-650 font-bold text-3xs px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Disposisi Terkunci</span>
                  </button>
                </div>
              ))
            )}

            {((activeSubTab === 'KELUAR' && filteredKeluar.length === 0) || 
              (activeSubTab === 'MASUK' && filteredMasuk.length === 0)) && (
              <div className="py-10 text-center bg-[#FAFBF9] border border-dashed rounded-xl">
                <FolderOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-3xs text-gray-400">Tidak ada data persuratan terindeks.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
