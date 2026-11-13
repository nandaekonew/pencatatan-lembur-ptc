'use client';

import React, { useState } from 'react';
import { SpklEntry, DEFAULT_PEKERJA, KETENTUAN_SPKL } from '@/types/spkl';
import { Printer, Calendar, FileText, ChevronRight } from 'lucide-react';

interface SpklSlipViewProps {
  entries: SpklEntry[];
  selectedEntry?: SpklEntry | null;
}

export const SpklSlipView: React.FC<SpklSlipViewProps> = ({ entries, selectedEntry: propSelectedEntry }) => {
  const [selectedId, setSelectedId] = useState<string>(
    propSelectedEntry?.id || (entries[0] ? (entries[0].id || entries[0].tanggal) : '')
  );

  const activeEntry = entries.find((e) => (e.id || e.tanggal) === selectedId) || propSelectedEntry || entries[0];

  const handlePrint = () => {
    window.print();
  };

  if (!activeEntry) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700">Belum ada data lembur untuk dicetak</h3>
        <p className="text-xs text-slate-500 mt-1">Silakan input aktivitas lembur terlebih dahulu pada tab Input Lembur.</p>
      </div>
    );
  }

  const [yearStr, monthStr, dayStr] = (activeEntry.tanggal || '2026-11-01').split('-');
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthIdx = parseInt(monthStr || '11', 10) - 1;
  const formattedDate = `${dayStr} ${monthNames[monthIdx] || 'November'} ${yearStr}`;

  return (
    <div className="space-y-6">
      {/* Control bar (No-print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Calendar className="w-5 h-5 text-slate-600" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase">Pilih Tanggal SPKL:</label>
            <select
              value={activeEntry.id || activeEntry.tanggal}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-0.5 px-3 py-1.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            >
              {entries.map((item) => (
                <option key={item.id || item.tanggal} value={item.id || item.tanggal}>
                  {item.tanggal} &bull; {item.kegiatan.substring(0, 45)}... ({item.total_jam_nyata} Jam)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Dokumen SPKL (PDF)</span>
        </button>
      </div>

      {/* Official SPKL Paper Document (A4 Printable Layout) */}
      <div className="bg-white max-w-3xl mx-auto p-8 sm:p-12 rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900 font-serif">
        {/* Document Header */}
        <div className="text-center pb-4 border-b-2 border-slate-800 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-900">
            Surat Perintah Kerja Lembur
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Nomor: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /PTC-lembur/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / {yearStr}
          </p>
        </div>

        {/* Date Place */}
        <div className="text-right text-xs font-sans text-slate-700 mb-4">
          Surabaya, {formattedDate}
        </div>

        {/* Introduction */}
        <div className="mb-4 text-xs font-sans text-slate-800 font-semibold">
          Dengan ini mengijinkan / menugaskan :
        </div>

        {/* Employee Identity Table */}
        <div className="bg-slate-50/70 p-3 rounded border border-slate-200 mb-6 font-sans text-xs">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-32 py-1 text-slate-600">Nama</td>
                <td className="w-4 py-1">:</td>
                <td className="py-1 font-bold text-slate-900">{activeEntry.nama_pekerja || DEFAULT_PEKERJA.nama}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">No. Pekerja</td>
                <td className="py-1">:</td>
                <td className="py-1 font-mono font-bold text-slate-900">{activeEntry.no_pekerja || DEFAULT_PEKERJA.no_pekerja}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Golongan</td>
                <td className="py-1">:</td>
                <td className="py-1 text-slate-900">{activeEntry.golongan || DEFAULT_PEKERJA.golongan}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Jabatan</td>
                <td className="py-1">:</td>
                <td className="py-1 text-slate-900">{activeEntry.jabatan || DEFAULT_PEKERJA.jabatan}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Task Details */}
        <div className="mb-2 text-xs font-sans text-slate-800 font-semibold">
          Untuk Melaksanakan :
        </div>
        <div className="bg-slate-50/70 p-3 rounded border border-slate-200 mb-6 font-sans text-xs">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-44 py-1 text-slate-600">Proyek / Kegiatan</td>
                <td className="w-4 py-1">:</td>
                <td className="py-1 font-semibold text-slate-900">{activeEntry.proyek || DEFAULT_PEKERJA.proyek}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Tanggal Pelaksanaan</td>
                <td className="py-1">:</td>
                <td className="py-1 text-slate-900">{formattedDate}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Terhitung Mulai Jam</td>
                <td className="py-1">:</td>
                <td className="py-1 font-mono text-slate-900">{activeEntry.mulai}:00 WIB</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Sampai Dengan Jam</td>
                <td className="py-1">:</td>
                <td className="py-1 font-mono text-slate-900">{activeEntry.selesai}:00 WIB</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Total Jam Nyata</td>
                <td className="py-1">:</td>
                <td className="py-1 font-bold text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    {activeEntry.total_jam_nyata} Jam
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Tempat</td>
                <td className="py-1">:</td>
                <td className="py-1 text-slate-900">{activeEntry.tempat || DEFAULT_PEKERJA.tempat}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Biaya Ditanggung Oleh</td>
                <td className="py-1">:</td>
                <td className="py-1 text-slate-900">{activeEntry.biaya_ditanggung || DEFAULT_PEKERJA.biaya_ditanggung}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600 align-top">Rincian Pekerjaan</td>
                <td className="py-1 align-top">:</td>
                <td className="py-1 text-slate-900 font-medium leading-relaxed">{activeEntry.kegiatan}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature Blocks */}
        <div className="grid grid-cols-3 gap-4 pt-6 pb-2 text-center font-sans text-xs">
          <div>
            <div className="font-semibold text-slate-800">Yang Melaksanakan (Ybs):</div>
            <div className="h-20 flex items-center justify-center text-slate-300 italic text-[11px]">
              ( Tanda Tangan )
            </div>
            <div className="font-bold underline text-slate-900">
              {activeEntry.nama_pekerja || DEFAULT_PEKERJA.nama}
            </div>
            <div className="text-[10px] text-slate-500">
              NIP: {activeEntry.no_pekerja || DEFAULT_PEKERJA.no_pekerja}
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-800">Menyetujui (Atasan Ybs):</div>
            <div className="text-[10px] text-slate-500 leading-tight">
              {DEFAULT_PEKERJA.menyetujui.jabatan}
            </div>
            <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
              ( Tanda Tangan )
            </div>
            <div className="font-bold underline text-slate-900">
              {DEFAULT_PEKERJA.menyetujui.nama}
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-800">Mengetahui:</div>
            <div className="text-[10px] text-slate-500 leading-tight">
              {DEFAULT_PEKERJA.mengetahui.jabatan}
            </div>
            <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
              ( Tanda Tangan )
            </div>
            <div className="font-bold underline text-slate-900">
              {DEFAULT_PEKERJA.mengetahui.nama}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 pt-2 border-t border-slate-200 text-[11px] italic font-sans text-slate-600">
          Note: Wajib melapor hasil lembur ke atasan yang bersangkutan.
        </div>

        {/* Rules Footer */}
        <div className="mt-6 pt-3 border-t-2 border-slate-300 font-sans text-[10px] text-slate-600">
          <div className="font-bold text-slate-800 mb-1">Ketentuan :</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {KETENTUAN_SPKL.map((k, i) => (
              <div key={i}>{k}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
