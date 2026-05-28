import type { RouteObject } from 'react-router-dom';
import CustomerApp from '../CustomerApp';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import KatalogPage from '../features/katalog/KatalogPage';
import AuthChoicePage from '../features/onboarding/AuthChoicePage';
import WelcomePage from '../features/onboarding/WelcomePage';
import SplashScreen from '../features/splash/SplashScreen';

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
    ],
  },
];
