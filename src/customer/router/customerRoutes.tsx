import type { RouteObject } from 'react-router-dom';
import CustomerApp from '../CustomerApp';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import KatalogPage from '../features/katalog/KatalogPage';
import KeranjangPage from '../features/keranjang/KeranjangPage';
import AuthChoicePage from '../features/onboarding/AuthChoicePage';
import BlockedPage from '../features/onboarding/BlockedPage';
import WelcomePage from '../features/onboarding/WelcomePage';
import KonfirmasiPage from '../features/pesanan/KonfirmasiPage';
import SuksesPage from '../features/pesanan/SuksesPage';
import TrackingPage from '../features/pesanan/TrackingPage';
import SplashScreen from '../features/splash/SplashScreen';
import StrukPage from '../features/struk/StrukPage';
import UlasanPage from '../features/ulasan/UlasanPage';
import UlasanSuksesPage from '../features/ulasan/UlasanSuksesPage';
import LoyaltiPage from '../features/loyalti/LoyaltiPage';
import AccountPage from '../features/account/AccountPage';

export const customerRoutes: RouteObject[] = [
  {
    path: 'customer',
    element: <CustomerApp />,
    children: [
      {
        path: '',
        element: <SplashScreen />,
      },
      {
        path: 'katalog',
        element: <KatalogPage />,
      },
      {
        path: 'welcome',
        element: <WelcomePage />,
      },
      {
        path: 'blocked',
        element: <BlockedPage />,
      },
      {
        path: 'auth-choice',
        element: <AuthChoicePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'keranjang',
        element: <KeranjangPage />,
      },
      {
        path: 'konfirmasi',
        element: <KonfirmasiPage />,
      },
      {
        path: 'pesanan-sukses/:pesananId',
        element: <SuksesPage />,
      },
      {
        path: 'pesanan/tracking/:pesananId',
        element: <TrackingPage />,
      },
      {
        path: 'struk/:pesananId',
        element: <StrukPage />,
      },
      {
        path: 'ulasan/:pesananId',
        element: <UlasanPage />,
      },
      {
        path: 'ulasan-sukses',
        element: <UlasanSuksesPage />,
      },
      {
        path: 'loyalty',
        element: <LoyaltiPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
    ],
  },
];
