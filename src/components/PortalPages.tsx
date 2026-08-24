import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users2, 
  Coins, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Send,
  Eye,
  Building,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  Map,
  Sparkles,
  Download,
  Upload,
  Trash2,
  Pencil,
  Save,
  XCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart,
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ReferenceLine
} from 'recharts';

import { 
  Ranting, 
  Pengurus, 
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
  Role
} from '../types';
import { isCloudinaryConfigured, uploadToCloudinary } from '../lib/cloudinaryClient';
import { isSupabaseConfigured, insertTableData, updateTableData, deleteTableData } from '../lib/supabaseClient';
import AdminCMSForm from './AdminCMSForm';
import { parseCSVLine, parseBirth, mapUnsurToBanom, mapRantingToId, mapAngkatanToYear } from '../data/mockData';

interface PortalPagesProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rantings: Ranting[];
  setRantings?: React.Dispatch<React.SetStateAction<Ranting[]>>;
  userRole?: Role;
  pengurusList: Pengurus[];
  kaderList: Kader[];
  setKaderList?: React.Dispatch<React.SetStateAction<Kader[]>>;
  kegiatanList: Kegiatan[];
  setKegiatanList?: React.Dispatch<React.SetStateAction<Kegiatan[]>>;
  kasList: TransparansiDana[];
  koinList: KoinS3[];
  suratList: Persuratan[];
  setSuratList?: React.Dispatch<React.SetStateAction<Persuratan[]>>;
  usahaList: Usaha[];
  saranaIbadahList: SaranaIbadah[];
  setSaranaIbadahList?: React.Dispatch<React.SetStateAction<SaranaIbadah[]>>;
  saranaPendidikanList: SaranaPendidikan[];
  setSaranaPendidikanList?: React.Dispatch<React.SetStateAction<SaranaPendidikan[]>>;
  beritaList: Berita[];
  dokumentasiList: Dokumentasi[];
  setDokumentasiList?: React.Dispatch<React.SetStateAction<Dokumentasi[]>>;
  aspirasiList: Aspirasi[];
  addAspirasi: (aspirasi: Omit<Aspirasi, 'id' | 'date' | 'status'>) => void;
  refetchData?: () => Promise<void>;
  profileSubPath?: string;
  setProfileSubPath?: (path: string) => void;
  setPengurusList?: React.Dispatch<React.SetStateAction<Pengurus[]>>;
}

export default function PortalPages({
  activeTab,
  setActiveTab,
  rantings,
  setRantings,
  userRole = 'guest',
  pengurusList,
  kaderList,
  setKaderList,
  kegiatanList,
  setKegiatanList,
  kasList,
  koinList,
  suratList,
  setSuratList,
  usahaList,
  saranaIbadahList,
  setSaranaIbadahList,
  saranaPendidikanList,
  setSaranaPendidikanList,
  beritaList,
  dokumentasiList,
  setDokumentasiList,
  aspirasiList,
  addAspirasi,
  refetchData,
  profileSubPath = '',
  setProfileSubPath,
  setPengurusList
}: PortalPagesProps) {

  // For viewing full news
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // For viewing details of documentation (multiple photos)
  const [selectedDokumentasi, setSelectedDokumentasi] = useState<Dokumentasi | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [newPhotoInput, setNewPhotoInput] = useState<string>('');

  // States for Ranting Profile photo upload modal
  const [showRantingPhotoModal, setShowRantingPhotoModal] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadPhotoError, setUploadPhotoError] = useState<string | null>(null);

  // State for inline editing of Tahun Berdiri in Profil Jamiyah
  const [editingEstablished, setEditingEstablished] = useState(false);
  const [editingEstablishedValue, setEditingEstablishedValue] = useState('');

  // State for admin editing on Banom/Lembaga detail pages
  const [editingBanomField, setEditingBanomField] = useState<string | null>(null);
  const [editingBanomValue, setEditingBanomValue] = useState('');
  const [showAssignKader, setShowAssignKader] = useState(false);
  const [banomKaderSearch, setBanomKaderSearch] = useState('');

  // State for inline pengurus form on Banom/Lembaga detail pages
  const [showPengurusForm, setShowPengurusForm] = useState(false);
  const [pengurusFormContext, setPengurusFormContext] = useState<{ groupType: string; groupName: string; rantingId: string }>({ groupType: '', groupName: '', rantingId: '' });
  const [pengurusFormEditId, setPengurusFormEditId] = useState<string | null>(null);

  // State for inline kegiatan form on Banom/Lembaga detail pages
  const [showKegiatanForm, setShowKegiatanForm] = useState(false);
  const [kegiatanFormContext, setKegiatanFormContext] = useState<{ organizer: string }>({ organizer: '' });

  // Ranting edit/delete handlers — all writes go through Supabase
  const handleEditRantingField = async (rantingId: string, field: string, value: string) => {
    if (!setRantings) return;
    // Optimistic update local state
    setRantings(prev => prev.map(r => r.id === rantingId ? { ...r, [field]: value } : r));
    // Persist to Supabase
    if (isSupabaseConfigured) {
      try {
        await updateTableData('ranting', rantingId, { [field === 'established' ? 'established' : field]: value });
        // Re-fetch to confirm consistency
        if (refetchData) await refetchData();
      } catch (err: any) {
        console.error('Gagal menyimpan perubahan ke Supabase:', err);
      }
    }
  };

  const handleDeleteRanting = async (rantingId: string, rantingName: string) => {
    if (!setRantings) return;
    if (rantingId === 'mwc') {
      alert('Tidak dapat menghapus data MWC NU Bungah.');
      return;
    }
    if (!window.confirm(`Apakah Anda yakin ingin menghapus profil "${rantingName}" secara permanen?`)) return;
    // Optimistic update
    setRantings(prev => prev.filter(r => r.id !== rantingId));
    // Delete from Supabase
    if (isSupabaseConfigured) {
      try {
        await deleteTableData('ranting', rantingId);
        if (refetchData) await refetchData();
      } catch (err: any) {
        console.error('Gagal menghapus dari Supabase:', err);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadingPhoto(true);
      setUploadPhotoError(null);
      const secureUrl = await uploadToCloudinary(file);
      setTempPhotoUrl(secureUrl);
    } catch (err: any) {
      setUploadPhotoError(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSaveRantingPhoto = async (newUrl: string) => {
    if (setRantings && selectedRantingProfileId) {
      setRantings(prev => prev.map(r => r.id === selectedRantingProfileId ? { ...r, imageUrl: newUrl } : r));
      // Persist to Supabase
      if (isSupabaseConfigured) {
        try {
          await updateTableData('ranting', selectedRantingProfileId, { imageUrl: newUrl });
          if (refetchData) await refetchData();
        } catch (err: any) {
          console.error('Gagal menyimpan foto ke Supabase:', err);
        }
      }
    }
    setShowRantingPhotoModal(false);
  };

  // States and handlers for SK Upload (Sinergi Data Terkoneksi)
  const [showSKUploadModal, setShowSKUploadModal] = useState(false);
  const [skNumber, setSkNumber] = useState('');
  const [skPeriod, setSkPeriod] = useState('');
  const [skFileUrl, setSkFileUrl] = useState('');
  const [skIsLatest, setSkIsLatest] = useState(true);
  const [uploadingSK, setUploadingSK] = useState(false);
  const [uploadSKError, setUploadSKError] = useState<string | null>(null);

  const handleSKFileUpload = async (file: File) => {
    try {
      setUploadingSK(true);
      setUploadSKError(null);
      const secureUrl = await uploadToCloudinary(file);
      setSkFileUrl(secureUrl);
    } catch (err: any) {
      setUploadSKError(err.message || 'Gagal mengunggah SK.');
    } finally {
      setUploadingSK(false);
    }
  };

  const handleSaveSK = async () => {
    if (!skNumber || !skPeriod || !skFileUrl) {
      setUploadSKError('Harap lengkapi semua kolom.');
      return;
    }
    
    if (setRantings && selectedRantingProfileId) {
      // Optimistic update
      setRantings(prev => prev.map(r => {
        if (r.id !== selectedRantingProfileId) return r;
        
        const currentSKs = r.skDocs || [];
        const updatedSKs = skIsLatest 
          ? currentSKs.map(sk => ({ ...sk, isLatest: false }))
          : currentSKs;
          
        const newSK = {
          id: 'sk-' + Date.now(),
          number: skNumber,
          period: skPeriod,
          fileUrl: skFileUrl,
          uploadDate: new Date().toISOString().split('T')[0],
          isLatest: skIsLatest
        };
        
        return {
          ...r,
          skDocs: [newSK, ...updatedSKs]
        };
      }));
      // Persist to Supabase
      if (isSupabaseConfigured) {
        try {
          const current = rantings.find(r => r.id === selectedRantingProfileId);
          if (current) {
            const newSK = {
              id: 'sk-' + Date.now(),
              number: skNumber,
              period: skPeriod,
              fileUrl: skFileUrl,
              uploadDate: new Date().toISOString().split('T')[0],
              isLatest: skIsLatest
            };
            const currentSKs = current.skDocs || [];
            const updatedSKs = skIsLatest 
              ? currentSKs.map(sk => ({ ...sk, isLatest: false }))
              : currentSKs;
            await updateTableData('ranting', selectedRantingProfileId, {
              skDocs: [newSK, ...updatedSKs]
            });
            if (refetchData) await refetchData();
          }
        } catch (err: any) {
          console.error('Gagal menyimpan SK ke Supabase:', err);
        }
      }
    }
    
    // Reset form
    setSkNumber('');
    setSkPeriod('');
    setSkFileUrl('');
    setSkIsLatest(true);
    setUploadSKError(null);
    setShowSKUploadModal(false);
  };

  const handleDeleteSK = async (skId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus SK ini?') && setRantings && selectedRantingProfileId) {
      // Optimistic update
      setRantings(prev => prev.map(r => {
        if (r.id !== selectedRantingProfileId) return r;
        const filteredSKs = (r.skDocs || []).filter(sk => sk.id !== skId);
        if (filteredSKs.length > 0 && !filteredSKs.some(sk => sk.isLatest)) {
          filteredSKs[0].isLatest = true;
        }
        return {
          ...r,
          skDocs: filteredSKs
        };
      }));
      // Persist to Supabase
      if (isSupabaseConfigured) {
        try {
          const current = rantings.find(r => r.id === selectedRantingProfileId);
          if (current) {
            const filteredSKs = (current.skDocs || []).filter(sk => sk.id !== skId);
            if (filteredSKs.length > 0 && !filteredSKs.some(sk => sk.isLatest)) {
              filteredSKs[0].isLatest = true;
            }
            await updateTableData('ranting', selectedRantingProfileId, {
              skDocs: filteredSKs
            });
            if (refetchData) await refetchData();
          }
        } catch (err: any) {
          console.error('Gagal menghapus SK dari Supabase:', err);
        }
      }
    }
  };

  // Pengurus form handler for Banom/Lembaga detail pages
  const handlePengurusFormSubmit = async (data: any) => {
    if (!setPengurusList) return;
    const context = pengurusFormContext;
    const itemWithGroup = {
      ...data,
      groupType: context.groupType as 'Banom' | 'Lembaga',
      groupName: context.groupName,
      category: 'Ranting' as const,
      rantingId: context.rantingId
    };

    const { kaderId: _kaderId, ...dataForDb } = itemWithGroup;

    if (pengurusFormEditId) {
      // Edit mode
      let updatedItem = itemWithGroup;
      if (isSupabaseConfigured) {
        try {
          updatedItem = await updateTableData('pengurus', pengurusFormEditId, dataForDb);
        } catch (e: any) {
          console.warn('Supabase update failed:', e);
          updatedItem = { ...itemWithGroup, id: pengurusFormEditId };
        }
      }
      setPengurusList(prev => prev.map(p => p.id === pengurusFormEditId ? updatedItem : p));
    } else {
      // Add mode
      const localId = `p-${Date.now()}`;
      const itemToSave = { ...dataForDb, id: localId };
      let savedItem = itemToSave;
      if (isSupabaseConfigured) {
        try {
          savedItem = await insertTableData('pengurus', itemToSave);
        } catch (e: any) {
          console.warn('Supabase insert failed:', e);
          savedItem = itemToSave;
        }
      }
      // Re-attach kaderId for local state
      if (_kaderId) (savedItem as any).kaderId = _kaderId;
      setPengurusList(prev => [savedItem, ...prev]);
    }

    // If kaderId is linked, update the kader record to reflect their pengurus role
    if (itemWithGroup.kaderId && setKaderList) {
      const kaderRole = `${itemWithGroup.role} — ${itemWithGroup.groupName || itemWithGroup.groupType}`;
      setKaderList(prev => prev.map(k => k.id === itemWithGroup.kaderId ? { ...k, role: kaderRole, banom: (itemWithGroup.groupName || 'Lainnya') as any } : k));
      if (isSupabaseConfigured) {
        try {
          await updateTableData('kader', itemWithGroup.kaderId, { role: kaderRole, banom: itemWithGroup.groupName || 'Lainnya' });
        } catch (e) { console.error('Gagal update data kader:', e); }
      }
    }
    setShowPengurusForm(false);
    setPengurusFormEditId(null);
  };

  const openPengurusForm = (groupType: string, groupName: string, rantingId: string, editId?: string) => {
    setPengurusFormContext({ groupType, groupName, rantingId });
    setPengurusFormEditId(editId || null);
    setShowPengurusForm(true);
  };

  // Kegiatan form handler for Banom/Lembaga detail pages
  const handleKegiatanFormSubmit = async (data: any) => {
    if (!setKegiatanList) return;
    const itemWithOrganizer = {
      ...data,
      organizer: kegiatanFormContext.organizer
    };

    const localId = `e-${Date.now()}`;
    const itemToSave = { ...itemWithOrganizer, id: localId };
    let savedItem = itemToSave;
    if (isSupabaseConfigured) {
      try {
        savedItem = await insertTableData('kegiatan', itemToSave);
      } catch (e: any) {
        console.warn('Supabase insert failed:', e);
        savedItem = itemToSave;
      }
    }
    setKegiatanList(prev => [savedItem, ...prev]);
    setShowKegiatanForm(false);
  };

  const openKegiatanForm = (organizer: string) => {
    setKegiatanFormContext({ organizer });
    setShowKegiatanForm(true);
  };

  // CSV Template and Bulk Importer handlers (Kader & Profil Ranting)
  const [csvKaderMessage, setCsvKaderMessage] = useState<string | null>(null);
  const [csvKaderError, setCsvKaderError] = useState<string | null>(null);
  const [csvRantingMessage, setCsvRantingMessage] = useState<string | null>(null);
  const [csvRantingError, setCsvRantingError] = useState<string | null>(null);

  const downloadKaderCSVTemplate = () => {
    const headers = ["NO", "NAMA LENGKAP", "TEMPAT TANGGAL LAHIR (Tempat, DD-MM-YYYY)", "UNSUR/BANOM/LEMBAGA", "JABATAN", "ALAMAT", "RANTING (NAMA DESA)", "NO TELEPON", "JENIS KELAMIN (L/P)", "MWCNU", "ANGKATAN/TAHUN"];
    const sampleRow1 = ["1", "Ahmad Fauzi", "Gresik, 12-05-1992", "GP Ansor", "Ketua", "Jl. Raya Bungah No. 10", "Bungah", "08123456789", "L", "MWCNU Bungah", "2024"];
    const sampleRow2 = ["2", "Siti Aminah", "Gresik, 20-10-1995", "Fatayat NU", "Sekretaris", "Jl. Melati No. 4, Sidokumpul", "Sidokumpul", "08576543210", "P", "MWCNU Bungah", "PKPNU II"];
    
    const csvRows = [
      headers.join(';'),
      sampleRow1.join(';'),
      sampleRow2.join(';'),
    ];
    
    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Unggah_Kader_NU.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadRantingCSVTemplate = () => {
    const headers = ["ID RANTING (Kosongkan jika baru)", "NAMA RANTING", "DESA / WILAYAH", "TANGGAL BERDIRI (DD-MM-YYYY)", "ALAMAT KANTOR", "TELEPON", "EMAIL", "BANOM AKTIF (Pisah dengan koma)", "LEMBAGA AKTIF (Pisah dengan koma)"];
    const sampleRow1 = ["r1", "PRNU Bungah", "Bungah", "31-01-1926", "Jl. Kiai Gede No. 4, Bungah", "08123456789", "bungah@mwcnubungah.or.id", "Muslimat NU, GP Ansor, Fatayat NU, IPNU, IPPNU, Banser", "LAZISNU, LTMNU, LDNU"];
    const sampleRow2 = ["r2", "PRNU Sidorejo", "Sidorejo", "15-08-1950", "Jl. KH. Wachid Hasyim No. 12", "08576543210", "sidorejo@mwcnubungah.or.id", "Muslimat NU, GP Ansor, IPNU, IPPNU", "LAZISNU"];
    
    const csvRows = [
      headers.join(';'),
      sampleRow1.join(';'),
      sampleRow2.join(';'),
    ];
    
    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Unggah_Profil_Ranting.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKaderCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setCsvKaderError("Gagal membaca file CSV.");
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
          if (row.length < 8) {
            failCount++;
            continue;
          }

          const nama = row[1];
          if (!nama || nama === 'NAMA LENGKAP' || nama === 'NAMA') continue;

          const birthCol = row[2] || '';
          const unsur = row[3] || 'Lainnya';
          const jabatan = row[4] || '-';
          const alamat = row[5] || '';
          const ranting = row[6] || 'mwc';
          const noTelp = row[7] || '';
          const jk = row[8] || 'L';
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
          successCount++;
        }

        if (importedKaders.length === 0) {
          setCsvKaderError("Tidak ada data kader valid yang ditemukan di file CSV.");
          return;
        }

        if (setKaderList) {
          setKaderList(prev => [...importedKaders, ...prev]);
          setCsvKaderMessage(`Berhasil mengimpor ${successCount} data kader baru! ${failCount > 0 ? `(${failCount} baris gagal)` : ''}`);
          setCsvKaderError(null);
          setTimeout(() => setCsvKaderMessage(null), 6000);
        } else {
          setCsvKaderError("Fungsi penyimpan data tidak tersedia.");
        }
      } catch (err: any) {
        setCsvKaderError(`Gagal memproses file CSV: ${err.message}`);
        setTimeout(() => setCsvKaderError(null), 6000);
      }
    };
    reader.readAsText(file);
  };

  const handleRantingCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setCsvRantingError("Gagal membaca file CSV.");
        return;
      }

      try {
        const lines = text.split('\n');
        const importedRantings: Ranting[] = [];
        let successCount = 0;
        let failCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const row = parseCSVLine(line);
          if (row.length < 3) {
            failCount++;
            continue;
          }

          const csvId = row[0] ? row[0].trim() : '';
          const name = row[1] ? row[1].trim() : '';
          const village = row[2] ? row[2].trim() : '';
          if (!name || name === 'NAMA RANTING') continue;

          const establishedRaw = row[3] || '';
          let established = establishedRaw;
          if (establishedRaw.includes('-')) {
            const parts = establishedRaw.split('-');
            if (parts.length === 3 && parts[2].length === 4) {
              established = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }

          const address = row[4] || '';
          const phone = row[5] || '';
          const email = row[6] || '';
          
          const activeBanomRaw = row[7] || '';
          const activeBanom = activeBanomRaw ? activeBanomRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
          
          const activeLembagaRaw = row[8] || '';
          const activeLembaga = activeLembagaRaw ? activeLembagaRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

          const id = csvId || `r-${Date.now()}_${i}`;

          const newRanting: Ranting = {
            id,
            name,
            village,
            established,
            address,
            phone,
            email,
            activeBanom,
            activeLembaga,
            skDocs: []
          };

          importedRantings.push(newRanting);
          successCount++;
        }

        if (importedRantings.length === 0) {
          setCsvRantingError("Tidak ada data ranting valid yang ditemukan di file CSV.");
          return;
        }

        if (setRantings) {
          setRantings(prev => {
            const merged = [...prev];
            importedRantings.forEach(imp => {
              const existingIdx = merged.findIndex(r => r.id === imp.id || r.village.toLowerCase() === imp.village.toLowerCase());
              if (existingIdx !== -1) {
                merged[existingIdx] = {
                  ...merged[existingIdx],
                  ...imp,
                  imageUrl: merged[existingIdx].imageUrl || imp.imageUrl,
                  skDocs: merged[existingIdx].skDocs && merged[existingIdx].skDocs.length > 0 ? merged[existingIdx].skDocs : imp.skDocs
                };
              } else {
                merged.push(imp);
              }
            });
            return merged;
          });

          setCsvRantingMessage(`Berhasil mengimpor/memperbarui ${successCount} data profil ranting! ${failCount > 0 ? `(${failCount} baris gagal)` : ''}`);
          setCsvRantingError(null);
          setTimeout(() => setCsvRantingMessage(null), 6000);
        } else {
          setCsvRantingError("Fungsi penyimpan data tidak tersedia.");
        }
      } catch (err: any) {
        setCsvRantingError(`Gagal memproses file CSV: ${err.message}`);
        setTimeout(() => setCsvRantingError(null), 6000);
      }
    };
    reader.readAsText(file);
  };

  // Lifted states to prevent Hook ordering bugs
  const [profilSelectedRanting, setProfilSelectedRanting] = useState<string>('Semua');
  const [profilSelectedBanom, setProfilSelectedBanom] = useState<string>('Semua');
  const [profilSearchQuery, setProfilSearchQuery] = useState('');
  const [selectedRantingProfileId, setSelectedRantingProfileId] = useState<string | null>(null);

  const [kaderSelectedBanom, setKaderSelectedBanom] = useState<string>('Semua');
  const [kaderSelectedRanting, setKaderSelectedRanting] = useState<string>('Semua');
  const [kaderSearchQuery, setKaderSearchQuery] = useState('');

  const [kegiatanStatusFilter, setKegiatanStatusFilter] = useState<'Semua' | 'Rencana' | 'Selesai'>('Semua');

  const [koinSelectedRanting, setKoinSelectedRanting] = useState<string>('Semua');
  const [koinSelectedMonth, setKoinSelectedMonth] = useState<string>('Semua');

  const [persuratanSearchQuery, setPersuratanSearchQuery] = useState('');
  const [persuratanSelectedType, setPersuratanSelectedType] = useState<string>('Semua');

  const [gallerySelectedCategory, setGallerySelectedCategory] = useState<string>('Semua');

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRantingId, setContactRantingId] = useState('r1');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactErrorMsg, setContactErrorMsg] = useState('');

  // Helper: Format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper: Translate Ranting ID to Name
  const getRantingName = (id?: string) => {
    if (!id) return 'Tingkat MWC';
    if (id === 'mwc') return 'Tingkat MWC';
    const r = rantings.find(item => item.id === id);
    return r ? r.name : 'Ranting NU';
  };

  // Helper: Parse and Render Points/Pilar Penyaluran for Koin S3
  const renderDistributionTarget = (target: string) => {
    if (!target) return null;
    if (target.trim().startsWith('[') && target.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(target);
        if (Array.isArray(parsed)) {
          return (
            <ul className="space-y-2 list-none pl-0">
              {parsed.map((item: any, idx: number) => (
                <li key={idx} className="flex flex-col text-xs text-slate-700 leading-normal border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-semibold text-slate-800 text-[11px]">{idx + 1}. {item.text || 'Pilar Penyaluran'}</span>
                    <span className="text-[10px] font-bold text-amber-600 shrink-0 ml-auto">
                      {item.amount ? formatRupiah(item.amount) : ''}
                    </span>
                  </div>
                  {item.photoUrl && (
                    <a 
                      href={item.photoUrl} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-1 text-[9px] text-tosca-700 hover:text-tosca-800 hover:underline mt-0.5 font-bold"
                    >
                      <span>🖼️ Lihat Foto Bukti</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          );
        }
      } catch (e) {
        // Fallback below
      }
    }
    return <p className="text-xs text-slate-700 italic font-medium leading-relaxed">&ldquo;{target}&rdquo;</p>;
  };

  // ==========================================
  // PAGE 0: HOME / BERANDA
  // ==========================================
  const renderHome = () => {
    // 1. Calculations for Home Stats
    const totalRanting = rantings.length - 1; // excluding mwc
    const totalKader = kaderList.length;
    
    // Total Koin S3 bulan ini (June 2026)
    const activeMonth = '2026-06';
    const totalKoinS3BulanIni = koinList
      .filter(k => k.month === activeMonth)
      .reduce((sum, k) => sum + k.amount, 0);

    const totalDanaSalurBulanIni = koinList
      .filter(k => k.month === activeMonth)
      .reduce((sum, k) => sum + k.distributionAmount, 0);

    // Kas non-S3 total masuk dan keluar
    const totalKasMasuk = kasList.filter(k => k.type === 'Masuk').reduce((sum, k) => sum + k.amount, 0);
    const totalKasKeluar = kasList.filter(k => k.type === 'Keluar').reduce((sum, k) => sum + k.amount, 0);
    const saldoKas = totalKasMasuk - totalKasKeluar;

    // 2. Prepare Chart Data for Koin S3
    const chartDataKoinS3 = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const koin = koinList.find(k => k.rantingId === r.id && k.month === activeMonth);
        return {
          name: r.village,
          'Perolehan S3 (Rp)': koin ? koin.amount : 0,
          'Penyaluran (Rp)': koin ? koin.distributionAmount : 0
        };
      });

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Banner Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-tosca-900 via-tosca-850 to-emerald-950 text-white rounded-2xl p-6 md:p-12 shadow-xl border border-tosca-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-tosca-200 border border-white/10 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Media Transparansi Publik Resmi</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
              Membangun Jam&apos;iyah Mandiri, Transparan & Akuntabel
            </h1>
            <p className="text-sm md:text-lg text-slate-200 max-w-2xl font-light leading-relaxed">
              Selamat datang di **Kanal Transparansi MWC NU Bungah**. Portal keterbukaan informasi publik yang mengintegrasikan akuntabilitas keuangan koin LAZISNU, inventarisasi aset wakaf, sarana pendidikan, serta manajemen kaderisasi secara berkala dan terpusat.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveTab('koin_s3')}
                className="px-5 py-2.5 bg-tosca-500 hover:bg-tosca-600 font-semibold text-white rounded-lg shadow-md transition-all text-sm flex items-center space-x-2"
              >
                <Coins className="w-4 h-4" />
                <span>Pantau Koin S3</span>
              </button>
              <button 
                onClick={() => setActiveTab('keuangan')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/25 border border-white/20 font-semibold text-white rounded-lg transition-all text-sm flex items-center space-x-2 backdrop-blur-md"
              >
                <DollarSign className="w-4 h-4" />
                <span>Lihat Laporan Arus Dana</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-tosca-50 rounded-xl text-tosca-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Ranting NU</span>
              <p className="text-xl font-bold text-gray-900">{totalRanting} Desa</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Kader Terdata</span>
              <p className="text-xl font-bold text-gray-900">{totalKader} Anggota</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Koin S3 ({activeMonth})</span>
              <p className="text-xl font-bold text-amber-600">{formatRupiah(totalKoinS3BulanIni)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Saldo Kas MWC</span>
              <p className="text-xl font-bold text-teal-600">{formatRupiah(saldoKas)}</p>
            </div>
          </div>
        </section>

        {/* Charts and Highlights Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Visualisasi Perolehan & Penyaluran Koin S3</h3>
                <p className="text-[10px] text-gray-500">Bulan Aktif: Juni 2026 (Per Pengurus Ranting NU se-Bungah)</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 bg-amber-50 text-amber-800 rounded font-bold uppercase">LAZISNU Care</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataKoinS3} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => `${v / 1000000}jt`} />
                  <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Perolehan S3 (Rp)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Penyaluran (Rp)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* S3 Quick Summary & Distribution target */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Sasaran Tasaruf Koin S3</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Uang koin receh seribu rupiah yang dikumpulkan para petugas (Gerakan S3) dari rumah ke rumah warga dilingkungan Ranting NU disalurkan secara berkala untuk 4 pilar kemaslahatan:
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-lg bg-tosca-50 flex items-center justify-center text-tosca-700 font-mono text-xs font-bold mt-0.5">1</div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Pilar Pendidikan</span>
                    <p className="text-[10px] text-gray-500">Membantu beasiswa siswa yatim/piatu dan stimulan insentif guru ngaji dhuafa.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 font-mono text-xs font-bold mt-0.5">2</div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Pilar Kesehatan</span>
                    <p className="text-[10px] text-gray-500">Layanan ambulans gratis MWC dan pembiayaan obat darurat warga prasejahtera.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-mono text-xs font-bold mt-0.5">3</div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Pilar Sosial Keagamaan</span>
                    <p className="text-[10px] text-gray-500">Santunan bencana alam, dana kematian warga, rehab ringan MCK rumah ibadah.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Rasio Penyelamatan</span>
                <span className="text-tosca-700 font-bold">
                  {((totalDanaSalurBulanIni / totalKoinS3BulanIni) * 100).toFixed(1)}% Penyaluran
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-tosca-600 h-2 rounded-full" 
                  style={{ width: `${(totalDanaSalurBulanIni / totalKoinS3BulanIni) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Latest News and Docs Log Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest News */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Kabar Berita Terkini</h3>
              <button 
                onClick={() => setActiveTab('berita')}
                className="text-xs text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"
              >
                <span>Lihat Semua Berita</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {beritaList.slice(0, 2).map((item) => (
                <div key={item.id} className="group cursor-pointer flex space-x-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0" onClick={() => { setSelectedNewsId(item.id); setActiveTab('berita'); }}>
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" 
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold text-tosca-700 uppercase tracking-wider">{item.category}</span>
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-tosca-600 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.content.replace(/[#*`>]/g, '').slice(0, 100)}...
                    </p>
                    <div className="flex items-center text-[10px] text-slate-400 space-x-2 pt-1">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Letters & Docs Log */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Log Persuratan Masuk & Keluar</h3>
                <button 
                  onClick={() => setActiveTab('persuratan')}
                  className="text-xs text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar -mx-6 px-6">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-2.5">Tanggal</th>
                      <th className="pb-2.5">Jenis</th>
                      <th className="pb-2.5">Perihal</th>
                      <th className="pb-2.5 text-right">No. Surat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suratList.slice(0, 3).map((s) => (
                      <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-2.5 text-slate-500 font-semibold">{s.date}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${s.type === 'Masuk' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                            {s.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-800 font-bold truncate max-w-[150px]">{s.subject}</td>
                        <td className="py-2.5 text-right font-mono text-[10px] text-slate-500">{s.letterNumber.split('/')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 bg-emerald-50/30 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <span className="text-[11px] text-emerald-900 font-semibold leading-relaxed">
                  Semua log surat tercatat transparan dan didistribusikan ke Ranting melalui arsip digital.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // ==========================================
  // DETAIL PAGE: BANOM / LEMBAGA
  // ==========================================
  const renderBanomLembagaDetail = (rantingId: string, groupType: string, groupId: string) => {
    const ranting = rantings.find(r => r.id === rantingId);
    const isBanom = groupType === 'banom';
    const isAdmin = userRole && userRole !== 'guest';

    // Definitions
    const banomDefs: Record<string, { name: string; desc: string }> = {
      'Muslimat NU': { name: 'Muslimat Nahdlatul Ulama', desc: 'Wadah perjuangan wanita Islam NU (ibu-ibu/dewasa).' },
      'GP Ansor': { name: 'Gerakan Pemuda Ansor (GP Ansor)', desc: 'Wadah perjuangan pemuda NU.' },
      'Fatayat NU': { name: 'Fatayat Nahdlatul Ulama', desc: 'Wadah perjuangan pemuda wanita/perempuan muda NU.' },
      'IPNU': { name: 'Ikatan Pelajar Nahdlatul Ulama (IPNU)', desc: 'Wadah perjuangan pelajar dan santri laki-laki NU.' },
      'IPPNU': { name: 'Ikatan Pelajar Putri Nahdlatul Ulama (IPPNU)', desc: 'Wadah perjuangan pelajar dan santri perempuan NU.' },
      'PMII': { name: 'Pergerakan Mahasiswa Islam Indonesia (PMII)', desc: 'Wadah perjuangan mahasiswa NU.' },
      'ISNU': { name: 'Ikatan Sarjana Nahdlatul Ulama (ISNU)', desc: 'Wadah para sarjana, intelektual, dan akademisi NU.' },
      'JARTMAN': { name: "Jam'iyyah Ahli Thariqah al-Mu'tabarah an-Nahdliyyah (JARTMAN)", desc: 'Wadah pengamal ajaran thariqah.' },
      'JQH': { name: "Jam'iyyatul Qurra wal Huffazh (JQH)", desc: 'Wadah para qari/qariah dan hafizh/hafizhah.' },
      'Pergunu': { name: 'Persatuan Guru Nahdlatul Ulama (Pergunu)', desc: 'Wadah perjuangan para guru dan pendidik NU.' },
      'Sarbumusi': { name: 'Serikat Buruh Muslimin Indonesia (Sarbumusi)', desc: 'Wadah perjuangan para buruh dan pekerja NU.' },
      'Pagar Nusa': { name: 'Ikatan Pencak Silat Pagar Nusa (IPS Pagar Nusa)', desc: 'Wadah seni bela diri pencak silat di lingkungan NU.' },
      'Lesbumi': { name: 'Lembaga Seniman Budayawan Muslimin Indonesia (Lesbumi)', desc: 'Wadah di bidang seni dan kebudayaan.' }
    };
    const lembagaDefs: Record<string, { name: string; desc: string }> = {
      'LDNU': { name: 'Lembaga Dakwah Nahdlatul Ulama (LDNU)', desc: 'Melaksanakan kebijakan NU di bidang dakwah Islamiyah.' },
      'LPMNU': { name: 'Lembaga Pendidikan Ma\'arif NU (LPMNU)', desc: 'Menyelenggarakan dan mengelola pendidikan formal.' },
      'RMI-NU': { name: 'Rabithah Ma\'ahid al-Islamiyah (RMI-NU)', desc: 'Asosiasi pondok pesantren NU.' },
      'LKKNU': { name: 'Lembaga Kemaslahatan Keluarga NU (LKKNU)', desc: 'Bergerak di bidang kesejahteraan keluarga.' },
      'LTMNU': { name: 'Lembaga Takmir Masjid NU (LTMNU)', desc: 'Mengurus pengelolaan dan pemakmuran masjid-masjid NU.' },
      'LAZISNU': { name: 'Lembaga Amil Zakat, Infak, dan Sedekah NU (LAZISNU)', desc: 'Menghimpun, mengelola, dan mendistribusikan zakat, infak, sedekah.' },
      'LKNU': { name: 'Lembaga Kesehatan Nahdlatul Ulama (LKNU)', desc: 'Melaksanakan kebijakan NU di bidang kesehatan.' },
      'LAKPESDAM': { name: 'Lembaga Kajian dan Pengembangan SDM (LAKPESDAM)', desc: 'Fokus pada kajian strategis dan pengembangan kapasitas SDM.' },
      'LPBHNU': { name: 'Lembaga Penyuluhan dan Bantuan Hukum NU (LPBHNU)', desc: 'Advokasi, penyuluhan, dan bantuan hukum.' },
      'LPNU': { name: 'Lembaga Perekonomian Nahdlatul Ulama (LPNU)', desc: 'Mengembangkan ekonomi warga dan kewirausahaan.' },
      'LP2NU': { name: 'Lembaga Pengembangan Pertanian NU (LP2NU)', desc: 'Mengembangkan bidang pertanian dan ketahanan pangan.' },
      'LBMNU': { name: 'Lembaga Bahtsul Masail NU (LBMNU)', desc: 'Membahas dan memecahkan masalah-masalah keagamaan.' },
      'LESBUMI': { name: 'Lembaga Seniman Budayawan Muslimin Indonesia (LESBUMI)', desc: 'Kebijakan NU di bidang kebudayaan dan seni.' },
      'LTNNU': { name: 'Lembaga Talif wan Nasyr NU (LTNNU)', desc: 'Lembaga infokom, penerbitan, media, dan dokumentasi.' },
      'LPBI-NU': { name: 'Lembaga Penanggulangan Bencana & Perubahan Iklim (LPBI-NU)', desc: 'Mitigasi bencana, tanggap darurat, dan lingkungan hidup.' },
      'LF-NU': { name: 'Lembaga Falakiyah NU (LF-NU)', desc: 'Mengelola urusan hisab dan rukyat.' },
      'LWPNU': { name: 'Lembaga Wakaf dan Pertanahan NU (LWPNU)', desc: 'Mengurus sertifikasi dan pengelolaan aset tanah NU.' }
    };

    const defs = isBanom ? banomDefs : lembagaDefs;
    const def = defs[groupId];
    const groupLabel = isBanom ? 'Badan Otonom (Banom)' : 'Lembaga';
    const groupColor = isBanom ? 'emerald' : 'blue';

    if (!ranting) {
      return (
        <div className="p-6 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-sm font-bold text-red-500">Ranting tidak ditemukan.</p>
          <button onClick={() => setProfileSubPath?.('')} className="mt-4 px-4 py-2 bg-tosca-600 text-white text-xs font-bold rounded-xl">Kembali</button>
        </div>
      );
    }

    // --- Kader filtering: map group ID to banom field values ---
    const banomToKaderBanom: Record<string, string[]> = {
      'Muslimat NU': ['Muslimat'],
      'GP Ansor': ['Ansor', 'Banser'],
      'Fatayat NU': ['Fatayat'],
      'IPNU': ['IPNU'],
      'IPPNU': ['IPPNU'],
      'Pagar Nusa': ['Pagar Nusa'],
      'PMII': ['Lainnya'],
      'ISNU': ['Lainnya'],
      'JARTMAN': ['Lainnya'],
      'JQH': ['Lainnya'],
      'Pergunu': ['Lainnya'],
      'Sarbumusi': ['Lainnya'],
      'Lesbumi': ['Lainnya']
    };
    const matchedBanomValues = banomToKaderBanom[groupId] || [];

    // Filter related data
    const groupPengurus = pengurusList.filter(p => p.groupType === (isBanom ? 'Banom' : 'Lembaga') && p.groupName === groupId);
    // Kader: filter by matching banom field AND ranting
    const rKader = kaderList.filter(k => {
      const rantingMatch = ranting.id === 'mwc' ? true : k.rantingId === ranting.id;
      const banomMatch = matchedBanomValues.length > 0
        ? matchedBanomValues.includes(k.banom)
        : k.banom === 'Lainnya'; // If no mapping, show unmapped kader
      return rantingMatch && banomMatch;
    });
    // All kader in this ranting (for assign dropdown)
    const allRantingKader = kaderList.filter(k => ranting.id === 'mwc' ? true : k.rantingId === ranting.id);
    const rKegiatan = kegiatanList.filter(k => k.organizer.toLowerCase().includes(groupId.toLowerCase()) || k.description?.toLowerCase().includes(groupId.toLowerCase()));
    const rKas = kasList.filter(k => k.description?.toLowerCase().includes(groupId.toLowerCase()));
    const rSurat = suratList.filter(s => s.subject?.toLowerCase().includes(groupId.toLowerCase()));
    const rDokumentasi = dokumentasiList.filter(d => d.title?.toLowerCase().includes(groupId.toLowerCase()) || d.category?.toLowerCase().includes(groupId.toLowerCase()));

    // --- Admin helpers ---
    const startEdit = (field: string, currentValue: string) => {
      setEditingBanomField(field);
      setEditingBanomValue(currentValue || '');
    };
    const saveEdit = async (field: string, rantingUpdateField?: string) => {
      if (setRantings && rantingUpdateField) {
        setRantings(prev => prev.map(r => r.id === rantingId ? { ...r, [rantingUpdateField]: editingBanomValue } : r));
        if (isSupabaseConfigured) {
          try { await updateTableData('ranting', rantingId, { [rantingUpdateField]: editingBanomValue }); } catch (e) { console.error(e); }
        }
      }
      setEditingBanomField(null);
    };
    const assignKaderToGroup = async (kaderId: string) => {
      if (!setKaderList) return;
      const targetBanom = matchedBanomValues[0] || groupId;
      setKaderList(prev => prev.map(k => k.id === kaderId ? { ...k, banom: targetBanom as any } : k));
      if (isSupabaseConfigured) {
        try { await updateTableData('kader', kaderId, { banom: targetBanom }); } catch (e) { console.error(e); }
      }
      setShowAssignKader(false);
      setBanomKaderSearch('');
    };
    const unassignKader = async (kaderId: string) => {
      if (!setKaderList) return;
      setKaderList(prev => prev.map(k => k.id === kaderId ? { ...k, banom: 'Lainnya' as any } : k));
      if (isSupabaseConfigured) {
        try { await updateTableData('kader', kaderId, { banom: 'Lainnya' }); } catch (e) { console.error(e); }
      }
    };

    // Filter kader for assign dropdown
    const assignableKader = allRantingKader.filter(k => {
      const notAssigned = !matchedBanomValues.includes(k.banom);
      const matchesSearch = !banomKaderSearch || k.name.toLowerCase().includes(banomKaderSearch.toLowerCase());
      return notAssigned && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs">
          <button onClick={() => { setSelectedRantingProfileId(rantingId); setProfileSubPath?.(''); }} className="text-tosca-600 hover:text-tosca-700 font-bold">← {ranting.name}</button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 font-semibold">{groupLabel}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-800 font-bold">{groupId}</span>
        </div>

        {/* Header Card */}
        <div className="rounded-2xl p-6 md:p-8 text-white shadow-xl" style={{ background: isBanom ? 'linear-gradient(135deg, #047857, #064e3b)' : 'linear-gradient(135deg, #1d4ed8, #1e3a5f)' }}>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                {groupLabel} • {ranting.name}
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold">{def?.name || groupId}</h1>
              <p className="text-sm text-white/80 max-w-xl leading-relaxed">{def?.desc || `Profil ${groupLabel} ${groupId} tingkat ${ranting.name}.`}</p>
            </div>
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold">
              {groupPengurus.length} Pengurus
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
            <p className="text-2xl font-bold text-slate-900">{groupPengurus.length}</p>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Pengurus</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
            <p className="text-2xl font-bold text-slate-900">{rKader.length}</p>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Kader Terkait</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
            <p className="text-2xl font-bold text-slate-900">{rKegiatan.length}</p>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Kegiatan</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
            <p className="text-2xl font-bold text-slate-900">{rDokumentasi.length}</p>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Dokumentasi</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Sejarah & Struktur */}
          <div className="space-y-6">
            {/* Sejarah & Profil */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-gray-900 text-sm">📖 Sejarah & Profil</h3>
                {isAdmin && editingBanomField !== 'history' && (
                  <button onClick={() => startEdit('history', def?.desc || '')} className="text-[10px] text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"><Pencil className="w-3 h-3" /><span>Edit</span></button>
                )}
              </div>
              {editingBanomField === 'history' ? (
                <div className="space-y-2">
                  <textarea value={editingBanomValue} onChange={e => setEditingBanomValue(e.target.value)} className="w-full p-2 border border-tosca-300 rounded-lg text-xs focus:ring-2 focus:ring-tosca-200" rows={4} />
                  <div className="flex space-x-2">
                    <button onClick={() => saveEdit('history')} className="px-3 py-1 bg-tosca-600 text-white text-[10px] font-bold rounded-lg">Simpan</button>
                    <button onClick={() => setEditingBanomField(null)} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">Batal</button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {def?.desc || `${groupId} merupakan ${groupLabel.toLowerCase()} tingkat ${ranting.village} yang tergabung dalam ${ranting.name}. Organisasi ini berperan aktif dalam kegiatan keagamaan, sosial, dan kaderisasi di lingkungan ${ranting.village}.`}
                </p>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs text-slate-600"><Building2 className="w-3.5 h-3.5 text-tosca-600" /><span>{ranting.address || ranting.village}</span></div>
                {ranting.phone && <div className="flex items-center space-x-2 text-xs text-slate-600"><Phone className="w-3.5 h-3.5 text-tosca-600" /><span>{ranting.phone}</span></div>}
                {ranting.email && <div className="flex items-center space-x-2 text-xs text-slate-600"><Mail className="w-3.5 h-3.5 text-tosca-600" /><span>{ranting.email}</span></div>}
              </div>
            </div>              {/* Struktur Pengurus */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-gray-900 text-sm">👤 Struktur Pengurus ({groupPengurus.length})</h3>
                {isAdmin && (
                  <button onClick={() => openPengurusForm(isBanom ? 'Banom' : 'Lembaga', groupId, rantingId)} className="px-3 py-1 bg-tosca-600 hover:bg-tosca-700 text-white text-[10px] font-bold rounded-lg flex items-center space-x-1">
                    <Plus className="w-3 h-3" /><span>Tambah Pengurus</span>
                  </button>
                )}
              </div>
              {groupPengurus.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada pengurus terdaftar.</p>
              ) : (
                <div className="space-y-2">
                  {groupPengurus.map((p) => (
                    <div key={p.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <img src={p.photoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} alt={p.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-contain border border-slate-200 bg-white shrink-0" />
                      <div className="min-w-0 w-full flex-1">
                        <span className="inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider mb-1" style={isBanom ? { backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #d1fae5' } : { backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #dbeafe' }}>{p.role || 'Anggota'}</span>
                        <h4 className="text-xs font-bold text-gray-900 truncate">{p.name}</h4>
                        <div className="flex items-center space-x-3 text-[9px] text-slate-500 mt-0.5">
                          {p.education && <span>{p.education}</span>}
                          {p.phone && <span className="font-mono">{p.phone}</span>}
                          {p.kaderisasiStatus && (
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${p.kaderisasiStatus === 'PD-PKPNU' || p.kaderisasiStatus === 'MKNU' ? 'bg-emerald-100 text-emerald-700' : p.kaderisasiStatus === 'Penyetaraan' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{p.kaderisasiStatus}</span>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <button onClick={() => openPengurusForm(isBanom ? 'Banom' : 'Lembaga', groupId, rantingId, p.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white text-slate-400 hover:text-tosca-600" title="Edit Pengurus">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Anggota / Kader — filtered by banom */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-gray-900 text-sm">👥 Data Kader {groupId} ({rKader.length})</h3>
                {isAdmin && (
                  <button onClick={() => setShowAssignKader(!showAssignKader)} className="px-3 py-1 bg-tosca-600 hover:bg-tosca-700 text-white text-[10px] font-bold rounded-lg flex items-center space-x-1">
                    <Plus className="w-3 h-3" /><span>Tugaskan Kader</span>
                  </button>
                )}
              </div>

              {/* Assign Kader panel */}
              {isAdmin && showAssignKader && (
                <div className="bg-tosca-50 border border-tosca-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-tosca-800">Tugaskan Kader ke {groupId}</span>
                    <button onClick={() => setShowAssignKader(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-4 h-4" /></button>
                  </div>
                  <input type="text" placeholder="Cari nama kader..." value={banomKaderSearch} onChange={e => setBanomKaderSearch(e.target.value)} className="w-full p-2 border border-tosca-200 rounded-lg text-xs focus:ring-2 focus:ring-tosca-200" />
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {assignableKader.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic py-2">Tidak ada kader yang bisa ditugaskan.</p>
                    ) : (
                      assignableKader.slice(0, 30).map(k => (
                        <div key={k.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 hover:border-tosca-200 transition-all">
                          <div>
                            <span className="text-xs font-bold text-gray-800 block">{k.name}</span>
                            <span className="text-[9px] text-slate-500">{k.role} • {k.banom}</span>
                          </div>
                          <button onClick={() => assignKaderToGroup(k.id)} className="px-2 py-1 bg-tosca-600 hover:bg-tosca-700 text-white text-[9px] font-bold rounded">Tugaskan</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {rKader.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 italic">Belum ada kader yang ditugaskan ke {groupId}.</p>
                  {isAdmin && <p className="text-[10px] text-tosca-600 mt-1 font-semibold">Klik &quot;Tugaskan Kader&quot; untuk menambahkan.</p>}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="text-left py-2">Nama</th><th className="text-left py-2">Jabatan</th><th className="text-left py-2">Gender</th><th className="text-left py-2">Telepon</th>
                      {isAdmin && <th className="text-right py-2">Aksi</th>}
                    </tr></thead>
                    <tbody>
                      {rKader.slice(0, 30).map((k) => (
                        <tr key={k.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                          <td className="py-2 font-bold text-gray-800">{k.name}</td>
                          <td className="py-2 text-slate-600">{k.role}</td>
                          <td className="py-2 text-slate-600">{k.gender}</td>
                          <td className="py-2 font-mono text-slate-500">{k.phone || '-'}</td>
                          {isAdmin && (
                            <td className="py-2 text-right">
                              <button onClick={() => unassignKader(k.id)} className="text-[9px] text-red-500 hover:text-red-700 font-bold" title="Lepas dari grup ini">Lepas</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rKader.length > 30 && <p className="text-[10px] text-slate-400 mt-2 italic">Menampilkan 30 dari {rKader.length} kader.</p>}
                </div>
              )}
            </div>

            {/* Program / Kegiatan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-gray-900 text-sm">📋 Program & Kegiatan ({rKegiatan.length})</h3>
                {isAdmin && (
                  <button onClick={() => openKegiatanForm(groupId)} className="px-3 py-1 bg-tosca-600 hover:bg-tosca-700 text-white text-[10px] font-bold rounded-lg flex items-center space-x-1">
                    <Plus className="w-3 h-3" /><span>Tambah Kegiatan</span>
                  </button>
                )}
              </div>
              {rKegiatan.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada program/kegiatan terkait.</p>
              ) : (
                <div className="space-y-2">
                  {rKegiatan.map((k) => (
                    <div key={k.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-800">{k.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${k.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{k.status}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-500 mt-1">
                        <span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{k.date}</span></span>
                        <span className="flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{k.location}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Keuangan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-gray-900 text-sm">💰 Transparansi Keuangan ({rKas.length})</h3>
                {isAdmin && (
                  <button onClick={() => setActiveTab('admin')} className="text-[10px] text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"><Pencil className="w-3 h-3" /><span>Kelola</span></button>
                )}
              </div>
              {rKas.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada data keuangan terkait.</p>
              ) : (
                <div className="space-y-2">
                  {rKas.map((k) => (
                    <div key={k.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{k.description}</p>
                        <span className="text-[10px] text-slate-500">{k.date} • {k.category}</span>
                      </div>
                      <span className={`text-xs font-bold ${k.type === 'Masuk' ? 'text-emerald-600' : 'text-red-600'}`}>{k.type === 'Masuk' ? '+' : '-'}{formatRupiah(k.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Persuratan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-gray-900 text-sm">📮 Arsip Persuratan ({rSurat.length})</h3>
                {isAdmin && (
                  <button onClick={() => setActiveTab('admin')} className="text-[10px] text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"><Pencil className="w-3 h-3" /><span>Kelola</span></button>
                )}
              </div>
              {rSurat.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada data persuratan terkait.</p>
              ) : (
                <div className="space-y-2">
                  {rSurat.map((s) => (
                    <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${s.type === 'Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{s.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{s.letterNumber}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-800 mt-1">{s.subject}</p>
                      <span className="text-[10px] text-slate-500">{s.date} • {s.senderOrRecipient}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Galeri Kegiatan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-gray-900 text-sm">🖼️ Galeri Kegiatan ({rDokumentasi.length})</h3>
                {isAdmin && (
                  <button onClick={() => setActiveTab('admin')} className="text-[10px] text-tosca-600 hover:text-tosca-700 font-bold flex items-center space-x-1"><Pencil className="w-3 h-3" /><span>Kelola</span></button>
                )}
              </div>
              {rDokumentasi.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada galeri kegiatan.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {rDokumentasi.map((d) => (
                    <div key={d.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group cursor-pointer">
                      <img src={d.url} alt={d.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                        <span className="text-[9px] font-bold text-white leading-tight line-clamp-2">{d.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Form Tambah/Edit Pengurus */}
        {showPengurusForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-xl overflow-hidden animate-scaleIn">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm">
                  {pengurusFormEditId ? 'Edit Pengurus' : 'Tambah Pengurus Baru'} — {pengurusFormContext.groupName}
                </h3>
                <button onClick={() => { setShowPengurusForm(false); setPengurusFormEditId(null); }} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
              </div>
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <AdminCMSForm
                  activeModel="pengurus"
                  editItemId={pengurusFormEditId}
                  rantings={rantings}
                  userRole={userRole || 'guest'}
                  onClose={() => { setShowPengurusForm(false); setPengurusFormEditId(null); }}
                  onSubmit={handlePengurusFormSubmit}
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
                  formContext={pengurusFormContext.groupType ? pengurusFormContext : undefined}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal: Form Tambah Kegiatan */}
        {showKegiatanForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-xl overflow-hidden animate-scaleIn">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm">
                  Tambah Kegiatan Baru — {groupId}
                </h3>
                <button onClick={() => setShowKegiatanForm(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
              </div>
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <AdminCMSForm
                  activeModel="kegiatan"
                  editItemId={null}
                  rantings={rantings}
                  userRole={userRole || 'guest'}
                  onClose={() => setShowKegiatanForm(false)}
                  onSubmit={handleKegiatanFormSubmit}
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
                  formContext={{ organizer: kegiatanFormContext.organizer }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // PAGE 1: PROFIL JAMIYAH
  // ==========================================
  const renderProfil = () => {
    // Route: /profil/:rantingId/:type/:itemId  (e.g. /profil/mwc/banom/gp-ansor)
    if (profileSubPath) {
      const parts = profileSubPath.split('/');
      const rantingId = parts[0] || '';
      const groupType = parts[1] || ''; // 'banom' or 'lembaga'
      const groupId = parts.slice(2).join('/') || '';

      if (rantingId && groupType && groupId && (groupType === 'banom' || groupType === 'lembaga')) {
        return renderBanomLembagaDetail(rantingId, groupType, groupId);
      }
    }

    // If a specific Ranting is selected, render the detailed Ranting profile
    if (selectedRantingProfileId) {
      const ranting = rantings.find(r => r.id === selectedRantingProfileId);
      if (!ranting) {
        return (
          <div className="p-6 text-center bg-white rounded-2xl border border-gray-200">
            <p className="text-sm font-bold text-red-500">Profil Ranting tidak ditemukan.</p>
            <button 
              onClick={() => setSelectedRantingProfileId(null)}
              className="mt-4 px-4 py-2 bg-tosca-600 text-white text-xs font-bold rounded-xl"
            >
              Kembali ke Daftar
            </button>
          </div>
        );
      }

      // Filter pengurus for this specific Ranting
      const rPengurus = pengurusList.filter(p => {
        if (ranting.id === 'mwc') {
          return p.category === 'MWC';
        }
        return p.category === 'Ranting' && p.rantingId === ranting.id;
      });

      // Filter connected data
      const rKader = kaderList.filter(k => ranting.id === 'mwc' ? true : k.rantingId === ranting.id);
      
      const rKegiatan = kegiatanList.filter(k => {
        if (ranting.id === 'mwc') {
          return k.organizer === 'MWC NU' || k.organizer.toLowerCase().includes('mwc');
        }
        return k.organizer.toLowerCase().includes(ranting.village.toLowerCase()) || 
               k.organizer.toLowerCase().includes(ranting.name.toLowerCase());
      });

      const rUsaha = usahaList.filter(u => {
        if (ranting.id === 'mwc') return true; // All MWC businesses
        return u.location.toLowerCase().includes(ranting.village.toLowerCase()) ||
               u.manager.toLowerCase().includes(ranting.village.toLowerCase());
      });

      const rIbadah = saranaIbadahList.filter(s => ranting.id === 'mwc' ? true : s.rantingId === ranting.id);
      const rPendidikan = saranaPendidikanList.filter(s => ranting.id === 'mwc' ? true : s.rantingId === ranting.id);
      const rKoin = koinList.filter(k => ranting.id === 'mwc' ? true : k.rantingId === ranting.id);
      const banomDefinitions = [
        { id: 'Muslimat NU', name: 'Muslimat Nahdlatul Ulama', desc: 'Wadah perjuangan wanita Islam NU (ibu-ibu/dewasa).' },
        { id: 'GP Ansor', name: 'Gerakan Pemuda Ansor (GP Ansor)', desc: 'Wadah perjuangan pemuda NU.' },
        { id: 'Fatayat NU', name: 'Fatayat Nahdlatul Ulama', desc: 'Wadah perjuangan pemuda wanita/perempuan muda NU.' },
        { id: 'IPNU', name: 'Ikatan Pelajar Nahdlatul Ulama (IPNU)', desc: 'Wadah perjuangan pelajar dan santri laki-laki NU.' },
        { id: 'IPPNU', name: 'Ikatan Pelajar Putri Nahdlatul Ulama (IPPNU)', desc: 'Wadah perjuangan pelajar dan santri perempuan NU.' },
        { id: 'PMII', name: 'Pergerakan Mahasiswa Islam Indonesia (PMII)', desc: 'Wadah perjuangan mahasiswa NU (telah kembali menjadi Banom NU).' },
        { id: 'ISNU', name: 'Ikatan Sarjana Nahdlatul Ulama (ISNU)', desc: 'Wadah para sarjana, intelektual, dan akademisi NU.' },
        { id: 'JARTMAN', name: 'Jam\'iyyah Ahli Thariqah al-Mu\'tabarah an-Nahdliyyah (JARTMAN)', desc: 'Wadah pengamal ajaran thariqah yang mu\'tabar (sah/tersambung ke Rasulullah).' },
        { id: 'JQH', name: 'Jam\'iyyatul Qurra wal Huffazh (JQH)', desc: 'Wadah para qari/qariah dan hafizh/hafizhah (penghafal Al-Qur\'an).' },
        { id: 'Pergunu', name: 'Persatuan Guru Nahdlatul Ulama (Pergunu)', desc: 'Wadah perjuangan para guru dan pendidik NU.' },
        { id: 'Sarbumusi', name: 'Serikat Buruh Muslimin Indonesia (Sarbumusi)', desc: 'Wadah perjuangan para buruh dan pekerja NU.' },
        { id: 'Pagar Nusa', name: 'Ikatan Pencak Silat Pagar Nusa (IPS Pagar Nusa)', desc: 'Wadah yang menaungi seni bela diri pencak silat di lingkungan NU.' },
        { id: 'Lesbumi', name: 'Lembaga Seniman Budayawan Muslimin Indonesia (Lesbumi - Basis Kultural)', desc: 'Wadah perjuangan di bidang seni dan kebudayaan (secara historis bergerak pada basis kultural).' }
      ];

      const lembagaDefinitions = [
        { id: 'LDNU', name: 'Lembaga Dakwah Nahdlatul Ulama (LDNU)', desc: 'Melaksanakan kebijakan NU di bidang dakwah Islamiyah.' },
        { id: 'LPMNU', name: 'Lembaga Pendidikan Ma\'arif NU (LPMNU)', desc: 'Menyelenggarakan dan mengelola pendidikan formal dari dasar hingga menengah.' },
        { id: 'RMI-NU', name: 'Rabithah Ma\'ahid al-Islamiyah (RMI-NU)', desc: 'Asosiasi pondok pesantren NU, bertugas mengoordinasikan dan mengembangkan pesantren.' },
        { id: 'LKKNU', name: 'Lembaga Kemaslahatan Keluarga Nahdlatul Ulama (LKKNU)', desc: 'Bergerak di bidang kesejahteraan keluarga, kependudukan, dan kesehatan reproduksi.' },
        { id: 'LTMNU', name: 'Lembaga Takmir Masjid Nahdlatul Ulama (LTMNU)', desc: 'Mengurus pengelolaan, pemakmuran, dan pemberdayaan masjid-masjid NU.' },
        { id: 'LAZISNU', name: 'Lembaga Amil Zakat, Infak, dan Sedekah NU (LAZISNU)', desc: 'Menghimpun, mengelola, dan mendistribusikan zakat, infak, sedekah, dan wakaf (ZISWAF).' },
        { id: 'LKNU', name: 'Lembaga Kesehatan Nahdlatul Ulama (LKNU)', desc: 'Melaksanakan kebijakan NU di bidang pelayanan kesehatan dan pembangunan masyarakat sehat.' },
        { id: 'LAKPESDAM', name: 'Lembaga Kajian dan Pengembangan Sumber Daya Manusia (LAKPESDAM)', desc: 'Fokus pada kajian strategis, isu-isu kebijakan, dan pengembangan kapasitas SDM.' },
        { id: 'LPBHNU', name: 'Lembaga Penyuluhan dan Bantuan Hukum NU (LPBHNU)', desc: 'Memberikan advokasi, penyuluhan, dan bantuan hukum kepada warga NU dan masyarakat umum.' },
        { id: 'LPNU', name: 'Lembaga Perekonomian Nahdlatul Ulama (LPNU)', desc: 'Mengembangkan ekonomi warga, kewirausahaan, dan koperasi di lingkungan NU.' },
        { id: 'LP2NU', name: 'Lembaga Pengembangan Pertanian Nahdlatul Ulama (LP2NU)', desc: 'Mengembangkan bidang pertanian, perkebunan, peternakan, dan ketahanan pangan.' },
        { id: 'LBMNU', name: 'Lembaga Bahtsul Masail Nahdlatul Ulama (LBMNU)', desc: 'Menghimpun, membahas, dan memecahkan masalah-masalah keagamaan (fiqih/kontemporer) yang membutuhkan kepastian hukum.' },
        { id: 'LESBUMI', name: 'Lembaga Seniman Budayawan Muslimin Indonesia (LESBUMI)', desc: 'Melaksanakan kebijakan NU di bidang kebudayaan and seni (struktur kelembagaan terbaru).' },
        { id: 'LTNNU', name: 'Lembaga Ta\'lif wan Nasyr NU (LTNNU)', desc: 'Lembaga infokom, penerbitan, media, dan dokumentasi karya pemikiran NU.' },
        { id: 'LPBI-NU', name: 'Lembaga Penanggulangan Bencana & Perubahan Iklim (LPBI-NU)', desc: 'Bergerak dalam mitigasi bencana, tanggap darurat, penanggulangan bencana, dan isu lingkungan hidup.' },
        { id: 'LF-NU', name: 'Lembaga Falakiyah NU (LF-NU)', desc: 'Mengelola urusan hisab dan rukyat serta pengembangan ilmu falak (astronomi Islam).' },
        { id: 'LWPNU', name: 'Lembaga Wakaf dan Pertanahan NU (LWPNU)', desc: 'Mengurus sertifikasi, inventarisasi, pengelolaan, dan hukum aset-aset tanah dan bangunan milik NU.' }
      ];

      // Computations for Harian, Banoms, and Lembagas
      const isAdmin = userRole && userRole !== 'guest';
      const rPengurusHarian = rPengurus.filter(p => p.groupType === 'Harian' || !p.groupType);

      // Build Banom list from ranting.activeBanom (source of truth) + pengurus members
      const activeBanomsWithMembers = (ranting.activeBanom || []).map(banomName => {
        const def = banomDefinitions.find(d => d.id === banomName);
        const members = rPengurus.filter(p => p.groupType === 'Banom' && p.groupName === banomName);
        return {
          id: banomName,
          name: def ? def.name : banomName,
          desc: def ? def.desc : 'Badan Otonom NU tingkat Ranting.',
          members
        };
      });

      // Build Lembaga list from ranting.activeLembaga (source of truth) + pengurus members
      const activeLembagasWithMembers = (ranting.activeLembaga || []).map(lembagaName => {
        const def = lembagaDefinitions.find(d => d.id === lembagaName);
        const members = rPengurus.filter(p => p.groupType === 'Lembaga' && p.groupName === lembagaName);
        return {
          id: lembagaName,
          name: def ? def.name : lembagaName,
          desc: def ? def.desc : 'Lembaga Nahdlatul Ulama tingkat Ranting.',
          members
        };
      });

      return (
        <div className="space-y-6 animate-fadeIn">
          {/* Back button and title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedRantingProfileId(null)}
              className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-tosca-600 hover:border-tosca-100 transition-all shadow-xs"
            >
              ← Kembali ke Daftar Ranting
            </button>
            <div>
              <span className="text-[10px] font-bold text-tosca-700 uppercase tracking-wider block">Profil Detil Jamiyah</span>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg md:text-xl font-display font-extrabold text-gray-900">{ranting.name}</h2>
                {userRole && userRole !== 'guest' && (
                  <button
                    onClick={() => {
                      const newName = window.prompt('Ubah Nama Kepengurusan:', ranting.name);
                      if (newName !== null && newName.trim()) handleEditRantingField(ranting.id, 'name', newName.trim());
                    }}
                    className="p-1 rounded-md hover:bg-tosca-50 text-slate-400 hover:text-tosca-600 transition-colors border border-slate-200 hover:border-tosca-200"
                    title="Ubah Nama"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Office info & Connected Data links */}
            <div className="space-y-6">
              {/* Office/Building Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <img
                    src={ranting.imageUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'}
                    alt={ranting.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-end p-4">
                    {userRole !== 'guest' && (userRole === 'super_admin' || (userRole === 'admin_ranting' && ranting.id === 'r1')) && (
                      <button
                        onClick={() => {
                          setTempPhotoUrl(ranting.imageUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png');
                          setUploadPhotoError(null);
                          setShowRantingPhotoModal(true);
                        }}
                        className="bg-white/95 hover:bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs transition-all flex items-center space-x-1"
                      >
                        <Upload className="w-3 h-3 text-tosca-600" />
                        <span>Ubah Foto</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">Informasi Kantor & Kontak</h3>
                  
                  <div className="space-y-3.5 text-xs text-slate-650">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-tosca-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Alamat Kantor</span>
                        <span className="font-semibold text-slate-800 leading-normal">{ranting.address || `Desa ${ranting.village}, Kec. Bungah, Gresik`}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 text-tosca-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Kontak WA / Telepon</span>
                        <span className="font-mono font-semibold text-slate-800">{ranting.phone || '08123456789'}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="w-4 h-4 text-tosca-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email Resmi</span>
                        <span className="font-semibold text-slate-800">{ranting.email || `${ranting.village.toLowerCase().replace(/\s+/g, '')}@mwcnubungah.or.id`}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-4 h-4 text-tosca-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Tahun Berdiri</span>
                          {userRole && userRole !== 'guest' && (
                            <button
                              onClick={() => {
                                const newYear = window.prompt('Ubah Tahun Berdiri (format: YYYY-MM-DD):', ranting.established);
                                if (newYear !== null && newYear.trim()) handleEditRantingField(ranting.id, 'established', newYear.trim());
                              }}
                              className="text-[9px] font-bold text-tosca-600 hover:text-tosca-700 bg-tosca-50 px-1.5 py-0.5 rounded border border-tosca-100 transition-all"
                            >
                              Ubah
                            </button>
                          )}
                        </div>
                        <span className="font-semibold text-slate-800">{ranting.established}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sejarah Singkat */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sejarah Singkat</span>
                      {userRole !== 'guest' && (
                        <button
                          onClick={() => {
                            const newHistory = window.prompt("Ubah Sejarah Singkat:", ranting.history || "");
                            if (newHistory !== null && setRantings) {
                              setRantings(prev => prev.map(r => r.id === ranting.id ? { ...r, history: newHistory } : r));
                            }
                          }}
                          className="text-[10px] font-bold text-tosca-600 hover:text-tosca-700 bg-tosca-50 px-2 py-0.5 rounded border border-tosca-100 transition-all"
                        >
                          Ubah Sejarah
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic font-medium whitespace-pre-wrap">
                      {ranting.history || "Sejarah singkat kepengurusan jamiyah ranting belum diisi. Hubungi pengurus untuk memperbarui halaman ini."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sinergi Portal - Terkoneksi Data */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-gray-900 text-sm">Sinergi Data Terkoneksi</h3>
                  <p className="text-[10px] text-slate-400">Data kader, aset, dan kegiatan terintegrasi</p>
                </div>

                <div className="space-y-3">
                  {/* Kader Connection */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-tosca-50/40 rounded-xl border border-slate-100 hover:border-tosca-100 transition-all cursor-pointer"
                    onClick={() => {
                      setKaderSelectedRanting(ranting.id === 'mwc' ? 'Semua' : ranting.id);
                      setActiveTab('kader');
                    }}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-tosca-50 text-tosca-700 rounded-lg">
                        <Users2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Data Kader Terdaftar</span>
                        <span className="text-[10px] text-slate-400 font-medium">Klik untuk lihat list lengkap</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-tosca-700 font-mono block">{rKader.length}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">KADER</span>
                    </div>
                  </div>

                  {/* Koin S3 Connection */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-100 hover:border-amber-100 transition-all cursor-pointer"
                    onClick={() => {
                      setKoinSelectedRanting(ranting.id === 'mwc' ? 'Semua' : ranting.id);
                      setActiveTab('koin_s3');
                    }}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Koin S3 LAZISNU</span>
                        <span className="text-[10px] text-slate-400 font-medium">Penyaluran & Perolehan</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-amber-600 block">
                        {rKoin.length > 0 ? formatRupiah(rKoin.reduce((sum, k) => sum + k.amount, 0)) : 'Rp 0'}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</span>
                    </div>
                  </div>

                  {/* Kegiatan Connection */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-100 hover:border-emerald-100 transition-all cursor-pointer"
                    onClick={() => setActiveTab('kegiatan')}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Kegiatan Jamiyah</span>
                        <span className="text-[10px] text-slate-400 font-medium">Rencana & riwayat kegiatan</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-700 font-mono block">{rKegiatan.length}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AGENDA</span>
                    </div>
                  </div>

                  {/* Usaha Connection */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-100 hover:border-blue-100 transition-all cursor-pointer"
                    onClick={() => setActiveTab('usaha')}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Badan Usaha Jamiyah</span>
                        <span className="text-[10px] text-slate-400 font-medium">Ekonomi Syariah & koperasi</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-blue-700 font-mono block">{rUsaha.length}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">USAHA</span>
                    </div>
                  </div>

                  {/* Sarana Pendidikan & Ibadah Connection */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50 hover:bg-purple-50/40 rounded-xl border border-slate-100 hover:border-purple-100 transition-all cursor-pointer text-center"
                      onClick={() => setActiveTab('sarana_pendidikan')}
                    >
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">PENDIDIKAN</span>
                      <span className="text-sm font-bold text-purple-700 font-mono">{rPendidikan.length} unit</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 hover:bg-teal-50/40 rounded-xl border border-slate-100 hover:border-teal-100 transition-all cursor-pointer text-center"
                      onClick={() => setActiveTab('sarana_ibadah')}
                    >
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">IBADAH</span>
                      <span className="text-sm font-bold text-teal-700 font-mono">{rIbadah.length} unit</span>
                    </div>
                  </div>

                  {/* Kumpulan Surat Keputusan (SK) */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">Kumpulan SK Pengurus</h4>
                        <p className="text-[9px] text-slate-400">Arsip Surat Keputusan (SK) resmi kepengurusan</p>
                      </div>
                      {userRole !== 'guest' && (
                        <button
                          onClick={() => {
                            setUploadSKError(null);
                            setShowSKUploadModal(true);
                          }}
                          className="text-[10px] font-bold text-tosca-600 hover:text-tosca-700 bg-tosca-50 hover:bg-tosca-100 px-2 py-1 rounded border border-tosca-200 transition-all flex items-center space-x-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah SK</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {(!ranting.skDocs || ranting.skDocs.length === 0) ? (
                        <p className="text-[10px] text-slate-400 italic text-center py-3 bg-slate-50/50 rounded-lg">Belum ada dokumen SK yang diunggah.</p>
                      ) : (
                        ranting.skDocs.map((sk) => (
                          <div key={sk.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between">
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center space-x-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-slate-800 truncate">No: {sk.number}</span>
                                {sk.isLatest && (
                                  <span className="text-[8px] font-bold bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-100">Aktif</span>
                                )}
                              </div>
                              <p className="text-[9px] text-slate-500 font-semibold">Masa Bakti: <span className="text-slate-700">{sk.period}</span></p>
                              <p className="text-[8px] text-slate-400 font-medium">Diunggah: {sk.uploadDate}</p>
                            </div>
                            <div className="flex items-center space-x-1 shrink-0">
                              <a 
                                href={sk.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1 bg-white hover:bg-tosca-50 text-tosca-600 rounded border border-slate-200 hover:border-tosca-300 transition-all shadow-2xs"
                                title="Unduh / Lihat File"
                              >
                                <Download className="w-3 h-3" />
                              </a>
                              {userRole !== 'guest' && (
                                <button
                                  onClick={() => handleDeleteSK(sk.id)}
                                  className="p-1 bg-white hover:bg-red-50 text-red-600 rounded border border-slate-200 hover:border-red-300 transition-all shadow-2xs"
                                  title="Hapus SK"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Tabs: Jajaran Pengurus, Banom, Lembaga) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Main Content Sections */}
              
              {/* 1. Jajaran Pengurus Harian */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Jajaran Pengurus Harian</h3>
                    <p className="text-[10px] text-slate-400">Jajaran Syuriah (Rais) & Tanfidziyah (Ketua) resmi</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold bg-tosca-50 text-tosca-700 px-2 py-0.5 rounded border border-tosca-100">
                      {rPengurusHarian.length} Jajaran
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => openPengurusForm('Harian', '', ranting.id)}
                        className="px-3 py-1.5 bg-tosca-600 hover:bg-tosca-700 text-white text-[10px] font-bold rounded-lg flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" /><span>Tambah Pengurus</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rPengurusHarian.map((p) => (
                    <div key={p.id} className="bg-slate-50/70 p-4 rounded-xl border border-slate-150 flex items-start space-x-3.5 hover:border-tosca-200 transition-all group relative">
                      <img 
                        src={p.photoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} 
                        alt={p.name} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-contain border border-slate-200 bg-white shrink-0 shadow-xs" 
                      />
                      <div className="space-y-1 overflow-hidden flex-1">
                        <span className="inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-tosca-100 text-tosca-800">
                          {p.role}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 truncate leading-tight">{p.name}</h4>
                        
                        <div className="grid grid-cols-2 gap-x-2 pt-1.5 text-[9px] text-slate-500">
                          <div>
                            <span className="block text-slate-400 font-bold uppercase text-[7px]">Pendidikan</span>
                            <span className="font-semibold text-slate-700 truncate block">{p.education}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-bold uppercase text-[7px]">Kaderisasi</span>
                            <span className="font-semibold text-slate-700 truncate block">{p.kaderisasiStatus}</span>
                          </div>
                        </div>
                        {p.phone && (
                          <div className="flex items-center space-x-1 text-slate-500 pt-1 text-[9px] font-mono">
                            <Phone className="w-3 h-3 text-tosca-600" />
                            <span>{p.phone}</span>
                          </div>
                        )}
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => openPengurusForm('Harian', '', ranting.id, p.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white text-slate-400 hover:text-tosca-600 absolute top-2 right-2"
                          title="Edit Pengurus"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {rPengurusHarian.length === 0 && (
                    <div className="col-span-full py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500 font-bold">Data Pengurus Harian belum dimasukkan secara lengkap di sistem.</p>
                      {isAdmin && <p className="text-[10px] text-tosca-600 mt-1 font-semibold">Klik \u201cTambah Pengurus\u201d untuk memulai.</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Banom & Lembaga — hanya yang aktif (punya pengurus) */}
              {(() => {
                // Filter: hanya tampilkan Banom/Lembaga yang punya pengurus di ranting ini
                const activeBanomIds = (ranting.activeBanom || []).filter(bId =>
                  pengurusList.some(p => p.groupType === 'Banom' && p.groupName === bId && (ranting.id === 'mwc' ? true : p.rantingId === ranting.id))
                );
                const activeLembagaIds = (ranting.activeLembaga || []).filter(lId =>
                  pengurusList.some(p => p.groupType === 'Lembaga' && p.groupName === lId && (ranting.id === 'mwc' ? true : p.rantingId === ranting.id))
                );
                const hasActive = activeBanomIds.length > 0 || activeLembagaIds.length > 0;

                // Master definitions for "Tambah" dropdown
                const allBanomIds = ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU', 'PMII', 'ISNU', 'JARTMAN', 'JQH', 'Pergunu', 'Sarbumusi', 'Pagar Nusa', 'Lesbumi'];
                const allLembagaIds = ['LDNU', 'LPMNU', 'RMI-NU', 'LKKNU', 'LTMNU', 'LAZISNU', 'LKNU', 'LAKPESDAM', 'LPBHNU', 'LPNU', 'LP2NU', 'LBMNU', 'LESBUMI', 'LTNNU', 'LPBI-NU', 'LF-NU', 'LWPNU'];

                const handleAddBanom = (banomId: string) => {
                  if (!setRantings) return;
                  // Add to ranting's activeBanom if not already there
                  if (!(ranting.activeBanom || []).includes(banomId)) {
                    setRantings(prev => prev.map(r => r.id === ranting.id ? { ...r, activeBanom: [...(r.activeBanom || []), banomId] } : r));
                    if (isSupabaseConfigured) {
                      const updated = { activeBanom: [...(ranting.activeBanom || []), banomId] };
                      updateTableData('ranting', ranting.id, updated).catch(console.error);
                    }
                  }
                  // Navigate to detail page
                  setProfileSubPath?.(`${ranting.id}/banom/${banomId}`);
                };

                const handleAddLembaga = (lembagaId: string) => {
                  if (!setRantings) return;
                  if (!(ranting.activeLembaga || []).includes(lembagaId)) {
                    setRantings(prev => prev.map(r => r.id === ranting.id ? { ...r, activeLembaga: [...(r.activeLembaga || []), lembagaId] } : r));
                    if (isSupabaseConfigured) {
                      const updated = { activeLembaga: [...(ranting.activeLembaga || []), lembagaId] };
                      updateTableData('ranting', ranting.id, updated).catch(console.error);
                    }
                  }
                  setProfileSubPath?.(`${ranting.id}/lembaga/${lembagaId}`);
                };

                return (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Banom & Lembaga NU</h3>
                        <p className="text-[10px] text-slate-400">Klik untuk melihat profil detail, struktur pengurus, kader, keuangan, dan galeri</p>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center space-x-2">
                          {/* Dropdown Tambah Banom */}
                          <div className="relative group">
                            <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg flex items-center space-x-1">
                              <Plus className="w-3 h-3" /><span>Tambah Banom</span>
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 w-56 hidden group-hover:block">
                              <div className="p-2 max-h-64 overflow-y-auto space-y-0.5">
                                {allBanomIds.map(bId => {
                                  const alreadyActive = activeBanomIds.includes(bId);
                                  return (
                                    <button
                                      key={bId}
                                      onClick={() => handleAddBanom(bId)}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${alreadyActive ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}`}
                                    >
                                      {alreadyActive ? '✓ ' : ''}{bId}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Dropdown Tambah Lembaga */}
                          <div className="relative group">
                            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg flex items-center space-x-1">
                              <Plus className="w-3 h-3" /><span>Tambah Lembaga</span>
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 w-56 hidden group-hover:block">
                              <div className="p-2 max-h-64 overflow-y-auto space-y-0.5">
                                {allLembagaIds.map(lId => {
                                  const alreadyActive = activeLembagaIds.includes(lId);
                                  return (
                                    <button
                                      key={lId}
                                      onClick={() => handleAddLembaga(lId)}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${alreadyActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
                                    >
                                      {alreadyActive ? '✓ ' : ''}{lId}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Active Banom (punya pengurus) */}
                    {activeBanomIds.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">Badan Otonom (Banom) — Aktif</span>
                        <div className="flex flex-wrap gap-2">
                          {activeBanomIds.map((banomId) => {
                            const count = pengurusList.filter(p => p.groupType === 'Banom' && p.groupName === banomId && (ranting.id === 'mwc' ? true : p.rantingId === ranting.id)).length;
                            return (
                              <button
                                key={banomId}
                                onClick={() => setProfileSubPath?.(`${ranting.id}/banom/${banomId}`)}
                                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 rounded-xl text-[11px] font-bold text-emerald-800 transition-all flex items-center space-x-1.5"
                              >
                                <span className="w-5 h-5 rounded bg-emerald-200 text-emerald-800 flex items-center justify-center text-[8px] font-extrabold shrink-0">
                                  {banomId.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                </span>
                                <span>{banomId}</span>
                                <span className="text-[9px] text-emerald-600 font-normal">({count})</span>
                                <ChevronRight className="w-3 h-3 text-emerald-400" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Active Lembaga (punya pengurus) */}
                    {activeLembagaIds.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-2">Lembaga — Aktif</span>
                        <div className="flex flex-wrap gap-2">
                          {activeLembagaIds.map((lemId) => {
                            const count = pengurusList.filter(p => p.groupType === 'Lembaga' && p.groupName === lemId && (ranting.id === 'mwc' ? true : p.rantingId === ranting.id)).length;
                            return (
                              <button
                                key={lemId}
                                onClick={() => setProfileSubPath?.(`${ranting.id}/lembaga/${lemId}`)}
                                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl text-[11px] font-bold text-blue-800 transition-all flex items-center space-x-1.5"
                              >
                                <span className="w-5 h-5 rounded bg-blue-200 text-blue-800 flex items-center justify-center text-[8px] font-extrabold shrink-0">
                                  {lemId.split('-')[0].slice(0, 2)}
                                </span>
                                <span>{lemId}</span>
                                <span className="text-[9px] text-blue-600 font-normal">({count})</span>
                                <ChevronRight className="w-3 h-3 text-blue-400" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {!hasActive && (
                      <div className="py-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500 font-bold">Belum ada Banom atau Lembaga yang aktif (belum ada pengurus terdaftar).</p>
                        {isAdmin && <p className="text-[10px] text-tosca-600 mt-1 font-semibold">Klik \u201cTambah Banom\u201d atau \u201cTambah Lembaga\u201d, lalu masukkan minimal Ketua & Sekretaris.</p>}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Modal: Ubah Foto Profil Ranting */}
          {showRantingPhotoModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-xl overflow-hidden animate-scaleIn">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Ubah Foto Profil Ranting</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Unggah foto kantor, aktivitas, atau setel ke logo NU default</p>
                  </div>
                  <button 
                    onClick={() => setShowRantingPhotoModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Preview Current */}
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pratinjau Foto</span>
                    <div className="w-full aspect-video bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                      <img 
                        src={tempPhotoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} 
                        alt="Pratinjau" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Drag and Drop Area */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Unggah Berkas Baru</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('ranting-photo-input')?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-tosca-400 hover:bg-tosca-50/20 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-700 font-semibold">Tarik & lepas file atau <span className="text-tosca-600 underline">klik untuk telusuri</span></span>
                      <span className="text-[9px] text-slate-400">PNG, JPG, JPEG sampai dengan 5MB</span>
                      <input 
                        type="file" 
                        id="ranting-photo-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Atau Masukkan Tautan/URL Gambar</label>
                    <input 
                      type="text"
                      value={tempPhotoUrl}
                      onChange={(e) => setTempPhotoUrl(e.target.value)}
                      placeholder="https://tautan-gambar-anda.com/foto.jpg"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-gray-800 font-medium"
                    />
                  </div>

                  {/* Set default trigger */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => setTempPhotoUrl('https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png')}
                      className="text-xs text-tosca-600 hover:text-tosca-700 font-semibold underline flex items-center space-x-1"
                    >
                      Setel ke Logo NU Default (Bungah)
                    </button>
                  </div>

                  {uploadingPhoto && (
                    <div className="text-center text-xs text-tosca-600 font-semibold animate-pulse">
                      Mengunggah ke Cloudinary...
                    </div>
                  )}

                  {uploadPhotoError && (
                    <div className="text-center text-xs text-red-600 font-semibold">
                      {uploadPhotoError}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowRantingPhotoModal(false)}
                    className="px-4 py-2 bg-white hover:bg-gray-100 text-slate-600 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    disabled={uploadingPhoto}
                    onClick={() => handleSaveRantingPhoto(tempPhotoUrl)}
                    className="px-4 py-2 bg-tosca-600 hover:bg-tosca-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Unggah SK Baru */}
          {showSKUploadModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-xl overflow-hidden animate-scaleIn">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Unggah Dokumen SK Pengurus</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Arsipkan Surat Keputusan (SK) MWC / Ranting secara digital</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowSKUploadModal(false);
                      setSkNumber('');
                      setSkPeriod('');
                      setSkFileUrl('');
                      setSkIsLatest(true);
                      setUploadSKError(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Nomor SK */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Nomor SK Resmi</label>
                    <input 
                      type="text"
                      value={skNumber}
                      onChange={(e) => setSkNumber(e.target.value)}
                      placeholder="Contoh: 124/A.II/04/2024"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-gray-800 font-medium"
                    />
                  </div>

                  {/* Masa Bakti */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Masa Bakti Kepengurusan</label>
                    <input 
                      type="text"
                      value={skPeriod}
                      onChange={(e) => setSkPeriod(e.target.value)}
                      placeholder="Contoh: 2024-2029"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-gray-800 font-medium"
                    />
                  </div>

                  {/* File Upload Area */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Berkas File SK (PDF/Gambar)</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleSKFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => document.getElementById('sk-file-input')?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-tosca-400 hover:bg-tosca-50/20 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1"
                    >
                      <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
                      <span className="text-xs text-slate-700 font-semibold">Tarik & lepas file atau <span className="text-tosca-600 underline">klik untuk telusuri</span></span>
                      <span className="text-[9px] text-slate-400">PDF, PNG, JPG, JPEG sampai dengan 5MB</span>
                      <input 
                        type="file" 
                        id="sk-file-input"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleSKFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Alternate URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Atau Masukkan Tautan File SK</label>
                    <input 
                      type="text"
                      value={skFileUrl}
                      onChange={(e) => setSkFileUrl(e.target.value)}
                      placeholder="https://tautan-berkas-sk.com/sk_resmi.pdf"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-gray-800 font-medium"
                    />
                  </div>

                  {/* Is Latest Checkbox */}
                  <label className="flex items-center space-x-2.5 cursor-pointer pt-1">
                    <input 
                      type="checkbox"
                      checked={skIsLatest}
                      onChange={(e) => setSkIsLatest(e.target.checked)}
                      className="rounded border-gray-300 text-tosca-600 focus:ring-tosca-500 h-4 w-4"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-700 block">Setel Sebagai SK Aktif Saat Ini</span>
                      <span className="text-[9px] text-slate-400 block font-medium">SK ini akan menjadi referensi pengurus aktif utama</span>
                    </div>
                  </label>

                  {uploadingSK && (
                    <div className="text-center text-xs text-tosca-600 font-semibold animate-pulse">
                      Mengunggah dokumen SK...
                    </div>
                  )}

                  {uploadSKError && (
                    <div className="text-center text-xs text-red-600 font-semibold">
                      {uploadSKError}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowSKUploadModal(false);
                      setSkNumber('');
                      setSkPeriod('');
                      setSkFileUrl('');
                      setSkIsLatest(true);
                      setUploadSKError(null);
                    }}
                    className="px-4 py-2 bg-white hover:bg-gray-100 text-slate-600 rounded-xl text-xs font-semibold border border-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    disabled={uploadingSK}
                    onClick={handleSaveSK}
                    className="px-4 py-2 bg-tosca-600 hover:bg-tosca-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                  >
                    Simpan SK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default Directory View (showing all 30 rantings)
    const selectedRanting = profilSelectedRanting;
    const setSelectedRanting = setProfilSelectedRanting;
    const selectedBanom = profilSelectedBanom;
    const setSelectedBanom = setProfilSelectedBanom;
    const searchQuery = profilSearchQuery;
    const setSearchQuery = setProfilSearchQuery;

    const filteredRantings = rantings.filter(r => {
      // Filter by Wilayah
      const matchesRanting = selectedRanting === 'Semua' || r.id === selectedRanting;

      // Filter by Banom / Lembaga
      let matchesBanom = true;
      if (selectedBanom !== 'Semua') {
        if (selectedBanom === 'Pengurus Harian') {
          const hasHarian = pengurusList.some(p => 
            (r.id === 'mwc' && p.category === 'MWC' && (!p.groupType || p.groupType === 'Harian')) ||
            (r.id !== 'mwc' && p.category === 'Ranting' && p.rantingId === r.id && (!p.groupType || p.groupType === 'Harian'))
          );
          matchesBanom = hasHarian;
        } else {
          const activeBanoms = r.id === 'mwc' ? ['Muslimat NU', 'GP Ansor', 'Fatayat NU', 'IPNU', 'IPPNU', 'PMII', 'ISNU', 'JARTMAN', 'JQH', 'Pergunu', 'Sarbumusi', 'Pagar Nusa', 'Lesbumi'] : (r.activeBanom || []);
          const activeLembagas = r.id === 'mwc' ? ['LDNU', 'LPMNU', 'RMI-NU', 'LKKNU', 'LTMNU', 'LAZISNU', 'LKNU', 'LAKPESDAM', 'LPBHNU', 'LPNU', 'LP2NU', 'LBMNU', 'LESBUMI', 'LTNNU', 'LPBI-NU', 'LF-NU', 'LWPNU'] : (r.activeLembaga || []);
          
          const matchesActiveB = activeBanoms.some(b => b.toLowerCase().includes(selectedBanom.toLowerCase()));
          const matchesActiveL = activeLembagas.some(l => l.toLowerCase().includes(selectedBanom.toLowerCase()));
          matchesBanom = matchesActiveB || matchesActiveL;
        }
      }

      // Filter by search text
      const matchesSearch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.village.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRanting && matchesBanom && matchesSearch;
    });

    // Helper to count cadres in a ranting
    const getKaderCount = (id: string) => {
      if (id === 'mwc') return kaderList.length;
      return kaderList.filter(k => k.rantingId === id).length;
    };

    const getBanomCount = (rantingId: string) => {
      const r = rantings.find(rn => rn.id === rantingId);
      return r?.activeBanom?.length || 0;
    };

    const getLembagaCount = (rantingId: string) => {
      const r = rantings.find(rn => rn.id === rantingId);
      return r?.activeLembaga?.length || 0;
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Profile directory description & count banner */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-extrabold text-gray-900">Profil Jam&apos;iyah & Ranting NU se-Kecamatan Bungah</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Berikut daftar terpadu unit kepengurusan Jam&apos;iyah Nahdlatul Ulama di wilayah Kecamatan Bungah, Gresik. Terdiri dari **1 MWC NU Tingkat Kecamatan** dan **29 Pengurus Ranting Nahdlatul Ulama (PRNU)** tingkat Desa. Klik salah satu kepengurusan untuk melihat profil pengurus lengkap, status keaktifan Badan Otonom, dan rekapitulasi data kader secara online.
            </p>
          </div>
          <div className="bg-tosca-50/80 px-4.5 py-3 rounded-xl border border-tosca-100 text-center shrink-0">
            <span className="text-xl font-mono font-bold text-tosca-700 block">{filteredRantings.length}</span>
            <span className="text-[9px] font-bold text-tosca-800 uppercase tracking-wider block">Kepengurusan Terfilter</span>
          </div>
        </section>

        {/* Filter and Search controls */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Wilayah (MWCNU & Ranting)</label>
              <select
                value={selectedRanting}
                onChange={(e) => setSelectedRanting(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Wilayah (30)</option>
                <option value="mwc">MWC NU BUNGAH (Tingkat Kecamatan)</option>
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Keaktifan Banom / Lembaga</label>
              <select
                value={selectedBanom}
                onChange={(e) => setSelectedBanom(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Banom & Lembaga</option>
                <optgroup label="Pengurus Inti">
                  <option value="Pengurus Harian">Pengurus Harian (Syuriah/Tanfidziyah)</option>
                </optgroup>
                <optgroup label="Badan Otonom (Banom)">
                  <option value="Muslimat NU">Muslimat NU</option>
                  <option value="GP Ansor">GP Ansor</option>
                  <option value="Fatayat NU">Fatayat NU</option>
                  <option value="IPNU">IPNU</option>
                  <option value="IPPNU">IPPNU</option>
                  <option value="Pagar Nusa">Pagar Nusa</option>
                  <option value="Banser">Banser</option>
                </optgroup>
                <optgroup label="Lembaga-Lembaga NU">
                  <option value="LAZISNU">LAZISNU</option>
                  <option value="LTMNU">LTMNU</option>
                  <option value="LDNU">LDNU</option>
                  <option value="RMI-NU">RMI-NU</option>
                  <option value="LPMNU">LPMNU (Ma'arif)</option>
                  <option value="LWPNU">LWPNU</option>
                  <option value="LAKPESDAM">LAKPESDAM</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Pencarian Desa / Wilayah</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ketik nama ranting atau desa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Sinergi CSV Bulk Importer/Exporter for Rantings */}
          <div className="border-t border-dashed border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Integrasi Data Profil Ranting</span>
              <p className="text-[11px] text-slate-500 font-semibold">Unduh template atau impor data profil ranting se-kecamatan secara massal via berkas CSV.</p>
            </div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <button
                onClick={downloadRantingCSVTemplate}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors flex items-center space-x-1.5"
                title="Unduh Template CSV Profil Ranting"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Unduh Template</span>
              </button>
              {userRole !== 'guest' ? (
                <label className="cursor-pointer px-3 py-1.5 bg-tosca-600 hover:bg-tosca-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>Unggah CSV Ranting</span>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleRantingCSVUpload}
                  />
                </label>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold italic">Login admin untuk mengunggah CSV</span>
              )}
            </div>
          </div>

          {/* Success / Error Messages */}
          {(csvRantingMessage || csvRantingError) && (
            <div className="p-3 rounded-xl border text-xs font-semibold animate-pulse mt-2 bg-white">
              {csvRantingMessage && <span className="text-emerald-700">{csvRantingMessage}</span>}
              {csvRantingError && <span className="text-red-600">{csvRantingError}</span>}
            </div>
          )}
        </div>

        {/* Rantings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRantings.map((r) => {
            const kaderCount = getKaderCount(r.id);
            const activeBanomCount = r.activeBanom?.length || 0;
            const activeLembagaCount = r.activeLembaga?.length || 0;
            
            return (
              <div 
                key={r.id} 
                onClick={() => {
                  setSelectedRantingProfileId(r.id);
                  setProfileSubPath?.(r.id);
                }}
                className="group cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-tosca-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Header */}
                <div className="relative h-28 bg-slate-100 overflow-hidden">
                  <img
                    src={r.imageUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'}
                    alt={r.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider mb-1
                      ${r.id === 'mwc' ? 'bg-tosca-500' : 'bg-emerald-600'}`}>
                      {r.id === 'mwc' ? 'Tingkat Kecamatan' : 'Ranting Desa'}
                    </span>
                    <h3 className="text-xs md:text-sm font-display font-extrabold leading-tight truncate">{r.name}</h3>
                  </div>
                </div>

                {/* Info and statistics */}
                <div className="p-4.5 space-y-3 flex-1">
                  <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500">
                    <div>
                      <span className="block text-slate-400 uppercase tracking-wider text-[8px] font-bold">Wilayah Desa</span>
                      <span className="font-semibold text-slate-850 truncate block">{r.village}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 uppercase tracking-wider text-[8px] font-bold">Tahun Berdiri</span>
                      <span className="font-semibold text-slate-850 truncate block">{r.established.split('-')[0]}</span>
                    </div>
                  </div>

                  {/* Summary of Banom & Lembaga counts */}
                  <div className="pt-2 border-t border-slate-50 grid grid-cols-3 gap-2 text-center">
                    <div className="p-1 bg-slate-50 rounded-lg">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Banom</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">{activeBanomCount} Aktif</span>
                    </div>
                    <div className="p-1 bg-slate-50 rounded-lg">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Lembaga</span>
                      <span className="text-xs font-bold text-blue-700 font-mono">{activeLembagaCount} Aktif</span>
                    </div>
                    <div className="p-1 bg-slate-50 rounded-lg">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Kader</span>
                      <span className="text-xs font-bold text-tosca-700 font-mono">{kaderCount} Org</span>
                    </div>
                  </div>
                </div>

                {/* Footer action + Admin controls */}
                <div className="bg-gray-50/80 px-4 py-2.5 border-t border-gray-150 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRantingProfileId(r.id);
                      setProfileSubPath?.(r.id);
                    }}
                    className="text-xs font-semibold text-tosca-700 hover:text-tosca-800 transition-colors flex items-center space-x-1"
                  >
                    <span>Buka Profil Lengkap</span>
                    <Building2 className="w-3.5 h-3.5" />
                  </button>
                  {userRole && userRole !== 'guest' && (
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          const newYear = window.prompt('Ubah Tahun Berdiri (format: YYYY-MM-DD):', r.established);
                          if (newYear !== null && newYear.trim()) handleEditRantingField(r.id, 'established', newYear.trim());
                        }}
                        className="p-1.5 rounded-md hover:bg-white text-slate-400 hover:text-tosca-600 transition-colors"
                        title="Edit Tahun Berdiri"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteRanting(r.id, r.name)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Hapus Ranting"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRantings.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200">
              <p className="text-xs text-slate-500 font-bold">Kepengurusan tidak ditemukan. Silakan ganti kata kunci.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 2: DATA KADER
  // ==========================================
  const renderKader = () => {
    const selectedBanom = kaderSelectedBanom;
    const setSelectedBanom = setKaderSelectedBanom;
    const selectedRanting = kaderSelectedRanting;
    const setSelectedRanting = setKaderSelectedRanting;
    const searchQuery = kaderSearchQuery;
    const setSearchQuery = setKaderSearchQuery;

    const filteredKader = kaderList.filter(k => {
      const matchesBanom = selectedBanom === 'Semua' || 
                           (selectedBanom === 'Pengurus Harian' && (
                             (k.role && (
                               k.role.toLowerCase().includes('syuriah') || 
                               k.role.toLowerCase().includes('tanfidziyah') || 
                               k.role.toLowerCase().includes('rais') || 
                               k.role.toLowerCase().includes('ketua') || 
                               k.role.toLowerCase().includes('sekretaris') || 
                               k.role.toLowerCase().includes('bendahara') || 
                               k.role.toLowerCase().includes('harian')
                             )) || 
                             (k.unsur && (
                               k.unsur.toLowerCase().includes('harian') || 
                               k.unsur.toLowerCase().includes('mwc') || 
                               k.unsur.toLowerCase().includes('ranting') || 
                               k.unsur.toLowerCase().includes('syuriah') || 
                               k.unsur.toLowerCase().includes('tanfidziyah')
                             ))
                           )) ||
                           k.banom === selectedBanom || 
                           (k.unsur && k.unsur.toLowerCase().includes(selectedBanom.toLowerCase()));
      const matchesRanting = selectedRanting === 'Semua' || k.rantingId === selectedRanting;
      const matchesSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (k.role && k.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (k.unsur && k.unsur.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesBanom && matchesRanting && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Banom / Lembaga</label>
              <select
                value={selectedBanom}
                onChange={(e) => setSelectedBanom(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Banom & Lembaga</option>
                <optgroup label="Pengurus Inti">
                  <option value="Pengurus Harian">Pengurus Harian (Syuriah/Tanfidziyah)</option>
                </optgroup>
                <optgroup label="Badan Otonom (Banom)">
                  <option value="Muslimat">Muslimat NU</option>
                  <option value="Ansor">GP Ansor</option>
                  <option value="Fatayat">Fatayat NU</option>
                  <option value="IPNU">IPNU</option>
                  <option value="IPPNU">IPPNU</option>
                  <option value="Pagar Nusa">Pagar Nusa</option>
                  <option value="Banser">Banser</option>
                </optgroup>
                <optgroup label="Lembaga-Lembaga NU">
                  <option value="LAZISNU">LAZISNU</option>
                  <option value="LTMNU">LTMNU</option>
                  <option value="LDNU">LDNU</option>
                  <option value="RMI-NU">RMI-NU</option>
                  <option value="LPMNU">LPMNU (Ma'arif)</option>
                  <option value="LWPNU">LWPNU</option>
                  <option value="LAKPESDAM">LAKPESDAM</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Wilayah (MWCNU & Ranting)</label>
              <select
                value={selectedRanting}
                onChange={(e) => setSelectedRanting(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Wilayah (30)</option>
                <option value="mwc">MWC NU BUNGAH (Tingkat Kecamatan)</option>
                {rantings.filter(r => r.id !== 'mwc').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Pencarian Nama</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ketik nama kader..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Sinergi CSV Bulk Importer/Exporter for Kaders */}
          <div className="border-t border-dashed border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Integrasi Data Kader Terpadu</span>
              <p className="text-[11px] text-slate-500 font-semibold">Unduh template atau impor data kader Nahdlatul Ulama secara massal via berkas CSV.</p>
            </div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <button
                onClick={downloadKaderCSVTemplate}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors flex items-center space-x-1.5"
                title="Unduh Template CSV Kader"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Unduh Template</span>
              </button>
              {userRole !== 'guest' ? (
                <label className="cursor-pointer px-3 py-1.5 bg-tosca-600 hover:bg-tosca-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>Unggah CSV Kader</span>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleKaderCSVUpload}
                  />
                </label>
              ) : (
                <span className="text-[10px] text-slate-400 font-semibold italic">Login admin untuk mengunggah CSV</span>
              )}
            </div>
          </div>

          {/* Success / Error Messages */}
          {(csvKaderMessage || csvKaderError) && (
            <div className="p-3 rounded-xl border text-xs font-semibold animate-pulse mt-2 bg-white">
              {csvKaderMessage && <span className="text-emerald-700">{csvKaderMessage}</span>}
              {csvKaderError && <span className="text-red-600">{csvKaderError}</span>}
            </div>
          )}
        </div>

        {/* Total count indicator */}
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-xs">
          <span>Kader Terdaftar: {filteredKader.length} Orang</span>
          <span className="text-[10px] text-slate-400 font-medium">Tampilan Kartu Terpadu</span>
        </div>

        {/* Kader Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKader.map((k) => (
            <div key={k.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-tosca-300 transition-all">
              <div className="p-5 flex items-start space-x-4">
                <img 
                  src={k.photoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} 
                  alt={k.name} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-contain border border-slate-200 bg-slate-50 shrink-0 shadow-xs" 
                />
                <div className="space-y-1 overflow-hidden">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-tosca-50 text-tosca-800 border border-tosca-100">
                    {k.unsur || k.banom}
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-tight truncate">{k.name}</h4>
                  <p className="text-[11px] text-tosca-600 font-bold truncate">{k.role || 'Kader / Anggota'}</p>
                </div>
              </div>
              
              <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-100 text-[10.5px] grid grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Ranting Desa</span>
                  <span className="text-gray-700 font-semibold truncate block">{getRantingName(k.rantingId)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Angkatan / Tahun</span>
                  <span className="text-gray-700 font-semibold truncate block">{k.angkatan || k.joinYear || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Jenis Kelamin</span>
                  <span className="text-gray-700 font-semibold truncate block">{k.gender}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase tracking-wider text-[8px] font-bold">Alamat</span>
                  <span className="text-gray-700 font-semibold truncate block text-[10px]" title={k.address}>{k.address || '-'}</span>
                </div>
                <div className="col-span-2 pt-1 flex items-center space-x-1.5 text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-tosca-600" />
                  <span className="font-mono">{k.phone}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredKader.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200">
              <p className="text-xs text-slate-500 font-bold">Kader tidak ditemukan. Silakan ganti kriteria pencarian.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 3: KEGIATAN JAMIYAH
  // ==========================================
  const renderKegiatan = () => {
    const statusFilter = kegiatanStatusFilter;
    const setStatusFilter = setKegiatanStatusFilter;

    const filteredKegiatan = kegiatanList.filter(e => {
      return statusFilter === 'Semua' || e.status === statusFilter;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex space-x-1">
            {(['Semua', 'Rencana', 'Selesai'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${statusFilter === status 
                    ? 'bg-tosca-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {status === 'Semua' ? 'Semua Agenda' : status === 'Rencana' ? 'Mendatang (Rencana)' : 'Telah Terlaksana'}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">Jumlah: {filteredKegiatan.length} Kegiatan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredKegiatan.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                {e.imageUrl && (
                  <img 
                    src={e.imageUrl} 
                    alt={e.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover bg-slate-50" 
                  />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-tosca-700 bg-tosca-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {e.organizer}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${e.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {e.status}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug hover:text-tosca-600 transition-colors">
                    {e.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {e.description}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-4 border-t border-slate-50 text-xs text-slate-600 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{e.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 truncate" />
                    <span className="truncate">{e.location.split(',')[0]}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100/50 pt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Sumber Biaya</span>
                    <span className="font-semibold text-slate-800">{e.fundingSource}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Anggaran Biaya</span>
                    <span className="font-bold text-tosca-700">{formatRupiah(e.budget)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 4: TRANSPARANSI DANA
  // ==========================================
  const renderKeuangan = () => {
    // 1. Calculations
    const incoming = kasList.filter(k => k.type === 'Masuk').reduce((sum, k) => sum + k.amount, 0);
    const outgoing = kasList.filter(k => k.type === 'Keluar').reduce((sum, k) => sum + k.amount, 0);
    const balance = incoming - outgoing;

    // 2. Prepare Category Pie Data
    const categorySummary = kasList.reduce((acc: { [key: string]: number }, cur) => {
      if (cur.type === 'Keluar') {
        acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
      }
      return acc;
    }, {});

    const pieData = Object.keys(categorySummary).map(cat => ({
      name: cat,
      value: categorySummary[cat]
    }));

    // 3. Prepare Monthly cashflow data for basic column chart
    const monthlySummary = kasList.reduce((acc: { [key: string]: { masuk: number; keluar: number } }, cur) => {
      const monthLabel = cur.date.slice(0, 7); // e.g., '2026-06'
      if (!acc[monthLabel]) {
        acc[monthLabel] = { masuk: 0, keluar: 0 };
      }
      if (cur.type === 'Masuk') {
        acc[monthLabel].masuk += cur.amount;
      } else {
        acc[monthLabel].keluar += cur.amount;
      }
      return acc;
    }, {});

    const chartData = Object.keys(monthlySummary).sort().map(month => ({
      name: month,
      Masuk: monthlySummary[month].masuk,
      Keluar: -monthlySummary[month].keluar,
      Saldo: monthlySummary[month].masuk - monthlySummary[month].keluar
    }));

    const COLORS = ['#0f766e', '#0d9488', '#14b8a6', '#5eead4', '#a7f3d0', '#f59e0b'];

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Quick Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Saldo Masuk</span>
              <p className="text-lg font-display font-extrabold text-emerald-600">{formatRupiah(incoming)}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Saldo Keluar</span>
              <p className="text-lg font-display font-extrabold text-red-600">{formatRupiah(outgoing)}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Saldo (Sisa)</span>
              <p className="text-lg font-display font-extrabold text-tosca-700">{formatRupiah(balance)}</p>
            </div>
            <div className="p-2.5 bg-tosca-50 rounded-xl text-tosca-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tingkat Penyerapan</span>
              <p className="text-lg font-display font-extrabold text-slate-800">
                {incoming > 0 ? `${((outgoing / incoming) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 font-bold text-xs">
              %
            </div>
          </div>
        </div>

        {/* Charts & Allocations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart: Alokasi Pengeluaran (Tujuan Penggunaan) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Tujuan Penggunaan Dana</h3>
              <p className="text-xs text-slate-500 mb-4">Rincian penggunaan kas berdasarkan kategori program dakwah & sosial</p>
            </div>
            
            {pieData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Labels Legend */}
                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-600 text-[11px] font-medium truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{formatRupiah(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">Belum ada data pengeluaran</p>
            )}
          </div>

          {/* Bar Chart: Arus Kas Bulanan */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Arus Keuangan Bulanan (Tingkat MWCNU)</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik komparasi bulanan antara saldo masuk, saldo keluar, dan saldo tersisa</p>
            </div>

            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} formatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                    <Bar dataKey="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Keluar" fill="#ef4444" radius={[0, 0, 4, 4]} />
                    <Line type="monotone" dataKey="Saldo" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">Belum ada tren data bulanan</p>
            )}
          </div>
        </div>

        {/* Transactions ledger */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Buku Transparansi Arus Kas Terkini</h3>
              <span className="text-[10px] text-slate-400 font-mono italic">Semua data terverifikasi auditor internal</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Kategori</th>
                    <th className="px-5 py-3">Tujuan / Rincian Keterangan</th>
                    <th className="px-5 py-3">PJ (PIC)</th>
                    <th className="px-5 py-3">Pemasukan (Masuk)</th>
                    <th className="px-5 py-3 text-right">Pengeluaran (Keluar)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kasList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-slate-500 font-mono font-medium">{k.date}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-700">{k.category}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 truncate max-w-[200px]" title={k.description}>
                        {k.description}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-semibold">{k.pic || '-'}</td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600">
                        {k.type === 'Masuk' ? formatRupiah(k.amount) : '-'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-red-600 text-right">
                        {k.type === 'Keluar' ? formatRupiah(k.amount) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Audited: Juni 2026</span>
            <button className="text-tosca-700 font-semibold hover:underline flex items-center space-x-1">
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Laporan PDF</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 5: KOIN S3 (LAZISNU)
  // ==========================================
  const renderKoinS3 = () => {
    const selectedRanting = koinSelectedRanting;
    const setSelectedRanting = setKoinSelectedRanting;

    const availableMonths = Array.from(new Set(koinList.map(k => k.month))).sort();

    const formatMonthLabel = (mLabel: string) => {
      if (!mLabel) return '';
      const [year, month] = mLabel.split('-');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const mIdx = parseInt(month, 10) - 1;
      return `${monthNames[mIdx] || month} ${year}`;
    };

    const filteredKoin = koinList.filter(k => {
      const matchRanting = selectedRanting === 'Semua' || k.rantingId === selectedRanting;
      const matchMonth = koinSelectedMonth === 'Semua' || k.month === koinSelectedMonth;
      return matchRanting && matchMonth;
    });

    const totalCollected = filteredKoin.reduce((sum, k) => sum + k.amount, 0);
    const totalDistributed = filteredKoin.reduce((sum, k) => sum + k.distributionAmount, 0);
    const totalBalance = totalCollected - totalDistributed;

    // 1. Prepare Ranting NU Accumulation Data - show all rantings and support month filtering
    const rantingSummaryData = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const rantingEntries = koinList.filter(k => {
          const matchRanting = k.rantingId === r.id;
          const matchMonth = koinSelectedMonth === 'Semua' || k.month === koinSelectedMonth;
          return matchRanting && matchMonth;
        });
        const collected = rantingEntries.reduce((sum, k) => sum + k.amount, 0);
        const distributed = rantingEntries.reduce((sum, k) => sum + k.distributionAmount, 0);
        const balance = collected - distributed;
        return {
          id: r.id,
          name: r.name.replace('PRNU ', ''),
          Perolehan: collected,
          Penyaluran: distributed,
          Saldo: balance
        };
      });

    // 2. Prepare Month NU Accumulation Data (for trend when single ranting is selected)
    // Always show full trend across all months for a single ranting, ignoring the monthly filter
    const trendKoin = koinList.filter(k => selectedRanting === 'Semua' || k.rantingId === selectedRanting);
    const monthlyRantingSummary = trendKoin.reduce((acc: { [key: string]: { collected: number; distributed: number } }, cur) => {
      if (!acc[cur.month]) {
        acc[cur.month] = { collected: 0, distributed: 0 };
      }
      acc[cur.month].collected += cur.amount;
      acc[cur.month].distributed += cur.distributionAmount;
      return acc;
    }, {});

    const monthlyChartData = Object.keys(monthlyRantingSummary).sort().map(month => ({
      name: month,
      Perolehan: monthlyRantingSummary[month].collected,
      Penyaluran: monthlyRantingSummary[month].distributed,
      Saldo: monthlyRantingSummary[month].collected - monthlyRantingSummary[month].distributed
    }));

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Banner Gerakan */}
        <section className="bg-gradient-to-r from-emerald-800 to-tosca-700 text-white rounded-2xl p-5 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md shadow-emerald-50/50">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-tosca-200">GERAKAN KOIN S3 LAZISNU</span>
            <h2 className="text-xl md:text-2xl font-display font-extrabold tracking-tight">Koin Sehari Seribu (S3)</h2>
            <p className="text-xs md:text-sm text-slate-100">
              Melalui gerakan kemandirian ini, koin kecil yang terkumpul dari seluruh keluarga Nahdliyin diseluruh Ranting NU se-Kecamatan Bungah diubah menjadi kekuatan sosial ekonomi dakwah yang maslahat untuk warga prasejahtera.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-tosca-200 uppercase font-bold tracking-wider animate-pulse">AKUMULASI S/D JUNI 2026</span>
            <p className="text-2xl font-display font-extrabold text-white mt-1">{formatRupiah(koinList.reduce((sum, k) => sum + k.amount, 0))}</p>
          </div>
        </section>

        {/* Filter & Summary Cards */}
        <div className="space-y-4">
          <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter Ranting</span>
                <select
                  value={selectedRanting}
                  onChange={(e) => setSelectedRanting(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-slate-700 font-semibold"
                >
                  <option value="Semua">Semua Ranting Desa (Tingkat MWCNU)</option>
                  {rantings.filter(r => r.id !== 'mwc').map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter Bulan</span>
                <select
                  value={koinSelectedMonth}
                  onChange={(e) => setKoinSelectedMonth(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 text-slate-700 font-semibold"
                >
                  <option value="Semua">Semua Bulan</option>
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{formatMonthLabel(m)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <span className="text-[10px] text-slate-400 font-mono font-bold">
              Status Laporan: <span className="text-emerald-600">AKTIF WAJIB BULANAN</span>
            </span>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Perolehan</span>
                <p className="text-lg font-display font-extrabold text-tosca-700">{formatRupiah(totalCollected)}</p>
              </div>
              <div className="p-2.5 bg-tosca-50 rounded-xl text-tosca-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Penyaluran (Tasaruf)</span>
                <p className="text-lg font-display font-extrabold text-amber-600">{formatRupiah(totalDistributed)}</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sisa Saldo</span>
                <p className="text-lg font-display font-extrabold text-emerald-600">{formatRupiah(totalBalance)}</p>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rasio Tasaruf</span>
                <p className="text-lg font-display font-extrabold text-slate-800">
                  {totalCollected > 0 ? `${((totalDistributed / totalCollected) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 font-bold text-xs">
                %
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {selectedRanting === 'Semua' ? (
          <div className="flex flex-col gap-6">
            {/* Chart 1: Perolehan vs Penyaluran Per Ranting */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Perolehan vs Penyaluran per Ranting NU</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik komparasi total dana koin S3 yang dihimpun dan ditasharufkan</p>
              {rantingSummaryData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rantingSummaryData} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 8 }} 
                        interval={0} 
                        angle={-45} 
                        textAnchor="end" 
                        height={75}
                      />
                      <YAxis tick={{ fontSize: 9 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="Perolehan" fill="#0d9488" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Penyaluran" fill="#d97706" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data ranting</p>
              )}
            </div>

            {/* Chart 2: Saldo Koin S3 Per Ranting */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Saldo Kas S3 per Ranting NU</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik sisa saldo simpanan koin S3 aktif di kas masing-masing ranting</p>
              {rantingSummaryData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rantingSummaryData} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 8 }} 
                        interval={0} 
                        angle={-45} 
                        textAnchor="end" 
                        height={75}
                      />
                      <YAxis tick={{ fontSize: 9 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="Saldo" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data ranting</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart for specific ranting: Monthly trend */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Tren Bulanan Perolehan & Penyaluran</h3>
              <p className="text-xs text-slate-500 mb-4">Grafik transparansi setoran koin S3 bulanan untuk {getRantingName(selectedRanting)}</p>
              {monthlyChartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Perolehan" fill="#0d9488" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Penyaluran" fill="#d97706" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data bulanan</p>
              )}
            </div>

            {/* Chart for specific ranting: Cumulative Monthly Saldo */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Perkembangan Sisa Saldo Bulanan</h3>
              <p className="text-xs text-slate-500 mb-4">Visualisasi tren saldo tersimpan untuk {getRantingName(selectedRanting)}</p>
              {monthlyChartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} formatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
                      <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Saldo" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Belum ada data bulanan</p>
              )}
            </div>
          </div>
        )}

        {/* Laporan Akumulasi per Ranting (Tingkat MWCNU) - requested by user */}
        {selectedRanting === 'Semua' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Laporan Akumulasi Koin S3 Tingkat Ranting se-MWCNU Bungah</span>
              <span className="text-[10px] text-slate-400 font-mono">Tahun Buku 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="px-6 py-3">Nama Ranting Desa</th>
                    <th className="px-6 py-3">Total Perolehan</th>
                    <th className="px-6 py-3">Total Penyaluran</th>
                    <th className="px-6 py-3">Rasio Tasaruf</th>
                    <th className="px-6 py-3 text-right">Sisa Saldo Kas Ranting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rantingSummaryData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 font-medium">
                      <td className="px-6 py-3.5 text-slate-800 font-bold">{getRantingName(item.id)}</td>
                      <td className="px-6 py-3.5 text-tosca-700 font-bold">{formatRupiah(item.Perolehan)}</td>
                      <td className="px-6 py-3.5 text-amber-600 font-semibold">{formatRupiah(item.Penyaluran)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-1.5" style={{ width: `${Math.min((item.Penyaluran / item.Perolehan) * 100, 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-500">{((item.Penyaluran / item.Perolehan) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right text-emerald-700 font-bold font-mono">{formatRupiah(item.Saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Report Cards per Ranting & Month - requested by user */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-sm">Kartu Laporan Bulanan Ranting</h3>
            <span className="text-[10px] text-slate-400 font-mono">Menampilkan {filteredKoin.length} Laporan Transparan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKoin.map((k) => {
              const reportSaldo = k.amount - k.distributionAmount;
              const ratio = k.amount > 0 ? (k.distributionAmount / k.amount) * 100 : 0;
              return (
                <div key={k.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-emerald-200 transition-all p-5 space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                    <div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
                        {k.month}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">{getRantingName(k.rantingId)}</h4>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      Terlapor
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Pemasukan (Koin Masuk)</span>
                      <span className="font-bold text-tosca-700">{formatRupiah(k.amount)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Penyaluran (Tasaruf)</span>
                      <span className="font-bold text-amber-600">{formatRupiah(k.distributionAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-50 pt-2.5">
                      <span className="font-bold text-slate-700">Sisa Saldo</span>
                      <span className="font-extrabold text-emerald-600 font-mono">{formatRupiah(reportSaldo)}</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 space-y-1 border border-slate-100 mt-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Tujuan & Sasaran Penyaluran</span>
                      {renderDistributionTarget(k.distributionTarget)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Efisiensi Penyaluran</span>
                        <span className="font-bold text-slate-600">{ratio.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-1.5" style={{ width: `${Math.min(ratio, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredKoin.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-slate-100 rounded-2xl py-12 text-center text-slate-400 text-xs font-semibold">
                Belum ada data laporan koin S3 yang terdaftar untuk ranting ini.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 6: PERSURATAN
  // ==========================================
  const renderPersuratan = () => {
    const searchQuery = persuratanSearchQuery;
    const setSearchQuery = setPersuratanSearchQuery;
    const selectedType = persuratanSelectedType;
    const setSelectedType = setPersuratanSelectedType;

    const filteredSurat = suratList.filter(s => {
      const matchesType = selectedType === 'Semua' || s.type === selectedType;
      const matchesSearch = s.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.senderOrRecipient.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-1">
            {(['Semua', 'Masuk', 'Keluar'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${selectedType === type 
                    ? 'bg-tosca-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {type === 'Semua' ? 'Semua Surat' : `Surat ${type}`}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor surat, perihal, pengirim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="px-6 py-3">No. Surat</th>
                  <th className="px-6 py-3">Klasifikasi</th>
                  <th className="px-6 py-3">Jenis</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Pengirim / Penerima</th>
                  <th className="px-6 py-3">Perihal</th>
                  <th className="px-6 py-3">Tembusan</th>
                  <th className="px-6 py-3 text-center">Berkas / Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSurat.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{s.letterNumber}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-600">{s.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                        ${s.type === 'Masuk' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{s.date}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">{s.senderOrRecipient}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{s.subject}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 italic truncate max-w-[150px]">{s.tembusan || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                        {/* Open Document Action */}
                        {s.isPrivate ? (
                          userRole !== 'guest' ? (
                            <a
                              href={s.attachmentUrl || '#'}
                              target={s.attachmentUrl ? "_blank" : "_self"}
                              rel="noreferrer"
                              onClick={(e) => {
                                if (!s.attachmentUrl) {
                                  e.preventDefault();
                                  const url = window.prompt("Belum ada berkas. Pengurus dapat memasukkan URL PDF/Foto surat di sini:", "");
                                  if (url && setSuratList) {
                                    setSuratList(prev => prev.map(item => item.id === s.id ? { ...item, attachmentUrl: url } : item));
                                  }
                                }
                              }}
                              className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold flex items-center space-x-1 border border-amber-200 transition-colors cursor-pointer"
                              title="Berkas Rahasia (Terbuka untuk Pengurus)"
                            >
                              <span>🔒</span>
                              <span className="underline">{s.attachmentUrl ? "Buka Rahasia" : "Tambah Berkas"}</span>
                            </a>
                          ) : (
                            <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[10px] font-bold flex items-center space-x-1 border border-red-100">
                              <span>🔒</span>
                              <span>Rahasia Publik</span>
                            </span>
                          )
                        ) : (
                          <a
                            href={s.attachmentUrl || '#'}
                            target={s.attachmentUrl ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={(e) => {
                              if (!s.attachmentUrl) {
                                e.preventDefault();
                                if (userRole !== 'guest') {
                                  const url = window.prompt("Belum ada berkas. Pengurus dapat memasukkan URL PDF/Foto surat di sini:", "");
                                  if (url && setSuratList) {
                                    setSuratList(prev => prev.map(item => item.id === s.id ? { ...item, attachmentUrl: url } : item));
                                  }
                                } else {
                                  alert("Berkas fisik belum diunggah untuk surat ini.");
                                }
                              }
                            }}
                            className="px-2.5 py-1 bg-tosca-50 text-tosca-700 hover:bg-tosca-100 rounded-lg text-xs font-bold flex items-center space-x-1 border border-tosca-100 transition-colors cursor-pointer"
                          >
                            <span>📄</span>
                            <span className="underline">{s.attachmentUrl ? "Buka Berkas" : "Belum Ada Berkas"}</span>
                          </a>
                        )}

                        {/* Privacy Toggle Action (Admin Only) */}
                        {userRole !== 'guest' && setSuratList && (
                          <button
                            onClick={() => {
                              setSuratList(prev => prev.map(item => item.id === s.id ? { ...item, isPrivate: !item.isPrivate } : item));
                            }}
                            className={`px-1.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer
                              ${s.isPrivate 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                            title={s.isPrivate ? "Ubah ke Publik" : "Matikan/Rahasiakan dari Publik"}
                          >
                            {s.isPrivate ? "Set Publik" : "Set Rahasia"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSurat.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      Surat tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 7: USAHA JAMIYAH
  // ==========================================
  const renderUsaha = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <h3 className="font-bold text-gray-900 mb-2 text-sm">Kemandirian Ekonomi Nahdliyin</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Untuk membiayai operasional organisasi dan dakwah tanpa terus bergantung pada sumbangan, MWC NU Bungah mendorong pembentukan unit-unit usaha otonom berbasis syariah dan kemitraan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usahaList.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                {u.imageUrl && (
                  <img 
                    src={u.imageUrl} 
                    alt={u.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-40 object-cover bg-slate-50" 
                  />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-tosca-700 bg-tosca-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {u.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                      ${u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {u.status}
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold text-slate-800 leading-snug">{u.name}</h4>
                  
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{u.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Penggerak: <strong className="text-slate-700 font-semibold">{u.manager}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimasi Omzet Bulanan</span>
                <span className="text-sm font-bold text-tosca-700 font-mono">{u.revenue > 0 ? formatRupiah(u.revenue) : 'Rp 0 (Offline)'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 8: SARANA IBADAH
  // ==========================================
  const renderSaranaIbadah = () => {
    const rantingSaranaStats = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const ibadahCount = saranaIbadahList.filter(si => si.rantingId === r.id).length;
        const pendidikanCount = saranaPendidikanList.filter(sp => sp.rantingId === r.id).length;
        return {
          id: r.id,
          name: r.name,
          ibadahCount,
          pendidikanCount,
          total: ibadahCount + pendidikanCount
        };
      })
      .filter(stat => stat.total > 0);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-5.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Inventarisasi Rumah Ibadah NU</h3>
            <p className="text-xs text-slate-500">Pendataan masjid, musholla, takmir, legalitas tanah, dan afiliasi amaliyah Aswaja.</p>
          </div>
          <span className="text-xs bg-tosca-50 text-tosca-700 font-bold px-3 py-1.5 rounded-xl border border-tosca-100">
            Total Tercatat: {saranaIbadahList.length} Sarana
          </span>
        </div>

        {/* Per-Ranting Distribution Cards */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Map className="w-4 h-4 text-tosca-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Distribusi Sarana per Ranting Desa</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {rantingSaranaStats.map(stat => (
              <div key={stat.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:border-tosca-200 hover:bg-tosca-50/10 transition-all">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider truncate" title={stat.name}>
                  {stat.name.replace('PRNU ', '')}
                </span>
                <div className="mt-2.5 flex justify-center space-x-2.5 text-xs">
                  <div className="text-center">
                    <span className="font-extrabold text-tosca-700 block">{stat.ibadahCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Ibadah</span>
                  </div>
                  <div className="border-r border-slate-200 h-5 my-auto" />
                  <div className="text-center">
                    <span className="font-extrabold text-emerald-700 block">{stat.pendidikanCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Sekolah</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {saranaIbadahList.map((si) => (
            <div key={si.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              {/* Card Photo */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
                <img
                  src={si.imageUrl || 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800&auto=format&fit=crop&q=80'}
                  alt={si.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {userRole !== 'guest' && (
                  <button
                    onClick={() => {
                      const newUrl = window.prompt("Ubah URL Foto Sarana Ibadah:", si.imageUrl || "");
                      if (newUrl !== null && setSaranaIbadahList) {
                        setSaranaIbadahList(prev => prev.map(item => item.id === si.id ? { ...item, imageUrl: newUrl } : item));
                      }
                    }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center space-x-1"
                  >
                    <Upload className="w-3 h-3 text-tosca-600" />
                    <span>Ubah Foto</span>
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div>
                      <span className="text-[10px] bg-tosca-50 text-tosca-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        {si.type}
                      </span>
                      <h4 className="text-base font-bold text-slate-800 leading-snug mt-1">{si.name}</h4>
                    </div>
                    <Building className="w-5 h-5 text-slate-300" />
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Ketua Takmir</span>
                      <span className="font-bold text-slate-700">{si.takmir}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Asal Ranting</span>
                      <span className="font-bold text-slate-700">{getRantingName(si.rantingId)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Imam Utama 1</span>
                      <span className="font-medium text-slate-600">{si.imam1}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Imam Utama 2</span>
                      <span className="font-medium text-slate-600">{si.imam2}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Alamat Lengkap</span>
                      <span className="text-slate-600 flex items-center mt-0.5"><MapPin className="w-3.5 h-3.5 text-slate-300 mr-1 shrink-0" />{si.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3.5 border-t border-slate-100 text-[10px] flex items-center justify-between rounded-b-2xl mt-4">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-600 font-bold">Status Wakaf: <strong className="text-slate-800">{si.landStatus}</strong></span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold
                    ${si.nuAffiliation === 'Milik NU' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {si.nuAffiliation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 9: SARANA PENDIDIKAN
  // ==========================================
  const renderSaranaPendidikan = () => {
    const rantingSaranaStats = rantings
      .filter(r => r.id !== 'mwc')
      .map(r => {
        const ibadahCount = saranaIbadahList.filter(si => si.rantingId === r.id).length;
        const pendidikanCount = saranaPendidikanList.filter(sp => sp.rantingId === r.id).length;
        return {
          id: r.id,
          name: r.name,
          ibadahCount,
          pendidikanCount,
          total: ibadahCount + pendidikanCount
        };
      })
      .filter(stat => stat.total > 0);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-5.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Lembaga Pendidikan Ma&apos;arif NU</h3>
            <p className="text-xs text-slate-500">Kondisi fisik gedung, pimpinan, jenjang madrasah, dan statistik siswa se-Kecamatan Bungah.</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-100">
            Total Tercatat: {saranaPendidikanList.length} Sekolah
          </span>
        </div>

        {/* Per-Ranting Distribution Cards */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Map className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Distribusi Sarana per Ranting Desa</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {rantingSaranaStats.map(stat => (
              <div key={stat.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center hover:border-emerald-200 hover:bg-emerald-50/10 transition-all">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider truncate" title={stat.name}>
                  {stat.name.replace('PRNU ', '')}
                </span>
                <div className="mt-2.5 flex justify-center space-x-2.5 text-xs">
                  <div className="text-center">
                    <span className="font-extrabold text-tosca-700 block">{stat.ibadahCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Ibadah</span>
                  </div>
                  <div className="border-r border-slate-200 h-5 my-auto" />
                  <div className="text-center">
                    <span className="font-extrabold text-emerald-700 block">{stat.pendidikanCount}</span>
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Sekolah</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {saranaPendidikanList.map((sp) => (
            <div key={sp.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              {/* Card Photo */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
                <img
                  src={sp.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'}
                  alt={sp.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {userRole !== 'guest' && (
                  <button
                    onClick={() => {
                      const newUrl = window.prompt("Ubah URL Foto Sarana Pendidikan:", sp.imageUrl || "");
                      if (newUrl !== null && setSaranaPendidikanList) {
                        setSaranaPendidikanList(prev => prev.map(item => item.id === sp.id ? { ...item, imageUrl: newUrl } : item));
                      }
                    }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center space-x-1"
                  >
                    <Upload className="w-3 h-3 text-tosca-600" />
                    <span>Ubah Foto</span>
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider mr-1.5">
                        {sp.level}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-semibold">
                        {sp.status}
                      </span>
                      <h4 className="text-base font-bold text-slate-800 leading-snug mt-1.5">{sp.name}</h4>
                    </div>
                    <BookOpen className="w-5 h-5 text-slate-300" />
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Kepala Sekolah / Pimpinan</span>
                      <span className="font-bold text-slate-700">{sp.principal}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Jumlah Siswa</span>
                      <span className="font-bold text-slate-700 font-mono">{sp.studentCount} Siswa</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Hubungi Telp</span>
                      <span className="text-slate-600 font-mono">{sp.phone || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Kondisi Bangunan</span>
                      <span className={`font-semibold flex items-center space-x-1
                        ${sp.condition === 'Baik' ? 'text-emerald-600' : sp.condition === 'Butuh Renovasi' ? 'text-red-600 font-bold' : 'text-amber-600'}`}>
                        {sp.condition === 'Baik' ? <CheckCircle className="w-3.5 h-3.5 inline mr-0.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 inline mr-0.5 text-amber-600" />}
                        <span>{sp.condition}</span>
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Alamat Lembaga</span>
                      <span className="text-slate-600 flex items-center mt-0.5"><MapPin className="w-3.5 h-3.5 text-slate-300 mr-1 shrink-0" />{sp.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-100 text-[10px] text-slate-500 rounded-b-2xl mt-4">
                  Asal Ranting: <strong className="text-slate-700">{getRantingName(sp.rantingId)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 10: BERITA / NEWS
  // ==========================================
  const renderBerita = () => {
    // If viewing single news
    if (selectedNewsId) {
      const item = beritaList.find(b => b.id === selectedNewsId);
      if (!item) {
        setSelectedNewsId(null);
        return null;
      }

      return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden animate-fadeIn space-y-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <button 
              onClick={() => setSelectedNewsId(null)}
              className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl shadow-2xs transition-all flex items-center space-x-1"
            >
              <span>← Kembali ke Daftar Berita</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">Diposting: {item.date}</span>
          </div>

          <div className="px-6 md:px-12 py-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-tosca-700 bg-tosca-50 px-2 py-1 rounded uppercase tracking-wider">
                {item.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 leading-tight">
                {item.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span>Penulis: <strong className="font-bold text-slate-700">{item.author}</strong></span>
                  <span>•</span>
                  <span>MWC NU Bungah Media</span>
                </div>
                {item.driveUrl && (
                  <a 
                    href={item.driveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Buka Drive Foto Berita</span>
                  </a>
                )}
              </div>
            </div>

            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover rounded-2xl bg-slate-50 border border-gray-100" 
              />
            )}

            {/* Custom Simple Markdown Renderer */}
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-4 max-w-4xl border-t border-slate-100 pt-6">
              {item.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('# ')) {
                  return <h2 key={pIdx} className="text-xl md:text-2xl font-bold text-slate-800 mt-6 mb-2">{trimmed.slice(2)}</h2>;
                }
                if (trimmed.startsWith('## ')) {
                  return <h3 key={pIdx} className="text-lg md:text-xl font-bold text-slate-800 mt-4 mb-2">{trimmed.slice(3)}</h3>;
                }
                if (trimmed.startsWith('> ')) {
                  return <blockquote key={pIdx} className="border-l-4 border-tosca-500 pl-4 italic text-slate-600 bg-tosca-50/50 py-2 rounded-r-lg my-4">{trimmed.slice(2)}</blockquote>;
                }
                if (trimmed.startsWith('1. ') || trimmed.startsWith('* ')) {
                  return (
                    <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-3 text-sm">
                      {trimmed.split('\n').map((li, lIdx) => (
                        <li key={lIdx} className="text-slate-700">{li.replace(/^(\d+\.|\*)\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                // Handle bold texts
                const parts = trimmed.split('**');
                if (parts.length > 1) {
                  return (
                    <p key={pIdx} className="text-slate-700">
                      {parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{p}</strong> : p)}
                    </p>
                  );
                }
                return <p key={pIdx} className="text-slate-700">{trimmed}</p>;
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritaList.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-tosca-200 hover:shadow-xs transition-all cursor-pointer group"
              onClick={() => setSelectedNewsId(item.id)}
            >
              <div>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover bg-slate-50 group-hover:scale-[1.015] transition-transform duration-300" 
                  />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-tosca-700 bg-tosca-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug group-hover:text-tosca-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-3">
                    {item.content.replace(/[#*`>]/g, '').slice(0, 150)}...
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3 border-t border-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Oleh: <strong className="text-slate-700 font-semibold">{item.author}</strong></span>
                <span className="text-tosca-600 font-bold group-hover:translate-x-1 transition-transform">Baca Selengkapnya →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE 11: DOKUMENTASI / GALLERY
  // ==========================================
  const renderDokumentasi = () => {
    const selectedCategory = gallerySelectedCategory;
    const setSelectedCategory = setGallerySelectedCategory;

    const filteredGallery = dokumentasiList.filter(d => {
      return selectedCategory === 'Semua' || d.category === selectedCategory;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex-wrap gap-2">
          <div className="flex space-x-1">
            {['Semua', 'Kegiatan', 'Rapat', 'Pelantikan', 'Harlah'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${selectedCategory === cat 
                    ? 'bg-tosca-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-bold font-mono">Tercatat {filteredGallery.length} Media</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((d) => (
            <div 
              key={d.id} 
              onClick={() => {
                setSelectedDokumentasi(d);
                setActivePhotoIndex(0);
                setNewPhotoInput('');
              }}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-tosca-200 cursor-pointer transition-all group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={d.url} 
                  alt={d.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover bg-slate-50 group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-md">
                  {d.category}
                </span>
                <span className="absolute top-2 right-2 bg-tosca-600/90 text-white text-[9px] font-extrabold px-2 py-1 rounded-md flex items-center space-x-1 shadow-sm">
                  <span>🖼️ Multi-Foto</span>
                </span>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug group-hover:text-tosca-600 transition-colors">{d.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Klik untuk membuka galeri album ({d.additionalImages ? d.additionalImages.length + 1 : 10} foto)</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-50 mt-2">
                  <span>{d.date}</span>
                  <span className="text-tosca-600 font-bold uppercase">{d.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Multi-Photo Popup Lightbox Modal */}
        {selectedDokumentasi && (() => {
          const d = selectedDokumentasi;
          
          // Define category specific default photos to make sure there are always 5-10 high quality photos!
          const fallbackMap: Record<string, string[]> = {
            'Rapat': [
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'
            ],
            'Kegiatan': [
              'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1523580494863-6f30312245d5?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1469571486010-0b3b2793c5dd?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
            ],
            'Pelantikan': [
              'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1523580494863-6f30312245d5?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1469571486010-0b3b2793c5dd?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
            ],
            'Harlah': [
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1469571486010-0b3b2793c5dd?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
            ]
          };

          const secondaryPhotos = d.additionalImages && d.additionalImages.length > 0 
            ? d.additionalImages 
            : (fallbackMap[d.category] || fallbackMap['Kegiatan']).slice(0, 9); // default 9 additional photos to make total 10!

          const allPhotos = [d.url, ...secondaryPhotos].slice(0, 10); // Exactly 5-10 photos!
          const activePhotoUrl = allPhotos[activePhotoIndex] || d.url;

          return (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row">
                
                {/* Photo Stage (Left Side - 65%) */}
                <div className="flex-1 bg-slate-950 relative flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                  <img
                    src={activePhotoUrl}
                    alt={`${d.title} - ${activePhotoIndex + 1}`}
                    referrerPolicy="no-referrer"
                    className="max-h-[550px] w-full object-contain"
                  />
                  
                  {/* Close button inside image for easy mobile closing */}
                  <button 
                    onClick={() => setSelectedDokumentasi(null)}
                    className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-md transition-colors"
                  >
                    ✕
                  </button>

                  {/* Stage navigation arrows */}
                  {allPhotos.length > 1 && (
                    <>
                      <button
                        onClick={() => setActivePhotoIndex(prev => (prev === 0 ? allPhotos.length - 1 : prev - 1))}
                        className="absolute left-4 bg-black/55 hover:bg-black text-white p-3 rounded-full shadow-md hover:scale-105 transition-all text-sm font-bold"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setActivePhotoIndex(prev => (prev === allPhotos.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 bg-black/55 hover:bg-black text-white p-3 rounded-full shadow-md hover:scale-105 transition-all text-sm font-bold"
                      >
                        →
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 bg-black/60 text-white text-xs font-mono px-3.5 py-1 rounded-full">
                    Foto ke-{activePhotoIndex + 1} dari {allPhotos.length}
                  </div>
                </div>

                {/* Details & Thumbnails (Right Side - 35%) */}
                <div className="w-full md:w-80 bg-slate-50 p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-[600px] border-t md:border-t-0 md:border-l border-slate-200">
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-tosca-50 text-tosca-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          {d.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug mt-1.5">{d.title}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedDokumentasi(null)}
                        className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1.5 hidden md:block"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-semibold flex items-center space-x-1 border-b border-slate-100 pb-3">
                      <span>Tanggal Unggah: {d.date}</span>
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                        Daftar Foto Album ({allPhotos.length})
                      </span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {allPhotos.map((photo, index) => (
                          <div 
                            key={index}
                            onClick={() => setActivePhotoIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer relative group transition-all
                              ${activePhotoIndex === index 
                                ? 'border-tosca-500 scale-95 shadow-md' 
                                : 'border-transparent hover:border-slate-300'}`}
                          >
                            <img
                              src={photo}
                              alt={`Thumbnail ${index + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {/* Delete Button for extra images (for admins only) */}
                            {userRole !== 'guest' && index > 0 && setDokumentasiList && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm("Hapus foto sekunder ini dari album?")) {
                                    const updatedSec = secondaryPhotos.filter((_, i) => i !== (index - 1));
                                    setDokumentasiList(prev => prev.map(item => item.id === d.id ? { ...item, additionalImages: updatedSec } : item));
                                    // Update our temporary selected object as well so it updates reactively in the popup
                                    setSelectedDokumentasi({
                                      ...d,
                                      additionalImages: updatedSec
                                    });
                                    setActivePhotoIndex(0);
                                  }
                                }}
                                className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Hapus foto"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Drive URL Section */}
                    <div className="space-y-1.5 pt-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                        Link Penyimpanan Berkas Eksternal
                      </span>
                      {d.driveUrl ? (
                        <a
                          href={d.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold p-2.5 rounded-xl border border-emerald-100 transition-colors"
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className="text-base font-normal">📁</span>
                            <span>Buka Google Drive Album</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                        </a>
                      ) : (
                        <div className="text-[11px] text-slate-500 italic bg-slate-100 p-2.5 rounded-xl">
                          Belum ada link Google Drive yang disematkan.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin controls to add secondary photos or change drive URL */}
                  {userRole !== 'guest' && setDokumentasiList && (
                    <div className="mt-6 pt-4 border-t border-slate-200 space-y-3.5 bg-slate-100/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                      <div className="flex items-center space-x-1 text-tosca-700 font-bold text-xs uppercase tracking-wider">
                        <span>⚙️</span>
                        <span>Menu Pengurus (CMS)</span>
                      </div>
                      
                      {/* Add photo input */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold block uppercase tracking-wide">Tambah URL Foto Baru (5-10 Foto)</label>
                        <div className="flex space-x-1">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={newPhotoInput}
                            onChange={(e) => setNewPhotoInput(e.target.value)}
                            className="flex-1 text-[11px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
                          />
                          <button
                            onClick={() => {
                              if (!newPhotoInput.trim()) return;
                              const updatedSec = [...(d.additionalImages || []), newPhotoInput.trim()];
                              setDokumentasiList(prev => prev.map(item => item.id === d.id ? { ...item, additionalImages: updatedSec } : item));
                              setSelectedDokumentasi({
                                ...d,
                                additionalImages: updatedSec
                              });
                              setNewPhotoInput('');
                              setActivePhotoIndex(updatedSec.length); // switch to the newly added photo!
                            }}
                            className="bg-tosca-600 hover:bg-tosca-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>

                      {/* Drive URL update input */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-bold block uppercase tracking-wide">Ubah Link Google Drive</label>
                        <div className="flex space-x-1">
                          <input
                            type="text"
                            placeholder="https://drive.google.com/..."
                            defaultValue={d.driveUrl || ''}
                            onBlur={(e) => {
                              const updatedUrl = e.target.value.trim();
                              setDokumentasiList(prev => prev.map(item => item.id === d.id ? { ...item, driveUrl: updatedUrl } : item));
                              setSelectedDokumentasi({
                                ...d,
                                driveUrl: updatedUrl
                              });
                            }}
                            className="flex-1 text-[11px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
                          />
                        </div>
                        <span className="text-[8px] text-slate-400 block mt-0.5">Sistem menyimpan otomatis saat Anda mengklik di luar kotak input.</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // ==========================================
  // PAGE 12: KONTAK & ASPIRASI
  // ==========================================
  const renderKontak = () => {
    // Local form states (bound to top-level lifted states to respect Rules of Hooks)
    const name = contactName;
    const setName = setContactName;
    const phone = contactPhone;
    const setPhone = setContactPhone;
    const email = contactEmail;
    const setEmail = setContactEmail;
    const rantingId = contactRantingId;
    const setRantingId = setContactRantingId;
    const subject = contactSubject;
    const setSubject = setContactSubject;
    const message = contactMessage;
    const setMessage = setContactMessage;
    const submitted = contactSubmitted;
    const setSubmitted = setContactSubmitted;
    const errorMsg = contactErrorMsg;
    const setErrorMsg = setContactErrorMsg;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !phone || !subject || !message) {
        setErrorMsg('Harap isi field wajib: Nama, No. Telp, Subjek, dan Pesan!');
        return;
      }
      setErrorMsg('');
      addAspirasi({
        name,
        phone,
        email: email || undefined,
        rantingId,
        subject,
        message
      });
      setSubmitted(true);
      // Reset fields
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');

      // Auto-clear success message after 5s
      setTimeout(() => setSubmitted(false), 5000);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeIn">
        {/* Contact Info & Mock Google Maps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Office Cards */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Sekretariat MWC NU Bungah</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Silakan kunjungi kantor pelayanan kami atau hubungi nomor kontak pengurus di bawah ini untuk layanan administrasi wakaf, rekomendasi kependidikan, dan LAZISNU.
            </p>

            <div className="space-y-3.5 text-xs text-slate-600 pt-2">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-tosca-600 shrink-0 mt-0.5" />
                <span>Gedung MWC NU Bungah Lt. 1-2, Jl. Raya Bungah No. 100, Kecamatan Bungah, Kabupaten Gresik, Jawa Timur, 61151</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-tosca-600" />
                <span className="font-mono">031-3948111 / 0812-3456-7802</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-tosca-600" />
                <span className="font-mono">mwc.bungah@nu.or.id</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Google Maps Styled in Green/Tosca */}
          <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Map className="w-4 h-4 text-tosca-600" />
                <span>Peta Lokasi Kantor MWC NU</span>
              </span>
              <span className="text-[10px] text-slate-400">Desa Bungah, Gresik</span>
            </div>

            {/* Custom styled clean map mockup */}
            <div className="h-56 bg-emerald-50/50 rounded-xl relative overflow-hidden border border-slate-100 flex items-center justify-center">
              {/* Abstract Map Lines representing rural streets */}
              <div className="absolute inset-0 opacity-15">
                <div className="absolute top-1/4 left-0 right-0 h-4 bg-slate-800 transform -rotate-6" />
                <div className="absolute bottom-1/3 left-0 right-0 h-6 bg-slate-800 transform rotate-12" />
                <div className="absolute left-1/3 top-0 bottom-0 w-5 bg-slate-800 transform -rotate-12" />
                <div className="absolute right-1/4 top-0 bottom-0 w-8 bg-slate-800 transform rotate-45" />
              </div>

              {/* Waterway representation (Bengawan Solo River next to Bungah) */}
              <div className="absolute right-0 bottom-0 top-0 w-16 bg-blue-100/50 -rotate-12 flex items-center justify-center">
                <span className="text-[8px] text-blue-400 font-mono tracking-widest uppercase rotate-90">S. BENGAWAN SOLO</span>
              </div>

              {/* Surrounding landmarks */}
              <div className="absolute top-4 left-6 text-[9px] bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-2xs font-bold text-slate-500">
                Alun-Alun Bungah
              </div>
              <div className="absolute bottom-6 right-24 text-[9px] bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-2xs font-bold text-slate-500">
                Jl. Raya Bungah-Gresik
              </div>

              {/* Pinpoint */}
              <div className="absolute flex flex-col items-center justify-center text-center animate-bounce">
                <MapPin className="w-8 h-8 text-tosca-700 fill-tosca-100" />
                <div className="mt-1 bg-tosca-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  Gedung MWC NU Bungah
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Aspiration Input form */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 text-base">Form Aspirasi & Pengaduan Warga</h3>
            <p className="text-xs text-slate-500 mt-1">
              Punya keluhan sarana ibadah rusak, butuh pendampingan sertifikasi wakaf, atau masukan program? Salurkan aspirasi Anda di sini. Aspirasi Anda akan masuk langsung ke dashboard CMS Pengurus MWC NU untuk segera diproses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span>Terima kasih! Aspirasi Anda berhasil dikirim dan tersimpan di database lokal. Pengurus akan segera memverifikasi laporan Anda.</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2.5">
                <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap (Wajib) *</label>
                <input
                  type="text"
                  placeholder="Ketik nama Anda..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nomor Telepon / WA (Wajib) *</label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Alamat Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="nama@email.com..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pilih Ranting Domisili Desa</label>
                <select
                  value={rantingId}
                  onChange={(e) => setRantingId(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-700 font-semibold"
                >
                  {rantings.filter(r => r.id !== 'mwc').map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Subjek Aspirasi *</label>
              <input
                type="text"
                placeholder="Contoh: Pengaduan Atap Musholla Bocor / Bantuan Sosial..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Isi Pesan Lengkap *</label>
              <textarea
                rows={5}
                placeholder="Tuliskan secara detail perihal laporan atau aspirasi yang ingin disampaikan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-slate-800 leading-relaxed font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-tosca-600 hover:bg-tosca-700 font-semibold text-white rounded-xl shadow-md transition-all text-xs flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Aspirasi Publik</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Main Page Router
  switch (activeTab) {
    case 'home': return renderHome();
    case 'profil': return renderProfil();
    case 'kader': return renderKader();
    case 'kegiatan': return renderKegiatan();
    case 'keuangan': return renderKeuangan();
    case 'koin_s3': return renderKoinS3();
    case 'persuratan': return renderPersuratan();
    case 'usaha': return renderUsaha();
    case 'sarana_ibadah': return renderSaranaIbadah();
    case 'sarana_pendidikan': return renderSaranaPendidikan();
    case 'berita': return renderBerita();
    case 'dokumentasi': return renderDokumentasi();
    case 'kontak': return renderKontak();
    default: return renderHome();
  }
}
