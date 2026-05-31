import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Printer, 
  Eye, 
  Award, 
  BookOpen, 
  UserPlus, 
  Trash2,
  Bookmark,
  MapPin,
  Map
} from 'lucide-react';
import { AnggotaPengurus, UserRole } from '../types';

interface AnggotaProps {
  anggotaList: AnggotaPengurus[];
  role: UserRole;
  onAddAnggota: (anggota: Omit<AnggotaPengurus, 'id'>) => void;
  onDeleteAnggota: (id: string) => void;
}

export default function DatabaseAnggotaView({
  anggotaList,
  role,
  onAddAnggota,
  onDeleteAnggota
}: AnggotaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStruktur, setSelectedStruktur] = useState<string>('Semua');
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeKartanuMember, setActiveKartanuMember] = useState<AnggotaPengurus | null>(anggotaList[1] || null);

  // Form states - Member
  const [mNama, setMNama] = useState('');
  const [mNik, setMNik] = useState('');
  const [mTempatLahir, setMTempatLahir] = useState('Gresik');
  const [mTanggalLahir, setMTanggalLahir] = useState('');
  const [mAlamat, setMAlamat] = useState('');
  const [mPendidikan, setMPendidikan] = useState('S1');
  const [mPekerjaan, setMPekerjaan] = useState('Swasta');
  const [mJabatan, setMJabatan] = useState('');
  const [mStruktur, setMStruktur] = useState<AnggotaPengurus['struktur']>('Pengurus Harian');
  const [mRantingId, setMRantingId] = useState('R-01');
  const [mKeahlianRaw, setMKeahlianRaw] = useState('');

  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  // Real Export to CSV
  const handleExportCSV = () => {
    // Generate headers
    const headers = ['Nomor Anggota', 'Nama Lengkap', 'NIK', 'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'Jabatan', 'Struktur'];
    const rows = anggotaList.map(a => [
      a.nomorAnggota,
      a.nama,
      `'${a.nik}`, // prevent excel dropping leading zeros
      a.tempatLahir,
      a.tanggalLahir,
      a.alamat,
      a.jabatanOrganisasi,
      a.struktur
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Kader_MWCNU_Smart_Governance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulated Import of extra members
  const handleSimulateImport = () => {
    const backupMembers = [
      {
        nomorAnggota: '35.15.02.0122',
        nama: 'Dr. KH. Ahmad Syafi’i, M.Ag',
        nik: '3515021803700004',
        tempatLahir: 'Gresik',
        tanggalLahir: '1970-03-18',
        alamat: 'Kemangi, Bungah, Gresik',
        pendidikan: 'S3 Hukum Islam',
        pekerjaan: 'Dosen UIN Sunan Ampel',
        jabatanOrganisasi: 'A’wan Syuriyah MWC',
        struktur: 'Pengurus Harian' as const,
        rantingId: 'R-08',
        riwayatJabatan: ['Ketua Lajnah Falakiyah Gresik', 'Pengurus MWC Mojopetung'],
        keahlian: ['Astronomi Islam / Falak', 'Ushul Fikih'],
        fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&crop=face&q=80'
      },
      {
        nomorAnggota: '35.15.02.0255',
        nama: 'Ustadzah Siti Fatimah, S.Pd',
        nik: '3515021204850021',
        tempatLahir: 'Surabaya',
        tanggalLahir: '1985-04-12',
        alamat: 'Kecamatan Bungah',
        pendidikan: 'S1 Pendidikan',
        pekerjaan: 'Guru MI Ma’arif',
        jabatanOrganisasi: 'Ketua PAC Fatayat NU Bungah',
        struktur: 'Banom' as const,
        rantingId: 'R-03',
        riwayatJabatan: ['Wakil Sekretaris Fatayat Gresik'],
        keahlian: ['Kaderisasi Perempuan', 'Bahasa Arab'],
        fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&crop=face&q=80'
      }
    ];

    backupMembers.forEach(memb => {
      // Avoid duplicate insert
      if (!anggotaList.some(a => a.nik === memb.nik)) {
        onAddAnggota(memb);
      }
    });

    alert("Simulasi Import Excel: Berhasil mengimpor 2 entri kader NU berprestasi ke database lokal!");
  };

  // Submit New Member
  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mNama || !mNik || !mJabatan) return;

    const noUrut = String(anggotaList.length + 10).padStart(4, '0');
    // Generates standard KARTANU NU-ID based on Bungah area code
    const generatedNo = `35.15.02.${noUrut}`;

    onAddAnggota({
      nomorAnggota: generatedNo,
      nama: mNama,
      nik: mNik,
      tempatLahir: mTempatLahir,
      tanggalLahir: mTanggalLahir,
      alamat: mAlamat,
      pendidikan: mPendidikan,
      pekerjaan: mPekerjaan,
      jabatanOrganisasi: mJabatan,
      struktur: mStruktur,
      rantingId: mRantingId,
      riwayatJabatan: ['Kader Baru Terdaftar (2026)'],
      keahlian: mKeahlianRaw ? mKeahlianRaw.split(',').map(s => s.trim()) : ['Umum', 'Keagamaan'],
      fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&crop=face&q=80'
    });

    // Reset Form
    setMNama('');
    setMNik('');
    setMJabatan('');
    setMAlamat('');
    setShowAddMember(false);
  };

  const filteredMembers = anggotaList.filter(a => {
    const matchesSearch = a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.jabatanOrganisasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStruktur = selectedStruktur === 'Semua' || a.struktur === selectedStruktur;

    return matchesSearch && matchesStruktur;
  });

  return (
    <div className="space-y-6" id="members-database-view">
      
      {/* Search and Utility Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        {/* Structure Filters */}
        <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl text-xs font-semibold gap-1">
          {['Semua', 'Pengurus Harian', 'Lembaga', 'Banom'].map((strat) => (
            <button
              key={strat}
              onClick={() => setSelectedStruktur(strat)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedStruktur === strat ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {strat}
            </button>
          ))}
        </div>

        {/* Input search keywords */}
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari NIK, nama, jabatan, nomor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.8 w-full text-xs rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex gap-1.5 w-full md:w-auto">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-gray-150 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Download database representation as real readable Excel CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            {isAdminOrOfficer && (
              <>
                <button
                  onClick={handleSimulateImport}
                  className="px-3 py-1.5 border border-dashed border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Load extra mock members directly in memory"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Import Excel</span>
                </button>

                <button
                  onClick={() => setShowAddMember(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Daftar Kader</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Database Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Members Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Kader / Nama</th>
                  <th className="py-3 px-4">Struktur / Jabatan</th>
                  <th className="py-3 px-4 text-center">Aksi Pembuatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredMembers.map((memb) => (
                  <tr 
                    key={memb.id} 
                    className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                      activeKartanuMember?.id === memb.id ? 'bg-indigo-50/20' : ''
                    }`}
                    onClick={() => setActiveKartanuMember(memb)}
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img 
                        src={memb.fotoUrl} 
                        alt={memb.nama} 
                        className="h-9 w-9 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-semibold text-gray-950 block">{memb.nama}</span>
                        <span className="font-mono text-gray-400 text-3xs block">KARTANU ID: {memb.nomorAnggota}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xxs px-2 py-0.2 font-semibold bg-gray-100 text-gray-800 rounded">{memb.struktur}</span>
                      <span className="font-medium text-emerald-800 block mt-1 leading-tight">{memb.jabatanOrganisasi}</span>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setActiveKartanuMember(memb)}
                          className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-3xs font-semibold px-2 py-1 rounded inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3 w-3" /> Cetak KARTANU
                        </button>
                        
                        {isAdminOrOfficer && (
                          <button
                            onClick={() => {
                              if(confirm(`Hapus kader "${memb.nama}" dari database governance?`)) {
                                onDeleteAnggota(memb.id);
                                if(activeKartanuMember?.id === memb.id) setActiveKartanuMember(null);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t text-xxs text-gray-400 text-center">
            Menampilkan {filteredMembers.length} dari total {anggotaList.length} entri terhubung di Kecamatan Bungah.
          </div>
        </div>

        {/* KARTANU Visual Card Live Generator */}
        <div className="lg:col-span-1 space-y-4">
          {activeKartanuMember ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] border-b pb-2">
                Kartu Tanda Anggota NU Pintar (KARTANU)
              </h3>

              {/* CARD CONTAINER (Green and Gold Official NU aesthetic) */}
              <div 
                id="kartanu-front"
                className="w-full h-52 bg-gradient-to-tr from-emerald-950 via-emerald-900 to-emerald-800 rounded-2xl border-2 border-[#D4AF37] relative text-white p-4 overflow-hidden flex flex-col justify-between shadow-lg"
              >
                {/* Visual stars represent Nu logo background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/10 rounded-full blur-xl pointer-events-none" />
                
                {/* Top cop */}
                <div className="flex items-start justify-between border-b border-[#D4AF37]/35 pb-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center font-bold text-xxs">
                      NU
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black tracking-widest leading-none text-[#D4AF37]">MWC NU KOTA</h4>
                      <p className="text-[6.5px] text-emerald-100/80 uppercase font-mono tracking-wider font-extrabold mt-0.5">BUNGAH</p>
                    </div>
                  </div>
                  <div className="text-[6.5px] font-mono text-[#D4AF37] text-right font-bold">
                    <span>E-KARTANU</span>
                  </div>
                </div>

                {/* Middle details */}
                <div className="flex gap-3 my-2 items-center z-10">
                  <img 
                    src={activeKartanuMember.fotoUrl} 
                    alt={activeKartanuMember.nama} 
                    className="h-20 w-16 border border-[#D4AF37]/50 rounded-md object-cover shadow-xs bg-emerald-950"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[11px] font-extrabold tracking-tight block truncate uppercase">{activeKartanuMember.nama}</span>
                    
                    <div className="text-[7.5px] text-emerald-200 leading-none">
                      <span className="block text-white/50">Jabatan:</span>
                      <strong className="text-[#D4AF37] tracking-tight">{activeKartanuMember.jabatanOrganisasi}</strong>
                    </div>

                    <div className="text-[7.5px] text-emerald-200 leading-none font-mono mt-1">
                      <span className="block text-white/50">NO. KARTANU:</span>
                      <strong className="text-white block tracking-wide">{activeKartanuMember.nomorAnggota}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom stats with secure QR barcode simulation */}
                <div className="flex justify-between items-end border-t border-[#D4AF37]/35 pt-1.5">
                  <span className="text-[6px] text-emerald-200/65 font-serif italic">Merawat Jagat, Membangun Peradaban</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="h-7 w-7 bg-white p-0.5 rounded flex justify-center items-center">
                      {/* Interactive Custom Canvas styled barcode / QR code representation */}
                      <svg viewBox="0 0 24 24" className="w-full h-full text-black">
                        <path d="M0 0h6v6H0zm2 2h2v2H2zm5-2h6v6H7zm2 2h2v2H9zm10-2h5v5h-5zm1 1h3v3h-3v-3zM0 8h5v5H0zm1 1h3v3h-3v-3zm7 0h3v4H8zm6-1h4v4h-4zm5 1h5v12h-5zm1 1h3v10h-3zm-13 7h6v5H7zm2 2h2v1H9zm1-13h2v5h-2zm-10 13h5v5H0zm1 1h3v3h-3" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="text-[5.5px] font-mono text-white/40 block text-right font-black leading-tight">ACTIVE<br/>MEMBER</span>
                  </div>
                </div>

              </div>

              {/* Backside of NU Card */}
              <div className="bg-emerald-950/5 border border-dashed border-emerald-900/10 p-3.5 rounded-xl space-y-2.5 text-xxs block text-left">
                <span className="font-bold text-emerald-900 block border-b pb-1">Biodata Detail Keanggotaan</span>
                <div className="space-y-1 text-gray-650">
                  <div><strong>NIK KTP:</strong> <span className="font-mono text-gray-900 font-semibold">{activeKartanuMember.nik}</span></div>
                  <div><strong>TTL:</strong> {activeKartanuMember.tempatLahir}, {activeKartanuMember.tanggalLahir}</div>
                  <div><strong>Alamat:</strong> {activeKartanuMember.alamat}</div>
                  <div><strong>Pekerjaan:</strong> {activeKartanuMember.pekerjaan} &bull; <strong>Pendidikan:</strong> {activeKartanuMember.pendidikan}</div>
                  <div><strong>Keahlian Pokok:</strong> {activeKartanuMember.keahlian.join(', ')}</div>
                </div>
                
                <div className="pt-2 border-t flex justify-between">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full bg-emerald-700 text-white select-none hover:bg-emerald-800 py-1.5 rounded-lg text-xxs font-bold inline-flex items-center gap-1 justify-center cursor-pointer shadow-xs"
                  >
                    <Printer className="h-3 w-3" /> Cetak Kartu Anggota (PDF)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border text-center text-gray-400 text-xxs">
              PILIH Kader di tabel sebelah kiri untuk menilai, mencetak, atau mengotomatisasi kartu anggota digital.
            </div>
          )}
        </div>

      </div>

      {/* POP-UP FORM REGISTER NEW MEMBER */}
      {showAddMember && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Registrasi Pendataan Kader Baru</h3>
            <form onSubmit={handleSubmitMember} className="space-y-3.5 text-xs text-left">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Nama Lengkap (Sesuai KTP)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KH. Zainuddin, Lc."
                    value={mNama}
                    onChange={(e) => setMNama(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="e.g. 351502xxxxxxxxxx"
                    value={mNik}
                    onChange={(e) => setMNik(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    required
                    value={mTempatLahir}
                    onChange={(e) => setMTempatLahir(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-500 font-bold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    required
                    value={mTanggalLahir}
                    onChange={(e) => setMTanggalLahir(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Alamat Tinggal Sekarang</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Perum Celep Asri Blok A-12, Bulusidokare"
                  value={mAlamat}
                  onChange={(e) => setMAlamat(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Tingkatan Struktur</label>
                  <select
                    value={mStruktur}
                    onChange={(e) => setMStruktur(e.target.value as any)}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  >
                    <option value="Pengurus Harian">Pengurus Harian</option>
                    <option value="Lembaga">Lembaga MWC</option>
                    <option value="Banom">Banom (Ansor / Muslimat)</option>
                    <option value="Ranting">Pengurus Ranting (Kelurahan)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-500 font-bold mb-1">Jabatan dalam Organisasi</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wakil Rais Syuriyah / Ketua Ranting Pepe"
                    value={mJabatan}
                    onChange={(e) => setMJabatan(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-550 mb-1 font-bold">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    required
                    value={mPendidikan}
                    onChange={(e) => setMPendidikan(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-550 mb-1 font-bold">Pekerjaan</label>
                  <input
                    type="text"
                    required
                    value={mPekerjaan}
                    onChange={(e) => setMPekerjaan(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Keahlian Khusus (pisahkan dengan koma)</label>
                <input
                  type="text"
                  placeholder="e.g. Manajemen Organisasi, Tata Busana, Komunikasi Digital"
                  value={mKeahlianRaw}
                  onChange={(e) => setMKeahlianRaw(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-750 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Daftarkan & Generate Kartu
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
