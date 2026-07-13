import React, { useState } from 'react';
import { Lock, CheckCircle, AlertCircle, Mail, Key } from 'lucide-react';
import { Role } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    let targetRole: Role = 'guest';
    let targetRantingId = 'mwc';

    if (email === 'maghfurmunif@gmail.com' && password === 'mwc123') {
      targetRole = 'super_admin';
    } else if (email === 'ahmadazkia@gmail.com' && password === 'nubungah2026') {
      targetRole = 'admin_lazisnu';
    } else {
      setError('Kombinasi Email dan Password sandi salah! Hubungi MWC NU Bungah jika Anda belum memiliki akun.');
      setSuccess(false);
      setIsLoading(false);
      return;
    }

    // Try to login via Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If user doesn't exist, try signing up automatically so they can log in seamlessly
          if (signInError.message?.toLowerCase().includes('invalid login credentials') || signInError.status === 400) {
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  role: targetRole,
                }
              }
            });

            if (signUpError) {
              console.warn("Supabase auto-signUp failed:", signUpError.message);
              // Do not block login in-memory even if signup fails (e.g. email confirmation required but not confirmed)
            } else {
              console.log("Supabase auto-signUp successful for:", email);
            }
          } else {
            console.warn("Supabase signIn failed:", signInError.message);
          }
        } else {
          console.log("Supabase signIn successful for:", email);
        }
      } catch (authErr: any) {
        console.warn("Supabase connection exception:", authErr);
      }
    }

    setUserRole(targetRole);
    setSelectedRantingId(targetRantingId);
    setSuccess(true);
    setIsLoading(false);
    setError(null);
    setTimeout(() => {
      setActiveTab('admin');
    }, 1500);
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
            disabled={isLoading || success}
            className="w-full py-2.5 bg-tosca-600 hover:bg-tosca-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg shadow-teal-100 transition-all text-xs cursor-pointer flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Memverifikasi Sandi...</span>
              </>
            ) : (
              <span>Autentikasi Masuk Portal</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
