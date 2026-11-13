'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { FormInputSpkl } from '@/components/FormInputSpkl';
import { RekapTable } from '@/components/RekapTable';
import { SpklSlipView } from '@/components/SpklSlipView';
import { SetupGuide } from '@/components/SetupGuide';
import { SpklEntry, DEFAULT_PEKERJA } from '@/types/spkl';
import { fetchSpklEntries, insertSpklEntry, deleteSpklEntry, isSupabaseConfigured } from '@/lib/supabase';
import { generateSpklExcel } from '@/lib/excel-export';
import { FileSpreadsheet, CheckCircle, Clock, ShieldCheck, UserCheck } from 'lucide-react';

export default function HomePage() {
  const [currentMonth, setCurrentMonth] = useState<string>('2026-11');
  const [activeTab, setActiveTab] = useState<'input' | 'rekap' | 'spkl' | 'guide'>('input');
  const [entries, setEntries] = useState<SpklEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<SpklEntry | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSupabase, setIsSupabase] = useState<boolean>(false);
  const [selectedInputDate, setSelectedInputDate] = useState<string>('2026-11-02');

  // Load entries on mount
  useEffect(() => {
    setIsSupabase(isSupabaseConfigured());
    const loadData = async () => {
      const data = await fetchSpklEntries();
      setEntries(data);
      if (data.length > 0) {
        setSelectedEntry(data[0]);
      }
    };
    loadData();
  }, []);

  // Total jam bulan ini
  const totalJamBulan = entries
    .filter((e) => e.tanggal.startsWith(currentMonth))
    .reduce((sum, item) => sum + (Number(item.total_jam_nyata) || 0), 0);

  // Handle save entry
  const handleSaveEntry = async (entry: Omit<SpklEntry, 'id'>) => {
    const saved = await insertSpklEntry(entry);
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.tanggal !== saved.tanggal);
      return [...filtered, saved].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    });
    setSelectedEntry(saved);
  };

  // Handle delete entry
  const handleDeleteEntry = async (id: string) => {
    await deleteSpklEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Handle excel export
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const blob = await generateSpklExcel(entries, currentMonth);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rekap_Lembur_PTC_${currentMonth}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export Excel failed:', err);
      alert('Gagal mengekspor file Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectForSpkl = (entry: SpklEntry) => {
    setSelectedEntry(entry);
    setActiveTab('spkl');
  };

  const handleSelectDateForInput = (dateStr: string) => {
    setSelectedInputDate(dateStr);
    setActiveTab('input');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportExcel={handleExportExcel}
        isExporting={isExporting}
        isSupabase={isSupabase}
        totalJamBulan={totalJamBulan}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Quick Info */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {DEFAULT_PEKERJA.nama} &bull; {DEFAULT_PEKERJA.no_pekerja}
              </div>
              <div className="text-xs text-slate-500">
                {DEFAULT_PEKERJA.jabatan} &bull; Lokasi: {DEFAULT_PEKERJA.tempat} &bull; Biaya: {DEFAULT_PEKERJA.biaya_ditanggung}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
              Menyetujui: <strong>{DEFAULT_PEKERJA.menyetujui.nama}</strong>
            </div>
            <div className="px-3 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
              Mengetahui: <strong>{DEFAULT_PEKERJA.mengetahui.nama}</strong>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'input' && (
          <FormInputSpkl
            onSaveEntry={handleSaveEntry}
            initialDate={selectedInputDate}
          />
        )}

        {activeTab === 'rekap' && (
          <RekapTable
            currentMonth={currentMonth}
            entries={entries}
            onDeleteEntry={handleDeleteEntry}
            onSelectForSpkl={handleSelectForSpkl}
            onSelectDateForInput={handleSelectDateForInput}
          />
        )}

        {activeTab === 'spkl' && (
          <SpklSlipView
            entries={entries.filter((e) => e.tanggal.startsWith(currentMonth))}
            selectedEntry={selectedEntry}
          />
        )}

        {activeTab === 'guide' && <SetupGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} PT Pertamina Training & Consulting (PTC) &bull; Sistem SPKL Operasional IT
          </div>
          <div className="text-slate-400">
            Reguler mulai 15:31 (Min. 30 Menit) &bull; Satgas / Libur Jam Aktual
          </div>
        </div>
      </footer>
    </div>
  );
}
