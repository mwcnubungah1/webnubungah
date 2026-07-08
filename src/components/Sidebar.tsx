import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  HeartHandshake, 
  FileText, 
  ShoppingBag, 
  Building, 
  BookOpen, 
  Newspaper, 
  Image, 
  Mail, 
  Lock, 
  Database,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { ModelType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: string;
  onLogout: () => void;
  activeModel: ModelType;
  setActiveModel: (model: ModelType) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  userRole,
  onLogout,
  activeModel,
  setActiveModel
}: SidebarProps) {

  const menuGroups = [
    {
      title: 'Portal Utama',
      items: [
        { id: 'home', label: 'Beranda Publik', icon: Home },
        { id: 'profil', label: 'Profil Jamiyah', icon: Users },
      ]
    },
    {
      title: 'Manajemen Data Jamiyah',
      items: [
        { id: 'kader', label: 'Data Kader Terpadu', icon: UserCheck },
        { id: 'kegiatan', label: 'Kegiatan Jamiyah', icon: Calendar },
      ]
    },
    {
      title: 'Akuntabilitas & Ekonomi',
      items: [
        { id: 'keuangan', label: 'Transparansi Dana', icon: DollarSign },
        { id: 'koin_s3', label: 'Koin S3 LAZISNU', icon: HeartHandshake },
        { id: 'usaha', label: 'Usaha Jamiyah', icon: ShoppingBag },
      ]
    },
    {
      title: 'Inventaris & Administrasi',
      items: [
        { id: 'persuratan', label: 'Log Persuratan', icon: FileText },
        { id: 'sarana_ibadah', label: 'Sarana Ibadah', icon: Building },
        { id: 'sarana_pendidikan', label: 'Sarana Pendidikan', icon: BookOpen },
      ]
    },
    {
      title: 'Publikasi & Layanan',
      items: [
        { id: 'berita', label: 'Kabar Berita NU', icon: Newspaper },
        { id: 'dokumentasi', label: 'Galeri Dokumentasi', icon: Image },
        { id: 'kontak', label: 'Aspirasi Warga', icon: Mail },
      ]
    },
    {
      title: 'Sistem & Admin',
      items: [
        { id: 'specs', label: 'Arsitektur & Spesifikasi', icon: Database },
        { 
          id: 'admin', 
          label: userRole !== 'guest' ? 'Dashboard Admin CMS' : 'Login Admin', 
          icon: Lock,
          highlight: true
        },
      ]
    }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false); // Close mobile drawer on click
  };

  const isItemActive = (tabId: string) => {
    if (tabId === 'admin') {
      return activeTab === 'admin' || activeTab === 'login';
    }
    return activeTab === tabId;
  };

  return (
    <>
      {/* Mobile Hamburger overlay */}
      {isOpen && (
        <div 
          id="sidebar-overlay"
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-200 z-50 transform lg:transform-none lg:opacity-100 transition-all duration-300 flex flex-col
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="https://res.cloudinary.com/dkirp8utp/image/upload/v1783494610/PRNU_BUNGAH_kif8y5.png" 
              referrerPolicy="no-referrer" 
              className="w-10 h-10 object-contain rounded-xl shrink-0" 
              alt="Logo PRNU Bungah" 
            />
            <div>
              <h1 className="font-bold text-sm leading-tight text-tosca-600">MWCNU Bungah</h1>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Transparan - Berdaulat</p>
            </div>
          </div>
          <button 
            id="close-sidebar-btn"
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-gray-400 tracking-widest uppercase block">
                {group.title}
              </span>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = isItemActive(item.id);
                  return (
                    <button
                       id={`nav-${item.id}`}
                       key={item.id}
                       onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 group text-left
                        ${isActive 
                          ? 'bg-tosca-50/80 text-tosca-600 border-r-4 border-tosca-600 pl-3.5 font-bold' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <IconComponent className={`w-3.5 h-3.5 transition-colors
                          ${isActive ? 'text-tosca-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 opacity-0 transition-all transform group-hover:opacity-100 group-hover:translate-x-0.5
                        ${isActive ? 'opacity-100 text-tosca-600' : 'text-slate-300'}`} 
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Footer / User Indicator */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-tosca-600 flex items-center justify-center text-xs text-white font-bold shrink-0">
              {userRole === 'guest' ? 'PU' : userRole === 'super_admin' ? 'SA' : userRole === 'admin_lazisnu' ? 'LA' : 'AR'}
            </div>
            <div className="flex-1 overflow-hidden leading-tight">
              <p className="text-xs font-bold text-gray-900 truncate">
                {userRole === 'guest' ? 'Pengunjung Umum' : userRole === 'super_admin' ? 'Super Admin MWC' : userRole === 'admin_lazisnu' ? 'Admin LAZISNU' : 'Admin Ranting'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {userRole === 'guest' ? 'mwc.bungah@nu.or.id' : 'Akses Dashboard CMS'}
              </p>
            </div>
            {userRole !== 'guest' && (
              <button 
                id="logout-btn"
                onClick={onLogout}
                className="text-gray-400 hover:text-red-500 shrink-0"
                title="Keluar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
