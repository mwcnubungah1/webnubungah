import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  Camera, 
  Link2, 
  Eye, 
  Film,
  Search,
  Grid
} from 'lucide-react';
import { DokumentasiKegiatan, ProgramKerja, AnggotaPengurus, UserRole } from '../types';

interface DokuProps {
  dokumentasiList: DokumentasiKegiatan[];
  programList: ProgramKerja[];
  anggotaList: AnggotaPengurus[];
  role: UserRole;
  onAddDokumentasi: (doku: Omit<DokumentasiKegiatan, 'id'>) => void;
}

export default function DokumentasiView({
  dokumentasiList,
  programList,
  anggotaList,
  role,
  onAddDokumentasi
}: DokuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('Semua');
  const [showAddDoku, setShowAddDoku] = useState(false);
  const [selectedPhotoLightBox, setSelectedPhotoLightBox] = useState<DokumentasiKegiatan | null>(null);

  // Form states - Dokumentasi
  const [dJudul, setDJudul] = useState('');
  const [dProgramId, setDProgramId] = useState('');
  const [dTanggal, setDTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [dDeskripsi, setDDeskripsi] = useState('');
  const [dLokasi, setDLokasi] = useState('');
  const [dPengurusInvolved, setDPengurusInvolved] = useState<string[]>([]);
  const [dCoverUrl, setDCoverUrl] = useState('');

  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  // Helper filters
  const filteredDoku = dokumentasiList.filter(d => {
    const matchesSearch = d.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = selectedProgramFilter === 'Semua' || d.programKerjaId === selectedProgramFilter;

    return matchesSearch && matchesProgram;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dJudul || !dDeskripsi || !dLokasi) return;

    // Use default beautiful Unsplash image if none provided
    const cover = dCoverUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80';

    onAddDokumentasi({
      judul: dJudul,
      programKerjaId: dProgramId || undefined,
      tanggal: dTanggal,
      deskripsi: dDeskripsi,
      lokasi: dLokasi,
      pengurusTerlibat: dPengurusInvolved.length > 0 ? dPengurusInvolved : ['H. Achmad Shofwan S.Ag'],
      fotos: [cover, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop&q=80']
    });

    // Reset Form
    setDJudul('');
    setDProgramId('');
    setDDeskripsi('');
    setDLokasi('');
    setDPengurusInvolved([]);
    setDCoverUrl('');
    setShowAddDoku(false);
  };

  return (
    <div className="space-y-6" id="documentation-gallery-view">
      
      {/* Search and Setup Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Grid className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-bold text-gray-550 uppercase tracking-widest">Album Dokumentasi Kegiatan</span>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari album, lokasi kegiatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.8 w-full text-xs text-gray-850 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
            />
          </div>

          {isAdminOrOfficer && (
            <button
              onClick={() => setShowAddDoku(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Unggah Album</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Albums */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoku.map((album) => {
          // Find connected program
          const prog = programList.find(p => p.id === album.programKerjaId);

          return (
            <div 
              key={album.id} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
              onClick={() => setSelectedPhotoLightBox(album)}
            >
              {/* Cover Photo */}
              <div className="relative h-44 overflow-hidden bg-emerald-950">
                <img 
                  src={album.fotos[0]} 
                  alt={album.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] text-indigo-300 font-mono tracking-wide">{album.tanggal}</span>
                  <h4 className="text-white text-xs font-bold leading-tight line-clamp-1 mt-0.5">{album.judul}</h4>
                </div>
                
                {album.videoUrl && (
                  <div className="absolute top-3 right-3 bg-red-650 text-white rounded-full p-1 border shadow">
                    <Film className="h-4.5 w-4.5 text-red-100" />
                  </div>
                )}
              </div>

              {/* Information Row */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xxs text-gray-500 leading-relaxed line-clamp-2">{album.deskripsi}</p>
                
                <div className="space-y-1.5 text-3xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#C5A059]" />
                    <span className="truncate">Lokasi: {album.lokasi}</span>
                  </div>

                  {prog && (
                    <div className="flex items-center gap-1">
                      <Link2 className="h-3 w-3 text-indigo-500" />
                      <span className="truncate font-semibold text-gray-700">Program: {prog.nama}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-emerald-600" />
                    <span className="truncate">Pelaksana: {album.pengurusTerlibat.join(', ')}</span>
                  </div>
                </div>

                <div className="border-t pt-2 mt-2 flex justify-between items-center text-xxs font-semibold text-emerald-800">
                  <span>Lihat Galeri Cover &bull; {album.fotos.length} Foto</span>
                  <button className="bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> Buka Detail
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POP-UP DETAILED EXPOSURE LIGHTBOX */}
      {selectedPhotoLightBox && (
        <div className="fixed inset-0 bg-gray-950/75 backdrop-blur-xxs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative border border-gray-850 flex flex-col my-8">
            <button 
              onClick={() => setSelectedPhotoLightBox(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white h-8 w-8 rounded-full flex justify-center items-center font-bold text-xl cursor-pointer z-50 border border-white/20"
            >
              &times;
            </button>

            {/* Showcase Main Image */}
            <div className="h-64 md:h-80 w-full overflow-hidden bg-emerald-950/40 relative">
              <img 
                src={selectedPhotoLightBox.fotos[0]} 
                alt={selectedPhotoLightBox.judul} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950 via-black/30 to-transparent p-6 text-white">
                <span className="text-xxs text-[#D4AF37] font-mono font-bold tracking-wide">{selectedPhotoLightBox.tanggal}</span>
                <h3 className="text-sm md:text-base font-extrabold leading-tight mt-1">{selectedPhotoLightBox.judul}</h3>
              </div>
            </div>

            {/* Description Details */}
            <div className="p-6 space-y-4 text-xs text-left text-gray-800">
              <div className="space-y-1">
                <span className="font-extrabold text-emerald-800 text-[10px] uppercase block tracking-wider">Latar Belakang & Liputan Kegiatan:</span>
                <p className="text-gray-600 leading-relaxed font-sans">{selectedPhotoLightBox.deskripsi}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xxs leading-normal font-sans text-gray-550">
                <div>
                  <span className="block font-bold text-gray-800 flex items-center gap-1 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Lokasi Kegiatan:
                  </span>
                  <p>{selectedPhotoLightBox.lokasi}</p>
                </div>
                <div>
                  <span className="block font-bold text-gray-800 flex items-center gap-1 mb-1">
                    <Users className="h-3.5 w-3.5 text-emerald-600" /> Pengurus / Lembaga Pengampu:
                  </span>
                  <p className="font-semibold text-emerald-950">{selectedPhotoLightBox.pengurusTerlibat.join(', ')}</p>
                </div>
              </div>

              {/* Sub Gallery Pictures */}
              <div className="space-y-2 border-t pt-4">
                <span className="font-extrabold text-[#C5A059] text-[10px] uppercase block tracking-wider">Koleksi Album Terkait:</span>
                <div className="grid grid-cols-3 gap-2">
                  {selectedPhotoLightBox.fotos.map((img, index) => (
                    <div key={index} className="h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 hover:opacity-90">
                      <img src={img} alt="album sub" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setSelectedPhotoLightBox(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.8 px-5 rounded-xl cursor-pointer"
              >
                Kembali ke Galeri
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP USULKAN DOKUMENTASI BARU */}
      {showAddDoku && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Unggah Dokumentasi Kegiatan Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Istighosah Kubro Ranting Lemahputro"
                  value={dJudul}
                  onChange={(e) => setDJudul(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Dihubungkan dengan Program Kerja</label>
                  <select
                    value={dProgramId}
                    onChange={(e) => setDProgramId(e.target.value)}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none"
                  >
                    <option value="">-- Pilih Program (Opsional) --</option>
                    {programList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1">Tanggal Kegiatan</label>
                  <input
                    type="date"
                    required
                    value={dTanggal}
                    onChange={(e) => setDTanggal(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Lokasi Detail (Tag Spasial)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masjid Baitussalam Lemahputro"
                    value={dLokasi}
                    onChange={(e) => setDLokasi(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Gambar Cover URL (Opsional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/xxx"
                    value={dCoverUrl}
                    onChange={(e) => setDCoverUrl(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Panitia / Pengurus Terlibat (Koma Berkelanjutan)</label>
                <input
                  type="text"
                  placeholder="e.g. KH. Syarif Hidayat, Drs. H. Choirul Anam"
                  value={dPengurusInvolved.join(', ')}
                  onChange={(e) => setDPengurusInvolved(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Ulasan / Liputan Berita Singkat</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan ulasan ringkas mengenai jalannya acara baksos, kajian, atau turba..."
                  value={dDeskripsi}
                  onChange={(e) => setDDeskripsi(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddDoku(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 cursor-pointer"
                >
                  Posting Album
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
