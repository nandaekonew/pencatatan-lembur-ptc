@echo off
title Menjalankan Aplikasi Pencatatan & Validator SPKL PTC
color 0A
cd /d "%~dp0"
set "PATH=D:\nodejs;D:\git\cmd;%PATH%"

echo ============================================================
echo   SISTEM PENCATATAN & VALIDATOR SPKL HARIAN OPERASIONAL PTC
echo   (TERINTEGRASI EXCEL REKAP & SUPABASE DATABASE)
echo ============================================================
echo.
echo Sedang menyiapkan server aplikasi...
echo Lokasi Folder: %~dp0
echo Jangan tutup jendela ini selama menggunakan aplikasi.
echo.

start "" "http://localhost:3000"
npm run dev
pause
