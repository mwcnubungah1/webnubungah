import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import { 
  Role, Ranting, ModelType,
  Kader, Kegiatan, TransparansiDana, KoinS3, Persuratan, Usaha, 
  SaranaIbadah, SaranaPendidikan, Berita, Dokumentasi, Aspirasi, Pengurus
} from '../types';
import { isCloudinaryConfigured, uploadToCloudinary } from '../lib/cloudinaryClient';
import { mapUnsurToBanom, mapAngkatanToYear } from '../data/mockData';

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
  /** Pre-fill context when adding pengurus from a Banom/Lembaga detail page */
  formContext?: {
    category?: 'MWC' | 'Ranting';
    rantingId?: string;
    groupType?: 'Harian' | 'Banom' | 'Lembaga';
    groupName?: string;
    organizer?: string;
  };
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
  pengurusList,
  formContext
}: AdminCMSFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [points, setPoints] = useState<{ text: string; amount: number; photoUrl: string }[]>([]);
  const [kaderSearchLocal, setKaderSearchLocal] = useState('');

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
        if (activeModel === 'koin_s3') {
          const target = item.distributionTarget || '';
          if (target.trim().startsWith('[') && target.trim().endsWith(']')) {
            try {
              const parsed = JSON.parse(target);
              if (Array.isArray(parsed)) {
                setPoints(parsed);
                return;
              }
            } catch (e) {}
          }
          setPoints([{ text: target, amount: item.distributionAmount || 0, photoUrl: item.imageUrl || '' }]);
        }
      }
    } else {
      const nowStr = new Date().toISOString().slice(0, 10);
      const defaultData: Record<string, any> = {
        kader: {
          name: '', pob: 'Gresik', dob: '2000-01-01', gender: 'Laki-laki',
          banom: 'Ansor', role: '', rantingId: 'r1', phone: '', joinYear: 2020, photoUrl: '',
          unsur: 'GP Ansor', address: '', angkatan: 'XXXV'
        },
        kegiatan: {
          title: '', date: nowStr, location: '',
          organizer: formContext?.organizer || 'MWC NU Bungah',
          targetGroup: 'Masyarakat Umum', fundingSource: 'Kas Jamiyah',
          budget: 2000000, status: 'Rencana', description: '', imageUrl: ''
        },
        keuangan: {
          date: nowStr, type: 'Masuk', category: 'Iuran Anggota',
          amount: 500000, description: '', pic: '', imageUrl: ''
        },
        koin_s3: {
          month: nowStr.slice(0, 7), rantingId: 'r1', amount: 1500000,
          distributionTarget: '', distributionAmount: 0, imageUrl: ''
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
          name: '', role: 'Tanfidziyah',
          category: formContext?.category || 'MWC',
          rantingId: formContext?.rantingId || 'r1',
          phone: '', email: '', kaderisasiStatus: 'Belum', education: 'S1', photoUrl: '',
          groupType: formContext?.groupType || 'Harian',
          groupName: formContext?.groupName || '',
          kaderId: ''
        }
      };
      setFormData(defaultData[activeModel] || {});
      if (activeModel === 'koin_s3') {
        setPoints([{ text: '', amount: 0, photoUrl: '' }]);
      }
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
              <label className="font-semibold text-slate-600">1. Nama Lengkap *</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Nama Lengkap" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">2. Tempat Lahir</label>
              <input type="text" value={formData.pob || ''} onChange={(e) => updateField('pob', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Contoh: Gresik" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">3. Tanggal Lahir</label>
              <input type="date" value={formData.dob || ''} onChange={(e) => updateField('dob', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">4. Unsur *</label>
              <input 
                type="text" 
                required
                value={formData.unsur || ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  updateField('unsur', val);
                  updateField('banom', mapUnsurToBanom(val));
                }} 
                className="w-full bg-white border border-slate-200 rounded p-2" 
                placeholder="Contoh: PC LPBI SERNU, GP Ansor, PAC Fatayat NU" 
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">5. Jabatan *</label>
              <input type="text" required value={formData.role || ''} onChange={(e) => updateField('role', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Contoh: KETUA, SEKRETARIS, ANGGOTA" />
            </div>
            <div className="space-y-1 col-span-1 sm:col-span-2">
              <label className="font-semibold text-slate-600">6. Alamat</label>
              <input type="text" value={formData.address || ''} onChange={(e) => updateField('address', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Contoh: Dusun Kaliwot RT 19B RW 07" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">7. Ranting Desa</label>
              <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="mwc">MWC (Tingkat Kecamatan)</option>
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">8. No. HP / WA *</label>
              <input type="text" required value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" placeholder="Contoh: 085755920527" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">9. Jenis Kelamin</label>
              <select value={formData.gender || 'Laki-laki'} onChange={(e) => updateField('gender', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">10. Angkatan</label>
              <input 
                type="text" 
                value={formData.angkatan || ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  updateField('angkatan', val);
                  updateField('joinYear', mapAngkatanToYear(val));
                }} 
                className="w-full bg-white border border-slate-200 rounded p-2 font-semibold" 
                placeholder="Contoh: XXXV, III, XL" 
              />
            </div>
            {renderUploader('photoUrl')}
          </div>
        )}

        {activeModel === 'pengurus' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Context banner when opened from Banom/Lembaga detail page */}
            {formContext && (
              <div className="col-span-1 sm:col-span-2 p-3 bg-tosca-50 border border-tosca-200 rounded-xl flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-tosca-100 flex items-center justify-center text-tosca-700 text-xs font-extrabold shrink-0">
                  {formContext.groupType === 'Banom' ? 'B' : 'L'}
                </div>
                <div>
                  <span className="text-[10px] text-tosca-600 font-bold uppercase block">Context Otomatis</span>
                  <span className="text-xs font-bold text-tosca-800">
                    {formContext.groupType === 'Banom' ? 'Banom' : 'Lembaga'}: {formContext.groupName} • {formContext.category === 'MWC' ? 'MWC NU Bungah' : rantings.find(r => r.id === formContext.rantingId)?.name || formContext.rantingId}
                  </span>
                </div>
              </div>
            )}

            {/* Name field — always shown, but context may hide it for kader selection */}
            {!formContext && (
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <label className="font-semibold text-slate-600">Nama Lengkap *</label>
                <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" />
              </div>
            )}
            
            {/* Category, Ranting, GroupType, GroupName — hidden when formContext is provided */}
            {!formContext && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Tingkatan Pengurus *</label>
                  <select value={formData.category || 'MWC'} onChange={(e) => updateField('category', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                    <option value="MWC">MWC (Tingkat Kecamatan)</option>
                    <option value="Ranting">Ranting (Tingkat Desa)</option>
                  </select>
                </div>

                {formData.category === 'Ranting' && (
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600">Ranting Desa *</label>
                    <select value={formData.rantingId || 'r1'} onChange={(e) => updateField('rantingId', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2">
                      {rantings.filter(r => r.id !== 'mwc').map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Kategori Struktur (Harian / Banom / Lembaga) *</label>
                  <select 
                    value={formData.groupType || 'Harian'} 
                    onChange={(e) => {
                      const gt = e.target.value as 'Harian' | 'Banom' | 'Lembaga';
                      updateField('groupType', gt);
                      if (gt === 'Harian') {
                        updateField('groupName', '');
                      } else if (gt === 'Banom') {
                        updateField('groupName', 'GP Ansor');
                      } else if (gt === 'Lembaga') {
                        updateField('groupName', 'LAZISNU');
                      }
                }} 
                className="w-full bg-white border border-slate-200 rounded p-2 font-semibold text-slate-700"
              >
                <option value="Harian">Pengurus Harian</option>
                <option value="Banom">Badan Otonom (Banom)</option>
                <option value="Lembaga">Lembaga NU</option>
              </select>
            </div>

            {formData.groupType === 'Banom' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Pilih Badan Otonom (Banom) *</label>
                <select 
                  value={
                    ["GP Ansor", "Fatayat NU", "Muslimat NU", "IPNU", "IPPNU", "Pagar Nusa", "ISNU", "PERGUNU", "JATMAN", "SARBUMUSI"].includes(formData.groupName || '')
                      ? formData.groupName 
                      : 'Lainnya'
                  } 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Lainnya') {
                      updateField('groupName', 'Kustom Banom');
                    } else {
                      updateField('groupName', val);
                    }
                  }}
                  className="w-full bg-white border border-slate-200 rounded p-2"
                >
                  <option value="GP Ansor">GP Ansor</option>
                  <option value="Fatayat NU">Fatayat NU</option>
                  <option value="Muslimat NU">Muslimat NU</option>
                  <option value="IPNU">IPNU</option>
                  <option value="IPPNU">IPPNU</option>
                  <option value="Pagar Nusa">Pagar Nusa</option>
                  <option value="ISNU">ISNU</option>
                  <option value="PERGUNU">PERGUNU</option>
                  <option value="JATMAN">JATMAN</option>
                  <option value="SARBUMUSI">SARBUMUSI</option>
                  <option value="Lainnya">Lainnya (Kustom / Tulis Sendiri)</option>
                </select>
                
                {!["GP Ansor", "Fatayat NU", "Muslimat NU", "IPNU", "IPPNU", "Pagar Nusa", "ISNU", "PERGUNU", "JATMAN", "SARBUMUSI"].includes(formData.groupName || '') && (
                  <div className="mt-2 animate-fadeIn">
                    <label className="text-[10px] text-slate-500 font-semibold">Tulis Nama Banom Kustom *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.groupName || ''} 
                      onChange={(e) => updateField('groupName', e.target.value)} 
                      placeholder="Contoh: CBP IPNU, KPP IPPNU" 
                      className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-medium mt-0.5" 
                    />
                  </div>
                )}
              </div>
            )}            {formData.groupType === 'Lembaga' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-600">Pilih Lembaga NU *</label>
                <select 
                  value={
                    ["LAZISNU", "LPMNU", "LTMNU", "LDNU", "RMI-NU", "LKNU", "LAKPESDAM", "LESBUMI", "LPBI-NU", "LWPNU", "LPBHNU", "LPPNU", "LTNNU", "LKKNU", "LPNU", "LP2NU", "LBMNU", "LF-NU"].includes(formData.groupName || '')
                      ? formData.groupName 
                      : 'Lainnya'
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Lainnya') {
                      updateField('groupName', 'Kustom Lembaga');
                    } else {
                      updateField('groupName', val);
                    }
                  }}
                  className="w-full bg-white border border-slate-200 rounded p-2"
                >
                  <option value="LAZISNU">LAZISNU</option>
                  <option value="LPMNU">LP Ma'arif NU (LPMNU)</option>
                  <option value="LTMNU">LTMNU</option>
                  <option value="LDNU">LDNU</option>
                  <option value="RMI-NU">RMI-NU</option>
                  <option value="LKNU">LKNU</option>
                  <option value="LAKPESDAM">LAKPESDAM</option>
                  <option value="LESBUMI">LESBUMI</option>
                  <option value="LPBI-NU">LPBI-NU</option>
                  <option value="LWPNU">LWPNU</option>
                  <option value="LPBHNU">LPBHNU</option>
                  <option value="LPPNU">LPPNU</option>
                  <option value="LTNNU">LTNNU</option>
                  <option value="LKKNU">LKKNU</option>
                  <option value="LPNU">LPNU</option>
                  <option value="LP2NU">LP2NU</option>
                  <option value="LBMNU">LBMNU</option>
                  <option value="LF-NU">LF-NU</option>
                  <option value="Lainnya">Lainnya (Kustom / Tulis Sendiri)</option>
                </select>

                {!["LAZISNU", "LPMNU", "LTMNU", "LDNU", "RMI-NU", "LKNU", "LAKPESDAM", "LESBUMI", "LPBI-NU", "LWPNU", "LPBHNU", "LPPNU", "LTNNU", "LKKNU", "LPNU", "LP2NU", "LBMNU", "LF-NU"].includes(formData.groupName || '') && (
                  <div className="mt-2 animate-fadeIn">
                    <label className="text-[10px] text-slate-500 font-semibold">Tulis Nama Lembaga Kustom *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.groupName || ''} 
                      onChange={(e) => updateField('groupName', e.target.value)} 
                      placeholder="Contoh: Lembaga Falakiyah NU" 
                      className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-medium mt-0.5" 
                    />
                  </div>
                )}
              </div>
            )}
            </>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Jabatan / Peran di Struktur *</label>
              <input type="text" required value={formData.role || ''} onChange={(e) => updateField('role', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Contoh: Rois Syuriyah, Ketua, Sekretaris, Bendahara, Anggota" />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600">No. HP / WA *</label>
              <input type="text" required value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" placeholder="Contoh: 081234567890" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Email</label>
              <input type="email" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" placeholder="Contoh: mail@domain.com" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Status Kaderisasi *</label>
              <select value={formData.kaderisasiStatus || 'Belum'} onChange={(e) => {
                const val = e.target.value;
                updateField('kaderisasiStatus', val);
                // Reset kader selection when status changes
                if (val === 'Belum') {
                  updateField('kaderId', '');
                }
              }} className="w-full bg-white border border-slate-200 rounded p-2">
                <option value="Belum">Belum Kaderisasi (Entri Baru)</option>
                <option value="PD-PKPNU">PD-PKPNU (Pilih dari Data Kader)</option>
                <option value="MKNU">MKNU (Pilih dari Data Kader)</option>
                <option value="Penyetaraan">Penyetaraan (Pilih dari Data Kader)</option>
              </select>
            </div>

            {/* Jika sudah kaderisasi: tampilkan dropdown pilih kader */}
            {(formData.kaderisasiStatus === 'PD-PKPNU' || formData.kaderisasiStatus === 'MKNU' || formData.kaderisasiStatus === 'Penyetaraan') && (
              <div className="col-span-1 sm:col-span-2 space-y-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
                <label className="font-semibold text-emerald-800 text-sm flex items-center space-x-2">
                  <span>👤</span><span>Pilih dari Data Kader (sudah PD-PKPNU)</span>
                </label>
                <p className="text-[10px] text-emerald-700 font-medium">Pilih nama kader yang sudah terdaftar. Data otomatis terisi ke form pengurus.</p>
                {/* Search input for kader */}
                <input
                  type="text"
                  placeholder="🔍 Ketik nama kader untuk mencari..."
                  value={kaderSearchLocal}
                  onChange={(e) => setKaderSearchLocal(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded p-2 text-sm"
                />
                {/* Filtered kader list */}
                <div className="max-h-48 overflow-y-auto space-y-1 bg-white border border-emerald-200 rounded-lg p-1">
                  {kaderList
                    .filter(k => {
                      if (editItemId && formData.kaderId === k.id) return true;
                      if (!kaderSearchLocal) return true;
                      return k.name.toLowerCase().includes(kaderSearchLocal.toLowerCase()) ||
                             (k.role || '').toLowerCase().includes(kaderSearchLocal.toLowerCase());
                    })
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, 30)
                    .map(k => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => {
                          updateField('kaderId', k.id);
                          updateField('name', k.name);
                          updateField('phone', k.phone || '');
                          updateField('education', k.angkatan ? `Angkatan ${k.angkatan}` : 'S1');
                          if (k.photoUrl) updateField('photoUrl', k.photoUrl);
                          setKaderSearchLocal('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${formData.kaderId === k.id ? 'bg-emerald-100 border border-emerald-300' : 'hover:bg-slate-50 border border-transparent'}`}
                      >
                        <div>
                          <span className="font-bold text-gray-800 block">{k.name}</span>
                          <span className="text-[10px] text-slate-500">{k.role || 'Kader'} • {k.banom || 'Umum'} • {k.phone || '-'}</span>
                        </div>
                        {formData.kaderId === k.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    ))}
                  {kaderList.filter(k => !kaderSearchLocal || k.name.toLowerCase().includes(kaderSearchLocal.toLowerCase())).length === 0 && (
                    <p className="text-[10px] text-slate-400 italic py-2 text-center">Tidak ditemukan kader dengan nama tersebut.</p>
                  )}
                </div>
                {formData.kaderId && (
                  <div className="flex items-center space-x-2 text-[10px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Kader dipilih: {formData.name} — data akan terhubung ke Data Kader.</span>
                  </div>
                )}
              </div>
            )}

            {/* Jika belum kaderisasi: tampilkan form entri baru */}
            {formData.kaderisasiStatus === 'Belum' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Nama Lengkap *</label>
                  <input type="text" required value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Nama lengkap pengurus" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">No. HP / WA *</label>
                  <input type="text" required value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" placeholder="Contoh: 081234567890" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Email</label>
                  <input type="email" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 font-mono" placeholder="Contoh: mail@domain.com" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Pendidikan Akhir</label>
                  <input type="text" value={formData.education || ''} onChange={(e) => updateField('education', e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2" placeholder="Contoh: S1, S2, SMA, Pesantren" />
                </div>
                {renderUploader('photoUrl')}
              </>
            )}

            {/* Jika sudah kaderisasi tapi belum pilih kader: tampilkan nama manual + hint */}
            {(formData.kaderisasiStatus === 'PD-PKPNU' || formData.kaderisasiStatus === 'MKNU' || formData.kaderisasiStatus === 'Penyetaraan') && !formData.kaderId && (
              <div className="col-span-1 sm:col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 font-semibold">
                ⚠️ Silakan pilih nama kader di atas, atau isi manual jika kader belum terdaftar di Data Kader.
              </div>
            )}

            {/* Jika sudah kaderisasi dan sudah pilih kader: tampilkan info ringkas */}
            {(formData.kaderisasiStatus === 'PD-PKPNU' || formData.kaderisasiStatus === 'MKNU' || formData.kaderisasiStatus === 'Penyetaraan') && formData.kaderId && (
              <div className="col-span-1 sm:col-span-2 bg-white border border-emerald-200 rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <img src={formData.photoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} alt="" className="w-12 h-12 rounded-xl object-contain border border-slate-200 bg-slate-50" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{formData.name}</span>
                    <span className="text-[10px] text-slate-500">{formData.phone} • {formData.education}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">✓ Terkait ke Data Kader (ID: {formData.kaderId})</span>
                  </div>
                </div>
              </div>
            )}
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
              <label className="font-semibold text-slate-600">Penyelenggara *{formContext?.organizer && ' (Otomatis)'}</label>
              <input type="text" required value={formData.organizer || ''} onChange={(e) => updateField('organizer', e.target.value)} readOnly={!!formContext?.organizer} className={`w-full border border-slate-200 rounded p-2 ${formContext?.organizer ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white'}`} />
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
              <label className="font-semibold text-slate-600">Alokasi Biaya Penyaluran (Rp) (Otomatis dari jumlah poin) *</label>
              <input type="number" readOnly required value={formData.distributionAmount || 0} className="w-full bg-slate-100 border border-slate-200 rounded p-2 font-mono font-bold text-slate-750" />
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-3 bg-slate-100/50 p-4 rounded-xl border border-slate-200 mt-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 text-xs">Poin-Poin Sasaran & Pilar Penyaluran (Tasaruf)</span>
                <button
                  type="button"
                  onClick={() => {
                    const newPoints = [...points, { text: '', amount: 0, photoUrl: '' }];
                    setPoints(newPoints);
                    updateField('distributionTarget', JSON.stringify(newPoints));
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pilar Penyaluran</span>
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {points.map((point, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 relative shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-600 text-[10px]">Pilar Penyaluran #{idx + 1}</span>
                      {points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newPoints = points.filter((_, i) => i !== idx);
                            setPoints(newPoints);
                            updateField('distributionTarget', JSON.stringify(newPoints));
                            const sum = newPoints.reduce((acc, curr) => acc + (curr.amount || 0), 0);
                            updateField('distributionAmount', sum);
                            if (newPoints[0]?.photoUrl) {
                              updateField('imageUrl', newPoints[0].photoUrl);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500">Nama Penyaluran / Target *</label>
                        <input
                          type="text"
                          required
                          value={point.text}
                          onChange={(e) => {
                            const newPoints = [...points];
                            newPoints[idx].text = e.target.value;
                            setPoints(newPoints);
                            updateField('distributionTarget', JSON.stringify(newPoints));
                          }}
                          placeholder="Misal: Beasiswa Rp. 300.000"
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500">Nominal Penyaluran (Rp) *</label>
                        <input
                          type="number"
                          required
                          value={point.amount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const newPoints = [...points];
                            newPoints[idx].amount = val;
                            setPoints(newPoints);
                            updateField('distributionTarget', JSON.stringify(newPoints));
                            const sum = newPoints.reduce((acc, curr) => acc + (curr.amount || 0), 0);
                            updateField('distributionAmount', sum);
                          }}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                      <label className="font-semibold text-slate-500 text-[10px]">Foto Bukti Penyaluran (Optional)</label>
                      <div className="flex items-center space-x-2">
                        {point.photoUrl && (
                          <img
                            src={point.photoUrl}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 object-cover rounded border border-slate-200 shrink-0"
                            alt="Bukti"
                          />
                        )}
                        <input
                          type="text"
                          value={point.photoUrl}
                          onChange={(e) => {
                            const newPoints = [...points];
                            newPoints[idx].photoUrl = e.target.value;
                            setPoints(newPoints);
                            updateField('distributionTarget', JSON.stringify(newPoints));
                            if (idx === 0) {
                              updateField('imageUrl', e.target.value);
                            }
                          }}
                          placeholder="Tautan URL foto bukti"
                          className="flex-1 bg-white border border-slate-200 rounded p-1.5 text-[10px] font-mono"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          id={`point-file-${idx}`}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploading(true);
                              try {
                                const secureUrl = await uploadToCloudinary(file);
                                const newPoints = [...points];
                                newPoints[idx].photoUrl = secureUrl;
                                setPoints(newPoints);
                                updateField('distributionTarget', JSON.stringify(newPoints));
                                if (idx === 0) {
                                  updateField('imageUrl', secureUrl);
                                }
                              } catch (err) {
                                console.error(err);
                                alert("Gagal mengunggah gambar bukti.");
                              } finally {
                                setUploading(false);
                              }
                            }
                          }}
                        />
                        <label
                          htmlFor={`point-file-${idx}`}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer shrink-0 border border-slate-200"
                        >
                          Upload Foto
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
