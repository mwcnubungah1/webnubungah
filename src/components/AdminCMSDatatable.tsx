import React from 'react';
import { Trash2, Edit, CheckCircle, Clock, CheckCircle2, FileText, Globe, HelpCircle, Building, Award, School } from 'lucide-react';
import { 
  ModelType, Ranting,
  Kader, Kegiatan, TransparansiDana, KoinS3, Persuratan, Usaha, 
  SaranaIbadah, SaranaPendidikan, Berita, Dokumentasi, Aspirasi, Pengurus
} from '../types';

interface AdminCMSDatatableProps {
  activeModel: ModelType;
  rantings: Ranting[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAspirasiStatusChange: (id: string, newStatus: 'Masuk' | 'Proses' | 'Selesai') => void;

  // Lists of records
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

export default function AdminCMSDatatable({
  activeModel,
  rantings,
  onEdit,
  onDelete,
  onAspirasiStatusChange,
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
}: AdminCMSDatatableProps) {

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRantingName = (id?: string) => {
    if (!id || id === 'mwc') return 'Tingkat MWC';
    const r = rantings.find(item => item.id === id);
    return r ? r.name : 'Ranting NU';
  };

  const getDistributionTargetLabel = (target: string) => {
    if (!target) return '';
    if (target.trim().startsWith('[') && target.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(target);
        if (Array.isArray(parsed)) {
          return `${parsed.length} Pilar: ${parsed.map((p: any) => p.text).filter(Boolean).join(', ')}`;
        }
      } catch (e) {}
    }
    return target;
  };

  // Shared Actions Renderer
  const renderActions = (id: string) => {
    return (
      <div className="flex items-center justify-end space-x-2">
        <button 
          onClick={() => onEdit(id)} 
          className="p-1 text-tosca-600 hover:bg-tosca-50 rounded"
          title="Ubah Data"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => onDelete(id)} 
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Hapus Data secara Permanen"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  switch (activeModel) {
    case 'kader':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Ranting Desa</th>
              <th className="px-5 py-3">Banom</th>
              <th className="px-5 py-3">Jabatan Pokok</th>
              <th className="px-5 py-3">No. Telp</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kaderList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center space-x-2">
                  {item.photoUrl && <img src={item.photoUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md shrink-0" />}
                  <span>{item.name}</span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{getRantingName(item.rantingId)}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 bg-tosca-50 text-tosca-700 font-bold rounded text-[10px]">
                    {item.banom}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500 font-medium italic">{item.role}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{item.phone}</td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'pengurus':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Jabatan</th>
              <th className="px-5 py-3">Tingkatan</th>
              <th className="px-5 py-3">Kaderisasi</th>
              <th className="px-5 py-3">No. HP</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pengurusList?.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center space-x-2">
                  <img src={item.photoUrl || 'https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png'} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md shrink-0 border border-slate-200" />
                  <span>{item.name}</span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{item.role}</td>
                <td className="px-5 py-3.5 text-slate-600">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.category === 'MWC' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {item.category === 'MWC' ? 'MWC' : `Ranting (${getRantingName(item.rantingId)})`}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{item.kaderisasiStatus}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{item.phone}</td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'kegiatan':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Nama Kegiatan</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Lokasi</th>
              <th className="px-5 py-3">Penyelenggara</th>
              <th className="px-5 py-3">Sumber Dana</th>
              <th className="px-5 py-3 text-right">Anggaran</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kegiatanList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800">{item.title}</td>
                <td className="px-5 py-3.5 text-slate-500 font-mono">{item.date}</td>
                <td className="px-5 py-3.5 text-slate-600 truncate max-w-[120px]">{item.location}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-700">{item.organizer}</td>
                <td className="px-5 py-3.5 font-medium text-slate-500">{item.fundingSource}</td>
                <td className="px-5 py-3.5 font-bold text-tosca-700 text-right">{formatRupiah(item.budget)}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'keuangan':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Jenis</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Rincian Keterangan</th>
              <th className="px-5 py-3 text-right">Jumlah</th>
              <th className="px-5 py-3">PIC</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kasList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 text-slate-500 font-mono">{item.date}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.type === 'Masuk' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-semibold">{item.category}</td>
                <td className="px-5 py-3.5 text-slate-600 max-w-[150px] truncate" title={item.description}>
                  <div className="flex items-center space-x-2">
                    {item.imageUrl && <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md shrink-0" />}
                    <span>{item.description}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-bold text-slate-800 text-right">{formatRupiah(item.amount)}</td>
                <td className="px-5 py-3.5 text-slate-500 font-medium">{item.pic}</td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'koin_s3':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Bulan</th>
              <th className="px-5 py-3">Ranting NU</th>
              <th className="px-5 py-3 text-right">Perolehan</th>
              <th className="px-5 py-3">Sasaran Penyaluran</th>
              <th className="px-5 py-3 text-right">Biaya Penyaluran</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {koinList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-mono font-bold text-slate-700">{item.month}</td>
                <td className="px-5 py-3.5 text-slate-600 font-semibold">{getRantingName(item.rantingId)}</td>
                <td className="px-5 py-3.5 font-bold text-emerald-600 text-right">{formatRupiah(item.amount)}</td>
                <td className="px-5 py-3.5 text-slate-500 italic max-w-[150px] truncate">
                  <div className="flex items-center space-x-2">
                    {item.imageUrl && <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md shrink-0" />}
                    <span>{getDistributionTargetLabel(item.distributionTarget)}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-bold text-amber-600 text-right">{formatRupiah(item.distributionAmount)}</td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'aspirasi':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Nama Pengirim</th>
              <th className="px-5 py-3">Kontak WA</th>
              <th className="px-5 py-3">Ranting</th>
              <th className="px-5 py-3">Subjek Laporan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-center">Ubah Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {aspirasiList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800">{item.name}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{item.phone}</td>
                <td className="px-5 py-3.5 text-slate-600">{getRantingName(item.rantingId)}</td>
                <td className="px-5 py-3.5 text-slate-600 max-w-[150px] truncate" title={item.message}>
                  <div className="flex items-center space-x-2">
                    {item.imageUrl && <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md shrink-0" />}
                    <span>{item.subject}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'Masuk' ? 'bg-blue-50 text-blue-700' : item.status === 'Proses' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <div className="inline-flex space-x-1">
                    <button 
                      onClick={() => onAspirasiStatusChange(item.id, 'Proses')}
                      className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-[9px] font-bold"
                    >
                      Proses
                    </button>
                    <button 
                      onClick={() => onAspirasiStatusChange(item.id, 'Selesai')}
                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold"
                    >
                      Selesai
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'persuratan':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">No. Surat</th>
              <th className="px-5 py-3">Jenis</th>
              <th className="px-5 py-3">Kode</th>
              <th className="px-5 py-3">Instansi</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Perihal</th>
              <th className="px-5 py-3">Tembusan</th>
              <th className="px-5 py-3">Lampiran</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suratList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold font-mono text-slate-800">{item.letterNumber}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.type === 'Masuk' ? 'bg-sky-50 text-sky-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-bold text-slate-600">{item.code}</td>
                <td className="px-5 py-3.5 font-medium text-slate-700">{item.senderOrRecipient}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{item.date}</td>
                <td className="px-5 py-3.5 text-slate-600 font-semibold">{item.subject}</td>
                <td className="px-5 py-3.5 text-slate-400 font-medium italic">{item.tembusan || '-'}</td>
                <td className="px-5 py-3.5">
                  {item.attachmentUrl ? (
                    <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="text-tosca-600 hover:underline font-bold inline-flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Lampiran</span>
                    </a>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'usaha':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Nama Usaha</th>
              <th className="px-5 py-3">Sektor</th>
              <th className="px-5 py-3">Lokasi</th>
              <th className="px-5 py-3">Pengelola</th>
              <th className="px-5 py-3 text-right">Omzet Bulanan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usahaList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center space-x-2">
                  {item.imageUrl && <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md" />}
                  <span>{item.name}</span>
                </td>
                <td className="px-5 py-3.5 font-bold text-tosca-700">{item.type}</td>
                <td className="px-5 py-3.5 text-slate-600 truncate max-w-[150px]">{item.location}</td>
                <td className="px-5 py-3.5 font-medium text-slate-700">{item.manager}</td>
                <td className="px-5 py-3.5 font-bold text-emerald-600 text-right">{formatRupiah(item.revenue)}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'sarana_ibadah':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Tipe</th>
              <th className="px-5 py-3">Takmir Utama</th>
              <th className="px-5 py-3">Imam 1</th>
              <th className="px-5 py-3">Imam 2</th>
              <th className="px-5 py-3">Afiliasi NU</th>
              <th className="px-5 py-3">Status Tanah</th>
              <th className="px-5 py-3">Ranting</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {saranaIbadahList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center space-x-2">
                  {item.imageUrl && <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md shrink-0" />}
                  <span>{item.name}</span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-slate-600">{item.type}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-700">{item.takmir}</td>
                <td className="px-5 py-3.5 text-slate-500 font-medium">{item.imam1}</td>
                <td className="px-5 py-3.5 text-slate-500 font-medium">{item.imam2}</td>
                <td className="px-5 py-3.5"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[9px]">{item.nuAffiliation}</span></td>
                <td className="px-5 py-3.5 text-slate-600 font-medium">{item.landStatus}</td>
                <td className="px-5 py-3.5 text-slate-600 font-bold">{getRantingName(item.rantingId)}</td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'sarana_pendidikan':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Nama Sekolah</th>
              <th className="px-5 py-3">Jenjang</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Pimpinan</th>
              <th className="px-5 py-3 text-right">Jumlah Siswa</th>
              <th className="px-5 py-3">No. Kontak</th>
              <th className="px-5 py-3">Kondisi Fisik</th>
              <th className="px-5 py-3">Ranting</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {saranaPendidikanList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center space-x-2">
                  {item.imageUrl && <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md shrink-0" />}
                  <span>{item.name}</span>
                </td>
                <td className="px-5 py-3.5 font-bold text-tosca-700">{item.level}</td>
                <td className="px-5 py-3.5 text-slate-600 font-semibold">{item.status}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-700">{item.principal}</td>
                <td className="px-5 py-3.5 font-bold text-slate-800 text-right font-mono">{item.studentCount}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{item.phone || '-'}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    item.condition === 'Baik' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600 font-bold">{getRantingName(item.rantingId)}</td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'berita':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Judul Berita</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Penulis</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {beritaList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center space-x-2">
                  {item.imageUrl && <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-6 h-6 object-cover rounded-md" />}
                  <span className="truncate max-w-[200px]" title={item.title}>{item.title}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 bg-tosca-50 text-tosca-700 font-bold rounded text-[10px]">
                    {item.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-slate-700">{item.author}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{item.date}</td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'dokumentasi':
      return (
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <th className="px-5 py-3">Judul Media</th>
              <th className="px-5 py-3">Tipe</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Pratinjau</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dokumentasiList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-bold text-slate-800 truncate max-w-[200px]">{item.title}</td>
                <td className="px-5 py-3.5 font-bold text-slate-500">{item.type}</td>
                <td className="px-5 py-3.5 font-semibold text-tosca-700">{item.category}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">{item.date}</td>
                <td className="px-5 py-3.5">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-tosca-600 hover:underline font-bold inline-flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>Lihat Media</span>
                    </a>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">{renderActions(item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    default:
      return (
        <div className="p-8 text-center bg-white border border-dashed rounded-lg text-slate-400 text-xs">
          Tidak ada data untuk model ini.
        </div>
      );
  }
}
