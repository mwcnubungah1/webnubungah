import React, { useState } from 'react';
import { Plus, Trash2, Search, BookOpen, Clock, FileText, Globe } from 'lucide-react';
import { BeritaArtikel, UserRole } from '../types';
import CloudinaryUpload from './CloudinaryUpload';

interface BeritaAdminProps {
  beritaList: BeritaArtikel[];
  role: UserRole;
  onAddBerita: (berita: Omit<BeritaArtikel, 'id' | 'bacaCount'>) => void;
  onDeleteBerita: (id: string) => void;
}

export default function BeritaAdminView({
  beritaList,
  role,
  onAddBerita,
  onDeleteBerita
}: BeritaAdminProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [bJudul, setBJudul] = useState('');
  const [bRingkasan, setBRingkasan] = useState('');
  const [bKonten, setBKonten] = useState('');
  const [bKategori, setBKategori] = useState<'Kegiatan' | 'Opini' | 'Pengumuman' | 'Warta Aswaja'>('Kegiatan');
  const [bPenulis, setBPenulis] = useState('Humas MWCNU Bungah');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState('');

  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  const filteredBerita = beritaList.filter(item => {
    const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.ringkasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || item.kategori === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bJudul || !bRingkasan || !bKonten) return;

    onAddBerita({
      judul: bJudul,
      ringkasan: bRingkasan,
      konten: bKonten,
      tanggal: new Date().toISOString().split('T')[0],
      kategori: bKategori,
      penulis: bPenulis,
      fotoUrl: uploadedPhotoUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    });

    // Reset Form
    setBJudul('');
    setBRingkasan('');
    setBKonten('');
    setBKategori('Kegiatan');
    setBPenulis('Humas MWCNU Bungah');
    setUploadedPhotoUrl('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="berita-management-container">
      {/* Search and Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-bold text-gray-550 uppercase tracking-widest">Dashboard Pengelolaan Warta & Berita</span>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul warta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.8 w-full text-xs text-gray-850 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 text-xs bg-white rounded-xl border border-gray-200 outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Kegiatan">Kegiatan</option>
            <option value="Opini">Opini</option>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Warta Aswaja">Warta Aswaja</option>
          </select>

          {isAdminOrOfficer && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Tulis Berita Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* News Table/Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBerita.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-gray-400 text-xxs rounded-2xl border border-dashed">
            Belum ada warta berita yang dipublikasi sesuai kueri filter.
          </div>
        ) : (
          filteredBerita.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-150/85 hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* News Image Cover */}
                <div className="relative h-40 bg-zinc-100">
                  <img 
                    src={item.fotoUrl} 
                    alt={item.judul} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-900 border border-[#D4AF37] text-[#D4AF37] font-sans text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {item.kategori}
                  </div>
                </div>

                {/* News Content Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-3xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {item.tanggal}
                    </span>
                    <span>•</span>
                    <span>Penulis: {item.penulis}</span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                    {item.judul}
                  </h3>

                  <p className="text-xxs text-gray-500 line-clamp-3 leading-relaxed">
                    {item.ringkasan}
                  </p>
                </div>
              </div>

              {/* Action Operations */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <a 
                  href={`/berita/${item.id}`}
                  className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold hover:underline"
                >
                  <Globe className="h-3 w-3" />
                  Lihat Publik
                </a>

                {isAdminOrOfficer && (
                  <button
                    onClick={() => {
                      if (confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen?")) {
                        onDeleteBerita(item.id);
                      }
                    }}
                    className="text-red-650 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition cursor-pointer"
                    title="Hapus Berita"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* POP-UP FORM TULIS BERITA */}
      {showAddForm && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-semibold text-gray-900">Publikasi Warta Berita Baru</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Judul Utama Berita</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MWCNU Bungah Resmikan Unit Baitul Mal Wat Tamwil Baru"
                  value={bJudul}
                  onChange={(e) => setBJudul(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Kategori Berita</label>
                  <select
                    value={bKategori}
                    onChange={(e) => setBKategori(e.target.value as any)}
                    className="w-full p-2.5 bg-white rounded-xl border border-gray-200"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Opini">Opini</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Warta Aswaja">Warta Aswaja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1">Nama Jurnalis / Penulis</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tim Media MWCNU"
                    value={bPenulis}
                    onChange={(e) => setBPenulis(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Ringkasan Berita Singkat (Untuk Feeds)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tulis 1-2 kalimat pengantar berita..."
                  value={bRingkasan}
                  onChange={(e) => setBRingkasan(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Konten Utama Berita (Deskripsi Penuh)</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Ketik liputan berita, deskripsi kegiatan, keputusan aswaja secara komprehensif di sini..."
                  value={bKonten}
                  onChange={(e) => setBKonten(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <CloudinaryUpload 
                  label="Unggah Foto Berita Utama (Cloudinary)" 
                  onUploadSuccess={(url) => setUploadedPhotoUrl(url)}
                  defaultUrl={uploadedPhotoUrl}
                  accept="image/*"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 cursor-pointer"
                >
                  Publikasikan Warta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
