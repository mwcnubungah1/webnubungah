import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle,
  Briefcase, 
  Search, 
  AlertTriangle,
  Award,
  CircleDollarSign
} from 'lucide-react';
import { ProgramKerja, UserRole } from '../types';

interface ProgerProps {
  programList: ProgramKerja[];
  role: UserRole;
  onAddProgram: (program: Omit<ProgramKerja, 'id' | 'realisasiAnggaran' | 'kegiatanTerbantu'>) => void;
  onUpdateProgram: (id: string, updates: Partial<ProgramKerja>) => void;
}

export default function ProgramKerjaView({
  programList,
  role,
  onAddProgram,
  onUpdateProgram
}: ProgerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [showAddProgram, setShowAddProgram] = useState(false);

  // Form states
  const [pNama, setPNama] = useState('');
  const [pPJ, setPPJ] = useState('');
  const [pAnggaran, setPAnggaran] = useState<number>(0);
  const [pTarget, setPTarget] = useState('');
  const [pMulai, setPMulai] = useState(new Date().toISOString().split('T')[0]);
  const [pSelesai, setPSelesai] = useState('');

  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  // Aggregators
  const totalAnggaranSet = programList.reduce((acc, curr) => acc + curr.anggaran, 0);
  const totalAnggaranReals = programList.reduce((acc, curr) => acc + curr.realisasiAnggaran, 0);
  const totalTuntas = programList.filter(p => p.status === 'Selesai').length;

  // Identify delayed programs (e.g. status = Tertunda, or status !== Selesai and timeline is passed)
  const delayedPrograms = programList.filter(p => p.status === 'Tertunda');

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const filteredPrograms = programList.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.penanggungJawab.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'Semua' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNama || !pPJ || pAnggaran <= 0) return;

    onAddProgram({
      nama: pNama,
      penanggungJawab: pPJ,
      anggaran: pAnggaran,
      target: pTarget || 'Meningkatkan kooptasi kader',
      timelineMulai: pMulai,
      timelineSelesai: pSelesai || new Date().toISOString().split('T')[0],
      status: 'Perencanaan',
      progress: 0
    });

    // Reset
    setPNama('');
    setPPJ('');
    setPAnggaran(0);
    setPTarget('');
    setPSelesai('');
    setShowAddProgram(false);
  };

  return (
    <div className="space-y-6" id="work-program-view">
      
      {/* Financial Highlight Headers for Proker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-gray-400 text-xxs font-extrabold uppercase tracking-wider block">Total Alokasi Rencana</span>
            <span className="text-lg font-mono font-bold text-gray-950 mt-1 block">{formatIDR(totalAnggaranSet)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-emerald-950">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-gray-400 text-xxs font-extrabold uppercase tracking-wider block">Tingkat Penyerapan Dana</span>
            <span className="text-lg font-mono font-bold text-[#C5A059] mt-1 block">{formatIDR(totalAnggaranReals)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-700">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <span className="text-gray-400 text-xxs font-extrabold uppercase tracking-wider block">Target Selesai</span>
            <span className="text-lg font-mono font-bold text-indigo-600 mt-1 block">{totalTuntas} / {programList.length} Program</span>
          </div>
        </div>
      </div>

      {/* Control row with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl text-xs font-semibold gap-1">
          {['Semua', 'Perencanaan', 'Berjalan', 'Selesai', 'Tertunda'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedStatus === st ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari program, penanggungjawab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.8 w-full text-xs text-gray-800 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
            />
          </div>

          {isAdminOrOfficer && (
            <button
              onClick={() => setShowAddProgram(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Usul Proker</span>
            </button>
          )}
        </div>
      </div>

      {/* Delayed / Alert Panel */}
      {delayedPrograms.length > 0 && selectedStatus === 'Semua' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-750 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-905">Informasi Keterlambatan Realisasi Program Kerja</h4>
            <p className="text-xxs text-amber-800">
              Sistem mendeteksi ada {delayedPrograms.length} program kerja yang sedang bernilai <strong>Tertunda</strong>. Harap lakukan reorganisasi rapat internal atau penyesuaian pendanaan.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Panel of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 text-xxs">Tidak ada program kerja yang memenuhi kriteria pencarian Anda.</div>
        ) : (
          filteredPrograms.map((prog) => {
            const isCompleted = prog.status === 'Selesai';
            const statusColor = 
              prog.status === 'Selesai' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              prog.status === 'Berjalan' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
              prog.status === 'Perencanaan' ? 'bg-slate-100 text-slate-700 border-slate-200' :
              'bg-amber-50 text-amber-800 border-amber-200';

            return (
              <div 
                key={prog.id} 
                className="bg-white p-5 rounded-2xl border border-gray-150/80 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono tracking-wider font-semibold block">{prog.id}</span>
                      <h4 className="text-xs font-bold text-gray-950 mt-1 leading-tight">{prog.nama}</h4>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${statusColor}`}>
                      {prog.status}
                    </span>
                  </div>

                  {/* Slider Progress Controls */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xxs text-gray-500 font-semibold">
                      <span>Progres Realisasi</span>
                      <span>{prog.progress}%</span>
                    </div>

                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-gray-100">
                        <div 
                          style={{ width: `${prog.progress}%` }} 
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            prog.status === 'Tertunda' ? 'bg-amber-500' : 'bg-emerald-600'
                          } transition-all duration-300`}
                        />
                      </div>
                    </div>

                    {isAdminOrOfficer && !isCompleted && (
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">Sesuaikan kemajuan realisasi fisik:</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={prog.progress}
                          onChange={(e) => onUpdateProgram(prog.id, { 
                            progress: Number(e.target.value),
                            status: Number(e.target.value) === 100 ? 'Selesai' : prog.status === 'Perencanaan' ? 'Berjalan' : prog.status
                          })}
                          className="w-24 accent-emerald-700 cursor-pointer h-1 rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Targets Section */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50 space-y-1 text-xxs">
                    <span className="font-extrabold text-emerald-805 block">Target Milestones:</span>
                    <p className="text-gray-600">{prog.target}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-xxs text-gray-400 font-sans">
                  <div>
                    <span className="block font-bold text-gray-900">Dana Pagu: {formatIDR(prog.anggaran)}</span>
                    <span className="text-3xs block leading-none mt-0.5">Diserap: {formatIDR(prog.realisasiAnggaran)}</span>
                  </div>

                  <div className="text-right">
                    <span className="block">Penanggung jawab: <strong>{prog.penanggungJawab}</strong></span>
                    <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">{prog.timelineMulai} s/d {prog.timelineSelesai}</span>
                  </div>
                </div>

                {/* Simulated action - Increase expenditure/fund usage */}
                {isAdminOrOfficer && prog.status === 'Berjalan' && (
                  <div className="mt-3 pt-2.5 border-t border-dashed flex justify-end gap-1.5">
                    <button
                      onClick={() => {
                        const amount = Number(prompt("Masukkan besaran realisasi serapan anggaran tambahan (Rupiah):"));
                        if (amount && amount > 0) {
                          onUpdateProgram(prog.id, {
                            realisasiAnggaran: prog.realisasiAnggaran + amount
                          });
                        }
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded cursor-pointer"
                    >
                      + Serap Kas Proker
                    </button>
                    <button
                      onClick={() => onUpdateProgram(prog.id, { status: prog.status === 'Berjalan' ? 'Tertunda' : 'Berjalan' })}
                      className="bg-amber-50 text-amber-800 text-[10px] px-2 py-1 rounded cursor-pointer"
                    >
                      {prog.status === 'Berjalan' ? 'Tunda Proker' : 'Lanjutkan'}
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* POP-UP USULKAN PROKER BARU */}
      {showAddProgram && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Usulkan Agenda Program Kerja Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Nama Program Kerja</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pembekalan Guru TPQ Aswaja"
                  value={pNama}
                  onChange={(e) => setPNama(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Penanggung Jawab / Pengampu (Lembaga/Banom/Person)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lembaga Dakwah NU (LDNU)"
                  value={pPJ}
                  onChange={(e) => setPPJ(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Anggaran Pagu (Rupiah)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000000"
                    value={pAnggaran || ''}
                    onChange={(e) => setPAnggaran(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Target Penyelesaian</label>
                  <input
                    type="date"
                    required
                    value={pSelesai}
                    onChange={(e) => setPSelesai(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Detail Target Capaian (Milestone)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Terbentuknya 10 unit TPQ bersertifikasi Aswaja"
                  value={pTarget}
                  onChange={(e) => setPTarget(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddProgram(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 cursor-pointer"
                >
                  Usulkan Program
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
