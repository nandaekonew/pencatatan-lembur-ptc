import { NextRequest, NextResponse } from 'next/server';
import { validateLembur } from '@/lib/spkl-validator';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_PEKERJA } from '@/types/spkl';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bulan = searchParams.get('bulan'); // e.g. "2026-11"

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('spkl_entries').select('*').order('tanggal', { ascending: true });
      if (bulan) {
        query = query.gte('tanggal', `${bulan}-01`).lte('tanggal', `${bulan}-31`);
      }
      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    } catch (e) {
      console.error('API Supabase error:', e);
    }
  }

  return NextResponse.json({
    success: true,
    source: 'client_managed',
    message: 'Supabase belum terkonfigurasi atau berjalan via offline/local sync.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateLembur(body);

    const record = {
      tanggal: validation.entry.tanggal,
      kegiatan: validation.entry.kegiatan,
      mulai: validation.entry.mulai,
      selesai: validation.entry.selesai,
      total_jam_nyata: validation.entry.total_jam_nyata,
      kategori_hari: body.kategori_hari || 'Hari Kerja Reguler',
      is_valid: validation.is_valid,
      validation_note: validation.validation_note,
      nama_pekerja: DEFAULT_PEKERJA.nama,
      no_pekerja: DEFAULT_PEKERJA.no_pekerja,
      jabatan: DEFAULT_PEKERJA.jabatan,
      golongan: DEFAULT_PEKERJA.golongan,
      proyek: DEFAULT_PEKERJA.proyek,
      tempat: DEFAULT_PEKERJA.tempat,
      biaya_ditanggung: DEFAULT_PEKERJA.biaya_ditanggung,
      menyetujui_nama: DEFAULT_PEKERJA.menyetujui.nama,
      menyetujui_jabatan: DEFAULT_PEKERJA.menyetujui.jabatan,
      mengetahui_nama: DEFAULT_PEKERJA.mengetahui.nama,
      mengetahui_jabatan: DEFAULT_PEKERJA.mengetahui.jabatan,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('spkl_entries').insert([record]).select().single();
      if (!error && data) {
        return NextResponse.json({
          success: true,
          source: 'supabase',
          validation,
          saved_record: data,
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: 'local',
      validation,
      saved_record: record,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 400 }
    );
  }
}
