@echo off
title Push Aplikasi SPKL Lembur PTC ke GitHub
color 0B
cd /d "%~dp0"
set "PATH=D:\git\cmd;D:\nodejs;%PATH%"

echo ============================================================
echo   PUSH APLIKASI SPKL LEMBUR PTC KE GITHUB
echo ============================================================
echo Lokasi Folder Proyek: %~dp0
echo.
echo Pastikan Anda sudah membuat Repository baru di https://github.com/new
echo Contoh nama repository: pencatatan-lembur-ptc
echo.
set /p REPO_URL="Masukkan URL Git Repository Tujuan (contoh: https://github.com/username/pencatatan-lembur-ptc.git): "

if not "%REPO_URL%"=="" (
    if not exist ".git" (
        git init
    )
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
)

echo.
echo Menyiapkan identitas git pengirim...
git config user.name "Nanda Eko Widianto"
git config user.email "nanda@ptc.pertamina.com"

echo.
echo Menambahkan file dan membuat commit...
git add .
git commit -m "feat: inisialisasi aplikasi pencatatan & validator SPKL PTC (Next.js, Supabase, Excel export)" 2>nul

echo.
echo Mengirim kode ke branch main di GitHub...
git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ============================================================
    echo   BERHASIL! Kode sudah ter-push ke GitHub.
    echo   Langkah selanjutnya:
    echo   1. Buka https://vercel.com
    echo   2. Import repository ini untuk deploy online
    echo   3. Tambahkan Environment Variable Supabase
    echo ============================================================
) else (
    echo ============================================================
    echo   Gagal melakukan push. Pastikan:
    echo   1. URL repository GitHub sudah benar.
    echo   2. Anda sudah login / memiliki izin akses ke akun GitHub.
    echo   3. Koneksi internet Anda aktif.
    echo ============================================================
)
pause
