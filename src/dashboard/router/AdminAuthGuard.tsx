import { useAuthStore } from '@shared/stores/authStore';
import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminAuthGuardProps {
  children: ReactNode;
}

const AdminAuthGuard: FC<AdminAuthGuardProps> = ({ children }) => {
  const { token, user } = useAuthStore();
  const location = useLocation();

  // Memeriksa apakah user sudah login dan role-nya ADMIN
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN';

  if (!isAuthenticated || !isAdmin) {
    // Jika tidak diotorisasi, arahkan ke login dan simpan rute aslinya
    return <Navigate to="/dashboard/login" state={{ from: location }} replace />;
  }

  // Jika diotorisasi, render anak komponen
  return <>{children}</>;
};

export default AdminAuthGuard;
