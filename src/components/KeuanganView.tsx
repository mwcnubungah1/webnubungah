import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  FileText, 
  Search, 
  History,
  AlertTriangle
} from 'lucide-react';
import { TransaksiKeuangan, UserRole } from '../types';

interface KeuanganProps {
  transaksiList: TransaksiKeuangan[];
  role: UserRole;
  onAddTransaksi: (tx: Omit<TransaksiKeuangan, 'id' | 'auditTrail'>) => void;
  onUpdateTransaksi: (id: string, updates: Partial<TransaksiKeuangan>) => void;
}

export default function KeuanganView({
  transaksiList,
  role,
  onAddTransaksi,
  onUpdateTransaksi
}: KeuanganProps) {
  const [activeSubTab, setActiveSubTab] = useState<'buku-kas' | 'neraca' | 'persetujuan'>('buku-kas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTx, setShowAddTx] = useState(false);
  const [selectedTxAudit, setSelectedTxAudit] = useState<TransaksiKeuangan | null>(null);

  // Form states
  const [txTipe, setTxTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [txKategori, setTxKategori] = useState<TransaksiKeuangan['kategori']>('Iuran');
  const [txDeskripsi, setTxDeskripsi] = useState('');
  const [txJumlah, setTxJumlah] = useState<number>(0);
  const [txTanggal, setTxTanggal] = useState(new Date().toISOString().split('T')[0]);

  const isAdminOrPresident = role === 'ADMIN_MWCNU' || role === 'KETUA';
  const isOfficer = role === 'SEKRETARIS' || role === 'ADMIN_MWCNU';

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Finance Aggregators
  const approvedTx = transaksiList.filter(t => t.status === 'Disetujui');
  const totalPemasukan = approvedTx
    .filter(t => t.tipe === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalPengeluaran = approvedTx
    .filter(t => t.tipe === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const kasSekarang = totalPemasukan - totalPengeluaran;
  const pendingTx = transaksiList.filter(t => t.status === 'Pending');

  // New Transaction Form Submission
  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDeskripsi || txJumlah <= 0) return;

    // Determine initial status based on role
    // Since bendahara/secretary inputs, requires Ketua approval
    const initialStatus = 'Pending';

    onAddTransaksi({
      tanggal: txTanggal,
      tipe: txTipe,
      kategori: txKategori,
      deskripsi: txDeskripsi,
      jumlah: txJumlah,
      status: initialStatus,
      buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=60'
    });

    // Reset
    setTxDeskripsi('');
    setTxJumlah(0);
    setShowAddTx(false);
  };

  // Trigger approvals (Ketua / Admin role)
  const handleApprove = (tx: TransaksiKeuangan) => {
    const updatedAudit = [
      ...tx.auditTrail,
      `Disetujui oleh ${role === 'KETUA' ? 'Ketua Tanfidziyah' : 'Administrator'} pada ${new Date().toISOString().split('T')[0]}`
    ];
    onUpdateTransaksi(tx.id, {
      status: 'Disetujui',
      disetujuiOleh: role === 'KETUA' ? 'H. Achmad Shofwan, S.Ag' : 'Admin Smart Governance',
      auditTrail: updatedAudit
    });
  };

  const handleDecline = (tx: TransaksiKeuangan) => {
    const updatedAudit = [
      ...tx.auditTrail,
      `Ditolak oleh ${role === 'KETUA' ? 'Ketua Tanfidziyah' : 'Administrator'} pada ${new Date().toISOString().split('T')[0]}`
    ];
    onUpdateTransaksi(tx.id, {
      status: 'Ditolak',
      auditTrail: updatedAudit
    });
  };

  // Searching buku kas Ledger
  const filteredLedger = transaksiList.filter(t => 
    t.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="transparency-finance-view">
      
      {/* Visual Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center text-emerald-800">
            <span className="text-xxs font-extrabold uppercase tracking-widest text-gray-400">Total Pemasukan</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="text-xl font-mono font-bold text-emerald-600 block mt-2">{formatIDR(totalPemasukan)}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Akumulasi iuran, donasi, & hibah</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center text-red-700">
            <span className="text-xxs font-extrabold uppercase tracking-widest text-gray-400">Total Pengeluaran</span>
            <TrendingDown className="h-4 w-4" />
          </div>
          <span className="text-xl font-mono font-bold text-red-600 block mt-2">{formatIDR(totalPengeluaran)}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Operasional & penyaluran proker</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs bg-emerald-900/10 border-emerald-100">
          <div className="flex justify-between items-center text-emerald-900">
            <span className="text-xxs font-extrabold uppercase tracking-widest text-emerald-800">Saldo Kas Bersih</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <span className="text-xl font-mono font-bold text-emerald-800 block mt-2">{formatIDR(kasSekarang)}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Siap disalurkan fungsional</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center text-amber-700">
            <span className="text-xxs font-extrabold uppercase tracking-widest text-gray-400">Menunggu Approval</span>
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-xl font-mono font-bold text-amber-600 block mt-2">{pendingTx.length} Pengajuan</span>
          <span className="text-[10px] text-gray-400 block mt-1">Butuh verifikasi Ketua</span>
        </div>
      </div>

      {/* Controller & Sub Navigation Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('buku-kas')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSubTab === 'buku-kas' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-650 hover:text-gray-950'
            }`}
          >
            Buku Kas Umum
          </button>
          <button
            onClick={() => setActiveSubTab('neraca')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSubTab === 'neraca' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-650 hover:text-gray-950'
            }`}
          >
            Neraca Sederhana
          </button>
          {isAdminOrPresident && (
            <button
              onClick={() => setActiveSubTab('persetujuan')}
              className={`px-4 py-2 rounded-lg cursor-pointer relative transition-colors ${
                activeSubTab === 'persetujuan' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-655 hover:text-gray-950'
              }`}
            >
              Approval Keuangan
              {pendingTx.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-550 text-white font-mono font-bold text-[9px] h-4 w-4 flex justify-center items-center rounded-full animate-pulse shadow-md">
                  {pendingTx.length}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {activeSubTab === 'buku-kas' && (
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari deskripsi transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.8 w-full text-xs rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
              />
            </div>
          )}

          {role !== 'PUBLIK_WARGA' && (
            <button
              onClick={() => {
                setTxTipe('Pemasukan');
                setTxKategori('Donasi');
                setShowAddTx(true);
              }}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Catat Transaksi</span>
            </button>
          )}
        </div>
      </div>

      {/* Pane Content */}
      {activeSubTab === 'buku-kas' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal & Status</th>
                  <th className="py-3 px-4">Kategori / Deskripsi</th>
                  <th className="py-3 px-4 text-right">Pemasukan</th>
                  <th className="py-3 px-4 text-right">Pengeluaran</th>
                  <th className="py-3 px-4 text-right">Aksi Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-xs">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-xxs">Belum ada transaksi terdaftar.</td>
                  </tr>
                ) : (
                  filteredLedger.map((tx) => {
                    const isIncome = tx.tipe === 'Pemasukan';
                    const approved = tx.status === 'Disetujui';

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-gray-500 block">{tx.tanggal}</span>
                          <span className={`inline-block text-[9px] px-2 py-0.2 rounded-full font-bold mt-1 ${
                            tx.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-800' :
                            tx.status === 'Pending' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-y-1">
                          <span className="text-xxs font-bold bg-slate-100 text-slate-700 py-0.5 px-2 rounded">{tx.kategori}</span>
                          <span className="text-gray-900 font-semibold block leading-tight">{tx.deskripsi}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isIncome ? (
                            <span className={`font-mono font-bold ${approved ? 'text-emerald-650' : 'text-gray-400'}`}>
                              {formatIDR(tx.jumlah)}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isIncome ? (
                            <span className={`font-mono font-bold ${approved ? 'text-red-600' : 'text-gray-400'}`}>
                              {formatIDR(tx.jumlah)}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedTxAudit(tx)}
                            className="text-gray-500 hover:text-black hover:underline text-xxs inline-flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <History className="h-3 w-3" /> Audit Log
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'neraca' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aktiva (Assets) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white">
              <h3 className="text-xs font-bold uppercase tracking-widest">Aktiva (Aset Organisasi)</h3>
            </div>
            <div className="p-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-semibold">Kas Lancar Organisasi</span>
                <span className="font-mono font-bold text-gray-950">{formatIDR(kasSekarang)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Aset Tetap (Pembangunan Graha Lantai 1)</span>
                <span className="font-mono font-bold text-gray-950">{formatIDR(245000000)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Kendaraan Siaga (Mobil Ambulans LAZISNU)</span>
                <span className="font-mono font-bold text-gray-950">{formatIDR(185000000)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-emerald-800 pt-2 text-sm">
                <span>Total Aktiva</span>
                <span>{formatIDR(kasSekarang + 245000000 + 185000000)}</span>
              </div>
            </div>
          </div>

          {/* Pasiva (Liabilities & Equity) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-4 bg-emerald-900 border-l-4 border-[#D4AF37] text-white">
              <h3 className="text-xs font-bold uppercase tracking-widest">Pasiva (Kewajiban & Ekuitas Sederhana)</h3>
            </div>
            <div className="p-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-medium">Hutang Operasional Kantor</span>
                <span className="font-mono font-bold text-gray-950">{formatIDR(0)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Dana Terikat Pembangunan Graha</span>
                <span className="font-mono font-bold text-gray-950">{formatIDR(245000000)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Ekuitas Dana Ummat (Kas LAZISNU & KOIN)</span>
                <span className="font-mono font-bold text-gray-950">{formatIDR(kasSekarang + 185000000)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-emerald-900 pt-2 text-sm">
                <span>Total Pasiva</span>
                <span>{formatIDR(kasSekarang + 245000000 + 185000000)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'persetujuan' && isAdminOrPresident && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Verifikasi Berkas Pendapatan & Pengeluaran Kas MWCNU</span>
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {pendingTx.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xxs">Tidak ada ajuan transaksi membutuhkan persetujuan saat ini. Semua buku kas bersih terkonsolidasi.</div>
            ) : (
              pendingTx.map((tx) => (
                <div key={tx.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 text-xs">
                    <span className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${
                      tx.tipe === 'Pemasukan' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {tx.tipe} &mdash; {tx.kategori}
                    </span>
                    <h4 className="text-xs font-semibold text-gray-900 block">{tx.deskripsi}</h4>
                    <span className="font-mono text-gray-500 block text-xxs">Tanggal Ajuan: {tx.tanggal} &bull; Pengajuan awal: Bendahara MWC</span>
                  </div>

                  <div className="flex items-center gap-4 self-stretch justify-between md:justify-end">
                    <span className="font-mono font-bold text-gray-950 text-sm">{formatIDR(tx.jumlah)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecline(tx)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xxs font-bold cursor-pointer"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleApprove(tx)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xxs font-bold cursor-pointer"
                      >
                        Setujui Ajuan
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* POP-UP: CATAT TRANSAKSI BARU */}
      {showAddTx && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Catat Ajuan Alur Keuangan Kas Baru</h3>
            <form onSubmit={handleSubmitTx} className="space-y-3.5 text-xs text-left">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Tipe Aliran Uang</label>
                  <select
                    value={txTipe}
                    onChange={(e) => {
                      const type = e.target.value as 'Pemasukan' | 'Pengeluaran';
                      setTxTipe(type);
                      setTxKategori(type === 'Pemasukan' ? 'Iuran' : 'Operasional');
                    }}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  >
                    <option value="Pemasukan">Pemasukan (Kredit)</option>
                    <option value="Pengeluaran">Pengeluaran (Debet)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1">Kategori Anggaran</label>
                  <select
                    value={txKategori}
                    onChange={(e) => setTxKategori(e.target.value as any)}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  >
                    {txTipe === 'Pemasukan' ? (
                      <>
                        <option value="Iuran">Iuran Anggota / Ranting</option>
                        <option value="Donasi">Donasi Shadaqah (LAZIS)</option>
                        <option value="Hibah">Hibah Instansi Pemerintah</option>
                        <option value="Usaha">Wirausaha Mart Organisasi</option>
                      </>
                    ) : (
                      <>
                        <option value="Operasional">Listrik / Air / Internet / Kantor</option>
                        <option value="Kegiatan">Subsidi Program Kegiatan</option>
                        <option value="Sosial">Bantuan Dana Mustahik (Sosial)</option>
                        <option value="Pendidikan">Beasiswa Fatayat / IPNU / Ma&apos;arif</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Deskripsi & Perincian Transaksi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pembelian bahan baku seng lobi lantai 1 Graha"
                  value={txDeskripsi}
                  onChange={(e) => setTxDeskripsi(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Jumlah Uang (Rupiah)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000000"
                    value={txJumlah || ''}
                    onChange={(e) => setTxJumlah(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={txTanggal}
                    onChange={(e) => setTxTanggal(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-[10px] text-indigo-900 block leading-normal font-sans">
                  <strong>* Alur Verifikasi Transparansi:</strong> Transaksi yang dicatat akan berstatus <strong>Pending</strong> terlebih dahulu dan membutuhkan tinjauan serta persetujuan digital di dashboard Ketua Tanfidziyah untuk sah dicantumkan dalam Buku Kas Umum.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddTx(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Catat & Ajukan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL LOG MODAL */}
      {selectedTxAudit && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-xxs font-extrabold uppercase tracking-widest text-[#C5A059] flex items-center gap-1">
                <History className="h-4 w-4" />
                <span>Rincian Audit Trail Transaksi</span>
              </span>
              <button onClick={() => setSelectedTxAudit(null)} className="text-gray-400 hover:text-black font-bold text-lg">&times;</button>
            </div>

            <div className="space-y-2 text-xs text-left">
              <h4 className="font-bold text-gray-900">{selectedTxAudit.deskripsi}</h4>
              <p className="text-xxs text-gray-450 font-mono">Kode Bukti Kas: TX-{selectedTxAudit.id}</p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-xxs font-sans text-left text-gray-650 max-h-48 overflow-y-auto">
              <p className="font-bold text-gray-900 border-b pb-1 mb-2">Riwayat Validasi (Sistem Keamanan):</p>
              {selectedTxAudit.auditTrail.map((log, index) => (
                <div key={index} className="flex gap-2 items-start py-1">
                  <span className="text-emerald-700 font-extrabold">&bull;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div>
              <button
                onClick={() => setSelectedTxAudit(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer"
              >
                Tutup Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
