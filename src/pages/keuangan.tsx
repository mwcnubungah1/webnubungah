import React from 'react';
import KeuanganView from '../components/KeuanganView';
import { TransaksiKeuangan, UserRole } from '../types';

interface PageProps {
  transaksiList: TransaksiKeuangan[];
  userRole: UserRole;
  onAddTransaksi: (tx: Omit<TransaksiKeuangan, 'id' | 'auditTrail'>) => void;
  onUpdateTransaksi: (id: string, updates: Partial<TransaksiKeuangan>) => void;
}

export default function KeuanganPage({
  transaksiList,
  userRole,
  onAddTransaksi,
  onUpdateTransaksi
}: PageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 p-8 rounded-2xl text-white space-y-2 text-left relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xxs uppercase font-extrabold text-[#D4AF37] tracking-widest block font-mono">TRANSPARANSI KEUANGAN MUTLAK</span>
        <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight">Kanal Akuntabilitas &amp; Buku Kas Umum</h1>
        <p className="text-3xs md:text-xxs text-emerald-100 max-w-2xl leading-relaxed">
          Cek rincian pemasukan KOIN NU, iuran ranting, donasi sosial, serta penyaluran dana operasional dan kegiatan santri secara transparan dan terverifikasi.
        </p>
      </div>

      <KeuanganView 
        transaksiList={transaksiList} 
        role={userRole} 
        onAddTransaksi={onAddTransaksi} 
        onUpdateTransaksi={onUpdateTransaksi} 
      />
    </div>
  );
}
