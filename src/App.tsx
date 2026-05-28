import type { FC } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { customerRoutes } from './customer/router/customerRoutes';
import { dashboardRoutes } from './dashboard/router/dashboardRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/customer" replace />,
  },
  ...customerRoutes,
  ...dashboardRoutes,
  {
    path: '*',
    element: <Navigate to="/customer" replace />,
  },
]);

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
