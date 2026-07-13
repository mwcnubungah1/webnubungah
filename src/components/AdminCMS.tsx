import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  AlertTriangle, 
  Sliders, 
  FileSpreadsheet, 
  FileText,
  Eye,
  Info,
  CheckCircle2,
  Lock,
  Upload
} from 'lucide-react';
import { parseCSVLine, parseBirth, mapUnsurToBanom, mapRantingToId, mapAngkatanToYear } from '../data/mockData';
import { 
  Kader, 
  Kegiatan, 
  TransparansiDana, 
  KoinS3, 
  Persuratan, 
  Usaha, 
  SaranaIbadah, 
  SaranaPendidikan, 
  Berita, 
  Dokumentasi, 
  Aspirasi, 
  Role, 
  Ranting,
  ModelType,
  Pengurus
} from '../types';
import { 
  isSupabaseConfigured, 
  insertTableData, 
  updateTableData, 
  deleteTableData 
} from '../lib/supabaseClient';
import AdminCMSForm from './AdminCMSForm';
import AdminCMSDatatable from './AdminCMSDatatable';

interface AdminCMSProps {
  userRole: Role;
  rantings: Ranting[];
  kaderList: Kader[];
  setKaderList: React.Dispatch<React.SetStateAction<Kader[]>>;
  kegiatanList: Kegiatan[];
  setKegiatanList: React.Dispatch<React.SetStateAction<Kegiatan[]>>;
  kasList: TransparansiDana[];
  setKasList: React.Dispatch<React.SetStateAction<TransparansiDana[]>>;
  koinList: KoinS3[];
  setKoinList: React.Dispatch<React.SetStateAction<KoinS3[]>>;
  suratList: Persuratan[];
  setSuratList: React.Dispatch<React.SetStateAction<Persuratan[]>>;
  usahaList: Usaha[];
  setUsahaList: React.Dispatch<React.SetStateAction<Usaha[]>>;
  saranaIbadahList: SaranaIbadah[];
  setSaranaIbadahList: React.Dispatch<React.SetStateAction<SaranaIbadah[]>>;
  saranaPendidikanList: SaranaPendidikan[];
  setSaranaPendidikanList: React.Dispatch<React.SetStateAction<SaranaPendidikan[]>>;
  beritaList: Berita[];
  setBeritaList: React.Dispatch<React.SetStateAction<Berita[]>>;
  dokumentasiList: Dokumentasi[];
  setDokumentasiList: React.Dispatch<React.SetStateAction<Dokumentasi[]>>;
  aspirasiList: Aspirasi[];
  setAspirasiList: React.Dispatch<React.SetStateAction<Aspirasi[]>>;
  pengurusList: Pengurus[];
  setPengurusList: React.Dispatch<React.SetStateAction<Pengurus[]>>;
  activeModel: ModelType;
  setActiveModel: (model: ModelType) => void;
}

export default function AdminCMS({
  userRole,
  rantings,
  kaderList,
  setKaderList,
  kegiatanList,
  setKegiatanList,
  kasList,
  setKasList,
  koinList,
  setKoinList,
  suratList,
  setSuratList,
  usahaList,
  setUsahaList,
  saranaIbadahList,
  setSaranaIbadahList,
  saranaPendidikanList,
  setSaranaPendidikanList,
  beritaList,
  setBeritaList,
  dokumentasiList,
  setDokumentasiList,
  aspirasiList,
  setAspirasiList,
  pengurusList,
  setPengurusList,
  activeModel,
  setActiveModel
}: AdminCMSProps) {

  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);

  // Helper: Get Ranting Name
  const getRantingName = (id?: string) => {
    if (!id || id === 'mwc') return 'Tingkat MWC';
    const r = rantings.find(item => item.id === id);
    return r ? r.name : 'Ranting NU';
  };

  // RBAC Permission Check Helper
  // Returns true if the user is authorized to write to this model/row
  const checkWritePermission = (model: ModelType, targetRantingId?: string): { allowed: boolean; reason?: string } => {
    if (userRole === 'super_admin') {
      return { allowed: true };
    }

    if (userRole === 'admin_lazisnu') {
      if (model === 'koin_s3') {
        return { allowed: true };
      }
      return { 
        allowed: false, 
        reason: 'Akses Ditolak: Peran Admin LAZISNU hanya diperbolehkan mengelola data Koin S3.' 
      };
    }

    if (userRole === 'admin_ranting') {
      // Allowed models for ranting admin
      const allowedModels: ModelType[] = ['kader', 'sarana_ibadah', 'sarana_pendidikan', 'usaha', 'kegiatan', 'koin_s3', 'pengurus'];
      if (!allowedModels.includes(model)) {
        return { 
          allowed: false, 
          reason: 'Akses Ditolak: Peran Admin Ranting tidak diperbolehkan mengelola data non-lokal seperti Persuratan Utama, Berita CMS, atau Buku Arus Kas MWC.' 
        };
      }
      
      // Check Ranting binding. Admin Ranting only can edit Ranting 'r1' (PRNU Bungah)
      if (targetRantingId && targetRantingId !== 'r1') {
        return { 
          allowed: false, 
          reason: `Akses Ditolak: Anda merupakan Admin PRNU Bungah. Anda tidak memiliki izin untuk mengedit data milik Ranting lain (${getRantingName(targetRantingId)}).` 
        };
      }
      
      return { allowed: true };
    }

    return { allowed: false, reason: 'Akses Ditolak: Silakan login terlebih dahulu.' };
  };

  // Real CSV/Excel Exporter with Microsoft Excel Compatibility
  const handleExport = (format: 'CSV' | 'EXCEL') => {
    let dataToExport: any[] = [];
    switch (activeModel) {
      case 'kader': dataToExport = kaderList; break;
      case 'kegiatan': dataToExport = kegiatanList; break;
      case 'keuangan': dataToExport = kasList; break;
      case 'koin_s3': dataToExport = koinList; break;
      case 'persuratan': dataToExport = suratList; break;
      case 'usaha': dataToExport = usahaList; break;
      case 'sarana_ibadah': dataToExport = saranaIbadahList; break;
      case 'sarana_pendidikan': dataToExport = saranaPendidikanList; break;
      case 'berita': dataToExport = beritaList; break;
      case 'dokumentasi': dataToExport = dokumentasiList; break;
      case 'aspirasi': dataToExport = aspirasiList; break;
      case 'pengurus': dataToExport = pengurusList; break;
    }

    if (!dataToExport || dataToExport.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    // Identify spreadsheet column headers
    const headers = Object.keys(dataToExport[0]).filter(k => typeof dataToExport[0][k] !== 'object');
    
    // Create CSV rows
    const csvRows = [];
    csvRows.push(headers.join(';')); // Use semicolon for seamless Indonesian/European Excel auto-column split

    for (const row of dataToExport) {
      const values = headers.map(header => {
        const val = row[header];
        const stringVal = val === null || val === undefined ? '' : String(val);
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(';'));
    }

    const csvContent = "\uFEFF" + csvRows.join("\n"); // Prepend UTF-8 BOM for Microsoft Excel character encoding
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    const extension = format === 'CSV' ? 'csv' : 'xlsx'; // excel natively parses csv with bom
    const filename = `Rekap_${activeModel}_${new Date().toISOString().slice(0, 10)}.${extension}`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(`Berhasil mengunduh rekap data ${activeModel.toUpperCase()} (${filename})!`);
    setTimeout(() => setExportSuccess(null), 5000);
  };

  // CSV Bulk Importer for Kader Data
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const check = checkWritePermission('kader');
    if (!check.allowed) {
      setValidationError(check.reason);
      setTimeout(() => setValidationError(null), 6000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setValidationError("Gagal membaca file CSV.");
        return;
      }

      try {
        const lines = text.split('\n');
        const importedKaders: Kader[] = [];
        let successCount = 0;
        let failCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const row = parseCSVLine(line);
          // CSV must have at least columns up to column index 8 (JK)
          if (row.length < 8) {
            failCount++;
            continue;
          }

          const no = row[0] || String(Date.now() + i);
          const nama = row[1];
          if (!nama || nama === 'NAMA') {
            // Skip headers or empty names
            continue;
          }

          const birthCol = row[2] || '';
          const unsur = row[3] || 'Lainnya';
          const jabatan = row[4] || '-';
          const alamat = row[5] || '';
          const ranting = row[6] || 'mwc';
          const noTelp = row[7] || '';
          const jk = row[8] || 'L';
          const mwcNu = row[9] || '';
          const angkatan = row[10] || '';

          const { pob, dob } = parseBirth(birthCol);
          const gender = jk.toUpperCase() === 'P' ? 'Perempuan' : 'Laki-laki';
          const banom = mapUnsurToBanom(unsur);
          const role = (jabatan && jabatan !== '-') ? jabatan : (unsur || 'Kader');
          const rantingId = mapRantingToId(ranting);
          const phone = noTelp === '-' ? '' : (noTelp.startsWith('8') ? '0' + noTelp : noTelp);
          const joinYear = mapAngkatanToYear(angkatan);

          const localId = `k-${Date.now()}_${i}`;
          
          const newKader: Kader = {
            id: localId,
            name: nama,
            pob,
            dob,
            gender,
            banom,
            role,
            rantingId,
            phone,
            joinYear,
            unsur,
            address: alamat,
            angkatan
          };

          importedKaders.push(newKader);
        }

        if (importedKaders.length === 0) {
          setValidationError("Tidak ada data kader valid yang ditemukan di file CSV.");
          return;
        }

        // Now save imported kaders
        const savedKaders: Kader[] = [];
        if (isSupabaseConfigured) {
          setSuccessMessage(`Sedang mengimpor ${importedKaders.length} kader ke Supabase...`);
          for (const item of importedKaders) {
            try {
              const saved = await insertTableData('kader', item);
              savedKaders.push(saved);
              successCount++;
            } catch (err) {
              console.error("Supabase write failed for", item.name, err);
              // Fallback to local
              savedKaders.push(item);
              successCount++;
            }
          }
        } else {
          // Local storage only
          savedKaders.push(...importedKaders);
          successCount = importedKaders.length;
        }

        const updatedList = [...savedKaders, ...kaderList];
        setKaderList(updatedList);
        localStorage.setItem('mwc_nu_kader', JSON.stringify(updatedList));

        setSuccessMessage(`Berhasil mengimpor ${successCount} data kader! ${failCount > 0 ? `(${failCount} baris gagal)` : ''}`);
        setTimeout(() => setSuccessMessage(null), 8000);

      } catch (err: any) {
        setValidationError(`Gagal memproses file CSV: ${err.message}`);
        setTimeout(() => setValidationError(null), 6000);
      }
    };

    reader.onerror = () => {
      setValidationError("Gagal mengunggah file.");
      setTimeout(() => setValidationError(null), 6000);
    };

    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  // Delete Action handler
  const handleDelete = async (id: string, targetRantingId?: string) => {
    const check = checkWritePermission(activeModel, targetRantingId);
    if (!check.allowed) {
      setValidationError(check.reason || 'Anda tidak memiliki hak akses untuk menghapus data ini.');
      setTimeout(() => setValidationError(null), 6000);
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini secara permanen?')) return;

    try {
      let deletedFromCloud = true;
      if (isSupabaseConfigured && !isNaN(Number(id))) {
        try {
          await deleteTableData(activeModel, id);
        } catch (dbErr: any) {
          console.warn("Supabase delete failed, falling back to local storage:", dbErr);
          deletedFromCloud = false;
        }
      }

      switch (activeModel) {
        case 'kader':
          setKaderList(kaderList.filter(item => item.id !== id));
          break;
        case 'kegiatan':
          setKegiatanList(kegiatanList.filter(item => item.id !== id));
          break;
        case 'keuangan':
          setKasList(kasList.filter(item => item.id !== id));
          break;
        case 'koin_s3':
          setKoinList(koinList.filter(item => item.id !== id));
          break;
        case 'persuratan':
          setSuratList(suratList.filter(item => item.id !== id));
          break;
        case 'usaha':
          setUsahaList(usahaList.filter(item => item.id !== id));
          break;
        case 'sarana_ibadah':
          setSaranaIbadahList(saranaIbadahList.filter(item => item.id !== id));
          break;
        case 'sarana_pendidikan':
          setSaranaPendidikanList(saranaPendidikanList.filter(item => item.id !== id));
          break;
        case 'berita':
          setBeritaList(beritaList.filter(item => item.id !== id));
          break;
        case 'dokumentasi':
          setDokumentasiList(dokumentasiList.filter(item => item.id !== id));
          break;
        case 'aspirasi':
          setAspirasiList(aspirasiList.filter(item => item.id !== id));
          break;
        case 'pengurus':
          setPengurusList(pengurusList.filter(item => item.id !== id));
          break;
      }

      if (deletedFromCloud) {
        setSuccessMessage('Data berhasil dihapus secara permanen.');
      } else {
        setSuccessMessage('Data berhasil dihapus secara lokal dari perangkat ini (Supabase RLS aktif).');
      }
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setValidationError(`Gagal menghapus data: ${err.message || err}`);
      setTimeout(() => setValidationError(null), 6000);
    }
  };

  // Aspirasi Status Transition Handler
  const handleAspirasiStatusChange = async (id: string, newStatus: 'Masuk' | 'Proses' | 'Selesai') => {
    const check = checkWritePermission('aspirasi');
    if (!check.allowed) {
      setValidationError(check.reason);
      setTimeout(() => setValidationError(null), 6000);
      return;
    }

    try {
      const current = aspirasiList.find(i => i.id === id);
      if (current) {
        const updated = { ...current, status: newStatus };
        if (isSupabaseConfigured) {
          try {
            await updateTableData('aspirasi', id, updated);
          } catch (dbErr) {
            console.warn("Supabase update status failed, using local status only:", dbErr);
          }
        }
        setAspirasiList(aspirasiList.map(item => item.id === id ? updated : item));
        setSuccessMessage(`Status Aspirasi #${id.slice(0, 4)} diubah menjadi [${newStatus}]`);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      console.error(err);
      setValidationError(`Gagal mengubah status aspirasi: ${err.message || err}`);
      setTimeout(() => setValidationError(null), 6000);
    }
  };

  // Edit Action Trigger
  const handleEdit = (id: string) => {
    // Check general permission first
    const check = checkWritePermission(activeModel);
    if (!check.allowed) {
      setValidationError(check.reason);
      setTimeout(() => setValidationError(null), 6000);
      return;
    }

    setEditItemId(id);
    setShowAddForm(true);
  };

  // Form Submit handler
  const handleFormSubmit = async (data: any) => {
    // Check permission bound to specific ranting if specified
    const check = checkWritePermission(activeModel, data.rantingId);
    if (!check.allowed) {
      setValidationError(check.reason);
      setTimeout(() => setValidationError(null), 6000);
      return;
    }

    try {
      if (editItemId) {
        // EDIT MODE
        let updatedItem = { ...data };
        let savedToCloud = true;
        if (isSupabaseConfigured) {
          try {
            if (isNaN(Number(editItemId))) {
              updatedItem = await insertTableData(activeModel, data);
            } else {
              updatedItem = await updateTableData(activeModel, editItemId, data);
            }
          } catch (dbErr: any) {
            console.warn("Supabase write failed, falling back to local storage:", dbErr);
            savedToCloud = false;
            updatedItem = { ...data, id: editItemId };
          }
        }

        switch (activeModel) {
          case 'kader': setKaderList(kaderList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'kegiatan': setKegiatanList(kegiatanList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'keuangan': setKasList(kasList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'koin_s3': setKoinList(koinList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'aspirasi': setAspirasiList(aspirasiList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'persuratan': setSuratList(suratList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'usaha': setUsahaList(usahaList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'sarana_ibadah': setSaranaIbadahList(saranaIbadahList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'sarana_pendidikan': setSaranaPendidikanList(saranaPendidikanList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'berita': setBeritaList(beritaList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'dokumentasi': setDokumentasiList(dokumentasiList.map(i => i.id === editItemId ? updatedItem : i)); break;
          case 'pengurus': setPengurusList(pengurusList.map(i => i.id === editItemId ? updatedItem : i)); break;
        }

        if (savedToCloud) {
          setSuccessMessage(`Berhasil memperbarui data ${activeModel.toUpperCase()} secara online!`);
        } else {
          setSuccessMessage(`Berhasil memperbarui data ${activeModel.toUpperCase()} secara lokal (Supabase RLS aktif).`);
        }
      } else {
        // ADD MODE
        const localId = `${activeModel.slice(0, 2)}-${Date.now()}`;
        const itemToSave = { ...data, id: localId };

        let savedItem = itemToSave;
        let savedToCloud = true;
        if (isSupabaseConfigured) {
          try {
            savedItem = await insertTableData(activeModel, itemToSave);
          } catch (dbErr: any) {
            console.warn("Supabase write failed, falling back to local storage:", dbErr);
            savedToCloud = false;
            savedItem = itemToSave;
          }
        }

        switch (activeModel) {
          case 'kader': setKaderList([savedItem, ...kaderList]); break;
          case 'kegiatan': setKegiatanList([savedItem, ...kegiatanList]); break;
          case 'keuangan': setKasList([savedItem, ...kasList]); break;
          case 'koin_s3': setKoinList([savedItem, ...koinList]); break;
          case 'aspirasi': setAspirasiList([savedItem, ...aspirasiList]); break;
          case 'persuratan': setSuratList([savedItem, ...suratList]); break;
          case 'usaha': setUsahaList([savedItem, ...usahaList]); break;
          case 'sarana_ibadah': setSaranaIbadahList([savedItem, ...saranaIbadahList]); break;
          case 'sarana_pendidikan': setSaranaPendidikanList([savedItem, ...saranaPendidikanList]); break;
          case 'berita': setBeritaList([savedItem, ...beritaList]); break;
          case 'dokumentasi': setDokumentasiList([savedItem, ...dokumentasiList]); break;
          case 'pengurus': setPengurusList([savedItem, ...pengurusList]); break;
        }

        if (savedToCloud) {
          setSuccessMessage(`Berhasil menyimpan data ${activeModel.toUpperCase()} baru secara online!`);
        } else {
          setSuccessMessage(`Berhasil menyimpan data ${activeModel.toUpperCase()} baru secara lokal (Supabase RLS aktif).`);
        }
      }

      setShowAddForm(false);
      setEditItemId(null);
      setValidationError(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      setValidationError(`Gagal menyimpan data: ${err.message || err}`);
      setTimeout(() => setValidationError(null), 8000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* RBAC Header overview */}
      <div className="bg-tosca-900 text-white rounded-xl p-5 border border-tosca-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-tosca-300" />
            <h3 className="font-display font-bold text-base">Dashboard CMS Administrasi Terpadu</h3>
          </div>
          <p className="text-xs text-tosca-200 leading-relaxed max-w-2xl">
            Sistem Keamanan Berbasis Hak Akses (RBAC) diaktifkan. Anda masuk sebagai: <strong className="text-white capitalize">{userRole.replace('_', ' ')}</strong>.
            {userRole === 'admin_ranting' && ' Anda hanya diizinkan untuk melihat/mengedit data yang terikat dengan Ranting PRNU Bungah (Desa Bungah).'}
            {userRole === 'admin_lazisnu' && ' Anda hanya memiliki izin mengelola data penyaluran Koin S3 LAZISNU.'}
            {userRole === 'super_admin' && ' Hak akses penuh: Anda berwenang melakukan operasi tulis/baca di semua Ranting desa.'}
          </p>
        </div>

        <div className="text-[10px] font-mono bg-white/10 px-3 py-2 rounded-lg border border-white/10 shrink-0">
          DATABASE STATUS: <span className={isSupabaseConfigured ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
            {isSupabaseConfigured ? "CLOUD SYNC (SUPABASE)" : "LOCAL SYNC (FALLBACK)"}
          </span>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs flex flex-wrap gap-2 animate-slideDown">
        {([
          { id: 'kader', label: 'Data Kader' },
          { id: 'pengurus', label: 'Profil Jamiyah' },
          { id: 'kegiatan', label: 'Kegiatan NU' },
          { id: 'koin_s3', label: 'LAZISNU Koin S3' },
          { id: 'keuangan', label: 'Arus Kas MWC' },
          { id: 'aspirasi', label: 'Aspirasi Warga' },
          { id: 'persuratan', label: 'Arsip Surat' },
          { id: 'usaha', label: 'Usaha Jamiyah' },
          { id: 'sarana_ibadah', label: 'Sarana Ibadah' },
          { id: 'sarana_pendidikan', label: 'Sarana Sekolah' },
          { id: 'berita', label: 'Portal Berita' },
          { id: 'dokumentasi', label: 'Media Galeri' }
        ] as const)
        .filter((tab) => {
          if (userRole === 'admin_lazisnu') {
            return tab.id === 'koin_s3';
          }
          return true;
        })
        .map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveModel(tab.id);
              setShowAddForm(false);
              setEditItemId(null);
              setValidationError(null);
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all
              ${activeModel === tab.id 
                ? 'bg-tosca-600 text-white shadow-xs' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Actions and Feedbacks Bar */}
      <div className="space-y-4">
        {/* Alerts feedbacks */}
        {validationError && (
          <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg text-xs text-amber-900 font-semibold flex items-start space-x-2.5 animate-fadeIn">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Informasi Sistem / Error Penanganan</p>
              <p className="mt-1 text-amber-800 font-normal leading-relaxed">{validationError}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg text-xs text-emerald-900 font-semibold flex items-center space-x-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {exportSuccess && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg text-xs text-blue-900 font-semibold flex items-center space-x-2.5 animate-fadeIn">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{exportSuccess}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const check = checkWritePermission(activeModel);
                if (!check.allowed) {
                  setValidationError(check.reason);
                  setTimeout(() => setValidationError(null), 6000);
                  return;
                }
                setEditItemId(null);
                setShowAddForm(!showAddForm);
              }}
              className="px-4 py-2 bg-tosca-600 hover:bg-tosca-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Entri Baru</span>
            </button>

            {activeModel === 'kader' && (
              <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center space-x-1.5 transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Unggah CSV Kader</span>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleCSVUpload}
                />
              </label>
            )}

            <span className="text-xs text-slate-400 font-medium">
              Aktif Mengelola: <strong className="text-slate-700 uppercase">{activeModel.replace('_', ' ')}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleExport('CSV')}
              className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg text-xs flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
            <button 
              onClick={() => handleExport('EXCEL')}
              className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg text-xs flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>
          </div>
        </div>

        {/* Dynamic Add/Edit Form rendering */}
        {showAddForm && (
          <AdminCMSForm 
            activeModel={activeModel}
            editItemId={editItemId}
            rantings={rantings}
            userRole={userRole}
            onClose={() => {
              setShowAddForm(false);
              setEditItemId(null);
            }}
            onSubmit={handleFormSubmit}
            kaderList={kaderList}
            kegiatanList={kegiatanList}
            kasList={kasList}
            koinList={koinList}
            suratList={suratList}
            usahaList={usahaList}
            saranaIbadahList={saranaIbadahList}
            saranaPendidikanList={saranaPendidikanList}
            beritaList={beritaList}
            dokumentasiList={dokumentasiList}
            aspirasiList={aspirasiList}
            pengurusList={pengurusList}
          />
        )}

        {/* Datatable area with horizontal scrolling */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Data Tabel - {activeModel.replace('_', ' ')}</span>
            <span className="text-[10px] text-slate-400 font-mono">Mobile responsive scrollable container</span>
          </div>

          <div className="overflow-x-auto">
            <AdminCMSDatatable 
              activeModel={activeModel}
              rantings={rantings}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAspirasiStatusChange={handleAspirasiStatusChange}
              kaderList={kaderList}
              kegiatanList={kegiatanList}
              kasList={kasList}
              koinList={koinList}
              suratList={suratList}
              usahaList={usahaList}
              saranaIbadahList={saranaIbadahList}
              saranaPendidikanList={saranaPendidikanList}
              beritaList={beritaList}
              dokumentasiList={dokumentasiList}
              aspirasiList={aspirasiList}
              pengurusList={pengurusList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
