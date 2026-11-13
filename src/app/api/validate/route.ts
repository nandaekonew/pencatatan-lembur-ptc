import { NextRequest, NextResponse } from 'next/server';
import { validateLembur } from '@/lib/spkl-validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = validateLembur({
      tanggal: body.tanggal,
      kegiatan: body.kegiatan,
      mulai: body.mulai,
      selesai: body.selesai,
      kategori_hari: body.kategori_hari,
      proyek: body.proyek,
      tempat: body.tempat,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        is_valid: false,
        validation_note: `Gagal memvalidasi input: ${error instanceof Error ? error.message : 'Unknown error'}`,
        entry: {
          tanggal: '',
          kegiatan: '',
          mulai: '',
          selesai: '',
          total_jam_nyata: 0,
          proyek: 'Umum',
          tempat: 'PTC',
        },
      },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tanggal = searchParams.get('tanggal') || '';
  const kegiatan = searchParams.get('kegiatan') || '';
  const mulai = searchParams.get('mulai') || '15:30';
  const selesai = searchParams.get('selesai') || '18:00';
  const kategori_hari = searchParams.get('kategori_hari') as any;

  const result = validateLembur({
    tanggal,
    kegiatan,
    mulai,
    selesai,
    kategori_hari,
  });

  return NextResponse.json(result, { status: 200 });
}
