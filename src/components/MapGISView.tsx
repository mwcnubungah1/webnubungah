import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  Compass, 
  Home, 
  BookOpen, 
  ShieldAlert, 
  Eye, 
  Filter, 
  Activity, 
  Layers,
  Sparkles,
  Plus
} from 'lucide-react';
import { LokasiGIS, UserRole } from '../types';

interface GISProps {
  lokasiList: LokasiGIS[];
  role: UserRole;
  onAddLocation: (loc: Omit<LokasiGIS, 'id'>) => void;
}

export default function MapGISView({
  lokasiList,
  role,
  onAddLocation
}: GISProps) {
  const [selectedTipe, setSelectedTipe] = useState<string>('Semua');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedLocationDetail, setSelectedLocationDetail] = useState<LokasiGIS | null>(lokasiList[0] || null);

  // Form states - Location adding
  const [showAddLoc, setShowAddLoc] = useState(false);
  const [locNama, setLocNama] = useState('');
  const [locTipe, setLocTipe] = useState<'Ranting' | 'Masjid' | 'Mushalla' | 'Madrasah' | 'Pesantren'>('Masjid');
  const [locAlamat, setLocAlamat] = useState('');
  const [locRanting, setLocRanting] = useState('R-01');
  const [locPimpinan, setLocPimpinan] = useState('');
  const [locKontak, setLocKontak] = useState('');
  const [locKeterangan, setLocKeterangan] = useState('');

  // Coordinates centering inside typical Kecamatan map grid
  // Lat: -7.05 s/d -7.08, Lng: 112.56 s/d 112.59
  const [locX, setLocX] = useState<number>(-7.0630);
  const [locY, setLocY] = useState<number>(112.5790);

  const isAdminOrOfficer = role !== 'PUBLIK_WARGA';

  // Filters
  const filteredLocations = lokasiList.filter(l => selectedTipe === 'Semua' || l.tipe === selectedTipe);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locNama || !locAlamat) return;

    onAddLocation({
      nama: locNama,
      tipe: locTipe,
      alamat: locAlamat,
      rantingId: locRanting,
      lat: locX,
      lng: locY,
      pimpinan: locPimpinan || undefined,
      kontak: locKontak || undefined,
      keterangan: locKeterangan || undefined
    });

    // Reset Form
    setLocNama('');
    setLocAlamat('');
    setLocPimpinan('');
    setLocKeterangan('');
    setShowAddLoc(false);
  };

  // Convert GPS Coordinates to Relative SVG Canvas positions
  const getCanvasCoords = (lat: number, lng: number) => {
    // Latitude range: -7.0500 to -7.0850 -> Y: 30 to 280
    // Longitude range: 112.5600 to 112.5950 -> X: 30 to 370
    const latMin = -7.0500;
    const latMax = -7.0850;
    const lngMin = 112.5600;
    const lngMax = 112.5950;

    const y = 30 + ((lat - latMin) / (latMax - latMin)) * 250;
    const x = 30 + ((lng - lngMin) / (lngMax - lngMin)) * 340;

    return { x, y };
  };

  // Icon selector based on category type
  const getLocBadgeColor = (tipe: string) => {
    switch(tipe) {
      case 'Ranting': return 'bg-emerald-600 text-white';
      case 'Masjid': return 'bg-sky-600 text-white';
      case 'Mushalla': return 'bg-amber-500 text-white';
      case 'Madrasah': return 'bg-teal-600 text-white';
      case 'Pesantren': return 'bg-indigo-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMarkerColor = (tipe: string) => {
    switch(tipe) {
      case 'Ranting': return '#059669'; // Emerald-600
      case 'Masjid': return '#0284c7'; // Sky-600
      case 'Mushalla': return '#d97706'; // Amber-600
      case 'Madrasah': return '#0d9488'; // Teal-600
      case 'Pesantren': return '#4f46e5'; // Indigo-600
      default: return '#4b5563';
    }
  };

  return (
    <div className="space-y-6" id="gis-organization-map">
      
      {/* Top filter choices and Gimmick heatmap switches */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl text-xs font-semibold gap-1">
          {['Semua', 'Ranting', 'Masjid', 'Mushalla', 'Madrasah', 'Pesantren'].map((tp) => (
            <button
              key={tp}
              onClick={() => setSelectedTipe(tp)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedTipe === tp ? 'bg-emerald-600 text-white font-bold' : 'text-gray-650 hover:text-gray-900'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>

        <div className="flex gap-2.5 w-full md:w-auto">
          {/* Heatmap Layer toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-colors ${
              showHeatmap 
                ? 'bg-amber-600 text-white border-amber-600 shadow-inner' 
                : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Activity className="h-4.5 w-4.5" />
            <span>{showHeatmap ? 'Layer Heatmap: Aktif' : 'Tampilkan Heatmap'}</span>
          </button>

          {isAdminOrOfficer && (
            <button
              onClick={() => setShowAddLoc(true)}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Plot Lokasi</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Spatial Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SVG interactive grid representing Bungah Kecamatan boundaries */}
        <div className="bg-[#FAFBF9] p-5 rounded-2xl border border-emerald-90/50 shadow-xs lg:col-span-3 flex flex-col items-center relative overflow-hidden h-[420px]">
          
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xxs p-2.5 rounded-xl border border-gray-150 text-3xs font-mono space-y-1 z-10 shadow-xs flex flex-col text-left">
            <span className="font-bold flex items-center gap-1 text-emerald-800 uppercase tracking-wider"><Layers className="h-3.5 w-3.5" /> Legenda Peta</span>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block" /> <span>Kantor MWC / Ranting</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-600 inline-block" /> <span>Masjid Nahdlatul Ulama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> <span>Mushalla Aswaja</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-600 inline-block" /> <span>Pesantren NU / Ponpes</span>
            </div>
            <div className="flex items-center gap-1.5 pb-1">
              <span className="h-2 w-2 rounded-full bg-teal-605 inline-block" /> <span>Madrasah Ma&apos;arif</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-white/95 select-none p-2 rounded-xl text-3xs font-bold text-gray-500 border flex items-center gap-1.5 z-10 shadow-xs uppercase tracking-widest font-mono">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Digital GIS Canvas Alpha</span>
          </div>

          {/* BACKGROUND GEO REFERENCE SVG */}
          <svg 
            viewBox="0 0 400 320" 
            className="w-full h-full max-w-[500px]"
          >
            {/* Outline of Kelurahan boundaries inside Kecamatan */}
            <path 
              d="M 50,30 Q 120,40 180,30 T 320,60 T 370,120 Q 350,210 320,280 Q 180,260 110,290 T 30,190 Q 40,110 50,30 Z" 
              fill="rgba(16, 185, 129, 0.05)" 
              stroke="#059669" 
              strokeWidth="1.5" 
              strokeDasharray="4,4"
              className="transition-all"
            />

            {/* Simulated Heatmap circles if activated */}
            {showHeatmap && (
              <>
                <circle cx="150" cy="110" r="80" className="fill-amber-500/15 stroke-amber-500/25 stroke-1 animate-pulse" />
                <circle cx="210" cy="180" r="50" className="fill-amber-500/10 stroke-amber-500/20 stroke-1" />
                <circle cx="95" cy="220" r="100" className="fill-amber-500/10 stroke-amber-500/15 stroke-1" />
              </>
            )}

            {/* Map Grid Coordinates reference markers */}
            <line x1="0" y1="80" x2="400" y2="80" stroke="#E5E7EB" strokeWidth="0.5" />
            <line x1="0" y1="160" x2="400" y2="160" stroke="#E5E7EB" strokeWidth="0.5" />
            <line x1="0" y1="240" x2="400" y2="240" stroke="#E5E7EB" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="100" y2="320" stroke="#E5E7EB" strokeWidth="0.5" />
            <line x1="200" y1="0" x2="200" y2="320" stroke="#E5E7EB" strokeWidth="0.5" />
            <line x1="300" y1="0" x2="300" y2="320" stroke="#E5E7EB" strokeWidth="0.5" />

            {/* PLotted GPS Markers */}
            {filteredLocations.map((loc) => {
              const { x, y } = getCanvasCoords(loc.lat, loc.lng);
              const mColor = getMarkerColor(loc.tipe);
              const isSelected = selectedLocationDetail?.id === loc.id;

              return (
                <g 
                  key={loc.id} 
                  cursor="pointer"
                  onClick={() => setSelectedLocationDetail(loc)}
                >
                  {/* Glowing halo indicating currently selected */}
                  {isSelected && (
                    <circle cx={x} cy={y - 12} r="16" fill="none" stroke={mColor} strokeWidth="1.5" className="animate-ping" opacity="0.3" />
                  )}

                  {/* Marker Pin Head */}
                  <path 
                    d="M 12,0 C 5.3,0 0,5.3 0,12 C 0,21 12,32 12,32 C 12,32 24,21 24,12 C 24,5.3 18.7,0 12,0 Z" 
                    fill={mColor} 
                    transform={`translate(${x - 12}, ${y - 32})`} 
                    className="drop-shadow-xs transition-all hover:scale-110 origin-bottom"
                  />

                  {/* Inner dot inside marker */}
                  <circle cx={x} cy={y - 20} r="4.5" fill="white" />
                  
                  {/* Subtle label showing node abbreviation */}
                  <text 
                    x={x} 
                    y={y + 11} 
                    textAnchor="middle" 
                    fontSize="7" 
                    className="fill-gray-600 font-mono font-black select-none tracking-tight leading-none bg-white p-0.5"
                  >
                    {loc.nama.slice(0, 15)}...
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Coordinate Scale bar bottom corner */}
          <div className="absolute bottom-4 left-4 bg-white/70 px-2 py-0.5 rounded text-[8px] font-mono border">
            Lat Range: -7.05 to -7.08 | Scale 1 : 15.000
          </div>
        </div>

        {/* GIS Sidebar Location Bio Detail panel */}
        <div className="lg:col-span-1 space-y-4 text-left">
          {selectedLocationDetail ? (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <span className={`inline-block text-[9px] font-extrabold uppercase py-0.5 px-2.5 rounded ${getLocBadgeColor(selectedLocationDetail.tipe)}`}>
                {selectedLocationDetail.tipe}
              </span>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-950 leading-tight">{selectedLocationDetail.nama}</h3>
                <p className="text-xxs text-gray-500 font-medium flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  <span>Kec Bungah, Lat: {selectedLocationDetail.lat}, Lng: {selectedLocationDetail.lng}</span>
                </p>
              </div>

              <div className="text-xxs space-y-2 border-t pt-3 leading-normal text-gray-700">
                <div>
                  <strong className="block text-gray-400">Pimpinan / PJ Pengampu:</strong>
                  <span className="font-semibold text-emerald-950">{selectedLocationDetail.pimpinan || 'Belum diisi harian'}</span>
                </div>

                <div>
                  <strong className="block text-gray-400">Alamat Fisik:</strong>
                  <span>{selectedLocationDetail.alamat}</span>
                </div>

                {selectedLocationDetail.kontak && (
                  <div>
                    <strong className="block text-gray-400">Nomor Kontak Hubung:</strong>
                    <span className="font-mono">{selectedLocationDetail.kontak}</span>
                  </div>
                )}

                <div>
                  <strong className="block text-gray-400">Keterangan / Agenda Aktif:</strong>
                  <p className="italic text-gray-500 leading-normal">{selectedLocationDetail.keterangan || 'Menunggu jadwal kajian rutin'}</p>
                </div>
              </div>

              <div className="pt-2 border-t text-center">
                <button 
                  onClick={() => alert(`Kordinasi navigasi spasial rute menuju "${selectedLocationDetail.nama}" di Bungah berhasil disimulasikan!`)}
                  className="w-full text-xxs bg-emerald-700 hover:bg-emerald-805 text-white select-none py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Map className="h-4 w-4" />
                  <span>Buka Petunjuk Rute GIS</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border text-center text-gray-400 text-xxs">
              SILAKAN PILIH Salah satu koordinat marker pin di peta spasial untuk mengulas rincian pengasuh, alamat kontak, dan status ranting.
            </div>
          )}
        </div>

      </div>

      {/* POP-UP FORM REGISTER NEW GIS PLOT */}
      {showAddLoc && (
        <div className="fixed inset-0 bg-transparent/20 backdrop-blur-xxs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Plot Koordinat Peta Organisasi Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Nama Lokasi / Institusi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masjid Al-Barakah Ranting Pepe"
                  value={locNama}
                  onChange={(e) => setLocNama(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Tipe Lokasi</label>
                  <select
                    value={locTipe}
                    onChange={(e) => setLocTipe(e.target.value as any)}
                    className="w-full p-2 bg-white rounded-xl border border-gray-200 outline-none"
                  >
                    <option value="Ranting">Kantor PRNU / Ranting</option>
                    <option value="Masjid">Masjid NU</option>
                    <option value="Mushalla">Mushalla Aswaja</option>
                    <option value="Madrasah">Madrasah Maarif</option>
                    <option value="Pesantren">Pondok Pesantren</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 font-bold mb-1">Pimpinan / Pengasuh</label>
                  <input
                    type="text"
                    placeholder="e.g. KH. Khozin"
                    value={locPimpinan}
                    onChange={(e) => setLocPimpinan(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jalan Raya Bungah No. 15, Bungah, Gresik"
                  value={locAlamat}
                  onChange={(e) => setLocAlamat(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              {/* Bungah Area Lat/Lng selector simulations */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Garis Lintang (Latitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={locX}
                    onChange={(e) => setLocX(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-gray-200 font-mono text-[10px]"
                  />
                  <span className="text-[10px] text-gray-400">Rentang: -7.05 s/d -7.08</span>
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Garis Bujur (Longitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={locY}
                    onChange={(e) => setLocY(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-gray-200 font-mono text-[10px]"
                  />
                  <span className="text-[10px] text-gray-400">Rentang: 112.56 s/d 112.59</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Keterangan Tambahan Organisasi</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Menyelenggarakan madrasah diniyah malam hari..."
                  value={locKeterangan}
                  onChange={(e) => setLocKeterangan(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddLoc(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Urungkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 cursor-pointer"
                >
                  Plot Koordinat
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
