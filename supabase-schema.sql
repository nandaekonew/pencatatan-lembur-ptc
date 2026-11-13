-- Skema Database Supabase untuk Sistem SPKL Harian PTC
-- Jalankan query ini di SQL Editor dashboard Supabase Anda

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

-- Index untuk mempermudah pencarian per bulan / tanggal
CREATE INDEX IF NOT EXISTS idx_spkl_tanggal ON spkl_entries (tanggal DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE spkl_entries ENABLE ROW LEVEL SECURITY;

-- Policy sederhana: Mengizinkan read & write publik / anon (untuk aplikasi internal operasional)
CREATE POLICY "Allow public read-write for SPKL entries" 
ON spkl_entries 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Data Awal Sampel November 2026 (berdasarkan CSV / data aktual operasional)
INSERT INTO spkl_entries (tanggal, kegiatan, mulai, selesai, total_jam_nyata, kategori_hari, is_valid, validation_note)
VALUES 
('2026-11-01', 'Satgas penyaluran BBM di Ruang Puskodal', '07:00:00', '17:00:00', 10.00, 'Hari Libur / Akhir Pekan / Satgas', true, 'Valid'),
('2026-11-02', 'Support Acara Rapat Triple M fungsi S&D dan lanjut uji coba dan monitoring PA di dalam Gedung juga di area luar Gedung kantor Jagir', '15:30:00', '21:30:00', 6.00, 'Hari Kerja Reguler', true, 'Valid'),
('2026-11-03', 'Support Acara Rapat Triple M fungsi S&D dan Support GR Dapen Himpana', '15:30:00', '21:00:00', 5.50, 'Hari Kerja Reguler', true, 'Valid'),
('2026-11-07', 'Perbaikan Public Adressor suara noice dan mengatur suara adzan untuk masuk ke Kantor Regional', '08:00:00', '21:00:00', 13.00, 'Hari Libur / Akhir Pekan / Satgas', true, 'Valid'),
('2026-11-09', 'Support Acara pelatihan AWB HC RR Pertamax dan GR acara Legal Counsel di RR Fastron', '15:30:00', '21:00:00', 5.50, 'Hari Kerja Reguler', true, 'Valid'),
('2026-11-10', 'Support upacara hari pahlawan 05:00-07:00, Support Acara pelatihan AWB HC RR Pertamax dan GR acara Legal Counsel di RR Fastron', '15:30:00', '21:30:00', 6.00, 'Hari Kerja Reguler', true, 'Valid'),
('2026-11-11', 'Support Acara pelatihan AWB HC RR Pertamax dan acara Legal Counsel di RR Fastron', '15:30:00', '18:00:00', 2.50, 'Hari Kerja Reguler', true, 'Valid'),
('2026-11-12', 'Support Acara Fungsi IA Visit BPK RI di RR Prima XP', '15:30:00', '18:00:00', 2.50, 'Hari Kerja Reguler', true, 'Valid');
