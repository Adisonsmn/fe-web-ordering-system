# Rencana Implementasi: Halaman Riwayat Pesanan (Dashboard Admin)

Tujuan dari rencana ini adalah untuk mengimplementasikan fungsionalitas UI/UX halaman **Riwayat Pesanan** pada _Dashboard_ Admin (mengacu pada Node Figma `166-288` dan `165-6`), serta menghubungkannya dengan API pesanan agar data bersifat dinamis.

> **PENTING: PERSETUJUAN PERUBAHAN BACKEND DIBUTUHKAN**
> Implementasi fitur ini mengharuskan adanya fitur filter rentang waktu ("Minggu Ini", "Bulan Ini") dan filter kategori menu ("Makanan", "Minuman", dll) pada daftar pesanan. Saat ini, _endpoint_ *backend* `GET /api/pesanan` hanya mendukung pencarian per satu tanggal (`tanggal`) dan tidak mendukung filter kategori menu.
> 
> **Usulan Perubahan Backend**: Saya menyarankan agar kita membuat _endpoint_ baru atau memodifikasi fungsi yang ada (`PesananRepository` dan `PesananController`) agar mendukung parameter pencarian berdasarkan `startDate`, `endDate`, dan `category`. (Mohon konfirmasi persetujuan Anda atas modifikasi _backend_ ini).

## 1. Frontend: Rute dan Navigasi
- **Modifikasi `PesananManagementPage.tsx`**: 
  - Menambahkan tombol **"Riwayat Pesanan"** di bagian _header_ atas (sesuai Node `166-288`).
  - Menggunakan komponen `Button` dari `@shared/components/ui/Button` atau tag `<Link>` bergaya tombol, yang akan mengarahkan pengguna ke rute baru.
- **Modifikasi `dashboardRoutes.tsx`**:
  - Daftarkan _path_ baru: `pesanan/riwayat`.
  - Sambungkan _path_ ini untuk me-render komponen `RiwayatPesananPage`.

## 2. Frontend: Halaman & Komponen UI (`RiwayatPesananPage.tsx`)
- Mengimplementasikan desain UI _Pixel-perfect_ sesuai instruksi Figma (Node `165-6`):
  - **Layout Utama**: Memakai background warna campuran putih/abu muda (`bg-off-white`).
  - **Bagian Filter Waktu (Tab)**: Membuat 3 opsi (_Hari Ini, Minggu Ini, Bulan Ini_) dengan gaya tombol *toggle* aktif/nonaktif.
  - **Bagian Filter Kategori (Chips)**: Membuat baris _chips_ yang bisa di-klik untuk memilih kategori menu (_Semua, Makanan, Minuman, Dessert, Snack_).
  - **Tabel Data Pesanan**: 
    - Struktur 7 kolom: *ID Pesanan, Meja / Area, Detail Menu, Waktu Selesai, Total Harga, Status, Aksi*.
    - Header tabel menggunakan huruf kapital dan warna teks _slate_.
    - **Detail Menu**: Menampilkan logika pemotongan teks (*truncation*) jika total baris detail pesanan terlalu panjang (contoh: "1x Wagyu Steak... +2 Item Lainnya").
    - **Badge Status**: Menampilkan komponen status dinamis dengan paduan warna teks dan *background* spesifik (Misal: Status "Selesai" warna *Teal*, "Dibatalkan" warna *Deep Orange*).
    - **Aksi**: Menampilkan tombol ikon titik tiga (Menu Konteks/Detail).
  - **Paginasi**: Membuat _footer_ tabel untuk informasi jumlah data ("Menampilkan X dari Y Pesanan") dan kontrol _Prev/Next_.

## 3. Frontend: Integrasi API & State (React Query)
- **File API (`pesananAdmin.api.ts`)**:
  - Membuat fungsi `getRiwayatPesananAdmin(params)` yang akan melakukan `GET` _request_ ke _endpoint backend_. `params` yang dikirim akan berupa filter *tanggal/rentang waktu*, *kategori*, dan informasi halaman (paginasi).
- **File Hooks (`useRiwayatPesanan.ts`)**:
  - Membuat *hook* `useQuery` khusus menggunakan ekosistem TanStack Query untuk melakukan pengambilan data dari fungsi API di atas secara efisien, serta menyediakan _state_ variabel seperti `isLoading` dan `isError`.

## 4. Backend: Penyesuaian Endpoint (Tergantung Persetujuan)
Setelah _approval_ diberikan, modifikasi di _backend_ yang harus dilakukan oleh *developer*:
- **`PesananRepository.java`**: 
  - Menambahkan _method_ / `@Query` JPQL baru (misal: `findAllRiwayatFiltered`).
  - Query ini harus mengikutsertakan operasi `LEFT JOIN` pada relasi `detailPesanan` dan `menu` agar tabel `pesanan` bisa difilter berdasarkan `category` dari `menu` di dalamnya.
  - Query harus mengganti `tanggal = :tanggal` dengan kondisi rentang waktu `tanggalPesanan BETWEEN :startDate AND :endDate`.
- **`PesananService` & `PesananController`**: 
  - Menyesuaikan _signature_ penerimaan parameter untuk melayani filter rentang tanggal dan kategori. Mengembalikan kelas data berbentuk `Page<PesananResponse>`.

## Langkah yang Dapat Diambil oleh Developer Selanjutnya
1. Mintalah persetujuan (approval) secara tegas dari *User* terkait penambahan/perubahan logika *Backend*.
2. Implementasikan dari atas ke bawah (Mulai dari *Backend* jika sudah disetujui, baru buat Integrasi *Frontend* API dan UI komponen Tabel).
3. Lakukan verifikasi hasil *build* dan pastikan navigasi serta integrasi API berfungsi.
