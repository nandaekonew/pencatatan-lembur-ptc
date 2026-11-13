'use client';

import React from 'react';
import { isWeekend } from '@/lib/spkl-validator';
import { SpklEntry } from '@/types/spkl';
import { Trash2, Printer, PlusCircle, Calendar, Clock } from 'lucide-react';

interface RekapTableProps {
  currentMonth: string; // YYYY-MM
  entries: SpklEntry[];
  onDeleteEntry: (id: string) => Promise<void>;
  onSelectForSpkl: (entry: SpklEntry) => void;
  onSelectDateForInput: (dateStr: string) => void;
}

export const RekapTable: React.FC<RekapTableProps> = ({
  currentMonth,
  entries,
  onDeleteEntry,
  onSelectForSpkl,
  onSelectDateForInput,
}) => {
  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr || '2026', 10);
  const month = parseInt(monthStr || '11', 10);

  const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthHeaderLabel = `${monthShorts[month - 1]}-${year.toString().slice(-2)}`;
  const daysInMonth = new Date(year, month, 0).getDate();

  // Calculate sum of total_jam_nyata
  const totalJamBulan = entries
    .filter((e) => e.tanggal.startsWith(currentMonth))
    .reduce((acc, curr) => acc + (Number(curr.total_jam_nyata) || 0), 0);

  // Generate 1..daysInMonth array
  const daysList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Title Banner - Matching Excel Design */}
      <div className="bg-[#92D050] text-center py-2.5 border-b border-slate-300">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide underline">
          Rekap Lembur Harian
        </h2>
      </div>

      {/* Subheader Month Banner */}
      <div className="bg-[#FFFF00] text-center py-1.5 border-b border-slate-300">
        <span className="text-sm font-bold text-slate-900">{monthHeaderLabel} ({monthNames[month - 1]} {year})</span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#FFFF00] text-slate-900 text-center font-bold border-b border-slate-300">
              <th className="py-2.5 px-3 border border-slate-300 w-12">No</th>
              <th className="py-2.5 px-3 border border-slate-300 w-14">Tgl</th>
              <th className="py-2.5 px-4 border border-slate-300 text-left min-w-[280px]">Kegiatan</th>
              <th className="py-2.5 px-3 border border-slate-300 w-24">Mulai</th>
              <th className="py-2.5 px-3 border border-slate-300 w-24">Selesai</th>
              <th className="py-2.5 px-3 border border-slate-300 w-28">Total Jam Nyata</th>
              <th className="py-2.5 px-3 border border-slate-300 w-24 no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daysList.map((day) => {
              const dayStr = day.toString().padStart(2, '0');
              const fullDateStr = `${year}-${month.toString().padStart(2, '0')}-${dayStr}`;
              const entry = entries.find((e) => e.tanggal === fullDateStr);
              const isWeekendDay = isWeekend(fullDateStr);

              return (
                <tr
                  key={day}
                  className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                    entry ? 'bg-amber-50/40' : isWeekendDay ? 'bg-slate-50/50' : ''
                  }`}
                >
                  {/* No */}
                  <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-slate-700">
                    {day}
                  </td>

                  {/* Tgl */}
                  <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-slate-700">
                    {day}
                  </td>

                  {/* Kegiatan */}
                  <td className="py-2 px-4 border-r border-slate-200 text-slate-800">
                    {entry ? (
                      <div>
                        <span className="font-medium">{entry.kegiatan}</span>
                        {entry.kategori_hari === 'Hari Libur / Akhir Pekan / Satgas' && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded">
                            Satgas/Libur
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectDateForInput(fullDateStr)}
                        className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center space-x-1 py-0.5"
                      >
                        <PlusCircle className="w-3 h-3 text-slate-400" />
                        <span>Tambah entri tgl {day}</span>
                      </button>
                    )}
                  </td>

                  {/* Mulai */}
                  <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-slate-700">
                    {entry ? (entry.mulai.includes(':') && entry.mulai.length === 5 ? `${entry.mulai}:00` : entry.mulai) : ''}
                  </td>

                  {/* Selesai */}
                  <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-slate-700">
                    {entry ? (entry.selesai.includes(':') && entry.selesai.length === 5 ? `${entry.selesai}:00` : entry.selesai) : ''}
                  </td>

                  {/* Total Jam Nyata */}
                  <td className="py-2 px-3 text-center border-r border-slate-200 font-mono font-bold text-slate-900">
                    {entry ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {entry.total_jam_nyata}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-2 px-2 text-center no-print">
                    {entry && (
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onSelectForSpkl(entry)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded"
                          title="Lihat / Cetak Surat Perintah Kerja Lembur"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {entry.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus entri lembur tanggal ${entry.tanggal}?`)) {
                                onDeleteEntry(entry.id!);
                              }
                            }}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded"
                            title="Hapus entri lembur"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer Summary Row */}
          <tfoot>
            <tr className="bg-emerald-50 text-slate-900 font-bold border-t-2 border-slate-400">
              <td colSpan={5} className="py-3 px-4 text-right border-r border-slate-300 uppercase tracking-wider text-xs">
                Total Jam Nyata ({monthHeaderLabel}):
              </td>
              <td className="py-3 px-3 text-center font-mono text-sm text-emerald-900 border-r border-slate-300">
                {totalJamBulan.toFixed(2)} Jam
              </td>
              <td className="py-3 px-2 no-print"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
