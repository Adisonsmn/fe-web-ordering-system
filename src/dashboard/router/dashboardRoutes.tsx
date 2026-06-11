import type { RouteObject } from 'react-router-dom';
import DashboardApp from '../DashboardApp';
import AdminLoginPage from '../features/auth/AdminLoginPage';
import LaporanPage from '../features/laporan/LaporanPage';
import MejaManagementPage from '../features/meja-management/MejaManagementPage';
import MenuManagementPage from '../features/menu-management/MenuManagementPage';
import OverviewPage from '../features/overview/OverviewPage';
import PengaturanPage from '../features/pengaturan/PengaturanPage';
import PesananManagementPage from '../features/pesanan-management/PesananManagementPage';
import RiwayatPesananPage from '../features/pesanan-management/RiwayatPesananPage';
import { PromoManagementPage } from '../features/promo-management/PromoManagementPage';
import { RiwayatPromoPage } from '../features/promo-management/RiwayatPromoPage';
import AdminAuthGuard from './AdminAuthGuard';

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard/login',
    element: <AdminLoginPage />,
  },
  {
    path: 'dashboard',
    element: (
      <AdminAuthGuard>
        <DashboardApp />
      </AdminAuthGuard>
    ),
    children: [
      {
        path: '',
        element: <OverviewPage />,
      },
      {
        path: 'pesanan',
        element: <PesananManagementPage />,
      },
      {
        path: 'pesanan/riwayat',
        element: <RiwayatPesananPage />,
      },
      {
        path: 'laporan',
        element: <LaporanPage />,
      },
      {
        path: 'menu',
        element: <MenuManagementPage />,
      },
      {
        path: 'promo',
        element: <PromoManagementPage />,
      },
      {
        path: 'promo/riwayat',
        element: <RiwayatPromoPage />,
      },
      {
        path: 'meja',
        element: <MejaManagementPage />,
      },
      {
        path: 'pengaturan',
        element: <PengaturanPage />,
      },
    ],
  },
];
