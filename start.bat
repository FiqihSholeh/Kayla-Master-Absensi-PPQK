@echo off
rem pindah ke folder proyek utama tempat package.json berada
cd /d "%~dp0"

rem jalankan npm run dev (yang menjalankan vite server)
start "" npm run dev

rem tunggu 5 detik supaya server mulai jalan
timeout /t 5

rem buka browser ke localhost:5173
start http://localhost:5173
