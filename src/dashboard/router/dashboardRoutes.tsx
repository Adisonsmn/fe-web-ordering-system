import type { RouteObject } from 'react-router-dom';
import DashboardApp from '../DashboardApp';
import AdminLoginPage from '../features/auth/AdminLoginPage';
import MejaManagementPage from '../features/meja-management/MejaManagementPage';
import MenuManagementPage from '../features/menu-management/MenuManagementPage';
import OverviewPage from '../features/overview/OverviewPage';
import PesananManagementPage from '../features/pesanan-management/PesananManagementPage';
import { PromoManagementPage } from '../features/promo-management/PromoManagementPage';
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
        path: 'menu',
        element: <MenuManagementPage />,
      },
      {
        path: 'promo',
        element: <PromoManagementPage />,
      },
      {
        path: 'meja',
        element: <MejaManagementPage />,
      },
    ],
  },
];
