import React from 'react';
import DokumentasiView from '../components/DokumentasiView';
import { DokumentasiKegiatan, ProgramKerja, AnggotaPengurus, UserRole } from '../types';

interface PageProps {
  dokumentasiList: DokumentasiKegiatan[];
  programList: ProgramKerja[];
  anggotaList: AnggotaPengurus[];
  userRole: UserRole;
  onAddDokumentasi: (doku: Omit<DokumentasiKegiatan, 'id'>) => void;
}

export default function AlbumDokumentasiPage({
  dokumentasiList,
  programList,
  anggotaList,
  userRole,
  onAddDokumentasi
}: PageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 p-8 rounded-2xl text-white space-y-2 text-left relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xxs uppercase font-extrabold text-[#D4AF37] tracking-widest block font-mono">JEJAK KHIDMAH NYATA</span>
        <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight">Album Dokumentasi &amp; Galeri Syiar</h1>
        <p className="text-3xs md:text-xxs text-emerald-100 max-w-2xl leading-relaxed">
          Kilas dokumentasi khidmah dakwah santri, syarah bahtsul masail, santunan LAZISNU, baksos kesehatan Ansor, hingga rapat koordinasi pimpinan harian.
        </p>
      </div>

      <DokumentasiView 
        dokumentasiList={dokumentasiList} 
        programList={programList} 
        anggotaList={anggotaList} 
        role={userRole} 
        onAddDokumentasi={onAddDokumentasi} 
      />
    </div>
  );
}
