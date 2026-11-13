'use client';

import React from 'react';
import { FileSpreadsheet, Printer, Database, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  activeTab: 'input' | 'rekap' | 'spkl' | 'guide';
  onTabChange: (tab: 'input' | 'rekap' | 'spkl' | 'guide') => void;
  onExportExcel: () => void;
  isExporting: boolean;
  isSupabase: boolean;
  totalJamBulan: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMonth,
  onMonthChange,
  activeTab,
  onTabChange,
  onExportExcel,
  isExporting,
  isSupabase,
  totalJamBulan,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-ptc-blue flex items-center justify-center text-white font-bold text-lg shadow-sm border border-slate-700">
              PTC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Pencatatan & Validator SPKL
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Operasional PTC
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Surat Perintah Kerja Lembur &bull; IT Region Jatimbalinus
              </p>
            </div>
          </div>

          {/* Month Selector & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status Database */}
            <div
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isSupabase
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={isSupabase ? 'Tersinkronisasi dengan Supabase Cloud' : 'Mode Offline / LocalStorage Aktif'}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabase ? 'Supabase Aktif' : 'Local Storage'}</span>
            </div>

            {/* Total Jam Badge */}
            <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1 rounded-md border border-slate-200 text-xs">
              <span className="text-slate-500 mr-1.5">Total Bulan Ini:</span>
              <span className="font-bold text-slate-900">{totalJamBulan.toFixed(1)} Jam</span>
            </div>

            {/* Month Filter */}
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="px-2.5 py-1.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ptc-navy focus:outline-none"
            />

            {/* Export Excel Button */}
            <button
              onClick={onExportExcel}
              disabled={isExporting}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-colors"
              title="Download File Excel Rekap & Format SPKL"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-t border-slate-100 py-1.5 overflow-x-auto">
          <button
            onClick={() => onTabChange('input')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'input'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Input Lembur & Validasi
          </button>
          <button
            onClick={() => onTabChange('rekap')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'rekap'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Rekap Bulanan (Grid 1 - 31)
          </button>
          <button
            onClick={() => onTabChange('spkl')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'spkl'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pratinjau & Cetak SPKL
          </button>
          <button
            onClick={() => onTabChange('guide')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Deploy & Database Setup
          </button>
        </div>
      </div>
    </header>
  );
};
