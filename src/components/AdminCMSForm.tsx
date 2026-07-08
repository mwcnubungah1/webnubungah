import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { 
  Role, Ranting, ModelType,
  Kader, Kegiatan, TransparansiDana, KoinS3, Persuratan, Usaha, 
  SaranaIbadah, SaranaPendidikan, Berita, Dokumentasi, Aspirasi, Pengurus
} from '../types';
import { isCloudinaryConfigured, uploadToCloudinary } from '../lib/cloudinaryClient';

interface AdminCMSFormProps {
  activeModel: ModelType;
  editItemId: string | null;
  rantings: Ranting[];
  userRole: Role;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  
  // Lists for finding items during edit prefill
  kaderList: Kader[];
  kegiatanList: Kegiatan[];
  kasList: TransparansiDana[];
  koinList: KoinS3[];
  suratList: Persuratan[];
  usahaList: Usaha[];
  saranaIbadahList: SaranaIbadah[];
  saranaPendidikanList: SaranaPendidikan[];
  beritaList: Berita[];
  dokumentasiList: Dokumentasi[];
  aspirasiList: Aspirasi[];
  pengurusList: Pengurus[];
}

export default function AdminCMSForm({
  activeModel,
  editItemId,
  rantings,
  userRole,
  onClose,
  onSubmit,
  kaderList,
  kegiatanList,
  kasList,
  koinList,
  suratList,
  usahaList,
  saranaIbadahList,
  saranaPendidikanList,
  beritaList,
  dokumentasiList,
  aspirasiList,
  pengurusList
}: AdminCMSFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize/Prefill Form State
  useEffect(() => {
    if (editItemId) {
      let item: any = null;
      switch (activeModel) {
        case 'kader': item = kaderList.find(i => i.id === editItemId); break;
        case 'kegiatan': item = kegiatanList.find(i => i.id === editItemId); break;
        case 'keuangan': item = kasList.find(i => i.id === editItemId); break;
        case 'koin_s3': item = koinList.find(i => i.id === editItemId); break;
        case 'aspirasi': item = aspirasiList.find(i => i.id === editItemId); break;
        case 'persuratan': item = suratList.find(i => i.id === editItemId); break;
        case 'usaha': item = usahaList.find(i => i.id === editItemId); break;
        case 'sarana_ibadah': item = saranaIbadahList.find(i => i.id === editItemId); break;
        case 'sarana_pendidikan': item = saranaPendidikanList.find(i => i.id === editItemId); break;
        case 'berita': item = beritaList.find(i => i.id === editItemId); break;
        case 'dokumentasi': item = dokumentasiList.find(i => i.id === editItemId); break;
        case 'pengurus': item = pengurusList?.find(i => i.id === editItemId); break;
      }
      if (item) {
        setFormData({ ...item });
      }
    } else {
      const nowStr = new Date().toISOString().slice(0, 10);
      const defaultData: Record<string, any> = {
        kader: {
          name: '', pob: 'Gresik', dob: '2000-01-01', gender: 'Laki-laki',
          banom: 'Ansor', role: '', rantingId: 'r1', phone: '', joinYear: 2020, photoUrl: ''
        },
        kegiatan: {
          title: '', date: nowStr, location: '', organizer: 'MWC NU Bungah',
          targetGroup: 'Masyarakat Umum', fundingSource: 'Kas Jamiyah',
          budget: 2000000, status: 'Rencana', description: '', imageUrl: ''
        },
        keuangan: {
          date: nowStr, type: 'Masuk', category: 'Iuran Anggota',
          amount: 500000, description: '', pic: '', imageUrl: ''
        },
        koin_s3: {
          month: nowStr.slice(0, 7), rantingId: 'r1', amount: 1500000,
          distributionTarget: 'Bantuan Sosial Dhuafa', distributionAmount: 1000000, imageUrl: ''
        },
        aspirasi: {
          name: '', phone: '', email: '', rantingId: 'r1',
          subject: '', message: '', date: nowStr, status: 'Masuk', imageUrl: ''
        },
        persuratan: {
          letterNumber: '', type: 'Masuk', code: 'A.I', senderOrRecipient: '',
          date: nowStr, subject: '', attachmentUrl: '', tembusan: ''
        },
        usaha: {
          name: '', type: 'Toko', location: '', manager: '',
          status: 'Aktif', revenue: 5000000, imageUrl: ''
        },
        sarana_ibadah: {
          name: '', type: 'Masjid', takmir: '', imam1: '', imam2: '',
          nuAffiliation: 'Milik NU', landStatus: 'Wakaf NU', address: '', rantingId: 'r1', imageUrl: ''
        },
        sarana_pendidikan: {
          name: '', level: 'MI', status: 'Swasta NU', principal: '',
          studentCount: 200, phone: '', condition: 'Baik', address: '', rantingId: 'r1', imageUrl: ''
        },
        berita: {
          title: '', category: 'Warta Jamiyah', content: '', imageUrl: '',
          date: nowStr, author: 'Sekretariat MWC'
        },
        dokumentasi: {
          title: '', type: 'Foto', url: '', date: nowStr, category: 'Kegiatan'
        },
        pengurus: {
          name: '', role: 'Tanfidziyah', category: 'MWC', rantingId: 'r1',
          phone: '', email: '', kaderisasiStatus: 'PD-PKPNU', education: 'S1', photoUrl: ''
        }
      };
      setFormData(defaultData[activeModel] || {});
    }
  }, [editItemId, activeModel]);

  const updateField = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  // Cloudinary File Upload handler
  const handleFileUpload = async (file: File, fieldName: string) => {
    setUploading(true);
    setUploadError(null);
    try {
      const secureUrl = await uploadToCloudinary(file);
      updateField(fieldName, secureUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], fieldName);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Render Uploader Area with drag & drop
  const renderUploader = (fieldName: string) => {
    const isConfigured = isCloudinaryConfigured;
    return (
      <div className="space-y-1.5 col-span-1 sm:col-span-2">
        <label className="font-semibold text-slate-600">Media/Lampiran (Upload Cloudinary)</label>
        
        <div 
          onDragEnter={handleDrag} 
          onDragOver={handleDrag} 
          onDragLeave={handleDrag} 
          onDrop={(e) => handleDrop(e, fieldName)}
          className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-all ${
            dragActive ? 'border-tosca-600 bg-tosca-50' : 'border-slate-200 bg-slate-50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-5 h-5 text-tosca-600 animate-spin" />
              <span className="text-slate-500 text-[10px]">Mengunggah ke Cloudinary...</span>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <Upload className="w-5 h-5 text-slate-400 mx-auto" />
              <div className="text-[11px] text-slate-600 font-medium">
                {isConfigured ? 'Drag & drop berkas, atau click untuk memilih' : 'Cloudinary belum dikonfigurasi (Gunakan URL Manual di bawah)'}
              </div>
              {isConfigured && (
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], fieldName)}
                  className="hidden" 
                  id="cloudinary-file-input" 
                />
              )}
              {isConfigured && (
                <label htmlFor="cloudinary-file-input" className="cursor-pointer text-[10px] text-tosca-700 underline font-semibold">
                  Pilih file lokal
                </label>
              )}
            </div>
          )}
        </div>

        {uploadError && (
          <div className="text-red-600 text-[10px] font-semibold flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{uploadError}</span>
          </div>
        )}

        <div className="space-y-1 mt-2">
          <label className="font-semibold text-slate-500 text-[10px]">Tautan URL Langsung (Otomatis terisi jika upload sukses)</label>
          <input 
            type="text"
            value={formData[fieldName] || ''}
            onChange={(e) => updateField(fieldName, e.target.value)}
            placeholder="Contoh: https://images.unsplash.com/... atau https://res.cloudinary.com/..."
            className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-mono"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4 animate-slideDown">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <h4 className="font-display font-bold text-slate-800 text-sm">
          {editItemId ? 'Ubah' : 'Tambah'} Entri Baru - {activeModel.toUpperCase()}
        </h4>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-4 text-xs">
        {activeModel === 'kader' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Lengkap *</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tempat Lahir</label>
              <input type="text" value={formData.pob || ''} onChange={(e) => updateField('pob', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tanggal Lahir</label>
              <input type="date" value={formData.dob || ''} onChange={(e) => updateField('dob', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jenis Kelamin</label>
              <select value={formData.gender || 'Laki-laki'} onChange={(e) => updateField('gender', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Banom</label>
              <select value={formData.banom || 'Ansor'} onChange={(e) => updateField('banom', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
                <option value="Ansor">Ansor</option>
                <option value="Fatayat">Fatayat</option>
                <option value="Muslimat">Muslimat</option>
                <option value="Banser">Banser</option>
                <option value="Pagar Nusa">Pagar Nusa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jabatan di Organisasi *</label>
              <input type="text" required value={formData.role || ''} onChange={(e) => updateField('role', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Ranting Desa</label>
              <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="mwc">MWC (Tingkat Kecamatan)</option>
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">No. HP / WA *</label>
              <input type="text" required value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tahun Bergabung</label>
              <input type="number" value={formData.joinYear || 2020} onChange={(e) => updateField('joinYear', parseInt(e.target.value) || 2020)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            {renderUploader('photoUrl')}
          </div>
        )}

        {activeModel === 'pengurus' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">Nama Lengkap *</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jabatan di Organisasi *</label>
              <input type="text" required value={formData.role || ''} onChange={(e) => updateField('role', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Contoh: Syuriah, Tanfidziyah, Ketua, Sekretaris" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tingkatan Pengurus</label>
              <select value={formData.category || 'MWC'} onChange={(e) => updateField('category', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="MWC">MWC (Tingkat Kecamatan)</option>
                <option value="Ranting">Ranting (Tingkat Desa)</option>
              </select>
            </div>
            {formData.category === 'Ranting' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Ranting Desa</label>
                <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                  {rantings.filter(r => r.id !== 'mwc').map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">No. HP / WA *</label>
              <input type="text" required value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Email</label>
              <input type="email" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Status Kaderisasi</label>
              <select value={formData.kaderisasiStatus || 'Belum'} onChange={(e) => updateField('kaderisasiStatus', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Belum">Belum Kaderisasi</option>
                <option value="PD-PKPNU">PD-PKPNU</option>
                <option value="PMKNU">PMKNU</option>
                <option value="MKNU">MKNU</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Pendidikan Akhir</label>
              <input type="text" value={formData.education || ''} onChange={(e) => updateField('education', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Contoh: S1, S2, SMA, Pesantren" />
            </div>
            {renderUploader('photoUrl')}
          </div>
        )}

        {activeModel === 'kegiatan' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Judul Kegiatan *</label>
              <input type="text" required value={formData.title || ''} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tanggal Pelaksanaan *</label>
              <input type="date" required value={formData.date || ''} onChange={(e) => updateField('date', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Lokasi Tempat *</label>
              <input type="text" required value={formData.location || ''} onChange={(e) => updateField('location', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Penyelenggara *</label>
              <input type="text" required value={formData.organizer || ''} onChange={(e) => updateField('organizer', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Target Peserta</label>
              <input type="text" value={formData.targetGroup || ''} onChange={(e) => updateField('targetGroup', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Sumber Dana</label>
              <select value={formData.fundingSource || 'Kas Jamiyah'} onChange={(e) => updateField('fundingSource', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Kas Jamiyah">Kas Jamiyah</option>
                <option value="Koin S3">Koin S3</option>
                <option value="Donatur">Donatur</option>
                <option value="Sponsor">Sponsor</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Rencana Anggaran (Rp) *</label>
              <input type="number" required value={formData.budget || 0} onChange={(e) => updateField('budget', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Status</label>
              <select value={formData.status || 'Rencana'} onChange={(e) => updateField('status', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Rencana">Rencana</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-600">Deskripsi Kegiatan *</label>
              <textarea rows={3} required value={formData.description || ''} onChange={(e) => updateField('description', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 leading-relaxed" />
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'keuangan' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tanggal Pencatatan *</label>
              <input type="date" required value={formData.date || ''} onChange={(e) => updateField('date', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jenis Arus Kas</label>
              <select value={formData.type || 'Masuk'} onChange={(e) => updateField('type', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Masuk">Kas Masuk (Debit)</option>
                <option value="Keluar">Kas Keluar (Kredit)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Kategori Kas *</label>
              <select value={formData.category || 'Iuran Anggota'} onChange={(e) => updateField('category', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Iuran Anggota">Iuran Anggota</option>
                <option value="Donasi Publik">Donasi Publik</option>
                <option value="Operasional Kantor">Operasional Kantor</option>
                <option value="Bantuan Sosial">Bantuan Sosial</option>
                <option value="Program Keagamaan">Program Keagamaan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jumlah Kas (Rp) *</label>
              <input type="number" required value={formData.amount || 0} onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Penanggung Jawab (PIC) *</label>
              <input type="text" required value={formData.pic || ''} onChange={(e) => updateField('pic', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-600">Keterangan / Rincian Kas *</label>
              <textarea rows={2} required value={formData.description || ''} onChange={(e) => updateField('description', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'koin_s3' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Bulan Kegiatan *</label>
              <input type="month" required value={formData.month || ''} onChange={(e) => updateField('month', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Ranting NU Desa *</label>
              <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Perolehan Koin S3 (Rp) *</label>
              <input type="number" required value={formData.amount || 0} onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Alokasi Biaya Penyaluran (Rp) *</label>
              <input type="number" required value={formData.distributionAmount || 0} onChange={(e) => updateField('distributionAmount', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-600">Sasaran Distribusi / Pilar Penyaluran *</label>
              <input type="text" required value={formData.distributionTarget || ''} onChange={(e) => updateField('distributionTarget', e.target.value)} placeholder="Misal: Sembako Dhuafa & Beasiswa" className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'aspirasi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Warga *</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">No. WA *</label>
              <input type="text" required value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Email</label>
              <input type="email" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Asal Wilayah Ranting</label>
              <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                {rantings.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">Subjek Aspirasi *</label>
              <input type="text" required value={formData.subject || ''} onChange={(e) => updateField('subject', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-600">Isi Pesan Lengkap *</label>
              <textarea rows={4} required value={formData.message || ''} onChange={(e) => updateField('message', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Status</label>
              <select value={formData.status || 'Masuk'} onChange={(e) => updateField('status', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Masuk">Masuk</option>
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'persuratan' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">No. Surat *</label>
              <input type="text" required value={formData.letterNumber || ''} onChange={(e) => updateField('letterNumber', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jenis Surat</label>
              <select value={formData.type || 'Masuk'} onChange={(e) => updateField('type', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Masuk">Surat Masuk</option>
                <option value="Keluar">Surat Keluar</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Kode Klasifikasi (e.g., A.I, B.II) *</label>
              <input type="text" required value={formData.code || ''} onChange={(e) => updateField('code', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Pengirim atau Penerima *</label>
              <input type="text" required value={formData.senderOrRecipient || ''} onChange={(e) => updateField('senderOrRecipient', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tanggal Surat *</label>
              <input type="date" required value={formData.date || ''} onChange={(e) => updateField('date', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Perihal / Subjek *</label>
              <input type="text" required value={formData.subject || ''} onChange={(e) => updateField('subject', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">Tembusan</label>
              <input type="text" value={formData.tembusan || ''} onChange={(e) => updateField('tembusan', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            {renderUploader('attachmentUrl')}
          </div>
        )}

        {activeModel === 'usaha' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Usaha *</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jenis Bidang Usaha</label>
              <select value={formData.type || 'Toko'} onChange={(e) => updateField('type', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Toko">Toko / Ritel</option>
                <option value="Jasa">Jasa / Servis</option>
                <option value="Pertanian">Pertanian / Perkebunan</option>
                <option value="Kuliner">Kuliner</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Lokasi Usaha *</label>
              <input type="text" required value={formData.location || ''} onChange={(e) => updateField('location', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Pengelola / Manager *</label>
              <input type="text" required value={formData.manager || ''} onChange={(e) => updateField('manager', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Omzet Bulanan (Rp) *</label>
              <input type="number" required value={formData.revenue || 0} onChange={(e) => updateField('revenue', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Status Operasional</label>
              <select value={formData.status || 'Aktif'} onChange={(e) => updateField('status', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Aktif">Aktif</option>
                <option value="Non-aktif">Non-aktif</option>
              </select>
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'sarana_ibadah' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Tempat Ibadah *</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tipe</label>
              <select value={formData.type || 'Masjid'} onChange={(e) => updateField('type', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Masjid">Masjid</option>
                <option value="Musholla">Musholla</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Ketua Takmir *</label>
              <input type="text" required value={formData.takmir || ''} onChange={(e) => updateField('takmir', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Imam Utama (1) *</label>
              <input type="text" required value={formData.imam1 || ''} onChange={(e) => updateField('imam1', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Imam Cadangan (2) *</label>
              <input type="text" required value={formData.imam2 || ''} onChange={(e) => updateField('imam2', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Afiliasi NU</label>
              <select value={formData.nuAffiliation || 'Milik NU'} onChange={(e) => updateField('nuAffiliation', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Milik NU">Milik NU</option>
                <option value="Afiliasi NU">Afiliasi NU</option>
                <option value="Simpatisan">Simpatisan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Status Kepemilikan Tanah</label>
              <select value={formData.landStatus || 'Wakaf NU'} onChange={(e) => updateField('landStatus', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Wakaf NU">Wakaf NU</option>
                <option value="Wakaf Pribadi">Wakaf Pribadi</option>
                <option value="Sertifikat Hak Milik">Sertifikat Hak Milik</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Wilayah Ranting</label>
              <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-600">Alamat Lengkap *</label>
              <textarea rows={2} required value={formData.address || ''} onChange={(e) => updateField('address', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'sarana_pendidikan' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Sekolah / Instansi *</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jenjang / Level</label>
              <select value={formData.level || 'MI'} onChange={(e) => updateField('level', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="PAUD">PAUD</option>
                <option value="TK/RA">TK/RA</option>
                <option value="MI">MI</option>
                <option value="MTs">MTs</option>
                <option value="MA">MA</option>
                <option value="Madin">Madin</option>
                <option value="TPQ">TPQ</option>
                <option value="Pesantren">Pesantren</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Status Sekolah</label>
              <select value={formData.status || 'Swasta NU'} onChange={(e) => updateField('status', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Swasta NU">Swasta NU</option>
                <option value="Negeri">Negeri</option>
                <option value="Swasta Non-NU">Swasta Non-NU</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Nama Kepala Sekolah / Pimpinan *</label>
              <input type="text" required value={formData.principal || ''} onChange={(e) => updateField('principal', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jumlah Siswa/Santri *</label>
              <input type="number" required value={formData.studentCount || 0} onChange={(e) => updateField('studentCount', parseInt(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">No. Kontak Sekolah *</label>
              <input type="text" required value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Kondisi Bangunan</label>
              <select value={formData.condition || 'Baik'} onChange={(e) => updateField('condition', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Sedang">Rusak Sedang</option>
                <option value="Butuh Renovasi">Butuh Renovasi</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Ranting Desa</label>
              <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-600">Alamat Lengkap *</label>
              <textarea rows={2} required value={formData.address || ''} onChange={(e) => updateField('address', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'berita' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">Judul Berita *</label>
              <input type="text" required value={formData.title || ''} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Kategori Berita</label>
              <select value={formData.category || 'Warta Jamiyah'} onChange={(e) => updateField('category', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Pengumuman">Pengumuman</option>
                <option value="Warta Jamiyah">Warta Jamiyah</option>
                <option value="Dakwah">Dakwah</option>
                <option value="Opini">Opini</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Penulis / Author *</label>
              <input type="text" required value={formData.author || 'Sekretariat MWC'} onChange={(e) => updateField('author', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tanggal Publikasi *</label>
              <input type="date" required value={formData.date || ''} onChange={(e) => updateField('date', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">Link Google Drive / Album Foto Eksternal (Opsional)</label>
              <input type="url" placeholder="https://drive.google.com/..." value={formData.driveUrl || ''} onChange={(e) => updateField('driveUrl', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-600">Konten Berita (Mendukung Markdown) *</label>
              <textarea rows={5} required value={formData.content || ''} onChange={(e) => updateField('content', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 leading-relaxed" />
            </div>
            {renderUploader('imageUrl')}
          </div>
        )}

        {activeModel === 'dokumentasi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">Judul Dokumentasi *</label>
              <input type="text" required value={formData.title || ''} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tipe Media</label>
              <select value={formData.type || 'Foto'} onChange={(e) => updateField('type', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Foto">Foto / Gambar</option>
                <option value="Video">Video Link</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Kategori Dokumentasi</label>
              <select value={formData.category || 'Kegiatan'} onChange={(e) => updateField('category', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-semibold">
                <option value="Kegiatan">Kegiatan</option>
                <option value="Rapat">Rapat</option>
                <option value="Pelantikan">Pelantikan</option>
                <option value="Harlah">Harlah</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Tanggal Dokumentasi *</label>
              <input type="date" required value={formData.date || ''} onChange={(e) => updateField('date', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">Link Google Drive / Penyimpanan Foto Lainnya (Opsional)</label>
              <input type="url" placeholder="https://drive.google.com/..." value={formData.driveUrl || ''} onChange={(e) => updateField('driveUrl', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
            </div>
            {renderUploader('url')}
          </div>
        )}

        <div className="flex space-x-2 pt-2 border-t border-slate-200 justify-end">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={uploading}
            className="px-4 py-2 bg-tosca-600 hover:bg-tosca-700 disabled:bg-slate-400 text-white font-semibold rounded shadow-xs flex items-center space-x-1"
          >
            {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Simpan ke Database</span>
          </button>
        </div>
      </form>
    </div>
  );
}
