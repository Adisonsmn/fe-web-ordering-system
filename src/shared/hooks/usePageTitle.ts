import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Peta path customer → nama halaman (bahasa Indonesia)
const CUSTOMER_PAGE_TITLES: Record<string, string> = {
  '/customer': 'Splash Screen',
  '/customer/welcome': 'Selamat Datang',
  '/customer/auth-choice': 'Pilihan Akun',
  '/customer/login': 'Masuk',
  '/customer/register': 'Daftar',
  '/customer/katalog': 'Katalog Menu',
  '/customer/keranjang': 'Keranjang',
  '/customer/konfirmasi': 'Konfirmasi Pesanan',
  '/customer/loyalty': 'Loyalti',
  '/customer/account': 'Akun Saya',
  '/customer/blocked': 'Akses Ditolak',
  '/customer/ulasan-sukses': 'Ulasan Terkirim',
};

// Peta path dashboard → nama halaman
const DASHBOARD_PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dasbor Utama',
  '/dashboard/pesanan': 'Manajemen Pesanan',
  '/dashboard/pesanan/riwayat': 'Riwayat Pesanan',
  '/dashboard/laporan': 'Laporan',
  '/dashboard/menu': 'Manajemen Menu',
  '/dashboard/promo': 'Manajemen Promosi',
  '/dashboard/promo/riwayat': 'Riwayat Promosi',
  '/dashboard/meja': 'Manajemen Meja',
  '/dashboard/pengaturan': 'Pengaturan',
  '/dashboard/login': 'Login Admin',
};

/**
 * Mencocokan pathname dengan peta judul.
 * Coba exact match dulu, lalu prefix match (lebih spesifik dulu).
 */
function resolveTitle(
  pathname: string,
  titleMap: Record<string, string>,
  fallback: string,
): string {
  // Exact match
  if (titleMap[pathname]) return titleMap[pathname];

  // Prefix match — urutkan dari yang paling panjang agar paling spesifik menang
  const keys = Object.keys(titleMap).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (pathname.startsWith(key + '/') || pathname.startsWith(key)) {
      return titleMap[key];
    }
  }

  return fallback;
}

type AppType = 'Customer' | 'Dashboard';

/**
 * Set document.title sesuai format:
 *   🍵 {AppType} | {Nama Halaman}
 *
 * @param appType  - 'Customer' atau 'Dashboard'
 */
export function usePageTitle(appType: AppType): void {
  const { pathname } = useLocation();

  useEffect(() => {
    let pageTitle: string;

    if (appType === 'Customer') {
      pageTitle = resolveTitle(pathname, CUSTOMER_PAGE_TITLES, 'Halaman Customer');
    } else {
      pageTitle = resolveTitle(pathname, DASHBOARD_PAGE_TITLES, 'Dasbor Utama');
    }

    document.title = `${appType} | ${pageTitle}`;
  }, [pathname, appType]);
}
