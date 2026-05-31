import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Building2, 
  ArrowRight,
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Info,
  ChevronRight
} from 'lucide-react';
import { useRouter } from '../router';
import { UserRole } from '../types';

interface PageProps {
  userRole: UserRole;
  onLogin: (role: UserRole) => void;
  onLogout: () => void;
}

export default function Login({ userRole, onLogin, onLogout }: PageProps) {
  const { navigate } = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail === 'maghfurmunif@gmail.com') {
        if (password === 'admin123') {
          onLogin('ADMIN_MWCNU');
          navigate('/admin');
        } else {
          setErrorMsg('Kata sandi untuk Administrator Utama salah.');
        }
      } else if (normalizedEmail === 'sekretaris@mwcnu.or.id') {
        if (password === 'sekretaris123') {
          onLogin('SEKRETARIS');
          navigate('/admin');
        } else {
          setErrorMsg('Kata sandi untuk Sekretaris Tanfidziyah salah.');
        }
      } else if (normalizedEmail === 'ketua@mwcnu.or.id') {
        if (password === 'ketua123') {
          onLogin('KETUA');
          navigate('/admin');
        } else {
          setErrorMsg('Kata sandi untuk Ketua Tanfidziyah salah.');
        }
      } else {
        setErrorMsg('Alamat Email tidak terdaftar atau kata sandi Anda salah.');
      }
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-150/60 shadow-md p-6 sm:p-8 space-y-6">
        
        {/* Brand layout branding header */}
        <div className="text-center space-y-2">
          <div className="h-16 w-16 mx-auto flex items-center justify-center bg-emerald-50 rounded-2xl border border-emerald-100 p-2 shadow-2xs">
            <img 
              src="https://res.cloudinary.com/dkirp8utp/image/upload/q_auto/f_auto/v1780232375/logo-nu-40177_wrpdez.png" 
              alt="Logo NU" 
              className="h-full w-auto object-contain" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-serif font-black tracking-tight text-emerald-950 uppercase">
              MWCNU SMART GOVERNANCE
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] font-mono">
              Otentikasi Pengurus Harian
            </p>
          </div>
        </div>

        {/* Form panel */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-left">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-3xs font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-gray-500 font-bold mb-1 uppercase tracking-wide">Alamat Email</label>
            <input
              type="email"
              required
              placeholder="e.g. nama@mwcnu.or.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl outline-hidden focus:border-emerald-600 font-semibold text-gray-750"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 font-bold uppercase tracking-wide">Kata Sandi Akses</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border rounded-xl outline-hidden focus:border-emerald-700 font-mono text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-650 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-990 hover:bg-emerald-950 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition text-xs shadow-xs cursor-pointer border border-emerald-950 text-[#D4AF37]"
          >
            {isSubmitting ? 'Memvalidasi Otentikasi...' : 'Masuk Dashboard Organisasi'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Sandbox Instruction credentials helper box */}
        <div className="bg-slate-50 p-4 rounded-2xl border text-left space-y-2">
          <h4 className="text-3xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-emerald-800" />
            <span>Kredensial Peninjauan (Guna Evaluasi):</span>
          </h4>
          <div className="text-4xs text-gray-550 space-y-1.5 font-mono leading-relaxed">
            <p>&bull; <b>Administrator (maghfurmunif@gmail.com):</b><br />Email: <code className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">maghfurmunif@gmail.com</code> | Sandi: <code className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">admin123</code></p>
            <p>&bull; <b>Sekretaris Tanfidziyah:</b><br />Email: <code className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">sekretaris@mwcnu.or.id</code> | Sandi: <code className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">sekretaris123</code></p>
            <p>&bull; <b>Ketua Tanfidziyah:</b><br />Email: <code className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">ketua@mwcnu.or.id</code> | Sandi: <code className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">ketua123</code></p>
          </div>
        </div>

      </div>
    </div>
  );
}
