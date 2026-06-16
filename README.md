# 🍃 Aroma Senja — Frontend

> **Web App Pemesanan Mandiri Restoran berbasis QR Code**
> Pelanggan scan QR → pesan menu → pantau status pesanan secara real-time, tanpa perlu antri ke kasir.

---

## 📋 Daftar Isi

- [Menjelaskan Project](#-menjelaskan-project)
- [Menjelaskan Fitur](#-menjelaskan-fitur)
- [Menjelaskan Alur Penggunaan](#-alur-penggunaan)
- [Menjelaskan Struktur Project](#-struktur-project)
- [Menjelaskan Cara Instalasi](#-cara-instalasi)
- [Menjelaskan Cara Menjalankan Aplikasi](#-cara-menjalankan-aplikasi)
- [Menjelaskan Environment Variable](#-environment-variable)
- [Anggota Tim](#-anggota-tim)
- [Panduan Kontribusi](#-panduan-kontribusi)
- [Konvensi Kode](#-konvensi-kode)
- [Deployment](#-deployment)

---

## 🍽️ Menjelaskan Project

**Aroma Senja** adalah sistem pemesanan mandiri untuk restoran. Pelanggan tidak perlu memanggil pelayan — cukup scan QR Code di meja, pilih menu, dan pesan langsung dari smartphone. Status pesanan akan diperbarui secara real-time ke dapur restoran dan kasir. Proyek ini terdiri dari dua sub-aplikasi (Customer App untuk mobile dan Dashboard Admin untuk desktop) yang dikemas dalam satu repositori terpadu.

---

## 🎯 Menjelaskan Fitur

| Fitur | Deskripsi | Target Aplikasi |
|-------|-----------|-----------------|
| 🔍 Katalog Menu | Menampilkan menu aktif dengan kategori, kolom pencarian, dan label promo diskon secara dinamis. | Customer App |
| 🛒 Keranjang Belanja | Mengelola item pesanan, memberikan instruksi catatan memasak ke dapur, dan menghitung total harga. | Customer App |
| 📦 Tracking Real-time | Memantau status pesanan (New, Preparing, Ready, Served) secara langsung menggunakan koneksi WebSocket (STOMP). | Customer App |
| 🏆 Loyalitas Poin | Mengumpulkan dan memotong poin untuk pelanggan yang masuk sebagai Member (Regular/Premium). | Customer App |
| 👤 Manajemen Akun | Mengedit data profil, foto profil, dan melihat riwayat belanja. | Customer App |
| 📊 Dashboard Overview | Menampilkan metrik pendapatan harian, pesanan aktif, total meja terisi, serta chart analitik. | Dashboard Admin |
| 📋 Kanban Board Pesanan | Memproses pesanan dari pelanggan secara visual dari dapur hingga meja makan dengan estimasi waktu. | Dashboard Admin |
| 🍔 CRUD Menu & Promo | Menambahkan, mengedit, menghapus, atau menonaktifkan item menu serta promo diskon restoran. | Dashboard Admin |
| 🪑 Meja & QR Code Generator | Mendaftarkan meja baru dan mengunduh berkas token QR Code unik untuk dipasang di meja fisik. | Dashboard Admin |
| 📈 Export Laporan Excel | Mengunduh riwayat transaksi dan analitik bulanan ke berkas Excel. | Dashboard Admin |

---

## 🔄 Alur Penggunaan

### 1. Alur Penggunaan Pelanggan (Customer App Flow)
```
[Scan QR Code Meja] ──> [Halaman Welcome] ──> [Pilihan Auth (Guest / Login / Register)]
                                                      │
                                                      v
[Katalog Menu] <── [Keranjang Belanja & Poin] <── [Katalog & Menu Detail]
      │
      v
[Konfirmasi & Checkout] ──> [Tracking Status Pesanan (Real-time WS)] ──> [Struk Digital & Rating]
```

### 2. Alur Penggunaan Restoran (Admin Dashboard Flow)
```
[Login Admin] ──> [Overview Metrik & Grafik Pendapatan]
                         │
                         ├──> [Kanban Board Pesanan] ──> (Terima, Proses, Saji Pesanan) ──> [Broadcast Real-time WS]
                         ├──> [Manajemen Menu & Promo] ──> (Tambah/Edit Menu & Diskon)
                         └──> [Manajemen Meja] ──> (Tambah Meja & Cetak QR Code Token)
```

---

## 📁 Struktur Project

Berikut adalah arsitektur direktori frontend berbasis **Feature-based Architecture**:

```
aroma-senja-frontend/
├── public/                     # Aset statis & berkas font eksternal
├── src/
│   ├── App.tsx                 # Entry point routing (React Router)
│   ├── main.tsx                # React DOM renderer
│   ├── index.css               # Design tokens & styling global Tailwind
│   │
│   ├── shared/                 # Komponen dan utilitas yang dipakai bersama
│   │   ├── components/
│   │   │   ├── ui/             # Atom UI: Button, Input, Badge, Modal, Spinner
│   │   │   └── layout/         # Layout: TopBar, BottomNav, Sidebar
│   │   ├── hooks/              # Hooks: useWebSocket, useDebounce, useLocalStorage
│   │   ├── lib/                # Konfigurasi client: axios.ts, queryClient.ts, supabase.ts
│   │   ├── stores/             # Global Zustand Store: authStore.ts, restoStore.ts
│   │   ├── types/              # Deklarasi Type TypeScript global
│   │   └── utils/              # Helper: formatRupiah, formatTanggal, cn()
│   │
│   ├── customer/               # Aplikasi Pelanggan Mobile (maksimal 390px)
│   │   ├── CustomerApp.tsx     # Router & Layout utama customer
│   │   └── features/           # Fitur domain customer (splash, onboarding, katalog, keranjang, pesanan, ulasan)
│   │
│   └── dashboard/              # Aplikasi Dashboard Merchant Desktop (minimal 1280px)
│       ├── DashboardApp.tsx    # Router & Layout utama dashboard
│       └── features/           # Fitur domain admin (auth, overview, pesanan, menu, promo, meja, laporan)
```

---

## 📥 Cara Instalasi

Ikuti langkah-langkah di bawah ini untuk menginstal proyek secara lokal:

1.  **Pastikan Anda memiliki prasyarat perangkat lunak:**
    *   **Node.js**: Versi 18.x atau di atasnya.
    *   **Bun**: Versi 1.x (Wajib, karena proyek menggunakan `bun.lock` dan perintah `bun install`).
    *   **Git**: Untuk mengelola kode sumber.

2.  **Kloning Repositori:**
    ```bash
    git clone <url-repository-anda>
    cd aroma-senja-frontend
    ```

3.  **Instalasi Dependensi Proyek:**
    Gunakan `bun` untuk menginstal modul pendukung (node_modules):
    ```bash
    bun install
    ```

---

## 🚀 Cara Menjalankan Aplikasi

Setelah proses instalasi selesai, ikuti langkah berikut untuk menjalankan aplikasi:

1.  **Setup Environment File:**
    Buat file `.env.local` di folder root frontend dengan menyalin file contoh:
    ```bash
    cp .env.example .env.local
    ```
    Isi nilai environment variable di dalam `.env.local` (lihat bagian [Environment Variable](#-environment-variable)).

2.  **Jalankan Server Development:**
    ```bash
    bun run dev
    ```
    Aplikasi akan berjalan secara lokal di:
    *   **Customer App** $\rightarrow$ [http://localhost:5173/customer](http://localhost:5173/customer)
    *   **Dashboard Admin** $\rightarrow$ [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

3.  **Build untuk Production:**
    Jika ingin membuat bundle produksi, jalankan perintah:
    ```bash
    bun run build
    # Untuk menguji hasil build produksi secara lokal
    bun run preview
    ```

---

## 🔑 Menjelaskan Environment Variable

Setiap variabel lingkungan wajib diawali dengan prefix `VITE_` agar terdeteksi oleh build tool Vite. File `.env.local` Anda harus berisi:

| Nama Variable | Wajib | Keterangan | Contoh Nilai |
|---------------|-------|------------|--------------|
| `VITE_API_BASE_URL` | Ya | Base URL server REST API backend | `http://localhost:8080/api` |
| `VITE_WS_URL` | Ya | Endpoint WebSocket untuk tracking pesanan | `ws://localhost:8080/ws` |
| `VITE_SUPABASE_URL` | Ya | URL proyek Supabase untuk CDN Gambar | `https://[PROJECT_ID].supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Ya | Kunci API publik anonim Supabase | `eyJhbGciOiJIUzI1NiIsIn...` |

---

## 👥 Anggota Tim

Proyek ini dibangun oleh Kelompok Aroma Senja untuk Tugas Besar mata kuliah Pemrograman Berorientasi Objek (PBO):

| Nama | GitHub | Peran |
|------|--------|-------|
| **Adison Simanullang** | [@Adisonsmn](https://github.com/Adisonsmn) | Frontend Lead & Integration |
| **Agung Natanael Saragih** | [@agungsrgh](https://github.com/agungsrgh) | Frontend & Backend Developer |
| **Farhan Hamzah** | [@farhan-hamzah](https://github.com/farhan-hamzah) | Frontend & Backend Developer |
| **Nazal Putra** | [@NazalDev](https://github.com/NazalDev) | Frontend & Backend Developer |
| **Muhammad Huttaqi** | [@MrTakeIt](https://github.com/MrTakeIt) | Frontend Developer |

---

## 🤝 Panduan Kontribusi

1.  Selalu lakukan `git pull origin main` sebelum mulai bekerja untuk menghindari konflik.
2.  Buat branch fitur baru dengan format penamaan: `feat/nama-fitur` atau `fix/nama-bug`.
3.  Pastikan kode Anda lolos linter dan formatter dengan menjalankan `bun run lint` dan `bun run format` sebelum melakukan commit.
4.  Lakukan push ke branch Anda dan buat Pull Request di GitHub untuk direview oleh tim lead.

---

## 📐 Konvensi Kode

### Path Alias
Hindari relative path yang panjang. Proyek ini mendukung path alias berikut:
*   `@/` $\rightarrow$ `src/`
*   `@shared/` $\rightarrow$ `src/shared/`
*   `@customer/` $\rightarrow$ `src/customer/`
*   `@dashboard/` $\rightarrow$ `src/dashboard/`

### Design Tokens (Warna)
Gunakan warna bawaan dari CSS Variables yang sudah dibungkus Tailwind:
*   `bg-deep-orange` / `text-deep-orange` untuk tombol aksi utama (CTA), harga, dan badge aktif.
*   `bg-slate-dark` / `text-slate-dark` untuk teks utama, heading, dan navigasi bar.
*   `bg-teal-muted` / `text-teal-muted` untuk chip kategori, aksen, dan tab aktif.
*   `bg-off-white` untuk warna latar belakang utama.

---

## 🚢 Deployment

Aplikasi ini dikonfigurasi untuk siap di-deploy secara instan ke platform **Vercel** melalui konfigurasi berkas vercel.json yang menangani routing mode Single Page Application (SPA).

---

<div align="center">
  <sub>Built with ❤️ by Tim Aroma Senja</sub>
</div>