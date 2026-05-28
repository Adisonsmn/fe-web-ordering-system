import type { RouteObject } from 'react-router-dom';
import DashboardApp from '../DashboardApp';
import OverviewPage from '../features/overview/OverviewPage';

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <DashboardApp />,
    children: [
      {
        path: '',
        element: <OverviewPage />,
      },
    ],
  },
];
