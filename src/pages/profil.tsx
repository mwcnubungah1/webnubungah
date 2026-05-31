import React, { useState } from 'react';
import { 
  Award, 
  Building2, 
  ShieldCheck, 
  Heart, 
  Users, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { AnggotaPengurus } from '../types';

interface PageProps {
  anggotaList: AnggotaPengurus[];
}

export default function Profil({ anggotaList }: PageProps) {
  const [selectedStruktur, setSelectedStruktur] = useState<string>('SEMUA');

  // Filter members by structure
  const filteredList = selectedStruktur === 'SEMUA' 
    ? anggotaList 
    : anggotaList.filter(a => a.struktur === selectedStruktur);

  return (
    <div className="space-y-10 text-left">
      
      {/* Title page header banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 p-8 rounded-2xl text-white space-y-2 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xxs uppercase font-extrabold text-[#D4AF37] tracking-widest block font-mono">PROFIL ORGANISASI</span>
        <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight">Mengenal Lebih Dekat MWCNU Bungah</h1>
        <p className="text-3xs md:text-xxs text-emerald-100 max-w-2xl leading-relaxed">
          Mengemban amanah perjuangan para ulama sepuh Nahdlatul Ulama dalam mengawal syiar Islam Ahlussunnah wal Jamaah An-Nahdliyah dan pemberdayaan ekonomi umat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Historical content & Vision Mision */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150/50 shadow-xxs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-850 flex items-center gap-2 border-b pb-2">
              <BookOpen className="h-4.5 w-4.5 text-emerald-700" />
              <span>Sejarah Perjuangan MWCNU Bungah</span>
            </h2>
            <div className="text-xs text-gray-650 leading-relaxed font-sans space-y-3">
              <p>
                Majelis Wakil Cabang Nahdlatul Ulama (MWCNU) Kecamatan Bungah berdiri tegak sebagai kompartemen wilayah perjuangan dakwah keagamaan di jantung Kabupaten Gresik. Sejak awal pendiriannya, MWCNU Bungah menjadi lokomotif penyebaran akidah Ahlussunnah wal Jama’ah yang mengedepankan prinsip tawasuth (moderat), tawazun (seimbang), tasamuh (toleran), dan i'tidal (tegak lurus).
              </p>
              <p>
                Berkat dukungan riil para ulama, masyayikh, dan kyai sepuh Pesantren di wilayah Bungah, MWCNU terus tumbuh mengayomi puluhan desa/ranting aktif. Kami tidak hanya berkutat pada penguatan ritual keagamaan (ubudiyah) seperti Lailatul Ijtima, Bahtsul Masail, dan tahlilan, melainkan juga mengakar kuat pada pemberdayaan sosial (ijtima'iyyah) and kemandirian ekonomi jamaah lewat Lazisnu dan Koperasi Syariah.
              </p>
              <p>
                Kini, di era disrupsi digital abad kedua Nahdlatul Ulama, MWCNU Bungah bertekad merintis transformasi digital yang dikemas dengan semangat "Smart Governance" yang mengutamakan tata kelola administrasi transparan, akurat, dan dapat dipertanggungjawabkan kepada umat.
              </p>
            </div>
          </section>

          {/* Visi Misi Bento Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50/40 to-emerald-100/10 p-6 rounded-2xl border border-emerald-50 shadow-xxs">
              <h3 className="text-xxs font-extrabold uppercase tracking-widest text-emerald-950 flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-[#C5A059]" />
                <span>Visi Utama Kami</span>
              </h3>
              <p className="text-xxs text-gray-650 leading-relaxed font-sans">
                Terwujudnya MWCNU Bungah sebagai pusat gerakan keumatan yang mandiri, berkarakter Washatiyah, dan tangguh menghadapi tantangan zaman dengan sistem tata kelola organisasi modern yang berafiliasi kuat dengan warisan keteladanan para ulama Nahdlatul Ulama.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50/35 to-indigo-150/10 p-6 rounded-2xl border border-indigo-50 shadow-xxs">
              <h3 className="text-xxs font-extrabold uppercase tracking-widest text-[#C5A059] flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-emerald-800" />
                <span>Misi Utama Kami</span>
              </h3>
              <ul className="text-xxs text-gray-650 leading-relaxed font-sans space-y-2 list-disc pl-4">
                <li>Melakukan tata kelola pendataan kader secara valid berbasis database Kartanu terintegrasi.</li>
                <li>Mewujudkan transparansi arus dana umat demi kemandirian dan kepercayaan tinggi jamaah.</li>
                <li>Meningkatkan sinergi antar lembaga keagamaan, pendidikan dan kesehatan se-Kecamatan.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Right Side: Structural Board Filter list */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-150/50 shadow-xxs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-850 flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-emerald-700" />
              <span>Klasifikasi Struktural</span>
            </h3>
            <p className="text-3xs text-gray-450 font-sans leading-relaxed">
              Saring daftar pimpinan dan pengurus digital berdasarkan klasifikasi bidang kerja organisasi MWCNU.
            </p>

            <div className="flex flex-col gap-1.5 pt-2">
              {[
                { label: 'Semua Pengurus', category: 'SEMUA' },
                { label: 'Pengurus Harian', category: 'Pengurus Harian' },
                { label: 'Lembaga MWC', category: 'Lembaga' },
                { label: 'Badan Otonom (Banom)', category: 'Banom' },
                { label: 'Pimpinan Ranting', category: 'Ranting' },
              ].map((btn) => (
                <button
                  key={btn.category}
                  onClick={() => setSelectedStruktur(btn.category)}
                  className={`w-full text-left font-semibold text-xxs px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer ${
                    selectedStruktur === btn.category 
                      ? 'bg-emerald-900 text-white font-bold shadow-xs' 
                      : 'text-gray-600 hover:bg-slate-55 bg-slate-50 border border-gray-100 hover:text-emerald-950'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid List of Board members */}
      <section className="space-y-6">
        <div className="border-b pb-2 flex justify-between items-end">
          <div>
            <h3 className="text-3xs uppercase tracking-widest text-[#D4AF37] font-extrabold">DATA RESMI</h3>
            <h2 className="text-md font-serif font-black text-emerald-950">Nama-Nama Pengurus Aktif ({filteredList.length})</h2>
          </div>
          <span className="text-3xs font-mono text-gray-400">Total terdaftar: {anggotaList.length}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredList.map((member) => (
            <div 
              key={member.id}
              className="bg-white rounded-2xl border border-gray-150/45 overflow-hidden shadow-3xs hover:shadow-2xs transition duration-200 text-left flex flex-col h-full"
            >
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                <img 
                  src={member.fotoUrl} 
                  alt={member.nama} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[9px] bg-emerald-600 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit mb-1">
                    {member.struktur}
                  </span>
                  <p className="text-xxs font-bold block truncate leading-tight font-sans">
                    NIK: {member.nik}
                  </p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-900 leading-tight block">{member.nama}</h4>
                  <p className="text-3xs text-[#C5A059] font-medium block uppercase tracking-wider">{member.jabatanOrganisasi}</p>
                  
                  <div className="pt-2 text-4xs text-gray-400 leading-normal space-y-1 font-sans border-t border-gray-50 mt-2">
                    <p><b>Nomor Kartanu:</b> {member.nomorAnggota}</p>
                    <p><b>Pendidikan:</b> {member.pendidikan}</p>
                    <p><b>Pekerjaan:</b> {member.pekerjaan}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-2">
                  {member.keahlian.slice(0, 2).map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-[9px] bg-slate-50 text-gray-500 border rounded-lg px-2 py-0.2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="col-span-full bg-slate-50 border border-dashed rounded-2xl p-10 text-center">
              <Users className="h-8 w-8 text-gray-305 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Tidak ada pengurus terdaftar untuk klasifikasi ini.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
