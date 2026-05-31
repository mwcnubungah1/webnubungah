import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Tag, 
  Plus, 
  Download, 
  Info, 
  Globe, 
  Lock,
  ChevronRight,
  RefreshCw,
  FolderMinus,
  FileText
} from 'lucide-react';
import { ArsipDokumen, UserRole } from '../types';
import CloudinaryUpload from './CloudinaryUpload';

interface ArsipProps {
  arsipList: ArsipDokumen[];
  role: UserRole;
  onAddArsip: (document: Omit<ArsipDokumen, 'id'>) => void;
  onDeleteArsip: (id: string) => void;
}

export default function ArsipView({
  arsipList,
  role,
  onAddArsip,
  onDeleteArsip
}: ArsipProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddArsip, setShowAddArsip] = useState(false);
  const [viewDetailsDoc, setViewDetailsDoc] = useState<ArsipDokumen | null>(null);

  // Form states
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<ArsipDokumen['kategori']>('SK');
  const [docTagString, setDocTagString] = useState('');
  const [docVersion, setDocVersion] = useState('v1.0');
  const [docSize, setDocSize] = useState('1.5 MB');
  const [docDesc, setDocDesc] = useState('');
  const [docPublic, setDocPublic] = useState(true);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const categories: ArsipDokumen['kategori'][] = ['SK', 'AD/ART', 'SOP', 'Proposal', 'LPJ', 'Notulen', 'Surat', 'Lainnya'];
  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  // Extract all unique tags
  const allTags = Array.from(
    new Set(arsipList.flatMap(doc => doc.tags))
  );

  // Filtering
  const filteredArsip = arsipList.filter(doc => {
    // Audit check on public transparency
    if (!isAdminOrOfficer && !doc.publicAccess) return false;

    const matchesSearch = doc.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || doc.kategori === selectedCategory;
    const matchesTag = !selectedTag || doc.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Handle addition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docDesc) return;

    // Convert comma tags to array
    const docTags = docTagString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onAddArsip({
      nama: docName,
      kategori: docCategory,
      tanggal: new Date().toISOString().split('T')[0],
      tags: docTags.length > 0 ? docTags : [docCategory, 'Digital'],
      versi: docVersion || 'v1.0',
      fileSize: docSize || '2.1 MB',
      deskripsi: docDesc,
      fileUrl: uploadedFileUrl || '#mock-file-view',
      publicAccess: docPublic
    });

    // Reset Form
    setDocName('');
    setDocCategory('SK');
    setDocTagString('');
    setDocVersion('v1.0');
    setDocSize('1.2 MB');
    setDocDesc('');
    setDocPublic(true);
    setUploadedFileUrl('');
    setShowAddArsip(false);
  };

  return (
    <div className="space-y-6" id="digital-archive-view">
      {/* Search Header and Upload Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pencarian cepat judul berkas, tag, atau isi ringkasan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 w-full text-xs rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
          />
        </div>

        {isAdminOrOfficer && (
          <button
            onClick={() => setShowAddArsip(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer shadow-xs whitespace-nowrap self-stretch md:self-auto text-center justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Arsip Baru</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <div className="space-y-4 lg:col-span-1">
          {/* Categories Box */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
            <h3 className="text-xxs font-extrabold uppercase tracking-widest text-gray-400 mb-3 flex items-center justify-between">
              <span>Saringan Kategori</span>
              <FolderOpen className="h-3.5 w-3.5 text-gray-400" />
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => { setSelectedCategory('Semua'); setSelectedTag(null); }}
                className={`w-full text-left py-1.5 px-3 rounded-lg flex justify-between items-center transition-colors cursor-pointer ${
                  selectedCategory === 'Semua' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-gray-650 hover:bg-gray-50'
                }`}
              >
                <span>Seluruh Dokumen</span>
                <span className="font-mono text-xxs bg-gray-105 px-1.5 py-0.5 rounded-full">{arsipList.length}</span>
              </button>
              {categories.map((cat) => {
                const count = arsipList.filter(d => d.kategori === cat && (isAdminOrOfficer || d.publicAccess)).length;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSelectedTag(null); }}
                    className={`w-full text-left py-1.5 px-3 rounded-lg flex justify-between items-center transition-colors cursor-pointer ${
                      selectedCategory === cat ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-gray-655 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="font-mono text-xxs bg-gray-105 px-1.5 py-0.5 rounded-full">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tags Box */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
            <h3 className="text-xxs font-extrabold uppercase tracking-widest text-gray-400 mb-3 flex items-center justify-between">
              <span>Filter Berdasar Tag</span>
              <Tag className="h-3.5 w-3.5 text-gray-400" />
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-3xs font-semibold py-1 px-2.5 rounded-full border transition-colors cursor-pointer ${
                  !selectedTag ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                Semua Tag
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-3xs font-semibold py-1 px-2.5 rounded-full border transition-colors cursor-pointer ${
                    selectedTag === tag ? 'bg-emerald-600 text-white border-emerald-600 font-bold' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Archives List Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 flex items-center justify-between">
            <span className="text-xs text-gray-550 font-medium">Menampilkan <strong>{filteredArsip.length}</strong> berkas tervalidasi</span>
            <span className="text-xxs text-gray-400">Total size: ~31 MB</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArsip.length === 0 ? (
              <div className="col-span-full bg-white py-12 rounded-2xl text-center border p-6 flex flex-col items-center justify-center">
                <FolderMinus className="h-10 w-10 text-gray-300 mb-2" />
                <h4 className="text-xs font-bold text-gray-700">Dokumen tidak ditemukan</h4>
                <p className="text-xxs text-gray-400 mt-0.5">Cobalah mengubah filter kategori atau kata kunci cari Anda.</p>
              </div>
            ) : (
              filteredArsip.map((doc) => (
                <div 
                  key={doc.id} 
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-emerald-350 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xxs px-2.5 py-0.5 font-extrabold rounded-md uppercase tracking-wider bg-emerald-50 text-emerald-800">
                        {doc.kategori}
                      </span>
                      <span className="text-xxs text-gray-400 font-mono italic">Versi {doc.versi} ({doc.fileSize})</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-950 leading-tight line-clamp-1">{doc.nama}</h4>
                      <p className="text-xxs text-gray-500 leading-relaxed line-clamp-2">{doc.deskripsi}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map(t => (
                        <span key={t} className="text-[9px] text-gray-400 font-mono">#{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {doc.publicAccess ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-bold" title="Dapat diakses oleh Publik Warga NU">
                          <Globe className="h-3 w-3" /> Publik
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-bold hover:cursor-help" title="Hanya diakses oleh Pengurus/Admin">
                          <Lock className="h-3 w-3" /> Rahasia Kantor
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewDetailsDoc(doc)}
                        className="text-gray-500 hover:text-gray-900 font-bold p-1 hover:bg-gray-50 rounded"
                        title="Rincian Berkas"
                      >
                        <Info className="h-4 w-4" />
                      </button>

                      <a
                        href={doc.fileUrl}
                        download
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Unduh simulasi berkas: "${doc.nama}" [${doc.fileSize}] berhasil dimulai.`);
                        }}
                        className="text-emerald-700 hover:text-emerald-900 font-bold p-1 hover:bg-emerald-50 rounded"
                        title="Unduh Berkas PDF"
                      >
                        <Download className="h-4 w-4" />
                      </a>

                      {isAdminOrOfficer && (
                        <button
                          onClick={() => {
                            if(confirm(`Apakah Anda yakin ingin menghapus arsip "${doc.nama}" dari basis digital?`)) {
                              onDeleteArsip(doc.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 font-semibold p-1 hover:bg-red-50 rounded cursor-pointer"
                          title="Hapus Arsip"
                        >
                          <ChevronRight className="h-4 w-4 text-red-500 hover:scale-110" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* UPLOAD FORM POP-UP */}
      {showAddArsip && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Arsipkan Berkas Baru ke Cloud MWCNU</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Judul / Nama Dokumen Resmi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surat Keputusan Koordinator LAZISNU"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Kategori Dokumen</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Versi Rilis Dokumen</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v1.0 Final atau Draft"
                    value={docVersion}
                    onChange={(e) => setDocVersion(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Ringkasan Deskripsi / Pokok Ketetapan</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tulislah intisari dokumen agar dapat dicari pengurus lain dengan mudah..."
                  value={docDesc}
                  onChange={(e) => setDocDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Daftar Tag Kunci (pisahkan dengan koma)</label>
                <input
                  type="text"
                  placeholder="e.g. SK, LAZISNU, Bantuan Keuangan"
                  value={docTagString}
                  onChange={(e) => setDocTagString(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-700">Izin Akses Publik</h4>
                  <p className="text-[10px] text-gray-400">Jika aktif, dokumen ini tampil di portal transparansi publik.</p>
                </div>
                <input
                  type="checkbox"
                  checked={docPublic}
                  onChange={(e) => setDocPublic(e.target.checked)}
                  className="h-4 w-4 bg-emerald-600 rounded text-emerald-600"
                />
              </div>

              <div>
                <CloudinaryUpload 
                  label="Unggah Berkas Arsip Digital (Cloudinary)" 
                  onUploadSuccess={(url) => setUploadedFileUrl(url)}
                  defaultUrl={uploadedFileUrl}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddArsip(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-750 rounded-xl hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700"
                >
                  Arsipkan Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewDetailsDoc && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] bg-indigo-50 text-indigo-800 font-extrabold tracking-wide py-0.5 px-2 rounded">Arsip Digital Resmi</span>
              <button onClick={() => setViewDetailsDoc(null)} className="text-gray-400 hover:text-gray-900 text-lg font-bold">&times;</button>
            </div>
            
            <div className="space-y-2 text-left">
              <h3 className="text-xs font-bold text-gray-900">{viewDetailsDoc.nama}</h3>
              <p className="text-xxs text-gray-600 leading-relaxed font-sans">{viewDetailsDoc.deskripsi}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 text-xxs space-y-1.5 text-left text-gray-550 font-sans">
              <div><strong>Kategori:</strong> {viewDetailsDoc.kategori}</div>
              <div><strong>Tanggal Arsip:</strong> {viewDetailsDoc.tanggal}</div>
              <div><strong>Status Transparansi:</strong> {viewDetailsDoc.publicAccess ? 'Publik (Warga NU dapat mengunduh)' : 'Rahasia Internal Kantor'}</div>
              <div><strong>Ukuran File:</strong> {viewDetailsDoc.fileSize}</div>
              <div><strong>Versi Dokumen:</strong> {viewDetailsDoc.versi}</div>
              <div className="flex flex-wrap gap-1 pt-1">
                {viewDetailsDoc.tags.map(t => <span key={t} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono text-3xs">#{t}</span>)}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewDetailsDoc(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
