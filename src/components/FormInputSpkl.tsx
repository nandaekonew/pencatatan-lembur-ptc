'use client';

import React, { useState, useEffect } from 'react';
import { validateLembur, isWeekend } from '@/lib/spkl-validator';
import { SpklEntry, KategoriHari, DEFAULT_PEKERJA } from '@/types/spkl';
import { Check, Copy, CheckCircle2, AlertTriangle, Clock, Calendar, Sparkles, Send } from 'lucide-react';

interface FormInputSpklProps {
  onSaveEntry: (entry: Omit<SpklEntry, 'id'>) => Promise<void>;
  initialDate?: string;
}

const TEMPLATE_KEGIATAN = [
  'Support Acara Rapat Triple M fungsi S&D dan lanjut uji coba dan monitoring PA di dalam Gedung juga di area luar Gedung kantor Jagir',
  'Support Acara Rapat Triple M fungsi S&D dan Support GR Dapen Himpana',
  'Satgas penyaluran BBM di Ruang Puskodal',
  'Perbaikan Public Adressor suara noice dan mengatur suara adzan untuk masuk ke Kantor Regional',
  'Support Acara pelatihan AWB HC RR Pertamax dan GR acara Legal Counsel di RR Fastron',
  'Support upacara hari pahlawan 05:00-07:00, Support Acara pelatihan AWB HC RR Pertamax dan GR acara Legal Counsel di RR Fastron',
  'Support Acara Fungsi IA Visit BPK RI di RR Prima XP',
];

export const FormInputSpkl: React.FC<FormInputSpklProps> = ({ onSaveEntry, initialDate }) => {
  const [tanggal, setTanggal] = useState<string>(initialDate || '2026-11-02');
  const [kategoriHari, setKategoriHari] = useState<KategoriHari>('Hari Kerja Reguler');
  const [mulai, setMulai] = useState<string>('15:30');
  const [selesai, setSelesai] = useState<string>('21:00');
  const [kegiatan, setKegiatan] = useState<string>('Support Acara Rapat Triple M fungsi S&D dan Support GR Dapen Himpana');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Auto detect weekend when date changes
  useEffect(() => {
    if (tanggal) {
      if (isWeekend(tanggal)) {
        setKategoriHari('Hari Libur / Akhir Pekan / Satgas');
        if (mulai === '15:30') setMulai('08:00');
        if (selesai === '21:00') setSelesai('17:00');
      } else {
        setKategoriHari('Hari Kerja Reguler');
        if (mulai === '08:00' || mulai === '07:00') setMulai('15:30');
      }
    }
  }, [tanggal]);

  // Run validation
  const validationResult = validateLembur({
    tanggal,
    kegiatan,
    mulai,
    selesai,
    kategori_hari: kategoriHari,
    proyek: DEFAULT_PEKERJA.proyek,
    tempat: DEFAULT_PEKERJA.tempat,
  });

  const jsonPureString = JSON.stringify(validationResult, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPureString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal || !kegiatan.trim()) {
      alert('Silakan lengkapi tanggal dan rincian kegiatan.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveEntry({
        tanggal,
        kegiatan: kegiatan.trim(),
        mulai,
        selesai,
        total_jam_nyata: validationResult.entry.total_jam_nyata,
        kategori_hari: kategoriHari,
        proyek: DEFAULT_PEKERJA.proyek,
        tempat: DEFAULT_PEKERJA.tempat,
        is_valid: validationResult.is_valid,
        validation_note: validationResult.validation_note,
        nama_pekerja: DEFAULT_PEKERJA.nama,
        no_pekerja: DEFAULT_PEKERJA.no_pekerja,
        jabatan: DEFAULT_PEKERJA.jabatan,
        golongan: DEFAULT_PEKERJA.golongan,
        biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
        menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
        menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
        mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
        mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Gagal menyimpan entri SPKL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* FORM INPUT LEMBUR */}
      <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Input Aktivitas Lembur Harian</h2>
            <p className="text-xs text-slate-500">Pencatatan dan verifikasi otomatis aturan lembur PTC</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700">
            {DEFAULT_PEKERJA.nama} ({DEFAULT_PEKERJA.no_pekerja})
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tanggal & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Tanggal Lembur
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Hari
              </label>
              <select
                value={kategoriHari}
                onChange={(e) => setKategoriHari(e.target.value as KategoriHari)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              >
                <option value="Hari Kerja Reguler">Hari Kerja Reguler</option>
                <option value="Hari Libur / Akhir Pekan / Satgas">Hari Libur / Akhir Pekan / Satgas</option>
              </select>
            </div>
          </div>

          {/* Jam Mulai & Jam Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Jam Mulai
              </label>
              <input
                type="time"
                value={mulai}
                onChange={(e) => setMulai(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                <span className="text-[10px] text-slate-500 mr-1">Preset:</span>
                {kategoriHari === 'Hari Kerja Reguler' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMulai('15:30')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      15:30
                    </button>
                    <button
                      type="button"
                      onClick={() => setMulai('15:31')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      15:31
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setMulai('07:00')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      07:00 (Satgas)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMulai('08:00')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      08:00
                    </button>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Jam Selesai
              </label>
              <input
                type="time"
                value={selesai}
                onChange={(e) => setSelesai(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                <span className="text-[10px] text-slate-500 mr-1">Preset:</span>
                {kategoriHari === 'Hari Kerja Reguler' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelesai('18:00')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      18:00 (2.5 Jam)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelesai('21:00')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      21:00 (5.5 Jam)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelesai('21:30')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      21:30 (6 Jam)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelesai('17:00')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      17:00 (10 Jam)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelesai('21:00')}
                      className="px-1.5 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                    >
                      21:00 (13 Jam)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Deskripsi Kegiatan */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Deskripsi Kegiatan Lembur
              </label>
              <span className="text-[11px] text-slate-400">Jelas & Ringkas</span>
            </div>
            <textarea
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
              rows={3}
              required
              placeholder="Contoh: Support Acara Rapat Triple M fungsi S&D..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />

            {/* Quick Templates */}
            <div className="mt-2">
              <div className="flex items-center text-[11px] font-medium text-slate-500 mb-1">
                <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                Template Kegiatan Cepat (Klik untuk memilih):
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded border border-slate-200">
                {TEMPLATE_KEGIATAN.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setKegiatan(tpl)}
                    className="text-[11px] text-left px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 truncate max-w-full"
                    title={tpl}
                  >
                    &bull; {tpl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Identitas Default Pengesahan (Read-only Info) */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Identitas & Otorisasi Pengesahan SPKL:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Proyek/Tempat:</span> {DEFAULT_PEKERJA.proyek} / {DEFAULT_PEKERJA.tempat}
              </div>
              <div>
                <span className="text-slate-500">Biaya:</span> {DEFAULT_PEKERJA.biaya_ditanggung}
              </div>
              <div>
                <span className="text-slate-500">Menyetujui:</span> {DEFAULT_PEKERJA.menyetujui.nama} ({DEFAULT_PEKERJA.menyetujui.jabatan})
              </div>
              <div>
                <span className="text-slate-500">Mengetahui:</span> {DEFAULT_PEKERJA.mengetahui.nama} ({DEFAULT_PEKERJA.mengetahui.jabatan})
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs">
              {saveSuccess && (
                <span className="inline-flex items-center text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Berhasil disimpan ke rekap bulanan!
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan ke Rekap'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* VALIDASI REAL-TIME & FORMAT OUTPUT JSON WAJIB */}
      <div className="lg:col-span-5 space-y-4">
        {/* Validation Status Card */}
        <div
          className={`rounded-xl p-5 border shadow-sm transition-all ${
            validationResult.is_valid
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-rose-50 border-rose-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {validationResult.is_valid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <h3
                className={`font-bold text-sm ${
                  validationResult.is_valid ? 'text-emerald-900' : 'text-rose-900'
                }`}
              >
                {validationResult.is_valid ? 'LEMBUR VALID' : 'LEMBUR TIDAK VALID / DITOLAK'}
              </h3>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  validationResult.is_valid
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-rose-200 text-rose-900'
                }`}
              >
                {validationResult.entry.total_jam_nyata} Jam Nyata
              </span>
            </div>
          </div>

          <p
            className={`mt-2 text-xs leading-relaxed ${
              validationResult.is_valid ? 'text-emerald-800' : 'text-rose-800'
            }`}
          >
            {validationResult.validation_note}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <span className="text-slate-400">Durasi:</span>{' '}
              <strong className="text-slate-800">
                {mulai} s/d {selesai}
              </strong>
            </div>
            <div>
              <span className="text-slate-400">Ketentuan:</span>{' '}
              <span className="text-slate-700">
                {kategoriHari === 'Hari Kerja Reguler' ? 'Mulai 15:31 (Min. 30m)' : 'Jam Aktual Penuh'}
              </span>
            </div>
          </div>
        </div>

        {/* JSON OUTPUT WAJIB (Pure JSON) */}
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-200">
                FORMAT OUTPUT WAJIB (JSON MURNI)
              </span>
            </div>
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Salin JSON Murni ke Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Salin JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-80">
            {jsonPureString}
          </pre>
        </div>

        {/* Ketentuan SPKL Quick Reference */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-xs">
          <h4 className="font-bold text-slate-900 mb-2">Ketentuan SPKL (Aturan Baku):</h4>
          <ul className="space-y-1 text-[11px] text-slate-600">
            <li>&bull; <strong>Hari Kerja:</strong> Dihitung mulai pukul 15:31. Jika durasi &lt; 30 menit (selesai sebelum 16:01), ditolak (0 jam).</li>
            <li>&bull; <strong>Hari Libur/Satgas:</strong> Dihitung penuh sesuai jam aktual penugasan (contoh: 07:00 - 17:00 = 10 jam).</li>
            <li>&bull; <strong>Kalkulasi Jam:</strong> (Selesai - Mulai) dalam jam desimal (contoh: 15:30 s/d 21:00 = 5.5 jam).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
