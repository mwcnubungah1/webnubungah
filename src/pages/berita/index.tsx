import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Eye, 
  X,
  Newspaper 
} from 'lucide-react';
import { useRouter } from '../../router';
import { BeritaArtikel } from '../../types';

interface PageProps {
  beritaList: BeritaArtikel[];
}

export default function BeritaCatalog({ beritaList }: PageProps) {
  const { navigate } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('SEMUA');

  // Filter lists
  const filteredList = beritaList.filter(item => {
    const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.ringkasan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.penulis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKategori = selectedKategori === 'SEMUA' || item.kategori === selectedKategori;
    return matchesSearch && matchesKategori;
  });

  return (
    <div className="space-y-10 text-left">
      
      {/* Title banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#102d1a] p-8 rounded-2xl text-white space-y-2 relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xxs uppercase font-extrabold text-[#D4AF37] tracking-widest block font-mono">WARTA &amp; MEDIA</span>
        <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight">Kanal Berita Utama MWCNU Bungah</h1>
        <p className="text-3xs md:text-xxs text-emerald-100 max-w-2xl leading-relaxed">
          Temukan info aktual seputar bahtsul masail, instruksi syuriyah, lailatul ijtima keliling, gerakan koin kaleng Lazisnu, hingga agenda banom harian.
        </p>
      </div>

      {/* Controller: Search & Category tabs */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150/50 shadow-xxs flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Category filtering tab buttons */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
          {['SEMUA', 'Kegiatan', 'Opini', 'Pengumuman', 'Warta Aswaja'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedKategori(cat)}
              className={`px-3 py-1.5 rounded-lg text-3xs font-extrabold uppercase tracking-wide transition cursor-pointer ${
                selectedKategori === cat
                  ? 'bg-emerald-900 text-white shadow-3xs'
                  : 'bg-slate-50 border border-gray-100 text-gray-500 hover:text-emerald-950 hover:bg-slate-100'
              }`}
            >
              {cat === 'SEMUA' ? 'Semua Warta' : cat}
            </button>
          ))}
        </div>

        {/* Dynamic Search Box */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Cari berita atau panulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-250/50 bg-slate-50 rounded-xl focus:outline-hidden focus:border-emerald-700 bg-white"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 p-0.5 rounded hover:bg-gray-100 text-gray-400"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

      </div>

      {/* Berita Grid Cards */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {filteredList.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-gray-150/45 overflow-hidden shadow-3xs hover:shadow-xs transition duration-300 flex flex-col h-full hover:scale-[1.01]"
            >
              {/* Cover thumbnail */}
              <div className="h-48 bg-slate-150 relative overflow-hidden">
                <span className="absolute top-4 left-4 bg-[#D4AF37] text-emerald-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md z-10 shadow-3xs">
                  {item.kategori}
                </span>
                <img 
                  src={item.fotoUrl} 
                  alt={item.judul} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Cover text summary details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-4xs font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.tanggal}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{item.penulis}</span>
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 leading-snug hover:text-emerald-800 transition line-clamp-2">
                    <button onClick={() => navigate(`/berita/${item.id}`)} className="text-left font-bold cursor-pointer">
                      {item.judul}
                    </button>
                  </h3>
                  <p className="text-3xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-3xs text-gray-400 font-mono inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Dilihat: {item.bacaCount}</span>
                  </span>
                  
                  <button
                    onClick={() => navigate(`/berita/${item.id}`)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-3xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <span>Detail</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-50 border border-dashed rounded-3xl">
              <Newspaper className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-450 font-sans">Tidak ada warta keagamaan atau klerikal yang cocok dengan pencarian Anda.</p>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
