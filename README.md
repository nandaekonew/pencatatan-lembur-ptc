# Sistem Pencatatan & Validator SPKL Harian Operasional PTC

Aplikasi web modern untuk pencatatan, validasi otomatis, rekapitulasi, cetak dokumen resmi, dan ekspor Excel **Surat Perintah Kerja Lembur (SPKL)** harian operasional PT Pertamina Training & Consulting (PTC) - IT Region Jatimbalinus.

Aplikasi ini siap di-deploy secara online ke **Vercel**, terintegrasi dengan database **Supabase**, dan dikelola di repository **GitHub**.

---

## 📋 Identitas Default Pekerja & Pengesahan

- **Nama Pekerja**: Nanda Eko Widianto
- **No. Pekerja**: D013-260003
- **Jabatan**: Office service
- **Golongan**: -
- **Proyek / Kegiatan**: Umum
- **Tempat**: PTC
- **Biaya Ditanggung Oleh**: Perusahaan
- **Menyetujui (Atasan Ybs)**: Ali Hakim Rosidi *(Area Manager IT Region Jatimbalinus)*
- **Mengetahui**: Ricky Roy Sagita *(Manpower Supply Manager)*

---

## ⚖️ Aturan & Ketentuan Validasi Lembur (SPKL)

1. **Hari Kerja Reguler:**
   - Jam lembur dihitung mulai pukul **15:31**.
   - Jika durasi lembur kurang dari 30 menit (selesai sebelum **16:01**), lembur **tidak valid / ditolak (0 jam)**.
   - Jika durasi lembur $\ge$ 30 menit, waktu mulai tercatat sesuai input (contoh: 15:30 atau 15:31).
2. **Hari Libur / Akhir Pekan / Satgas:**
   - Jam mulai dan selesai dihitung penuh sesuai jam aktual penugasan (contoh: 07:00 s/d 17:00 = 10 jam, 08:00 s/d 21:00 = 13 jam).
3. **Kalkulasi Jam Nyata:**
   - Rumus: $(\text{Jam Selesai} - \text{Jam Mulai})$ dalam satuan jam desimal presisi (contoh: 15:30 s/d 21:00 = 5.5 jam; 15:30 s/d 21:30 = 6 jam).

---

## 🚀 Format Output API Validasi (JSON Murni)

Endpoint: `POST /api/validate` atau `GET /api/validate`

Format output:
```json
{
  "is_valid": true,
  "validation_note": "Valid",
  "entry": {
    "tanggal": "2026-11-02",
    "kegiatan": "Support Acara Rapat Triple M fungsi S&D...",
    "mulai": "15:30",
    "selesai": "21:30",
    "total_jam_nyata": 6,
    "proyek": "Umum",
    "tempat": "PTC"
  }
}
```

---

## ✨ Fitur Utama Aplikasi

1. **Input & Validasi Lembur Interaktif**:
   - Deteksi otomatis hari libur / akhir pekan (Sabtu & Minggu).
   - Validasi instan dengan badge status dan pesan penjelasan.
   - Salin JSON murni dalam 1-klik untuk integrasi eksternal.
   - Preset waktu dan template kegiatan operasional aktual.
2. **Rekap Bulanan Grid 1 - 31 (Sesuai Format Excel)**:
   - Tampilan visual persis seperti lembar kerja Excel PTC (Header Hijau `#92D050` & Kuning `#FFFF00`).
   - Akumulasi live total jam lembur dalam 1 bulan penuh.
3. **Pratinjau & Cetak Dokumen SPKL Resmi**:
   - Layout dokumen A4 standar Pertamina / PTC lengkap dengan nomor surat, identitas, rincian pekerjaan, dan kolom tanda tangan 3 pihak (Ybs, Menyetujui, Mengetahui).
   - Dukungan cetak langsung (Ctrl + P / PDF export).
4. **Export Excel (.xlsx)**:
   - Dibuat menggunakan library `exceljs`.
   - **Sheet 1**: Rekap Lembur Harian (tabel tanggal 1–31, styling sel, formula SUM otomatis).
   - **Sheet 2**: Format Surat Perintah Kerja Lembur (dokumen resmi dan 6 ketentuan SPKL).
5. **Dukungan Dual-Storage (Offline & Cloud Sync)**:
   - Berfungsi langsung secara offline via browser LocalStorage.
   - Otomatis tersinkronisasi ke PostgreSQL Supabase saat API keys diisi.

---

## 🗄️ Langkah Integrasi Supabase Database

1. Buka [supabase.com](https://supabase.com) dan buat proyek baru (gratis).
2. Di dashboard Supabase, buka menu **SQL Editor**.
3. Buka file `supabase-schema.sql` di root proyek ini, salin seluruh kodenya, lalu klik **Run**.
4. Buka menu **Project Settings** > **API**.
5. Salin **Project URL** dan **anon public key**.
6. Buat file `.env.local` di folder proyek ini:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
   ```

---

## 🌐 Panduan Deploy ke Vercel

1. Buat repository baru di akun GitHub Anda, misalnya `pencatatan-lembur-ptc`.
2. Push repository ini ke GitHub:
   ```bash
   git add .
   git commit -m "feat: inisialisasi aplikasi SPKL PTC"
   git branch -M main
   git remote add origin https://github.com/USERNAME/pencatatan-lembur-ptc.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
4. Klik **Add New Project**, pilih repository `pencatatan-lembur-ptc`.
5. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Klik **Deploy**. Dalam ~1 menit aplikasi Anda sudah online dan dapat diakses publik!

---

## 🛠️ Menjalankan Secara Lokal (Development)

```bash
# Install dependencies
npm install

# Jalankan server development
npm run dev

# Buka http://localhost:3000 di browser
```
