import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SpklEntry, DEFAULT_PEKERJA } from '@/types/spkl';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Initial sample data from actual November 2026 CSV
export const INITIAL_ENTRIES: SpklEntry[] = [
  {
    id: 'seed-1',
    tanggal: '2026-11-01',
    kegiatan: 'Satgas penyaluran BBM di Ruang Puskodal',
    mulai: '07:00',
    selesai: '17:00',
    total_jam_nyata: 10,
    kategori_hari: 'Hari Libur / Akhir Pekan / Satgas',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
  {
    id: 'seed-2',
    tanggal: '2026-11-02',
    kegiatan: 'Support Acara Rapat Triple M fungsi S&D dan lanjut uji coba dan monitoring PA di dalam Gedung juga di area luar Gedung kantor Jagir',
    mulai: '15:30',
    selesai: '21:30',
    total_jam_nyata: 6,
    kategori_hari: 'Hari Kerja Reguler',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
  {
    id: 'seed-3',
    tanggal: '2026-11-03',
    kegiatan: 'Support Acara Rapat Triple M fungsi S&D dan Support GR Dapen Himpana',
    mulai: '15:30',
    selesai: '21:00',
    total_jam_nyata: 5.5,
    kategori_hari: 'Hari Kerja Reguler',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
  {
    id: 'seed-4',
    tanggal: '2026-11-07',
    kegiatan: 'Perbaikan Public Adressor suara noice dan mengatur suara adzan untuk masuk ke Kantor Regional',
    mulai: '08:00',
    selesai: '21:00',
    total_jam_nyata: 13,
    kategori_hari: 'Hari Libur / Akhir Pekan / Satgas',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
  {
    id: 'seed-5',
    tanggal: '2026-11-09',
    kegiatan: 'Support Acara pelatihan AWB HC RR Pertamax dan GR acara Legal Counsel di RR Fastron',
    mulai: '15:30',
    selesai: '21:00',
    total_jam_nyata: 5.5,
    kategori_hari: 'Hari Kerja Reguler',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
  {
    id: 'seed-6',
    tanggal: '2026-11-10',
    kegiatan: 'Support upacara hari pahlawan 05:00-07:00, Support Acara pelatihan AWB HC RR Pertamax dan GR acara Legal Counsel di RR Fastron',
    mulai: '15:30',
    selesai: '21:30',
    total_jam_nyata: 6,
    kategori_hari: 'Hari Kerja Reguler',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
  {
    id: 'seed-7',
    tanggal: '2026-11-11',
    kegiatan: 'Support Acara pelatihan AWB HC RR Pertamax dan acara Legal Counsel di RR Fastron',
    mulai: '15:30',
    selesai: '18:00',
    total_jam_nyata: 2.5,
    kategori_hari: 'Hari Kerja Reguler',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
  {
    id: 'seed-8',
    tanggal: '2026-11-12',
    kegiatan: 'Support Acara Fungsi IA Visit BPK RI di RR Prima XP',
    mulai: '15:30',
    selesai: '18:00',
    total_jam_nyata: 2.5,
    kategori_hari: 'Hari Kerja Reguler',
    proyek: 'Umum',
    tempat: 'PTC',
    is_valid: true,
    validation_note: 'Valid',
    nama_pekerja: DEFAULT_PEKERJA.nama,
    no_pekerja: DEFAULT_PEKERJA.no_pekerja,
    jabatan: DEFAULT_PEKERJA.jabatan,
    golongan: DEFAULT_PEKERJA.golongan,
    biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
  },
];

const LOCAL_STORAGE_KEY = 'ptc_spkl_entries_v1';

export async function fetchSpklEntries(): Promise<SpklEntry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('spkl_entries')
        .select('*')
        .order('tanggal', { ascending: true });

      if (error) {
        console.error('Supabase fetch error, fallback to localStorage:', error);
      } else if (data && data.length > 0) {
        return data as SpklEntry[];
      }
    } catch (err) {
      console.error('Supabase exception, fallback to localStorage:', err);
    }
  }

  // Fallback to localStorage or seeds
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing local storage:', e);
      }
    }
    // Store seeds
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ENTRIES));
  }
  return INITIAL_ENTRIES;
}

export async function insertSpklEntry(entry: Omit<SpklEntry, 'id'>): Promise<SpklEntry> {
  const completeEntry: SpklEntry = {
    ...entry,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
    nama_pekerja: entry.nama_pekerja || DEFAULT_PEKERJA.nama,
    no_pekerja: entry.no_pekerja || DEFAULT_PEKERJA.no_pekerja,
    jabatan: entry.jabatan || DEFAULT_PEKERJA.jabatan,
    golongan: entry.golongan || DEFAULT_PEKERJA.golongan,
    proyek: entry.proyek || DEFAULT_PEKERJA.proyek,
    tempat: entry.tempat || DEFAULT_PEKERJA.tempat,
    biaya_ditanggung: entry.biaya_ditanggung || DEFAULT_PEKERJA.biaya_ditanggung,
    menyetujui_nama: entry.menyetujui_nama || DEFAULT_PEKERJA.menyetujui.nama,
    menyetujui_jabatan: entry.menyetujui_jabatan || DEFAULT_PEKERJA.menyetujui.jabatan,
    mengetahui_nama: entry.mengetahui_nama || DEFAULT_PEKERJA.mengetahui.nama,
    mengetahui_jabatan: entry.mengetahui_jabatan || DEFAULT_PEKERJA.mengetahui.jabatan,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('spkl_entries')
        .insert([completeEntry])
        .select()
        .single();

      if (!error && data) {
        return data as SpklEntry;
      }
      console.warn('Supabase insert failed, saving to localStorage:', error);
    } catch (err) {
      console.warn('Supabase exception on insert, saving to localStorage:', err);
    }
  }

  // Save to localStorage
  if (typeof window !== 'undefined') {
    const existing = await fetchSpklEntries();
    // Check if entry for same date already exists, update or append
    const filtered = existing.filter((e) => e.tanggal !== entry.tanggal);
    const updated = [...filtered, completeEntry].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }

  return completeEntry;
}

export async function deleteSpklEntry(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('spkl_entries').delete().eq('id', id);
      if (error) console.error('Supabase delete error:', error);
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const existing = await fetchSpklEntries();
    const updated = existing.filter((e) => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
  return true;
}
