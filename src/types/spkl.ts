export type KategoriHari = 'Hari Kerja Reguler' | 'Hari Libur / Akhir Pekan / Satgas';

export interface SpklEntry {
  id?: string;
  tanggal: string; // YYYY-MM-DD
  kegiatan: string;
  mulai: string; // HH:mm or HH:mm:ss
  selesai: string; // HH:mm or HH:mm:ss
  total_jam_nyata: number;
  kategori_hari: KategoriHari;
  proyek: string;
  tempat: string;
  is_valid: boolean;
  validation_note: string;
  nama_pekerja?: string;
  no_pekerja?: string;
  jabatan?: string;
  golongan?: string;
  biaya_ditanggung?: string;
  menyetujui_nama?: string;
  menyetujui_jabatan?: string;
  mengetahui_nama?: string;
  mengetahui_jabatan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ValidationOutput {
  is_valid: boolean;
  validation_note: string;
  entry: {
    tanggal: string;
    kegiatan: string;
    mulai: string;
    selesai: string;
    total_jam_nyata: number;
    proyek: string;
    tempat: string;
  };
}

export const DEFAULT_PEKERJA = {
  nama: 'Nanda Eko Widianto',
  no_pekerja: 'D013-260003',
  jabatan: 'Office service',
  golongan: '-',
  proyek: 'Umum',
  tempat: 'PTC',
  biaya_ditanggung: 'Perusahaan',
  menyetujui: {
    nama: 'Ali Hakim Rosidi',
    jabatan: 'Area Manager IT Region Jatimbalinus',
  },
  mengetahui: {
    nama: 'Ricky Roy Sagita',
    jabatan: 'Manpower Supply Manager',
  },
};

export const KETENTUAN_SPKL = [
  '01 : Setiap pekerja lembur wajib mengisi SPKL',
  '02 : Pekerja lembur atas perintah atasan ybs',
  '03 : Membuat rekapan setiap bulan atas lembur masing - masing pekerja',
  '04 : Lembur di hitung mulai jam 15:31 menit',
  '05 : Apabila pekerja lembur kurang dari 30 menit dianggap tidak melaksanakan lembur',
  '06 : Apabila pekerja lembur lebih dari 30 menit, maka dihitung lembur mulai 15 :31 menit',
];
