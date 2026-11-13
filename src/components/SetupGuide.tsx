'use client';

import React, { useState } from 'react';
import { Database, GitBranch, Globe, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlCode = `-- Skema Database Supabase untuk SPKL PTC
CREATE TABLE IF NOT EXISTS spkl_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL,
  kegiatan TEXT NOT NULL,
  mulai TIME NOT NULL,
  selesai TIME NOT NULL,
  total_jam_nyata NUMERIC(5, 2) NOT NULL DEFAULT 0,
  kategori_hari VARCHAR(50) NOT NULL DEFAULT 'Hari Kerja Reguler',
  is_valid BOOLEAN NOT NULL DEFAULT true,
  validation_note TEXT DEFAULT 'Valid',
  nama_pekerja VARCHAR(100) NOT NULL DEFAULT 'Nanda Eko Widianto',
  no_pekerja VARCHAR(50) NOT NULL DEFAULT 'D013-260003',
  jabatan VARCHAR(100) NOT NULL DEFAULT 'Office service',
  golongan VARCHAR(20) DEFAULT '-',
  proyek VARCHAR(100) NOT NULL DEFAULT 'Umum',
  tempat VARCHAR(100) NOT NULL DEFAULT 'PTC',
  biaya_ditanggung VARCHAR(100) NOT NULL DEFAULT 'Perusahaan',
  menyetujui_nama VARCHAR(100) NOT NULL DEFAULT 'Ali Hakim Rosidi',
  menyetujui_jabatan VARCHAR(100) NOT NULL DEFAULT 'Area Manager IT Region Jatimbalinus',
  mengetahui_nama VARCHAR(100) NOT NULL DEFAULT 'Ricky Roy Sagita',
  mengetahui_jabatan VARCHAR(100) NOT NULL DEFAULT 'Manpower Supply Manager',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE spkl_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for SPKL entries" 
ON spkl_entries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;

  const gitCode = `git init
git add .
git commit -m "feat: inisialisasi aplikasi pencatatan dan validator SPKL PTC"
git branch -M main
git remote add origin https://github.com/USERNAME/pencatatan-lembur-ptc.git
git push -u origin main`;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Panduan Integrasi & Deployment (Supabase &bull; GitHub &bull; Vercel)
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Aplikasi ini dirancang siap pakai (Plug & Play). Anda dapat menggunakan aplikasi ini secara lokal/offline melalui browser storage, atau menghubungkannya ke cloud database Supabase dan mendeploy ke Vercel agar dapat diakses dari mana saja secara online.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Supabase */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">1. Database Supabase</h3>
            <p className="text-xs text-slate-500 mb-4">
              Buat project gratis di supabase.com, buka <strong>SQL Editor</strong>, dan jalankan skema tabel.
            </p>

            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono relative mb-4">
              <div className="text-slate-400 mb-1"># File: supabase-schema.sql</div>
              <pre className="max-h-36 overflow-y-auto">{sqlCode}</pre>
              <button
                onClick={() => handleCopy(sqlCode, 'sql')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center space-x-1"
              >
                {copiedSection === 'sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'sql' ? 'Tersalin' : 'Salin SQL'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Env Variables:</strong>
            <div className="font-mono text-[10px] text-slate-500 mt-1">
              NEXT_PUBLIC_SUPABASE_URL<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </div>
          </div>
        </div>

        {/* Step 2: GitHub */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">2. Repository GitHub</h3>
            <p className="text-xs text-slate-500 mb-4">
              Buat repo baru di GitHub (misal <code>pencatatan-lembur-ptc</code>), lalu push kode dari terminal.
            </p>

            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono relative mb-4">
              <pre className="overflow-x-auto">{gitCode}</pre>
              <button
                onClick={() => handleCopy(gitCode, 'git')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center space-x-1"
              >
                {copiedSection === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'git' ? 'Tersalin' : 'Salin Git'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Catatan:</strong> Kode sudah terkonfigurasi dengan <code>.gitignore</code> aman, memastikan credential tidak bocor.
          </div>
        </div>

        {/* Step 3: Vercel */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">3. Deploy ke Vercel</h3>
            <p className="text-xs text-slate-500 mb-4">
              Akses vercel.com &bull; Klik <strong>Add New Project</strong> &bull; Import repo GitHub Anda &bull; Tambahkan Environment Variables.
            </p>

            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-2 mb-4">
              <li>Hubungkan akun GitHub di Vercel</li>
              <li>Pilih repository <strong>pencatatan-lembur-ptc</strong></li>
              <li>Di bagian <strong>Environment Variables</strong>, masukkan URL dan Anon Key Supabase</li>
              <li>Klik <strong>Deploy</strong> (selesai dalam 1 menit)</li>
            </ol>
          </div>

          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-1.5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Buka Dashboard Vercel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
