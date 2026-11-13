import ExcelJS from 'exceljs';
import { SpklEntry, DEFAULT_PEKERJA, KETENTUAN_SPKL } from '@/types/spkl';

export async function generateSpklExcel(entries: SpklEntry[], yearMonth: string = '2026-11'): Promise<Blob> {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr || '2026', 10);
  const month = parseInt(monthStr || '11', 10);

  // Month name formatting in Indonesian
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthLabel = `${monthShorts[month - 1]}-${year.toString().slice(-2)}`;
  const fullMonthLabel = `${monthNames[month - 1]} ${year}`;

  const daysInMonth = new Date(year, month, 0).getDate();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'PTC SPKL System';
  workbook.created = new Date();

  // --------------------------------------------------------------------------
  // SHEET 1: REKAP LEMBUR HARIAN
  // --------------------------------------------------------------------------
  const sheetRekap = workbook.addWorksheet('Rekap Lembur Harian', {
    views: [{ showGridLines: true }],
  });

  // Set column widths
  sheetRekap.columns = [
    { width: 6 },  // A: No
    { width: 8 },  // B: Tgl
    { width: 65 }, // C: Kegiatan
    { width: 14 }, // D: Mulai
    { width: 14 }, // E: Selesai
    { width: 18 }, // F: Total Jam Nyata
  ];

  // Row 1: Banner Header Hijau "Rekap Lembur Harian"
  sheetRekap.mergeCells('A1:F1');
  const cellA1 = sheetRekap.getCell('A1');
  cellA1.value = 'Rekap Lembur Harian';
  cellA1.font = { name: 'Calibri', size: 12, bold: true, underline: true, color: { argb: 'FF000000' } };
  cellA1.alignment = { horizontal: 'center', vertical: 'middle' };
  cellA1.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF92D050' }, // Hijau segar khas file template PTC
  };

  // Row 2: Subheader Kuning Periode Bulan (e.g. Nov-26)
  sheetRekap.mergeCells('A2:F2');
  const cellA2 = sheetRekap.getCell('A2');
  cellA2.value = monthLabel;
  cellA2.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
  cellA2.alignment = { horizontal: 'center', vertical: 'middle' };
  cellA2.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' }, // Kuning
  };

  // Row 3: Table Column Headers
  const headers = ['No', 'Tgl', 'Kegiatan', 'Mulai', 'Selesai', 'Total Jam Nyata'];
  const headerRow = sheetRekap.getRow(3);
  headers.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 10, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' }, // Kuning header
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Populate rows for days 1..daysInMonth
  let sumFormulaStart = 4;
  for (let day = 1; day <= daysInMonth; day++) {
    const rowNum = 3 + day;
    const row = sheetRekap.getRow(rowNum);
    const dayStr = day.toString().padStart(2, '0');
    const targetDate = `${year}-${month.toString().padStart(2, '0')}-${dayStr}`;

    // Find entry for this date
    const dayEntry = entries.find((e) => e.tanggal === targetDate);

    // Col A: No
    const cA = row.getCell(1);
    cA.value = day;
    cA.alignment = { horizontal: 'center', vertical: 'middle' };

    // Col B: Tgl
    const cB = row.getCell(2);
    cB.value = day;
    cB.alignment = { horizontal: 'center', vertical: 'middle' };

    // Col C: Kegiatan
    const cC = row.getCell(3);
    cC.value = dayEntry ? dayEntry.kegiatan : '';
    cC.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    // Col D: Mulai
    const cD = row.getCell(4);
    cD.value = dayEntry && dayEntry.mulai ? `${dayEntry.mulai}:00` : '';
    cD.alignment = { horizontal: 'center', vertical: 'middle' };

    // Col E: Selesai
    const cE = row.getCell(5);
    cE.value = dayEntry && dayEntry.selesai ? `${dayEntry.selesai}:00` : '';
    cE.alignment = { horizontal: 'center', vertical: 'middle' };

    // Col F: Total Jam Nyata
    const cF = row.getCell(6);
    cF.value = dayEntry && dayEntry.total_jam_nyata ? dayEntry.total_jam_nyata : 0;
    cF.numFmt = '#,##0.00;(#,##0.00);0';
    cF.alignment = { horizontal: 'center', vertical: 'middle' };

    // Borders
    [cA, cB, cC, cD, cE, cF].forEach((c) => {
      c.font = { name: 'Calibri', size: 9 };
      c.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  // Summary Row (Total Jam Lembur)
  const lastDataRow = 3 + daysInMonth;
  const summaryRow = sheetRekap.getRow(lastDataRow + 1);
  
  sheetRekap.mergeCells(`A${lastDataRow + 1}:E${lastDataRow + 1}`);
  const summaryLabel = sheetRekap.getCell(`A${lastDataRow + 1}`);
  summaryLabel.value = 'TOTAL JAM NYATA';
  summaryLabel.font = { name: 'Calibri', size: 10, bold: true };
  summaryLabel.alignment = { horizontal: 'right', vertical: 'middle' };

  const summaryVal = summaryRow.getCell(6);
  summaryVal.value = { formula: `SUM(F4:F${lastDataRow})` };
  summaryVal.font = { name: 'Calibri', size: 10, bold: true };
  summaryVal.alignment = { horizontal: 'center', vertical: 'middle' };
  summaryVal.numFmt = '#,##0.00';

  for (let c = 1; c <= 6; c++) {
    const cell = summaryRow.getCell(c);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2EFDA' }, // Soft green
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'double' },
      right: { style: 'thin' },
    };
  }

  // --------------------------------------------------------------------------
  // SHEET 2: FORMAT SURAT PERINTAH KERJA LEMBUR (SPKL)
  // --------------------------------------------------------------------------
  const sheetSpkl = workbook.addWorksheet('Surat Perintah Kerja Lembur', {
    views: [{ showGridLines: true }],
  });

  sheetSpkl.columns = [
    { width: 4 },  // A
    { width: 14 }, // B
    { width: 22 }, // C
    { width: 4 },  // D
    { width: 35 }, // E
    { width: 18 }, // F
    { width: 20 }, // G
  ];

  // Title
  sheetSpkl.mergeCells('B2:G2');
  const spklTitle = sheetSpkl.getCell('B2');
  spklTitle.value = 'SURAT PERINTAH KERJA LEMBUR';
  spklTitle.font = { name: 'Calibri', size: 14, bold: true, underline: true };
  spklTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  // Nomor Dokumen
  sheetSpkl.mergeCells('B3:G3');
  const spklNomor = sheetSpkl.getCell('B3');
  spklNomor.value = `      /PTC-lembur/           /${year}`;
  spklNomor.font = { name: 'Calibri', size: 10, italic: true };
  spklNomor.alignment = { horizontal: 'center', vertical: 'middle' };

  // Surabaya, Tanggal
  sheetSpkl.getCell('B5').value = `Surabaya, ${fullMonthLabel}`;
  sheetSpkl.getCell('B5').font = { name: 'Calibri', size: 10 };

  // Header Pengantar
  sheetSpkl.getCell('B7').value = 'Dengan ini mengijinkan/menugaskan :';
  sheetSpkl.getCell('B7').font = { name: 'Calibri', size: 10, bold: true };

  const identityRows = [
    { label: 'Nama', value: DEFAULT_PEKERJA.nama },
    { label: 'No. Pekerja', value: DEFAULT_PEKERJA.no_pekerja },
    { label: 'Golongan', value: DEFAULT_PEKERJA.golongan },
    { label: 'Jabatan', value: DEFAULT_PEKERJA.jabatan },
  ];

  identityRows.forEach((item, idx) => {
    const r = 8 + idx;
    sheetSpkl.getCell(`B${r}`).value = item.label;
    sheetSpkl.getCell(`D${r}`).value = ':';
    sheetSpkl.getCell(`E${r}`).value = item.value;
    sheetSpkl.getCell(`B${r}`).font = { name: 'Calibri', size: 10 };
    sheetSpkl.getCell(`D${r}`).font = { name: 'Calibri', size: 10 };
    sheetSpkl.getCell(`E${r}`).font = { name: 'Calibri', size: 10, bold: true };
  });

  // Tugas
  sheetSpkl.getCell('B13').value = 'Untuk Melaksanakan :';
  sheetSpkl.getCell('B13').font = { name: 'Calibri', size: 10, bold: true };

  const taskRows = [
    { label: 'Proyek/Kegiatan', value: DEFAULT_PEKERJA.proyek },
    { label: 'Periode / Tanggal', value: fullMonthLabel },
    { label: 'Tempat', value: DEFAULT_PEKERJA.tempat },
    { label: 'Biaya ditanggung oleh', value: DEFAULT_PEKERJA.biaya_ditanggung },
    { label: 'Keterangan lain', value: 'Sesuai rincian Rekap Lembur Harian terlampir' },
  ];

  taskRows.forEach((item, idx) => {
    const r = 14 + idx;
    sheetSpkl.getCell(`B${r}`).value = item.label;
    sheetSpkl.getCell(`D${r}`).value = ':';
    sheetSpkl.getCell(`E${r}`).value = item.value;
    sheetSpkl.getCell(`B${r}`).font = { name: 'Calibri', size: 10 };
    sheetSpkl.getCell(`D${r}`).font = { name: 'Calibri', size: 10 };
    sheetSpkl.getCell(`E${r}`).font = { name: 'Calibri', size: 10 };
  });

  // Signature Block
  sheetSpkl.getCell('B21').value = 'Yang Melaksanakan (Ybs):';
  sheetSpkl.getCell('B21').font = { name: 'Calibri', size: 10, bold: true };

  sheetSpkl.getCell('E21').value = 'Menyetujui (Atasan Ybs):';
  sheetSpkl.getCell('E21').font = { name: 'Calibri', size: 10, bold: true };

  sheetSpkl.getCell('G21').value = 'Mengetahui:';
  sheetSpkl.getCell('G21').font = { name: 'Calibri', size: 10, bold: true };

  sheetSpkl.getCell('E22').value = DEFAULT_PEKERJA.menyetujui.jabatan;
  sheetSpkl.getCell('E22').font = { name: 'Calibri', size: 9, italic: true };

  sheetSpkl.getCell('G22').value = DEFAULT_PEKERJA.mengetahui.jabatan;
  sheetSpkl.getCell('G22').font = { name: 'Calibri', size: 9, italic: true };

  // Names at row 26
  sheetSpkl.getCell('B26').value = `( ${DEFAULT_PEKERJA.nama} )`;
  sheetSpkl.getCell('B26').font = { name: 'Calibri', size: 10, bold: true };

  sheetSpkl.getCell('E26').value = `( ${DEFAULT_PEKERJA.menyetujui.nama} )`;
  sheetSpkl.getCell('E26').font = { name: 'Calibri', size: 10, bold: true };

  sheetSpkl.getCell('G26').value = `( ${DEFAULT_PEKERJA.mengetahui.nama} )`;
  sheetSpkl.getCell('G26').font = { name: 'Calibri', size: 10, bold: true };

  sheetSpkl.getCell('B27').value = 'Note: Wajib melapor hasil lembur keatasan yang bersangkutan';
  sheetSpkl.getCell('B27').font = { name: 'Calibri', size: 9, italic: true };

  // Ketentuan SPKL (Rules)
  sheetSpkl.getCell('B29').value = 'Ketentuan :';
  sheetSpkl.getCell('B29').font = { name: 'Calibri', size: 10, bold: true };

  KETENTUAN_SPKL.forEach((item, idx) => {
    const r = 30 + idx;
    sheetSpkl.getCell(`B${r}`).value = item;
    sheetSpkl.getCell(`B${r}`).font = { name: 'Calibri', size: 9 };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
