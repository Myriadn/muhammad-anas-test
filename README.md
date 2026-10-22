# Geo-Entity Manager

Aplikasi untuk menampilkan, mengelola, dan memvalidasi entity (kendaraan, perangkat IoT, fasilitas) dengan informasi lokasi geografis pada peta interaktif.

## Cara Menjalankan Program

### Prasyarat
- Go 1.26
- Node.js 22
- Nix dengan flakes (opsional)
- Browser

### Langkah-langkah
1. Clone repository ini
2. (Jika pakai Nix) Jalankan `direnv allow` atau `nix develop`
3. **Jalankan Backend:**
   ```bash
   cd server
   cp .env.example .env
   go run .
   ```
    (Server akan berjalan di http://localhost:9002 untuk defaultnya, database SQLite akan otomatis dibuat dan di-seed dengan 5 data dummy).
4. **Menjalankan Frontend** (buka terminal baru):
    ```bash
    cd client
    cp .env.example .env
    npm install
    npm run dev
    ```
5. Buka http://localhost:5173 di browser

## Alasan Pemilihan Library

- **Backend (Go + Gin + SQLite)**: 
    - Gin dipilih karena sangat ringan dan cepat untuk membuat REST API
    - SQLite (via modernc.org/sqlite) dipilih supaya reviewer tidak perlu menginstall server database eksternal
- **Frontend (React + Vite + TypeScript)**: 
    - Vite dipilih karena hot-reload yang instan dan konfigurasi yang minimalis
    - React dengan TypeScript memastikan tipe data dari API sesuai dengan yang dirender di UI
- **Map (Leaflet)**:
    - Leaflet dipilih karena open-source dan tidak memerlukan API Key
- **State & Data Fetching (TanStack Query)**: 
    - Menangani server state (caching, auto-refetch setelah CRUD) secara otomatis
- **Form & Validasi (React Hook Form + Zod)**: 
    - Memastikan validasi input di sisi frontend berjalan ketat sebelum dikirim ke backend, meminimalisir request error

## Fitur yang Selesai
- [x] Menampilkan entity pada peta (Leaflet marker)
- [X] Menambahkan (Create), Mengubah (Update), dan Menghapus (Delete) entity
- [X] Panel detail entity saat marker atau list di sidebar diklik
- [X] Validasi input ganda pada Frontend (Zod) dan Backend (Gin validator)
- [X] Error handling (menampilkan pesan error API di UI jika validasi backend gagal)
- [X] FlyTo animation (peta otomatis zoom ke marker yang dipilih)
- [X] Graceful Shutdown pada server Go (menunggu request selesai sebelum mati)
- [X] Konfigurasi Environment Variables (.env) pada Frontend dan Backend

## Fitur yang Belum Selesai
- Tidak ada sistem autentikasi (login/register) karena fokus pada fungsionalitas CRUD entity sesuai soal
- Belum ada fitur drag-and-drop marker pada peta untuk mengubah koordinat secara langsung (koordinat diubah via form input)
- Peta menggunakan layer default OpenStreetMap

## Agentic AI Usage

Proyek ini dikerjakan dengan bantuan AI (Agentic & Chat). Untuk transparansi, workflow, contoh prompt, serta batasan penggunaan AI selama pengerjaan didokumentasikan secara lengkap pada file [AGENTS.md](./AGENT.md)