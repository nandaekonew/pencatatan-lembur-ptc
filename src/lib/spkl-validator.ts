import { KategoriHari, ValidationOutput, DEFAULT_PEKERJA } from '@/types/spkl';

export interface ValidateInput {
  tanggal: string; // YYYY-MM-DD
  kegiatan: string;
  mulai: string; // HH:mm or HH:mm:ss
  selesai: string; // HH:mm or HH:mm:ss
  kategori_hari?: KategoriHari;
  proyek?: string;
  tempat?: string;
}

/**
 * Mengubah string waktu 'HH:mm' atau 'HH:mm:ss' menjadi total menit sejak 00:00
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  return hours * 60 + minutes;
}

/**
 * Format string waktu agar selalu 'HH:mm'
 */
export function formatTimeHHmm(timeStr: string): string {
  if (!timeStr) return '00:00';
  const parts = timeStr.trim().split(':');
  const hh = (parts[0] || '00').padStart(2, '0');
  const mm = (parts[1] || '00').padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Menentukan apakah suatu tanggal adalah hari Sabtu atau Minggu
 */
export function isWeekend(dateStr: string): boolean {
  if (!dateStr) return false;
  // Parse YYYY-MM-DD
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3) return false;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Minggu, 6 = Sabtu
}

/**
 * Memvalidasi dan menghitung jam lembur sesuai ketentuan SPKL PTC
 */
export function validateLembur(input: ValidateInput): ValidationOutput {
  const tanggal = input.tanggal?.trim() || '';
  const kegiatan = input.kegiatan?.trim() || '';
  const mulaiRaw = input.mulai?.trim() || '15:30';
  const selesaiRaw = input.selesai?.trim() || '18:00';
  const mulai = formatTimeHHmm(mulaiRaw);
  const selesai = formatTimeHHmm(selesaiRaw);
  const proyek = input.proyek || DEFAULT_PEKERJA.proyek;
  const tempat = input.tempat || DEFAULT_PEKERJA.tempat;

  // Tentukan kategori hari jika tidak diberikan
  let kategori: KategoriHari = input.kategori_hari || (isWeekend(tanggal) ? 'Hari Libur / Akhir Pekan / Satgas' : 'Hari Kerja Reguler');

  // Konversi menit
  const startMinutes = timeToMinutes(mulai);
  let endMinutes = timeToMinutes(selesai);

  // Jika jam selesai lebih kecil dari jam mulai (misal lembur melewati tengah malam)
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  // Durasi kotor dalam menit
  const durasiMenit = endMinutes - startMinutes;

  // Kasus Hari Kerja Reguler
  if (kategori === 'Hari Kerja Reguler') {
    // Patokan reguler lembur dihitung mulai 15:31
    // Batas minimum 30 menit -> selesai harus >= 16:01 (atau durasi dari 15:31 minimal 30 menit)
    const cutoffStart = timeToMinutes('15:31');
    const cutoffMinFinish = timeToMinutes('16:01');

    if (endMinutes < cutoffMinFinish || durasiMenit < 30) {
      return {
        is_valid: false,
        validation_note: 'Durasi lembur kurang dari 30 menit (selesai sebelum 16:01). Sesuai ketentuan, lembur dianggap tidak ada (0 jam).',
        entry: {
          tanggal,
          kegiatan,
          mulai,
          selesai,
          total_jam_nyata: 0,
          proyek,
          tempat,
        },
      };
    }

    // Jika mulai sebelum 15:30 pada hari kerja reguler, berikan catatan informatif
    const nominalStartMinutes = startMinutes < timeToMinutes('15:30') ? timeToMinutes('15:30') : startMinutes;
    const effectiveMinutes = endMinutes - nominalStartMinutes;
    
    // Total jam nyata dihitung desimal presisi 2 digit
    // Contoh: 15:30 s/d 21:00 = 5.5 jam; 15:30 s/d 21:30 = 6 jam
    const totalJam = Math.round((effectiveMinutes / 60) * 100) / 100;

    let note = 'Valid';
    if (startMinutes < timeToMinutes('15:30')) {
      note = 'Valid (Catatan: Jam mulai disesuaikan mulai jam kerja lembur 15:30)';
    }

    return {
      is_valid: true,
      validation_note: note,
      entry: {
        tanggal,
        kegiatan,
        mulai,
        selesai,
        total_jam_nyata: totalJam,
        proyek,
        tempat,
      },
    };
  }

  // Kasus Hari Libur / Akhir Pekan / Satgas
  // Jam mulai dan selesai dihitung penuh sesuai jam aktual penugasan
  if (durasiMenit <= 0) {
    return {
      is_valid: false,
      validation_note: 'Jam selesai harus lebih besar dari jam mulai.',
      entry: {
        tanggal,
        kegiatan,
        mulai,
        selesai,
        total_jam_nyata: 0,
        proyek,
        tempat,
      },
    };
  }

  const totalJamLibur = Math.round((durasiMenit / 60) * 100) / 100;

  return {
    is_valid: true,
    validation_note: 'Valid (Hari Libur/Akhir Pekan/Satgas dihitung penuh sesuai jam aktual)',
    entry: {
      tanggal,
      kegiatan,
      mulai,
      selesai,
      total_jam_nyata: totalJamLibur,
      proyek,
      tempat,
    },
  };
}
