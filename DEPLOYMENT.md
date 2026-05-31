import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  BookOpen, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useRouter } from '../../router';
import { BeritaArtikel } from '../../types';

interface PageProps {
  beritaList: BeritaArtikel[];
}

export default function BeritaDetail({ beritaList }: PageProps) {
  const { params, navigate } = useRouter();
  
  // Extract route parameter
  const itemId = params.id;
  const article = beritaList.find(b => b.id === itemId);

  // Fallback if not found
  if (!article) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-left max-w-md mx-auto space-y-4">
        <h2 className="text-sm font-bold text-gray-800">Warta Tidak Ditemukan</h2>
        <p className="text-3xs text-gray-500 text-center font-sans">Maaf, artikel berita keagamaan yang Anda tuju tidak terdaftar atau telah diarsipkan oleh pengurus harian.</p>
        <button 
          onClick={() => navigate('/berita')}
          className="bg-emerald-800 text-white font-bold text-xxs px-4 py-2 rounded-xl"
        >
          Kembali ke Seri Berita
        </button>
      </div>
    );
  }

  // Find other recent posts to display as suggestions
  const suggestions = beritaList.filter(b => b.id !== article.id).slice(0, 3);

  return (
    <div className="space-y-8 text-left">
      
      {/* Back to catalog navigator */}
      <button
        onClick={() => navigate('/berita')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Warta Berita</span>
      </button>

      {/* Grid: Main content & Suggestions rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left main content block */}
        <article className="lg:col-span-2 bg-white rounded-3xl border border-gray-150/50 shadow-xxs overflow-hidden">
          
          {/* Header image banner */}
          <div className="h-64 sm:h-80 relative overflow-hidden bg-slate-100">
            <img 
              src={article.fotoUrl} 
              alt={article.judul} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-4 left-4 bg-emerald-900 text-[#D4AF37] font-extrabold text-[10px] tracking-wide uppercase px-3 py-1.5 rounded-lg shadow-sm">
              {article.kategori}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header meta details */}
            <div className="space-y-3">
              <h1 className="text-md sm:text-xl font-serif font-black text-gray-900 leading-snug">
                {article.judul}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-3xs font-mono text-gray-400 border-b pb-4 border-gray-100">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Diterbitkan: {article.tanggal}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>Kontributor: {article.penulis}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Telah dibaca {article.bacaCount + 10} kali</span>
                </span>
              </div>
            </div>

            {/* Content body */}
            <div 
              className="text-xs text-gray-750 font-sans leading-relaxed space-y-4 prose prose-emerald prose-xs max-w-none"
              dangerouslySetInnerHTML={{ __html: article.konten }}
            />

            {/* Note signature banner */}
            <div className="p-4 bg-emerald-50/45 rounded-2xl border border-emerald-50 text-3xs italic text-emerald-805 leading-normal font-sans">
              Segala kesimpulan maupun opini dalam artikel ini bersumber murni dari koordinator lapangan, diredaksi terperinci oleh tim Sekretariat Tanfidziyah MWCNU Kecamatan Bungah demi syiar Wasathiyah Ahlussunnah wal Jamaah.
            </div>

          </div>

        </article>

        {/* Right suggestions list */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-150/50 shadow-xxs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-850 flex items-center gap-2 border-b pb-2">
              <BookOpen className="h-4.5 w-4.5 text-emerald-700" />
              <span>Warta Terkait Lainnya</span>
            </h3>

            <div className="space-y-4">
              {suggestions.map((item) => (
                <div 
                  key={item.id} 
                  className="group flex gap-3 text-left items-start cursor-pointer border-b pb-4 last:border-b-0 last:pb-0"
                  onClick={() => navigate(`/berita/${item.id}`)}
                >
                  <img 
                    src={item.fotoUrl} 
                    alt={item.judul} 
                    className="h-12 w-12 rounded-xl object-cover hover:opacity-90 transition inline-block flex-none bg-slate-100 border" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-gray-400 block">{item.tanggal}</span>
                    <h4 className="text-3xs font-extrabold text-gray-800 leading-snug group-hover:text-emerald-850 transition line-clamp-2">
                      {item.judul}
                    </h4>
                  </div>
                </div>
              ))}

              {suggestions.length === 0 && (
                <p className="text-3xs text-gray-400">Tidak ada artikel terkait beredar.</p>
              )}
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
