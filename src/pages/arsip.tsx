import React from 'react';
import ArsipView from '../components/ArsipView';
import { ArsipDokumen, UserRole } from '../types';

interface PageProps {
  arsipDocs: ArsipDokumen[];
  userRole: UserRole;
  onAddArsip: (doc: Omit<ArsipDokumen, 'id'>) => void;
  onDeleteArsip: (id: string) => void;
}

export default function ArsipPage({
  arsipDocs,
  userRole,
  onAddArsip,
  onDeleteArsip
}: PageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-[#142d1f] p-8 rounded-2xl text-white space-y-2 text-left relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xxs uppercase font-extrabold text-[#D4AF37] tracking-widest block font-mono">PERPUSTAKAAN DOKUMEN</span>
        <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight">Arsip Dokumen &amp; Surat Keputusan</h1>
        <p className="text-3xs md:text-xxs text-emerald-100 max-w-2xl leading-relaxed">
          Temukan dan unduh transparan seluruh laporan kerja pertanggungjawaban (LPJ), surat keputusan (SK) koordinasi ranting,AD/ART, dan SOP resmi MWCNU Bungah.
        </p>
      </div>

      <ArsipView 
        arsipList={arsipDocs} 
        role={userRole} 
        onAddArsip={onAddArsip} 
        onDeleteArsip={onDeleteArsip} 
      />
    </div>
  );
}
