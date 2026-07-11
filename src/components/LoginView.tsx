import React, { useState } from 'react';
import { Lock, CheckCircle, AlertCircle, Mail, Key } from 'lucide-react';
import { Role } from '../types';

interface LoginViewProps {
  setUserRole: (role: Role) => void;
  setSelectedRantingId: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function LoginView({
  setUserRole,
  setSelectedRantingId,
  setActiveTab
}: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'maghfurmunif@gmail.com' && password === 'mwc123') {
      setUserRole('super_admin');
      setSelectedRantingId('mwc');
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setActiveTab('admin');
      }, 1500);
    } else if (email === 'ahmadazkia@gmail.com' && password === 'nubungah2026') {
      setUserRole('admin_lazisnu');
      setSelectedRantingId('mwc');
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setActiveTab('admin');
      }, 1500);
    } else {
      setError('Kombinasi Email dan Password sandi salah! Hubungi MWC NU Bungah jika Anda belum memiliki akun.');
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-fadeIn">
      <div className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-tosca-50 rounded-xl flex items-center justify-center mx-auto border border-tosca-100 text-tosca-600 shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Login Portal Pengurus</h3>
          <p className="text-xs text-gray-500 font-medium font-sans">Gunakan akun email Anda untuk masuk ke Panel CMS Administrasi</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center space-x-2 font-bold animate-pulse">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>Autentikasi berhasil! Mengalihkan ke Dashboard CMS...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl flex items-center space-x-2 font-bold animate-shake">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>Email Pengurus</span>
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800 font-sans"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-gray-400" />
              <span>Password Sandi</span>
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-tosca-100 focus:border-tosca-500 focus:bg-white text-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-tosca-600 hover:bg-tosca-700 text-white font-bold rounded-xl shadow-lg shadow-teal-100 transition-all text-xs cursor-pointer"
          >
            Autentikasi Masuk Portal
          </button>
        </form>
      </div>
    </div>
  );
}
