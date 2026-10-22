# AGENT.md — AI Usage Log

Dokumen ini menjelaskan bagaimana AI (Agentic & Chat) digunakan selama
mengerjakan take-home test ini.

## Tool yang dipakai
- GitHub Copilot Chat (Agent mode) — model Random (Automatic)
- DeepSeek (browser) untuk diskusi arsitektur

## Log penggunaan

### Hari 1 — 2026-10-21
- Scaffold handler Gin untuk CRUD entity (AI generate boilerplate)
- Scaffold komponen React (Leaflet map + TanStack Query) untuk fetch data
- Rewrite manual: ganti lat/lng ke *float64 di backend biar bisa validasi "field tidak dikirim" (membedakan angka 0 dengan null)
- Test validasi manual di 4 skenario invalid (nama kosong, type salah, lat/lng out-of-range, id bukan angka)
- Fix CORS: AI membantu mengidentifikasi konfigurasi middleware `gin-contrib/cors` karena browser memblokir request dari port FE ke BE
- Fix Leaflet icon bug: AI memberikan solusi inject path gambar icon marker yang hilang saat di-bundle Vite

### Hari 2 — 2026-10-22
- Scaffold UI Modal Form dengan react-hook-form + Zod
- Fix TypeScript error (TS2322/TS2345): AI membantu memecahkan konflik tipe data antara `zodResolver` dan `EntityInput` dengan menambahkan `valueAsNumber: true` pada input HTML dan menyesuaikan schema Zod
- Merangkai logika `invalidateQueries` di React Query secara manual agar UI auto-refresh setelah Create/Update/Delete tanpa reload

## Keputusan yang saya ambil
- Stack: Go + Gin + SQLite + React + Leaflet
- Skema DB entity (struct dan tipe data)
- Aturan validasi bisnis (minimal 3 karakter, range koordinat)
- Memutuskan untuk menaruh logika pada arsitektur yang di sesuaikan pada kode

## Contoh prompt yang dipakai
1. "Buatkan handler Go Gin untuk PUT /api/entities/:id. Body divalidasi dengan go-playground/validator. Field: name, type, status, lat, lng. Return 400 kalau invalid, 404 kalau id gak ada."
2. "Browser memblokir request dari localhost:5173 ke localhost:8080. Reason: CORS header 'Access-Control-Allow-Origin' missing. Gimana cara benerinnya di Gin?"
3. "Ada error TS2322: Type 'Resolver<...>' is not assignable to type 'Resolver<...>' di react-hook-form + zod. Kenapa ini terjadi dan gimana solusinya?"

## Bagian yang saya rewrite manual
- Mengubah hasil generate AI untuk validasi lat/lng dari `float64` menjadi `*float64`
- Menulis ulang logika form handling agar sinkron dengan tipe data `EntityInput` di backend
- Refactoring Mengeksekusi pemindahan file, menyambungkan ulang import antar package, dan memastikan `main.go` hanya bertugas sebagai *orchestrator*