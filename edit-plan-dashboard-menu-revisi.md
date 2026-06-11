# Plan: Revisi UI/UX Lanjutan Dashboard Manajemen Menu

## 1. Hasil Audit & Analisis
Berdasarkan permintaan pengguna, berikut adalah hasil analisis untuk 3 isu utama pada komponen Manajemen Menu:

1. **Dropdown Ikut Blur Saat "Tidak Tersedia"**:
   - **Penyebab**: Pada `MenuCard.tsx`, komponen root `div` dari card memiliki class kondisional `isHabis && 'opacity-75'`. Selain itu, terdapat overlay absolute dengan `z-20` yang menutupi seluruh card (`inset-0`) dengan warna putih transparan dan efek `mix-blend-saturation`.
   - **Solusi**: Kita perlu menghapus class `opacity-75` dari root container agar efek transparansi tidak turun ke child elements (dropdown). Kemudian, kita akan memberikan `z-index` yang lebih tinggi (`z-30`) khusus pada `div` pembungkus komponen `AvailabilityToggle`. Karena dropdown memiliki background putih (`bg-white`), komponen ini akan tampil sepenuhnya terang dan jelas di atas efek blur/overlay card tersebut.

2. **Mengubah Label "Promo Aktif" Menjadi Nama Kategori**:
   - **Penyebab**: Saat ini, jika menu memiliki promo (`hasPromo = true`), badge di pojok kiri atas card akan menampilkan teks statis "Promo Aktif".
   - **Solusi**: Teks "Promo Aktif" pada blok kode kondisi promo akan diganti dengan variabel `{menu.category}`. Warna *background* orange (`bg-deep-orange`) akan tetap dipertahankan karena secara visual mengindikasikan bahwa item tersebut sedang memiliki promo.

3. **Menghapus Filter Kategori "Paket Hemat"**:
   - **Penyebab**: Variabel konstanta `CATEGORIES` memiliki nilai `'Paket Hemat'` yang merender tab filter dan juga opsi select form.
   - **Solusi**: Menghapus `'Paket Hemat'` dari konstanta `CATEGORIES` di dua file:
     1. `MenuManagementPage.tsx`
     2. `MenuFormModal.tsx`

---

## 2. Rencana Implementasi

### File Target 1: `src/dashboard/features/menu-management/components/MenuCard.tsx`
**Perubahan yang dilakukan:**
1. Di dalam `className` untuk element root card (sekitar baris 48), hapus kondisional `isHabis && 'opacity-75'`.
2. Di dalam blok kode `hasPromo ? ( ... )`, ubah teks `"Promo Aktif"` di dalam tag `<p>` menjadi `{menu.category}`.
3. Di dalam blok render `<AvailabilityToggle>`, ubah pembungkus div dari `<div className="relative shrink-0">` menjadi `<div className="relative shrink-0 z-30">`.

### File Target 2: `src/dashboard/features/menu-management/MenuManagementPage.tsx`
**Perubahan yang dilakukan:**
- Cari deklarasi: `const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Dessert', 'Paket Hemat'];`
- Ubah menjadi: `const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Dessert'];`

### File Target 3: `src/dashboard/features/menu-management/components/MenuFormModal.tsx`
**Perubahan yang dilakukan:**
- Cari deklarasi: `const CATEGORIES = ['Makanan', 'Minuman', 'Dessert', 'Paket Hemat'];`
- Ubah menjadi: `const CATEGORIES = ['Makanan', 'Minuman', 'Dessert'];`

---

## 3. Langkah Validasi
1. Buka dashboard Admin, tab **Manajemen Menu**.
2. **Uji Dropdown (Issue 1)**: Ubah salah satu menu menjadi "Tidak Tersedia". Pastikan area card tersebut menjadi abu-abu/redup, namun kontrol dropdown "Tidak Tersedia" tetap terang, bisa dibaca dengan jelas, dan tidak tertutup overlay.
3. **Uji Badge Promo (Issue 2)**: Temukan menu yang sedang mendapatkan promo (atau buat/assign promo baru pada sebuah menu). Pastikan badge berwarna orange di kiri atas gambar card menampilkan nama kategorinya (misal: "Minuman") dan bukan tulisan "Promo Aktif".
4. **Uji Kategori (Issue 3)**:
   - Pastikan pada deretan tombol filter kategori di bagian atas halaman (di atas daftar menu), tombol "Paket Hemat" sudah hilang.
   - Klik "Tambah Item Baru" (atau edit item yang sudah ada), buka dropdown "Kategori", pastikan pilihan "Paket Hemat" tidak ada lagi.
