import React, { useState } from 'react';
import { 
  FileText, 
  Mail, 
  Send, 
  Plus, 
  Search, 
  CheckCircle, 
  FileCheck, 
  BookOpen, 
  Printer, 
  Eye, 
  Trash2,
  FileCode,
  UserCheck
} from 'lucide-react';
import { SuratMasuk, SuratKeluar, UserRole } from '../types';
import CloudinaryUpload from './CloudinaryUpload';

interface LettersProps {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  role: UserRole;
  onAddSuratMasuk: (surat: Omit<SuratMasuk, 'id'>) => void;
  onAddSuratKeluar: (surat: Omit<SuratKeluar, 'id' | 'tanggalDibuat'>) => void;
  onUpdateSuratMasuk: (id: string, updates: Partial<SuratMasuk>) => void;
  onUpdateSuratKeluar: (id: string, updates: Partial<SuratKeluar>) => void;
}

export default function LettersView({
  suratMasukList,
  suratKeluarList,
  role,
  onAddSuratMasuk,
  onAddSuratKeluar,
  onUpdateSuratMasuk,
  onUpdateSuratKeluar
}: LettersProps) {
  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar'>('masuk');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create state models
  const [showAddMasuk, setShowAddMasuk] = useState(false);
  const [showAddKeluar, setShowAddKeluar] = useState(false);
  const [previewLetter, setPreviewLetter] = useState<SuratKeluar | null>(null);

  // Form states - Surat Masuk
  const [noSuratMasuk, setNoSuratMasuk] = useState('');
  const [pengirimMasuk, setPengirimMasuk] = useState('');
  const [perihalMasuk, setPerihalMasuk] = useState('');
  const [tglMasuk, setTglMasuk] = useState('');
  const [lampiranMasuk, setLampiranMasuk] = useState('1 Berkas');
  const [uploadedMasukFileUrl, setUploadedMasukFileUrl] = useState('');

  // Form states - Surat Keluar
  const [penerimaKeluar, setPenerimaKeluar] = useState('');
  const [perihalKeluar, setPerihalKeluar] = useState('');
  const [lampiranKeluar, setLampiranKeluar] = useState('- ');
  const [kontenKeluar, setKontenKeluar] = useState('');
  const [klasifikasiKeluar, setKlasifikasiKeluar] = useState<'A.I' | 'A.G' | 'B.I'>('A.I');
  const [uploadedKeluarFileUrl, setUploadedKeluarFileUrl] = useState('');

  // Disposisi states
  const [disposisiId, setDisposisiId] = useState<string | null>(null);
  const [disposisiKepada, setDisposisiKepada] = useState('');
  const [disposisiCatatan, setDisposisiCatatan] = useState('');

  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  // Handle Surat Masuk submission
  const handleSubmitMasuk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noSuratMasuk || !pengirimMasuk || !perihalMasuk || !tglMasuk) return;
    onAddSuratMasuk({
      nomorSurat: noSuratMasuk,
      pengirim: pengirimMasuk,
      perihal: perihalMasuk,
      tanggal: tglMasuk,
      lampiran: lampiranMasuk,
      statusDisposisi: 'Belum Disposisi',
      fileUrl: uploadedMasukFileUrl || '/images/empty_invoice.png'
    });
    // Reset
    setNoSuratMasuk('');
    setPengirimMasuk('');
    setPerihalMasuk('');
    setTglMasuk('');
    setLampiranMasuk('1 Berkas');
    setUploadedMasukFileUrl('');
    setShowAddMasuk(false);
  };

  // Handle Surat Keluar submission (starts as Draft)
  const handleSubmitKeluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penerimaKeluar || !perihalKeluar || !kontenKeluar) return;
    
    // Auto increment number logic
    const idx = suratKeluarList.length + 1;
    const padIdx = String(idx).padStart(3, '0');
    // Month Roman numeral
    const months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = months[new Date().getMonth()];
    const autoNo = `${padIdx}/MWC-NU/${klasifikasiKeluar}/${romanMonth}/${new Date().getFullYear()}`;

    onAddSuratKeluar({
      nomorSurat: autoNo,
      penerima: penerimaKeluar,
      perihal: perihalKeluar,
      tanggal: new Date().toISOString().split('T')[0],
      lampiran: lampiranKeluar,
      status: 'Draft',
      content: kontenKeluar,
      dibuatOleh: role === 'ADMIN_MWCNU' ? 'Admin Utama' : role === 'SEKRETARIS' ? 'Sekretaris' : 'Ketua Tanfidziyah',
      fileUrl: uploadedKeluarFileUrl || undefined
    });

    // Reset
    setPenerimaKeluar('');
    setPerihalKeluar('');
    setLampiranKeluar('- ');
    setKontenKeluar('');
    setUploadedKeluarFileUrl('');
    setShowAddKeluar(false);
  };

  // Submit Disposition
  const handleSaveDisposisi = (id: string) => {
    onUpdateSuratMasuk(id, {
      statusDisposisi: 'Sudah Disposisi',
      disposisiKepada: disposisiKepada || 'Syuriyah MWC',
      catatanDisposisi: disposisiCatatan || 'Harap ditindaklanjuti segera'
    });
    setDisposisiId(null);
    setDisposisiKepada('');
    setDisposisiCatatan('');
  };

  // Filtering
  const filteredMasuk = suratMasukList.filter(s => 
    s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKeluar = suratKeluarList.filter(s => 
    s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.penerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="letters-governance-view">
      {/* Tab Switcher & Headless Search Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-xs border border-gray-100">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('masuk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'masuk' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Surat Masuk ({suratMasukList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('keluar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'keluar' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Surat Keluar ({suratKeluarList.length})</span>
          </button>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari perihal, nomor, pengirim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 w-full text-xs rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
            />
          </div>

          {isAdminOrOfficer && (
            <>
              {activeTab === 'masuk' ? (
                <button
                  onClick={() => setShowAddMasuk(true)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Surat Masuk</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAddKeluar(true)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Draf Surat</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content Pane */}
      {activeTab === 'masuk' ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Nomor & Tanggal</th>
                  <th className="py-3 px-4">Pengirim</th>
                  <th className="py-3 px-4">Perihal</th>
                  <th className="py-3 px-4">Disposisi</th>
                  {isAdminOrOfficer && <th className="py-3 px-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredMasuk.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 text-xxs">Tidak ada arsip surat masuk.</td>
                  </tr>
                ) : (
                  filteredMasuk.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-gray-900 font-semibold block">{item.nomorSurat}</span>
                        <span className="text-gray-400 text-2xs block mt-1">{item.tanggal}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{item.pengirim}</td>
                      <td className="py-3 px-4 font-medium max-w-[200px] truncate">{item.perihal}</td>
                      <td className="py-3 px-4">
                        {item.statusDisposisi === 'Sudah Disposisi' ? (
                          <div className="p-2 rounded bg-amber-50 border border-amber-100 text-xxs text-amber-900">
                            <strong>Kepada:</strong> {item.disposisiKepada}<br/>
                            <strong>Catatan:</strong> {item.catatanDisposisi}
                          </div>
                        ) : (
                          <span className="text-xxs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold">Kategori: Pengarsipan</span>
                        )}
                      </td>
                      {isAdminOrOfficer && (
                        <td className="py-3 px-4 text-right space-x-2">
                          {item.statusDisposisi === 'Belum Disposisi' && (role === 'KETUA' || role === 'ADMIN_MWCNU') && (
                            <button
                              onClick={() => {
                                setDisposisiId(item.id);
                                setDisposisiKepada('Syuriyah MWC & Tanfidziyah');
                              }}
                              className="bg-amber-600 text-white select-none hover:bg-amber-700 font-semibold text-xxs py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Buat Disposisi %
                            </button>
                          )}
                          
                          {item.fileUrl && (
                            <a 
                              href={item.fileUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 text-xxs"
                            >
                              <Eye className="h-3 w-3" /> Scan Dokumen
                            </a>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Surat Keluar Workflow Panel */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs xl:col-span-2">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">Penelusuran Kelancaran Berkas Keluar</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">No. Surat & Tujuan</th>
                    <th className="py-3 px-4">Status & Otoritas</th>
                    <th className="py-3 px-4 text-right">Alur Transparansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredKeluar.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-400 text-xxs">Tidak ada draf surat keluar.</td>
                    </tr>
                  ) : (
                    filteredKeluar.map((item) => {
                      const getStatusBadge = () => {
                        switch(item.status) {
                          case 'Draft':
                            return 'bg-slate-100 text-slate-700 font-bold border border-slate-200';
                          case 'Diverifikasi Sekretaris':
                            return 'bg-blue-50 text-blue-800 font-semibold border border-blue-100';
                          case 'Disetujui Ketua':
                            return 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-100';
                          default:
                            return 'bg-gray-100 text-gray-600 border border-gray-200';
                        }
                      };

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4">
                            <span className="font-mono text-gray-800 font-semibold block">{item.nomorSurat}</span>
                            <span className="text-gray-900 font-bold text-xxs block mt-0.5 mt-1">{item.penerima}</span>
                            <span className="text-gray-400 text-3xs block">Tanggal: {item.tanggal} &bull; Perihal: {item.perihal}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block text-xxs px-2.5 py-0.5 rounded-full ${getStatusBadge()}`}>
                              {item.status}
                            </span>
                            {item.tandaTanganDigital && (
                              <span className="text-3xs block text-gray-400 mt-1 italic">Ttd: {item.tandaTanganDigital}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-1.5 flex-wrap">
                              {/* Workflow action: Secretary verify */}
                              {item.status === 'Draft' && (role === 'SEKRETARIS' || role === 'ADMIN_MWCNU') && (
                                <button
                                  onClick={() => onUpdateSuratKeluar(item.id, { status: 'Diverifikasi Sekretaris' })}
                                  className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-semibold py-1 px-2 rounded cursor-pointer"
                                  title="Verifikasi keabsahan penulisan dan penomoran"
                                >
                                  Verifikasi Sekr
                                </button>
                              )}

                              {/* Workflow action: Chairman Approval */}
                              {item.status === 'Diverifikasi Sekretaris' && (role === 'KETUA' || role === 'ADMIN_MWCNU') && (
                                <button
                                  onClick={() => onUpdateSuratKeluar(item.id, { 
                                    status: 'Disetujui Ketua',
                                    tandaTanganDigital: 'H. Achmad Shofwan, S.Ag (Ketua Tanfidziyah MWC NU)'
                                  })}
                                  className="bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-semibold py-1 px-2 rounded cursor-pointer"
                                  title="Setujui dan tanda tangani digital berkas"
                                >
                                  Ttd & Setujui
                                </button>
                              )}

                              {/* Workflow action: Archive */}
                              {item.status === 'Disetujui Ketua' && (role === 'SEKRETARIS' || role === 'ADMIN_MWCNU') && (
                                <button
                                  onClick={() => onUpdateSuratKeluar(item.id, { status: 'Diarsipkan' })}
                                  className="bg-gray-700 text-white hover:bg-gray-805 text-[10px] font-semibold py-1 px-2 rounded cursor-pointer"
                                >
                                  Arsipkan
                                </button>
                              )}

                              {item.fileUrl && (
                                <a
                                  href={item.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[10px] px-2.5 py-1 rounded inline-flex items-center gap-1 font-bold cursor-pointer border border-indigo-100"
                                >
                                  Unduh Lampiran
                                </a>
                              )}

                              <button
                                onClick={() => setPreviewLetter(item)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] px-2 py-1 rounded inline-flex items-center gap-1 cursor-pointer font-bold"
                              >
                                <Eye className="h-3.5 w-3.5" /> Kop & Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Informative guidelines */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-sans font-semibold text-gray-800 text-sm flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              <span>SOP Penomoran Resmi</span>
            </h3>
            <p className="text-xxs text-gray-500 leading-relaxed">
              Penomoran surat Majelis Wakil Cabang Nahdlatul Ulama tersistemisasi secara otomatis berdasar jenis:
            </p>
            <div className="space-y-2 text-xxs">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-emerald-800 block">Klasifikasi A.I (Internal Organisasi)</span>
                <span className="text-gray-500">Digunakan untuk urusan rutin internal pengurus, koordinasi harian, keputusan rapat pleno, dan ketetapan syuriyah.</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-emerald-800 block">Klasifikasi A.G (Eksternal Pemerintah/Instansi)</span>
                <span className="text-gray-500">Mencakup urusan hubungan kemitraan struktural di luar NU, seperti KUA, Forkopimca Camat, Dinas Sosial, atau Bupati.</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-bold text-emerald-800 block">Klasifikasi B.I (Lembaga Mandiri/Banom)</span>
                <span className="text-gray-500">Koordinasi teknis bersama Ansor, Muslimat, IPNU IPPNU, Lazisnu dalam pelaporan kas serta instruksi ad-hoc ranting.</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: ADD SURAT MASUK */}
      {showAddMasuk && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Registrasi Log Surat Masuk Baru</h3>
            <form onSubmit={handleSubmitMasuk} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Nomor Surat Asal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 024/PCNU/A.I/V/2026"
                  value={noSuratMasuk}
                  onChange={(e) => setNoSuratMasuk(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Pengirim (Instansi/Badan)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PCNU Kabupaten Gresik"
                  value={pengirimMasuk}
                  onChange={(e) => setPengirimMasuk(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Perihal Utama Surat</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delegasi Pendidikan MKNU"
                  value={perihalMasuk}
                  onChange={(e) => setPerihalMasuk(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Tanggal Terima</label>
                  <input
                    type="date"
                    required
                    value={tglMasuk}
                    onChange={(e) => setTglMasuk(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Sifat Lampiran</label>
                  <input
                    type="text"
                    required
                    value={lampiranMasuk}
                    onChange={(e) => setLampiranMasuk(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <CloudinaryUpload 
                  label="Scan Berkas Fisik Surat Masuk (Cloudinary)" 
                  onUploadSuccess={(url) => setUploadedMasukFileUrl(url)} 
                  defaultUrl={uploadedMasukFileUrl}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMasuk(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 font-medium whitespace-nowrap cursor-pointer"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 whitespace-nowrap cursor-pointer"
                >
                  Daftarkan Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SURAT KELUAR */}
      {showAddKeluar && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-xl w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Buat Konsep Draf Surat Keluar Baru</h3>
            <form onSubmit={handleSubmitKeluar} className="space-y-3 text-xs text-left">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-gray-600 font-bold mb-1 col-span-2">Penerima Surat (Tujuan)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seluruh Pimpinan Ranting NU"
                    value={penerimaKeluar}
                    onChange={(e) => setPenerimaKeluar(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Klasifikasi NU</label>
                  <select
                    value={klasifikasiKeluar}
                    onChange={(e) => setKlasifikasiKeluar(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white outline-none focus:border-emerald-600"
                  >
                    <option value="A.I">A.I (Internal)</option>
                    <option value="A.G">A.G (Eksternal)</option>
                    <option value="B.I">B.I (Lembaga)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Hal / Subjek Surat</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Undangan Halal Bihalal Koordinasi Ranting"
                  value={perihalKeluar}
                  onChange={(e) => setPerihalKeluar(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Sifat Lampiran</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Lembar / - "
                    value={lampiranKeluar}
                    onChange={(e) => setLampiranKeluar(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-medium mb-1">Nomor Penomoran Otomatis</label>
                  <input
                    type="text"
                    disabled
                    value="Generated Otomatis setelah disimpan"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-mono text-[10px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Isi Redaksional Surat (Materi Utama)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Dengan ini kami mengharap kehadiran...."
                  value={kontenKeluar}
                  onChange={(e) => setKontenKeluar(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div>
                <CloudinaryUpload 
                  label="Unggah Lampiran Berkas / Surat Pelengkap (Cloudinary)" 
                  onUploadSuccess={(url) => setUploadedKeluarFileUrl(url)}
                  defaultUrl={uploadedKeluarFileUrl}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddKeluar(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 font-medium whitespace-nowrap cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 whitespace-nowrap cursor-pointer"
                >
                  Simpan sebagai Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPOSISI DIALOG */}
      {disposisiId && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-amber-700">Tulis Disposisi Pimpinan Syuriah/Tanfidziyah</h3>
            <div className="space-y-3 text-xs text-left">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Tujukan Disposisi Tugas Kepada:</label>
                <input
                  type="text"
                  required
                  value={disposisiKepada}
                  onChange={(e) => setDisposisiKepada(e.target.value)}
                  placeholder="e.g. Lembaga Amil Zakat & Bendahara"
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-bold mb-1">Instruksi Catatan Tindakan:</label>
                <textarea
                  rows={3}
                  required
                  value={disposisiCatatan}
                  onChange={(e) => setDisposisiCatatan(e.target.value)}
                  placeholder="Segera sampaikan undangan dan koordinasi logistik..."
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-amber-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDisposisiId(null)}
                  className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSaveDisposisi(disposisiId)}
                  className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 cursor-pointer"
                >
                  Simpan & Kirim Disposisi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED KOP SURAT PREVIEW & EMULATION PRINT */}
      {previewLetter && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full p-8 my-8 relative flex flex-col">
            <button 
              onClick={() => setPreviewLetter(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-lg font-bold p-1 cursor-pointer"
            >
              &times;
            </button>

            {/* Official NU Letterhead (Kop) */}
            <div className="printable-kop border-b-4 border-double border-emerald-800 pb-4 text-center">
              <div className="flex items-center justify-center gap-4">
                {/* Visual Emblem representation with Green NU Symbol */}
                <div className="h-16 w-16 bg-emerald-700 text-white rounded-full flex flex-col justify-center items-center shadow-xs border border-emerald-600 relative overflow-hidden">
                  <div className="text-[9px] font-bold tracking-widest text-[#D4AF37]">MWCNU</div>
                  <BookOpen className="h-6 w-6 text-[#D4AF37]" />
                  <div className="text-[6px] text-emerald-100 font-mono">EST. 1926</div>
                </div>

                <div className="text-left space-y-0.5">
                  <h2 className="text-sm font-sans font-extrabold tracking-wide text-emerald-900 uppercase">
                    PENGURUS MAJELIS WAKIL CABANG NAHDLATUL ULAMA
                  </h2>
                  <h3 className="text-base font-sans font-black tracking-widest text-emerald-800 uppercase">
                    MWC NU BUNGAH
                  </h3>
                  <p className="text-[10px] text-gray-500 font-semibold font-mono">
                    Sekretariat: Jl. Raya Bungah No. 15, Bungah, Gresik, Jawa Timur | Telp/WA: +62 899 5023222
                  </p>
                  <p className="text-[9px] text-[#C5A059] italic font-semibold">
                    &quot;Merawat Jagat, Membangun Peradaban&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Letter Meta Content */}
            <div className="flex justify-between items-start pt-6 text-xs text-gray-700">
              <div className="space-y-1">
                <div><strong>Nomor:</strong> <span className="font-mono text-gray-900 font-semibold">{previewLetter.nomorSurat}</span></div>
                <div><strong>Sifat:</strong> Penting / Segera</div>
                <div><strong>Lampiran:</strong> {previewLetter.lampiran}</div>
                <div><strong>Hal:</strong> <span className="font-semibold underline text-gray-900">{previewLetter.perihal}</span></div>
              </div>
              <div className="text-right">
                <p>Bungah, {previewLetter.tanggal}</p>
                <p className="mt-1 font-semibold">Kepada Yth:</p>
                <p className="text-emerald-950 font-bold max-w-[200px] leading-tight block text-right mt-0.5">
                  {previewLetter.penerima}
                </p>
              </div>
            </div>

            {/* Letter Body (Redaksi) */}
            <div className="py-8 text-xs text-gray-900 leading-relaxed text-justify space-y-4 border-b border-gray-100 flex-1">
              <p className="font-semibold italic text-emerald-800">Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,</p>
              <p className="indent-8 font-sans">
                Salam silaturahim kami sampaikan, semoga kita semua senantiasa berada dalam lindungan dan bimbingan Allah Subhanahu Wa Ta&apos;ala dalam menjalankan aktivitas sehari-hari, Amin.
              </p>
              <p className="indent-8 whitespace-pre-wrap font-sans">
                {previewLetter.content}
              </p>
              <p className="indent-8 font-sans">
                Demikian surat pemberitahuan/undangan resmi ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama yang baik dari seluruh unsur pengurus, kami haturkan limpahan terima kasih.
              </p>
              <p className="font-semibold italic text-emerald-800 pt-2 text-right">Wallahul Muwaffiq ila Aqwamith Thariq,</p>
              <p className="font-semibold italic text-gray-800 text-right">Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.</p>
            </div>

            {/* Official Signatures Row (Tanda Tangan) */}
            <div className="grid grid-cols-2 gap-8 text-center pt-6 text-xs text-gray-850">
              <div>
                <p className="text-gray-400 select-none block">Syuriyah MWC NU</p>
                <div className="h-10 text-xxs flex items-center justify-center italic text-gray-400">
                  <span>(Ttd digital aman terverif)</span>
                </div>
                <p className="font-bold text-gray-950 border-t pt-1">KH. Sholeh Qosim, M.Pd.I</p>
                <p className="text-[10px] text-gray-500">Rais Syuriyah</p>
              </div>

              <div>
                <p className="text-gray-400 select-none block font-semibold text-emerald-950">Tanfidziyah MWC NU</p>
                <div className="h-10 text-xxs flex flex-col items-center justify-center italic text-emerald-800 font-extrabold">
                  {previewLetter.tandaTanganDigital ? (
                    <span className="p-1 px-2 border border-emerald-200 bg-emerald-50 rounded text-[9px] block">
                      &bull; {previewLetter.tandaTanganDigital} &bull;
                    </span>
                  ) : (
                    <span className="text-gray-400 text-3xs italic font-normal">Belum Dttd - Menunggu Persetujuan Ketua</span>
                  )}
                </div>
                <p className="font-bold text-gray-950 border-t pt-1">H. Achmad Shofwan, S.Ag</p>
                <p className="text-[10px] text-gray-500">Ketua Tanfidziyah</p>
              </div>
            </div>

            {/* Footer Admin Stamp Area */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6 text-[9.5px] text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                {/* Standard Admin Barcode QR */}
                <div className="bg-gray-100 p-1 border rounded block">
                  <div className="h-8 w-8 bg-zinc-800 flex justify-center items-center text-white text-[8px] font-bold">QR-SEC</div>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Arsip Otomatis Terenkripsi</p>
                  <p>Hash-ID: SK-{previewLetter.id}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" /> Cetak Lembar Surat
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
