import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  CheckSquare, 
  Archive, 
  BarChart, 
  Vote, 
  Edit3, 
  Clock, 
  FileText,
  MessageSquareOff,
  UserCheck
} from 'lucide-react';
import { AgendaMusyawarah, UserRole, VotingMusyawarah } from '../types';
import CloudinaryUpload from './CloudinaryUpload';

interface MusyawarahProps {
  agendaList: AgendaMusyawarah[];
  role: UserRole;
  onAddAgenda: (agenda: Omit<AgendaMusyawarah, 'id' | 'absensi'>) => void;
  onUpdateAgenda: (id: string, updates: Partial<AgendaMusyawarah>) => void;
}

export default function MusyawarahView({
  agendaList,
  role,
  onAddAgenda,
  onUpdateAgenda
}: MusyawarahProps) {
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaMusyawarah>(agendaList[0]);
  const [showAddAgenda, setShowAddAgenda] = useState(false);
  
  // Edit Notulensi state
  const [isEditingNotulen, setIsEditingNotulen] = useState(false);
  const [tempNotulen, setTempNotulen] = useState(selectedAgenda?.notulensi || '');
  const [tempKeputusan, setTempKeputusan] = useState(selectedAgenda?.keputusanHasil || '');

  // Form states - Musyawarah
  const [aJudul, setAJudul] = useState('');
  const [aTanggal, setATanggal] = useState(new Date().toISOString().split('T')[0]);
  const [aWaktu, setAWaktu] = useState('19:30 WIB');
  const [aQuestion, setAQuestion] = useState('');
  const [aOptionsRaw, setAOptionsRaw] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  // Handle meeting addition
  const handleSubmitAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aJudul) return;

    // Convert raw choices to options
    let votingObj: VotingMusyawarah | undefined = undefined;
    if (aQuestion && aOptionsRaw) {
      const parsedOptions = aOptionsRaw.split(',').map((opt, i) => ({
        id: String(i + 1),
        teks: opt.trim(),
        suara: 0
      }));
      votingObj = {
        id: `VOTT-${Date.now()}`,
        pertanyaan: aQuestion,
        pilihan: parsedOptions,
        status: 'Aktif',
        totalSuara: 0,
        waktuMulai: new Date().toISOString()
      };
    }

    onAddAgenda({
      judul: aJudul,
      tanggal: aTanggal,
      waktu: aWaktu,
      status: 'Belum Mulai',
      notulensi: 'Agenda belum dimulai. Menunggu kesiapan moderator rapat.',
      keputusanHasil: 'Belum ada ketetapan.',
      voting: votingObj,
      fileUrl: uploadedFileUrl || undefined
    });

    // Reset Form
    setAJudul('');
    setAQuestion('');
    setAOptionsRaw('');
    setUploadedFileUrl('');
    setShowAddAgenda(false);
  };

  // Live cast vote
  const handleVote = (optionId: string) => {
    if (!selectedAgenda?.voting) return;

    // Increment vote count inside option
    const updatedPilihan = selectedAgenda.voting.pilihan.map(p => {
      if (p.id === optionId) {
        return { ...p, suara: p.suara + 1 };
      }
      return p;
    });

    const updatedVoting: VotingMusyawarah = {
      ...selectedAgenda.voting,
      pilihan: updatedPilihan,
      totalSuara: selectedAgenda.voting.totalSuara + 1
    };

    onUpdateAgenda(selectedAgenda.id, { voting: updatedVoting });
    
    // Refresh local selection in memory
    setSelectedAgenda(prev => ({
      ...prev,
      voting: updatedVoting
    }));
  };

  // Close poll/voting
  const handleClosePoll = () => {
    if (!selectedAgenda?.voting) return;
    const updatedVoting: VotingMusyawarah = {
      ...selectedAgenda.voting,
      status: 'Ditutup'
    };
    onUpdateAgenda(selectedAgenda.id, { voting: updatedVoting });
    setSelectedAgenda(prev => ({ ...prev, voting: updatedVoting }));
  };

  // Attendance marker
  const handleToggleAttendance = (attendeeName: string, level: 'Hadir' | 'Izin' | 'Sakit') => {
    if (!selectedAgenda?.absensi) return;

    const listCopy = [...selectedAgenda.absensi];
    const index = listCopy.findIndex(user => user.nama === attendeeName);
    if (index >= 0) {
      listCopy[index] = {
        ...listCopy[index],
        kehadiran: level,
        waktuHadir: level === 'Hadir' ? new Date().toTimeString().split(' ')[0].slice(0, 5) : undefined
      };
    } else {
      // Add new roster attendance
      listCopy.push({
        nama: attendeeName,
        jabatan: 'Pengurus Ranting / Banom',
        kehadiran: level,
        waktuHadir: level === 'Hadir' ? new Date().toTimeString().split(' ')[0].slice(0, 5) : undefined
      });
    }

    onUpdateAgenda(selectedAgenda.id, { absensi: listCopy });
    setSelectedAgenda(prev => ({ ...prev, absensi: listCopy }));
  };

  // Save editable Notulen harian
  const handleSaveNotulen = () => {
    onUpdateAgenda(selectedAgenda.id, {
      notulensi: tempNotulen,
      keputusanHasil: tempKeputusan
    });
    setSelectedAgenda(prev => ({
      ...prev,
      notulensi: tempNotulen,
      keputusanHasil: tempKeputusan
    }));
    setIsEditingNotulen(false);
  };

  // Helper calculation
  const totalPresence = selectedAgenda?.absensi?.filter(a => a.kehadiran === 'Hadir').length || 0;
  const quorumMet = totalPresence >= 3;

  return (
    <div className="space-y-6" id="digital-musyawarah-board">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="space-y-0.5 text-left">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5">
            <Vote className="h-4 w-4" />
            <span>Sistem Musyawarah Digital (E-Rapat)</span>
          </h2>
          <p className="text-xxs text-gray-400">Pencatatan notulensi resmi, presensi kehadiran qorun, dan pemungutan suara voting hukum aswaja.</p>
        </div>

        {isAdminOrOfficer && (
          <button
            onClick={() => setShowAddAgenda(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Jadwalkan E-Rapat</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Agendas list */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs lg:col-span-1 space-y-3 h-[450px] overflow-y-auto">
          <h3 className="text-xxs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Daftar Agenda Musyawarah</h3>
          
          <div className="space-y-2 text-left">
            {agendaList.map((ag) => {
              const isSelected = selectedAgenda?.id === ag.id;
              const statusCol = 
                ag.status === 'Selesai' ? 'bg-emerald-50 text-emerald-800' :
                ag.status === 'Berlangsung' ? 'bg-[#D4AF37]/10 text-emerald-900 border-l-2 border-[#D4AF37]' :
                'bg-slate-100 text-slate-500';

              return (
                <div 
                  key={ag.id}
                  onClick={() => {
                    setSelectedAgenda(ag);
                    setTempNotulen(ag.notulensi || '');
                    setTempKeputusan(ag.keputusanHasil || '');
                    setIsEditingNotulen(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'bg-emerald-550/10 border-emerald-500' : 'border-gray-100 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${statusCol}`}>{ag.status}</span>
                  <h4 className="text-xs font-bold text-gray-950 mt-2 leading-tight line-clamp-2">{ag.judul}</h4>
                  <div className="flex justify-between items-center text-3xs text-gray-400 mt-2 font-mono">
                    <span>{ag.tanggal}</span>
                    <span>{ag.waktu}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Workspace */}
        {selectedAgenda ? (
          <div className="lg:col-span-3 space-y-6">
            
            {/* Agenda Details & Controls */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-left space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">RUANG RAPAT ELEKTRONIK</span>
                  <h3 className="text-xs font-bold text-gray-950 leading-tight block">{selectedAgenda.judul}</h3>
                  <div className="flex gap-4 text-xxs text-gray-500 font-sans mt-1">
                    <span>Tanggal: <strong>{selectedAgenda.tanggal}</strong></span>
                    <span>Waktu Mulai: <strong>{selectedAgenda.waktu}</strong></span>
                  </div>
                  {selectedAgenda.fileUrl && (
                    <div className="pt-2">
                      <a 
                        href={selectedAgenda.fileUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-805 border border-indigo-150 rounded-xl px-3 py-1.5 text-xxs font-bold cursor-pointer transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Unduh Dokumen Bahtsul Masail / Makalah Rapat (Cloudinary)</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {isAdminOrOfficer && selectedAgenda.status !== 'Selesai' && (
                    <>
                      {selectedAgenda.status === 'Belum Mulai' ? (
                        <button
                          onClick={() => {
                            onUpdateAgenda(selectedAgenda.id, { status: 'Berlangsung' });
                            setSelectedAgenda(prev => ({ ...prev, status: 'Berlangsung' }));
                          }}
                          className="bg-indigo-600 text-white hover:bg-indigo-700 text-xxs px-3 py-1.5 font-bold rounded-xl cursor-pointer"
                        >
                          Mulai Rapat (Live)
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onUpdateAgenda(selectedAgenda.id, { 
                              status: 'Selesai',
                              absensi: selectedAgenda.absensi.length > 0 ? selectedAgenda.absensi : [
                                { nama: 'KH. Sholeh Qosim, M.Pd.I', jabatan: 'Rais Syuriyah', kehadiran: 'Hadir', waktuHadir: '08:15' },
                                { nama: 'H. Achmad Shofwan, S.Ag', jabatan: 'Ketua Tanfidziyah', kehadiran: 'Hadir', waktuHadir: '08:20' },
                                { nama: 'Drs. H. Choirul Anam', jabatan: 'Sekretaris', kehadiran: 'Hadir', waktuHadir: '08:10' }
                              ]
                            });
                            setSelectedAgenda(prev => ({ 
                              ...prev, 
                              status: 'Selesai',
                              absensi: selectedAgenda.absensi.length > 0 ? selectedAgenda.absensi : [
                                { nama: 'KH. Sholeh Qosim, M.Pd.I', jabatan: 'Rais Syuriyah', kehadiran: 'Hadir', waktuHadir: '08:15' },
                                { nama: 'H. Achmad Shofwan, S.Ag', jabatan: 'Ketua Tanfidziyah', kehadiran: 'Hadir', waktuHadir: '08:20' },
                                { nama: 'Drs. H. Choirul Anam', jabatan: 'Sekretaris', kehadiran: 'Hadir', waktuHadir: '08:10' }
                              ]
                            }));
                          }}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 text-xxs px-3 py-1.5 font-bold rounded-xl cursor-pointer"
                        >
                          Selesaikan Rapat
                        </button>
                      )}
                    </>
                  )}
                  <span className={`text-xxs px-3 py-1.5 font-bold rounded-xl ${
                    selectedAgenda.status === 'Selesai' ? 'bg-emerald-50 text-emerald-800' : 'bg-indigo-50 text-indigo-800'
                  }`}>
                    {selectedAgenda.status}
                  </span>
                </div>
              </div>

              {/* Roster Absensi list */}
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xxs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <UserCheck className="h-4.5 w-4.5 text-emerald-600" /> Pre-Sensi Pengurus Ranting / Harian ({totalPresence} Hadir)
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${quorumMet ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {quorumMet ? 'Quorum Rapat Sah' : 'Menunggu Batas Minimal Quorum (3 Orang)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Common preset of organizers that can be toggled presency */}
                  {['KH. Sholeh Qosim, M.Pd.I', 'H. Achmad Shofwan, S.Ag', 'Drs. H. Choirul Anam', 'H. Mukhlis Al-Hakim, S.E.'].map((user) => {
                    const row = selectedAgenda.absensi?.find(a => a.nama === user);
                    const currentStatus = row?.kehadiran || 'Izin';

                    return (
                      <div key={user} className="p-2.5 bg-white rounded-lg border border-gray-100 space-y-1.5 text-center flex flex-col justify-between shadow-xxs">
                        <span className="font-semibold text-gray-900 block truncate leading-tight">{user.split(',')[0]}</span>
                        <div className="flex gap-1 justify-center">
                          {['Hadir', 'Izin'].map((lvl) => {
                            const active = currentStatus === lvl;
                            return (
                              <button
                                key={lvl}
                                disabled={selectedAgenda.status === 'Selesai'}
                                onClick={() => handleToggleAttendance(user, lvl as any)}
                                className={`text-[9px] px-2 py-1 rounded select-none cursor-pointer ${
                                  active 
                                    ? lvl === 'Hadir' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-gray-700'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notulensi & Resolution Content editable */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xxs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Edit3 className="h-4 w-4 text-[#C5A059]" /> Draft Notula & Ketetapan Hukum Hasil
                  </span>
                  
                  {isAdminOrOfficer && selectedAgenda.status !== 'Selesai' && (
                    <>
                      {isEditingNotulen ? (
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => setIsEditingNotulen(false)} 
                            className="text-xxs text-gray-400 hover:underline cursor-pointer"
                          >
                            Batal
                          </button>
                          <button 
                            onClick={handleSaveNotulen} 
                            className="text-xxs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded-lg cursor-pointer"
                          >
                            Simpan Draft
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setTempNotulen(selectedAgenda.notulensi || '');
                            setTempKeputusan(selectedAgenda.keputusanHasil || '');
                            setIsEditingNotulen(true);
                          }} 
                          className="text-xxs text-emerald-800 font-bold hover:underline"
                        >
                          Tulis Notulan Rapat
                        </button>
                      )}
                    </>
                  )}
                </div>

                {isEditingNotulen ? (
                  <div className="space-y-3.5 text-xs text-left">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Catatan Jalannya Rapat (Notula)</label>
                      <textarea
                        rows={3}
                        value={tempNotulen}
                        onChange={(e) => setTempNotulen(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Ketetapan Hukum / Rekap Hasil Rapat</label>
                      <textarea
                        rows={2}
                        value={tempKeputusan}
                        onChange={(e) => setTempKeputusan(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-4 bg-emerald-50/20 border border-emerald-50/50 rounded-xl space-y-2">
                      <span className="font-bold text-emerald-900 block border-b pb-1">Notula Sidang Rapat:</span>
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedAgenda.notulensi || 'Belum ada catatan rapat.'}</p>
                    </div>

                    <div className="p-4 bg-indigo-50/20 border border-indigo-50/50 rounded-xl space-y-2">
                      <span className="font-bold text-indigo-900 block border-b pb-1">Konsensus Resmi / Fatwa Aswaja:</span>
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedAgenda.keputusanHasil || 'Ketetapan hukum dispesifikasikan saat sidang selesai.'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Connected real Interactive Voting widget */}
              {selectedAgenda.voting && (
                <div className="border-t border-gray-100 pt-5 space-y-4">
                  <span className="text-xxs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Vote className="h-4.5 w-4.5 text-emerald-600" /> PEMILU / VOTING MATERI RAPAT PENGURUS
                  </span>

                  <div className="p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-650/15 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 flex-wrap gap-2">
                      <p className="text-xs font-bold text-[#D4AF37] leading-tight max-w-[80%]">
                        PERTANYAAN: {selectedAgenda.voting.pertanyaan}
                      </p>
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                        selectedAgenda.voting.status === 'Aktif' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        Poling: {selectedAgenda.voting.status}
                      </span>
                    </div>

                    {/* Poll items */}
                    <div className="space-y-4">
                      {selectedAgenda.voting.pilihan.map((p) => {
                        const scoreCount = p.suara;
                        const total = selectedAgenda.voting?.totalSuara || 1;
                        const pct = Math.round((scoreCount / total) * 100) || 0;

                        return (
                          <div key={p.id} className="space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-white/90 font-medium">{p.teks}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-gray-400">({scoreCount} Suara)</span>
                                <span className="font-sans font-bold text-[#D4AF37] w-10 text-right">{pct}%</span>
                              </div>
                            </div>

                            {/* visual progress bar */}
                            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden flex items-center justify-between">
                              <div 
                                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            {/* Click to vote button */}
                            {selectedAgenda.voting?.status === 'Aktif' && (
                              <div className="flex justify-end pt-1">
                                <button
                                  onClick={() => handleVote(p.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white text-[9px] font-bold py-0.5 px-3 rounded select-none cursor-pointer"
                                >
                                  Pilih Opsi &amp; Vote
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/10 pt-3 mt-4 flex justify-between items-center text-3xs text-gray-400 font-mono">
                      <span>Total suara masuk: <strong>{selectedAgenda.voting.totalSuara}</strong> pemilih terkonfirmasi qorun</span>
                      {isAdminOrOfficer && selectedAgenda.voting.status === 'Aktif' && (
                        <button
                          onClick={handleClosePoll}
                          className="bg-red-650 hover:bg-red-750 text-white font-bold px-2.5 py-1 rounded"
                        >
                          Tutup Voting (Kunci Rekap)
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="lg:col-span-3 bg-white p-12 text-center text-gray-400 text-xxs">
            Silakan pilih agenda musyawarah tingkat kelurahan/ranting di panel kiri.
          </div>
        )}

      </div>

      {/* POP-UP FORM JADWALKAN RAPAT */}
      {showAddAgenda && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Jadwal Agenda Musyawarah Baru</h3>
            <form onSubmit={handleSubmitAgenda} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Nama / Agenda Utama Rapat</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pembahasan Dana Korban Bencana Sosial"
                  value={aJudul}
                  onChange={(e) => setAJudul(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Hari & Tanggal Rapat</label>
                  <input
                    type="date"
                    required
                    value={aTanggal}
                    onChange={(e) => setATanggal(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Jam / Waktu Sidang</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 19:30 WIB s/d selesai"
                    value={aWaktu}
                    onChange={(e) => setAWaktu(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>

              {/* Optional Poll attachment to meeting */}
              <div className="border bg-slate-50 p-4 rounded-xl border-gray-150 space-y-2.5">
                <span className="font-bold text-emerald-905 block">Tambahkan Diskusi Voting Langsung (Opsional)</span>
                
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 text-3xs">Pertanyaan Voting Utama</label>
                  <input
                    type="text"
                    placeholder="e.g. Setujukah Anda iuran bulanan dinaikkan?"
                    value={aQuestion}
                    onChange={(e) => setAQuestion(e.target.value)}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1 text-3xs">Pilihan Jawaban (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    placeholder="Setuju, Tidak Setuju, Abstain"
                    value={aOptionsRaw}
                    onChange={(e) => setAOptionsRaw(e.target.value)}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <CloudinaryUpload 
                  label="Unggah Makalah / Kitab / Referensi Pembahasan (Cloudinary)" 
                  onUploadSuccess={(url) => setUploadedFileUrl(url)}
                  defaultUrl={uploadedFileUrl}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddAgenda(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 cursor-pointer"
                >
                  Jadwalkan E-Rapat
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
