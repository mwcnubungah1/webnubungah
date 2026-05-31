import React from 'react';
import ProgramKerjaView from '../components/ProgramKerjaView';
import { ProgramKerja, UserRole } from '../types';

interface PageProps {
  programList: ProgramKerja[];
  userRole: UserRole;
  onAddProgram: (program: Omit<ProgramKerja, 'id' | 'realisasiAnggaran' | 'kegiatanTerbantu'>) => void;
  onUpdateProgram: (id: string, updates: Partial<ProgramKerja>) => void;
}

export default function ProgramKerjaPage({
  programList,
  userRole,
  onAddProgram,
  onUpdateProgram
}: PageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 p-8 rounded-2xl text-white space-y-2 text-left relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-45px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xxs uppercase font-extrabold text-[#D4AF37] tracking-widest block font-mono">REALISASI PROGRAM ADIL</span>
        <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight">Rencana &amp; Realisasi Program Kerja</h1>
        <p className="text-3xs md:text-xxs text-emerald-100 max-w-2xl leading-relaxed">
          Pantau progres fisik pelaksanaan program penguatan ranting, pemberdayaan ummat, serta penyaluran dana sosial keagamaan se-Kecamatan Bungah.
        </p>
      </div>

      <ProgramKerjaView 
        programList={programList} 
        role={userRole} 
        onAddProgram={onAddProgram} 
        onUpdateProgram={onUpdateProgram} 
      />
    </div>
  );
}
