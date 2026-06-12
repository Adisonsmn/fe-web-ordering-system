# 🍃 Aroma Senja — Frontend

> **Web App Pemesanan Mandiri Restoran berbasis QR Code**
> Pelanggan scan QR → pesan menu → pantau status pesanan secara real-time, tanpa perlu antri ke kasir.

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Dua Aplikasi dalam Satu Repo](#-dua-aplikasi-dalam-satu-repo)
- [Tech Stack](#-tech-stack)
- [Struktur Folder](#-struktur-folder)
- [Prasyarat](#-prasyarat)
- [Cara Menjalankan (Development)](#-cara-menjalankan-development)
- [Environment Variables](#-environment-variables)
- [Halaman & Rute](#-halaman--rute)
- [Perintah yang Tersedia](#-perintah-yang-tersedia)
- [Panduan Kontribusi](#-panduan-kontribusi)
- [Konvensi Kode](#-konvensi-kode)
- [Deployment](#-deployment)

---

## 🍽️ Tentang Project

**Aroma Senja** adalah sistem pemesanan mandiri untuk restoran. Pelanggan tidak perlu memanggil pelayan — cukup scan QR Code di meja, pilih menu, dan pesan langsung dari smartphone. Status pesanan akan diperbarui secara real-time.

### Alur Utama Pelanggan
```
Scan QR Code Meja → Selamat Datang → Pilih Login/Daftar/Tamu
    → Katalog Menu → Keranjang → Konfirmasi Pesanan
    → Tracking Real-time → Struk Digital → Beri Ulasan
```

### Fitur Utama
| Fitur | Deskripsi |
|-------|-----------|
| 🔍 Katalog Menu | Tampilkan menu dengan kategori, search, dan promo |
| 🛒 Keranjang | Kelola item, gunakan poin loyalitas |
| 📦 Tracking Real-time | Status pesanan diperbarui via WebSocket |
| 🏆 Loyalitas | Program poin untuk pelanggan member |
| 👤 Profil | Edit data diri & foto profil |
| 📊 Dashboard Admin | Manajemen pesanan, menu, promo, meja, laporan |

---

## 🖥️ Dua Aplikasi dalam Satu Repo

Project ini terdiri dari **dua aplikasi berbeda** yang di-bundle dalam satu codebase:

| | Customer App | Dashboard Admin |
|--|---|---|
| **URL** | `/customer` | `/dashboard` |
| **Target** | Pelanggan restoran | Operator/admin restoran |
| **Tampilan** | Mobile (max 390px) | Desktop (min 1280px) |
| **Auth** | JWT CLIENT / Guest | JWT ADMIN |

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| Framework UI | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 4.x |
| State Management | Zustand + Immer | 5.x |
| Server State | TanStack React Query | 5.x |
| HTTP Client | Axios | 1.x |
| Routing | React Router DOM | 7.x |
| WebSocket | STOMP.js + SockJS | 7.x |
| Storage | Supabase (avatar/gambar) | 2.x |
| Charts | Recharts | 3.x |
| Icons | Lucide React | latest |
| Linter & Formatter | Biome | 2.x |
| Package Manager | **Bun** | latest |

> ⚠️ **Wajib menggunakan `bun`** sebagai package manager. Jangan gunakan `npm`, `yarn`, atau `pnpm`.

---

## 📁 Struktur Folder

```
aroma-senja-frontend/
├── public/                     # Aset statis
├── src/
│   ├── App.tsx                 # Entry point router
│   ├── main.tsx                # React DOM render
│   ├── index.css               # Design tokens global
│   │
│   ├── shared/                 # Dipakai kedua app
│   │   ├── components/
│   │   │   ├── ui/             # Button, Input, Badge, Modal, Spinner
│   │   │   └── layout/         # TopBar, BottomNav, Sidebar
│   │   ├── hooks/              # useWebSocket, useDebounce, useLocalStorage
│   │   ├── lib/                # axios.ts, queryClient.ts, supabase.ts
│   │   ├── stores/             # authStore.ts, restoStore.ts (Zustand)
│   │   ├── types/              # TypeScript types & interfaces
│   │   └── utils/              # formatRupiah, formatTanggal, cn()
│   │
│   ├── customer/               # App Pelanggan (mobile)
│   │   ├── CustomerApp.tsx
│   │   ├── router/
│   │   └── features/
│   │       ├── splash/         # Halaman loading awal
│   │       ├── onboarding/     # Welcome & pilihan auth
│   │       ├── auth/           # Login & Register
│   │       ├── katalog/        # Katalog menu
│   │       ├── menu-detail/    # Detail item (bottom sheet)
│   │       ├── keranjang/      # Keranjang belanja
│   │       ├── pesanan/        # Konfirmasi, sukses, tracking
│   │       ├── struk/          # Struk digital
│   │       ├── ulasan/         # Form ulasan & rating
│   │       ├── loyalti/        # Halaman poin loyalitas
│   │       └── account/        # Profil pengguna
│   │
│   └── dashboard/              # App Admin (desktop)
│       ├── DashboardApp.tsx
│       ├── router/
│       └── features/
│           ├── auth/           # Login admin
│           ├── overview/       # Dashboard utama & statistik
│           ├── pesanan-management/  # Kanban pesanan + riwayat
│           ├── menu-management/     # CRUD menu
│           ├── promo-management/    # CRUD promo & riwayat
│           ├── meja-management/     # Manajemen meja & QR
│           ├── laporan/             # Analitik & export Excel
│           └── pengaturan/          # Pengaturan restoran & profil admin
│
├── .env.example                # Template env variables
├── .env.local                  # Env lokal (JANGAN di-commit!)
├── biome.json                  # Konfigurasi linter & formatter
├── vite.config.ts              # Konfigurasi Vite + path alias
├── tailwind.config.ts          # (via @tailwindcss/vite)
├── tsconfig.json               # TypeScript config
└── vercel.json                 # Konfigurasi deployment Vercel
```

---

## ✅ Prasyarat

Pastikan sudah terinstall di komputer kamu:

| Tools | Versi Minimum | Cek dengan |
|-------|---------------|------------|
| [Node.js](https://nodejs.org) | 18.x | `node -v` |
| [Bun](https://bun.sh) | 1.x | `bun -v` |
| [Git](https://git-scm.com) | - | `git -v` |

### Install Bun (jika belum ada)

**Windows (PowerShell):**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**macOS / Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

---

## 🚀 Cara Menjalankan (Development)

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>/aroma-senja-frontend
```

### Langkah 2 — Install Dependencies

```bash
bun install
```

### Langkah 3 — Setup Environment Variables

Salin file contoh dan isi nilainya:

```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi:

```env
# URL backend API (minta ke anggota tim yang punya akses)
VITE_API_BASE_URL=https://aromasenja-api.malaysiawest.cloudapp.azure.com/api

# URL WebSocket
VITE_WS_URL=wss://aromasenja-api.malaysiawest.cloudapp.azure.com/ws

# Supabase (untuk upload gambar) — minta dari ketua tim
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

> 📌 **Catatan**: File `.env.local` tidak boleh di-commit ke Git (sudah ada di `.gitignore`). Minta nilai env ke ketua tim secara langsung.

### Langkah 4 — Jalankan Dev Server

```bash
bun run dev
```

Aplikasi akan berjalan di:
- **Customer App** → [http://localhost:5173/customer](http://localhost:5173/customer)
- **Dashboard Admin** → [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

---

## 🔑 Environment Variables

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `VITE_API_BASE_URL` | ✅ | Base URL REST API backend (sudah termasuk `/api`) |
| `VITE_WS_URL` | ✅ | URL WebSocket untuk tracking pesanan real-time |
| `VITE_SUPABASE_URL` | ✅ | URL project Supabase (untuk upload foto menu & avatar) |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Anon Key Supabase (public key, aman di frontend) |

> Semua env variable **wajib** diawali `VITE_` agar bisa diakses di kode. Akses via `import.meta.env.VITE_*`.

---

## 🗺️ Halaman & Rute

### Customer App (`/customer/...`)

| Rute | Halaman | Deskripsi |
|------|---------|-----------|
| `/customer` | Splash Screen | Loading awal |
| `/customer/welcome` | Selamat Datang | Tampil setelah scan QR |
| `/customer/auth-choice` | Pilihan Auth | Login / Daftar / Lanjut Sebagai Tamu |
| `/customer/login` | Login | Form login member |
| `/customer/register` | Daftar | Form registrasi member baru |
| `/customer/katalog` | Katalog Menu | Daftar menu, search, filter kategori |
| `/customer/keranjang` | Keranjang | Item keranjang & ringkasan biaya |
| `/customer/konfirmasi` | Konfirmasi | Review pesanan sebelum submit |
| `/customer/pesanan-sukses/:id` | Pesanan Berhasil | Konfirmasi pesanan diterima |
| `/customer/pesanan/tracking/:id` | Tracking | Status pesanan real-time |
| `/customer/struk/:id` | Struk Digital | Struk setelah pesanan selesai |
| `/customer/ulasan/:id` | Beri Ulasan | Form rating & ulasan |
| `/customer/ulasan-sukses` | Ulasan Terkirim | Konfirmasi ulasan berhasil |
| `/customer/loyalty` | Loyalitas | Poin & riwayat reward |
| `/customer/account` | Profil Saya | Edit profil, logout |

### Dashboard Admin (`/dashboard/...`)

> Semua halaman dashboard membutuhkan login sebagai **ADMIN**.

| Rute | Halaman | Deskripsi |
|------|---------|-----------|
| `/dashboard/login` | Login Admin | Form login admin |
| `/dashboard` | Overview | Statistik harian, live orders, meja |
| `/dashboard/pesanan` | Manajemen Pesanan | Kanban board pesanan aktif |
| `/dashboard/pesanan/riwayat` | Riwayat Pesanan | Histori semua pesanan |
| `/dashboard/menu` | Manajemen Menu | CRUD item menu |
| `/dashboard/promo` | Manajemen Promo | CRUD promo & diskon |
| `/dashboard/promo/riwayat` | Riwayat Promo | Histori penggunaan promo |
| `/dashboard/meja` | Manajemen Meja | Kelola meja & generate QR Code |
| `/dashboard/laporan` | Analitik & Laporan | Grafik pendapatan, menu terlaris, export Excel |
| `/dashboard/pengaturan` | Pengaturan | Profil admin & konfigurasi restoran |

---

## 📦 Perintah yang Tersedia

```bash
# Jalankan development server
bun run dev

# Build untuk production
bun run build

# Preview hasil build production
bun run preview

# Cek lint (tampilkan error)
bun run lint

# Auto-fix lint errors
bun run lint:fix

# Format kode
bun run format
```

---

## 🤝 Panduan Kontribusi

### 1. Selalu Pull Sebelum Mulai Kerja

```bash
git pull origin main
```

### 2. Buat Branch Baru untuk Setiap Fitur/Fix

```bash
# Format: feat/, fix/, refactor/, chore/
git checkout -b feat/nama-fitur
git checkout -b fix/nama-bug
```

### 3. Commit dengan Format yang Jelas

```bash
git add .
git commit -m "feat: tambah halaman riwayat pesanan"
git commit -m "fix: perbaiki redirect saat logout"
git commit -m "refactor: pisah komponen MenuCard"
```

### 4. Push & Buat Pull Request

```bash
git push origin feat/nama-fitur
# Lalu buat Pull Request di GitHub → minta review ke ketua tim
```

### 5. Pastikan Lulus Lint Sebelum Push

```bash
bun run lint      # tidak boleh ada error
bun run build     # tidak boleh ada error
```

---

## 📐 Konvensi Kode

### Path Alias

Gunakan alias berikut, **jangan** pakai relative path lebih dari 1 level:

```ts
// ✅ Benar
import { Button } from '@shared/components/ui'
import { useAuthStore } from '@shared/stores/authStore'
import { KatalogPage } from '@customer/features/katalog/KatalogPage'

// ❌ Salah
import { Button } from '../../../shared/components/ui'
```

| Alias | Target |
|-------|--------|
| `@/` | `src/` |
| `@shared/` | `src/shared/` |
| `@customer/` | `src/customer/` |
| `@dashboard/` | `src/dashboard/` |

### Design Tokens (Warna)

Gunakan class Tailwind dari design token, **bukan** hex langsung:

```tsx
// ✅ Benar
<button className="bg-deep-orange text-white">
<div className="text-slate-dark border-teal-muted">

// ❌ Salah
<button className="bg-[#FF5722] text-white">
```

| Token | Warna | Kegunaan |
|-------|-------|----------|
| `deep-orange` | `#FF5722` | CTA, harga, badge aktif |
| `slate-dark` | `#303841` | Teks, heading, navbar |
| `teal-muted` | `#76ABAE` | Aksen, tab aktif, chip |
| `off-white` | `#F5F5F5` | Background utama |

### Penempatan File

| Tipe File | Lokasi |
|-----------|--------|
| Komponen 1 feature | `features/{nama}/components/` |
| Hook API | `features/{nama}/hooks/` |
| Fungsi fetch | `features/{nama}/api/` |
| Zustand store (lokal) | `features/{nama}/store/` |
| Komponen dipakai 2+ feature | `shared/components/` |
| Types lintas feature | `shared/types/` |

---

## 🚢 Deployment

Project ini dikonfigurasi untuk deploy ke **Vercel**.

### Deploy Manual

```bash
# Build production
bun run build

# Preview lokal sebelum deploy
bun run preview
```

### Environment Variables di Vercel

Pastikan semua variabel di `.env.example` sudah diisi di:
**Vercel Dashboard → Project → Settings → Environment Variables**

> File `vercel.json` sudah dikonfigurasi agar semua rute diarahkan ke `index.html` (SPA routing).

---

## 👥 Tim Pengembang

| Nama | GitHub | Role |
|------|--------|------|
| Adison Simanullang | *(isi username)* | Frontend Lead |
| agungsrgh | [@agungsrgh](https://github.com/agungsrgh) | Frontend Dev |
| Farhan Hamzah | [@farhan-hamzah](https://github.com/farhan-hamzah) | Frontend Dev |
| Nazal Putra | [@NazalDev](https://github.com/NazalDev) | Frontend Dev |

---

## 📝 Lisensi

Project ini dibuat untuk keperluan **Tugas Besar mata kuliah Pemrograman Berbasis Objek (PBO)** — Semester 4.

---

<div align="center">
  <sub>Built with ❤️ by Tim Aroma Senja</sub>
</div>