import React, { useState } from 'react';
import { 
  Database, 
  Code, 
  Cpu, 
  Copy, 
  Check, 
  Search, 
  ArrowRight, 
  Layers, 
  WifiOff, 
  Server,
  Terminal,
  FileCode,
  Cloud,
  ExternalLink,
  Settings,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { postgresSchemaDDL, apiSpecifications, architectureRecommendations } from '../data/architectureDocs';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { isCloudinaryConfigured } from '../lib/cloudinaryClient';

export default function TechnicalSpecs() {
  const [activeSubTab, setActiveSubTab] = useState<'ddl' | 'api' | 'optimize' | 'cloud'>('ddl');

  const [copied, setCopied] = useState(false);
  const [apiSearch, setApiSearch] = useState('');

  const handleCopyDDL = () => {
    navigator.clipboard.writeText(postgresSchemaDDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const filteredApiSpecs = apiSpecifications.map(cat => {
    const filteredEndpoints = cat.endpoints.filter(ep => {
      return ep.path.toLowerCase().includes(apiSearch.toLowerCase()) || 
             ep.desc.toLowerCase().includes(apiSearch.toLowerCase()) || 
             ep.method.toLowerCase().includes(apiSearch.toLowerCase());
    });
    return {
      ...cat,
      endpoints: filteredEndpoints
    };
  }).filter(cat => cat.endpoints.length > 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Specs Intro Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-slate-800 text-lg">Cetak Biru Arsitektur & Spesifikasi Sistem</h3>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Halaman ini didedikasikan bagi Tim Developer untuk mengimplementasikan basis data relasional (PostgreSQL) serta mengintegrasikan backend API. Semua skema telah dinormalisasi (3NF) dan dioptimalkan untuk performa tinggi di area dengan sinyal terbatas.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 border border-slate-200 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('ddl')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0
              ${activeSubTab === 'ddl' ? 'bg-white text-tosca-800 shadow-2xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Skema DDL SQL</span>
          </button>
          <button
            onClick={() => setActiveSubTab('api')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0
              ${activeSubTab === 'api' ? 'bg-white text-tosca-800 shadow-2xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Endpoint API</span>
          </button>
          <button
            onClick={() => setActiveSubTab('optimize')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0
              ${activeSubTab === 'optimize' ? 'bg-white text-tosca-800 shadow-2xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Optimasi Sinyal</span>
          </button>
          <button
            onClick={() => setActiveSubTab('cloud')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0
              ${activeSubTab === 'cloud' ? 'bg-white text-tosca-800 shadow-2xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Integrasi Cloud</span>
          </button>
        </div>
      </div>

      {/* DDL TAB */}
      {activeSubTab === 'ddl' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4.5 h-4.5 text-tosca-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">PostgreSQL DDL Schema Blueprint</span>
            </div>
            
            <button
              onClick={handleCopyDDL}
              className="px-3 py-1.5 bg-tosca-50 hover:bg-tosca-100 text-tosca-700 font-semibold rounded-lg text-xs flex items-center space-x-1.5 transition-colors border border-tosca-100/30"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Skema DDL'}</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-inner text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
            <pre className="no-scrollbar">{postgresSchemaDDL}</pre>
          </div>
        </div>
      )}

      {/* API SPEC TAB */}
      {activeSubTab === 'api' && (
        <div className="space-y-6">
          {/* API Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari endpoint, metod, deskripsi..."
                value={apiSearch}
                onChange={(e) => setApiSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-hidden focus:ring-1 focus:ring-tosca-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Format Respons: JSON (RFC 8259)</span>
          </div>

          {/* Endpoints listing */}
          <div className="space-y-6">
            {filteredApiSpecs.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{group.category} Endpoints</h4>
                
                <div className="space-y-4">
                  {group.endpoints.map((ep: any, epIdx) => (
                    <div key={epIdx} className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                      {/* Endpoint top identifier bar */}
                      <div className="px-5 py-3 border-b border-slate-50 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
                        <div className="flex items-center space-x-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider
                            ${ep.method === 'GET' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-700">{ep.path}</span>
                          {ep.queryParams && (
                            <span className="font-mono text-[10px] text-slate-400 font-medium italic">{ep.queryParams}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium italic">{ep.desc}</span>
                      </div>

                      {/* Code payloads blocks */}
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30">
                        {/* Request payload */}
                        {ep.payload ? (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Request Payload (JSON)</span>
                            <div className="bg-slate-900 text-[10px] font-mono text-slate-300 rounded-lg p-3 overflow-x-auto max-h-48 border border-slate-800">
                              <pre>{JSON.stringify(ep.payload, null, 2)}</pre>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase font-mono">Parameters / Headers</span>
                            <div className="bg-slate-100 text-[10px] text-slate-500 rounded-lg p-3 h-20 flex items-center justify-center border border-slate-200">
                              None / No payload required
                            </div>
                          </div>
                        )}

                        {/* Response sample */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-semibold text-slate-400 block uppercase">Response Sample (JSON)</span>
                          <div className="bg-slate-900 text-[10px] font-mono text-slate-300 rounded-lg p-3 overflow-x-auto max-h-48 border border-slate-800">
                            <pre>{JSON.stringify(ep.response, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredApiSpecs.length === 0 && (
              <p className="text-center py-12 text-slate-400 text-xs">Tidak ada spesifikasi API yang cocok.</p>
            )}
          </div>
        </div>
      )}

      {/* OPTIMIZATIONS TAB */}
      {activeSubTab === 'optimize' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Recommendations */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs h-fit space-y-6">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-tosca-600" />
              <h4 className="font-display font-bold text-slate-800">Rekomendasi Stack Teknologi</h4>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wide">Frontend Framework</span>
                <p className="text-slate-800 font-semibold mt-0.5">{architectureRecommendations.stack.frontend}</p>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wide">Backend API / Server</span>
                <p className="text-slate-800 font-semibold mt-0.5">{architectureRecommendations.stack.backend}</p>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wide">Relational Database</span>
                <p className="text-slate-800 font-semibold mt-0.5">{architectureRecommendations.stack.database}</p>
              </div>
              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wide">Cache Layer</span>
                <p className="text-slate-800 font-semibold mt-0.5">{architectureRecommendations.stack.cache}</p>
              </div>
            </div>
          </div>

          {/* Right panel: Optimization details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center space-x-2.5">
              <WifiOff className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="font-display font-bold text-slate-800 text-sm">Arsitektur Ramah Sinyal Pedesaan (Low Bandwidth)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Strategi percepatan load dan ketahanan jaringan di wilayah pesisir Bungah.</p>
              </div>
            </div>

            <div className="space-y-4">
              {architectureRecommendations.bandwidthOptimizations.map((opt, optIdx) => (
                <div key={optIdx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-tosca-50 rounded text-tosca-700 font-bold font-mono text-xs flex items-center justify-center">
                      {optIdx + 1}
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{opt.title}</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CLOUD TAB */}
      {activeSubTab === 'cloud' && (
        <div className="space-y-6">
          {/* Status Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supabase Status Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-display font-bold text-slate-800">Supabase Database</h4>
                  </div>
                  <p className="text-xs text-slate-400">Penyimpanan relasional PostgreSQL & Sinkronisasi Real-time</p>
                </div>
                
                {isSupabaseConfigured ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold flex items-center space-x-1 border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Terkonfigurasi</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold flex items-center space-x-1 border border-amber-100">
                    <AlertCircle className="w-3 h-3" />
                    <span>Menunggu Kunci API</span>
                  </span>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-lg text-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Variabel .env</span>
                  <div className="font-mono text-[10px] bg-slate-900 text-slate-300 p-2.5 rounded-md overflow-x-auto select-all">
                    VITE_SUPABASE_URL="{isSupabaseConfigured ? import.meta.env.VITE_SUPABASE_URL : 'https://your-project-id.supabase.co'}"<br/>
                    VITE_SUPABASE_ANON_KEY="{isSupabaseConfigured ? '••••••••••••••••••••••••' : 'your-anon-public-key'}"
                  </div>
                </div>

                <div className="text-xs leading-relaxed text-slate-500 space-y-2">
                  <p className="font-semibold text-slate-700">Langkah-langkah:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    <li>Masuk ke <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-tosca-600 font-semibold inline-flex items-center hover:underline">Supabase Console <ExternalLink className="w-3 h-3 ml-0.5" /></a> dan buat project baru.</li>
                    <li>Pergi ke menu <span className="font-mono font-bold text-slate-600">Settings &gt; API</span> untuk mengambil Project URL dan Anon Key.</li>
                    <li>Salin DDL SQL dari tab <span className="font-semibold text-tosca-700 cursor-pointer" onClick={() => setActiveSubTab('ddl')}>"Skema DDL SQL"</span> di atas, buka <span className="font-mono font-bold text-slate-600">SQL Editor</span> di panel Supabase Anda, lalu tempelkan dan jalankan (Run) untuk membuat tabel relasional yang diperlukan secara otomatis.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cloudinary Status Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sky-600">
                    <Cloud className="w-5 h-5 text-sky-600" />
                    <h4 className="font-display font-bold text-slate-800">Cloudinary Media</h4>
                  </div>
                  <p className="text-xs text-slate-400">Penyimpanan awan terdistribusi untuk berkas foto, sertifikat, & dokumentasi</p>
                </div>

                {isCloudinaryConfigured ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold flex items-center space-x-1 border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Terkonfigurasi</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold flex items-center space-x-1 border border-amber-100">
                    <AlertCircle className="w-3 h-3" />
                    <span>Menunggu Kunci API</span>
                  </span>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-lg text-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Variabel .env</span>
                  <div className="font-mono text-[10px] bg-slate-900 text-slate-300 p-2.5 rounded-md overflow-x-auto select-all">
                    VITE_CLOUDINARY_CLOUD_NAME="{isCloudinaryConfigured ? import.meta.env.VITE_CLOUDINARY_CLOUD_NAME : 'your-cloudinary-cloud-name'}"<br/>
                    VITE_CLOUDINARY_UPLOAD_PRESET="{isCloudinaryConfigured ? import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET : 'your-upload-preset-name'}"
                  </div>
                </div>

                <div className="text-xs leading-relaxed text-slate-500 space-y-2">
                  <p className="font-semibold text-slate-700">Langkah-langkah:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    <li>Daftar/Masuk ke <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-tosca-600 font-semibold inline-flex items-center hover:underline">Cloudinary <ExternalLink className="w-3 h-3 ml-0.5" /></a> untuk melihat "Cloud Name" Anda di dashboard utama.</li>
                    <li>Pergi ke halaman <span className="font-semibold text-slate-700">Settings &gt; Upload</span> di panel Cloudinary Anda.</li>
                    <li>Gulir ke bawah ke bagian <span className="font-semibold text-slate-700">Upload presets</span>, lalu buat/aktifkan "Unsigned Upload Preset" baru.</li>
                    <li>Masukkan nama "Upload Preset" yang tidak bertanda tangan (unsigned) tersebut ke variabel <span className="font-mono text-slate-600 font-bold">VITE_CLOUDINARY_UPLOAD_PRESET</span> agar unggahan gambar dapat berjalan lancar langsung dari sisi klien.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Code Integration Example */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-slate-700" />
              <h4 className="font-display font-bold text-slate-800 text-sm">Contoh Penggunaan SDK di Sisi Klien</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Supabase Fetch Data</span>
                <div className="bg-slate-950 text-slate-300 font-mono text-[10px] p-4 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>
{`import { supabase } from '../lib/supabaseClient';

async function fetchRantingList() {
  const { data, error } = await supabase
    .from('ranting')
    .select('*')
    .order('name', { ascending: true });

  if (error) console.error(error);
  return data;
}`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Cloudinary Upload Image</span>
                <div className="bg-slate-950 text-slate-300 font-mono text-[10px] p-4 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>
{`import { uploadToCloudinary } from '../lib/cloudinaryClient';

async function handleImageUpload(file: File) {
  try {
    const secureUrl = await uploadToCloudinary(file);
    console.log('Uploaded secure URL:', secureUrl);
    return secureUrl;
  } catch (error) {
    alert(error.message);
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
