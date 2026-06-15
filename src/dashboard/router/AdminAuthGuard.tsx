import { useAuthStore } from '@shared/stores/authStore';
import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminAuthGuardProps {
  children: ReactNode;
}

const AdminAuthGuard: FC<AdminAuthGuardProps> = ({ children }) => {
  const { token, user, loginExpiresAt, isSessionInvalidated, setSessionInvalidated, clearAuth } = useAuthStore();
  const location = useLocation();

  // Cek apakah sesi sudah kedaluwarsa berdasarkan loginExpiresAt
  const isExpired = loginExpiresAt !== null && Date.now() > loginExpiresAt;
  if (isExpired && !isSessionInvalidated) {
    setSessionInvalidated(true);
  }

  // Jika sesi tidak valid (karena login dari perangkat lain atau kedaluwarsa),
  // tampilkan overlay modal card toast dan buramkan tampilan dashboard di belakangnya
  if (isSessionInvalidated) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Render halaman di belakang dengan efek blur dan matikan interaksi */}
        <div className="filter blur-md pointer-events-none select-none h-screen w-full overflow-hidden">
          {children}
        </div>
        
        {/* Blocking Glassmorphic Overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-dark/30 backdrop-blur-[6px] p-4 transition-all duration-300">
          {/* Card Toast Container */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(48,56,65,0.2)] max-w-sm w-full p-6 text-center border border-slate-dark/5 animate-fade-in-up scale-[1.02] transform transition-transform duration-300">
            {/* Pulsing Warning Icon in Deep Orange */}
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-deep-orange/10 text-deep-orange mb-5 animate-pulse">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            
            {/* Title with Serif font */}
            <h3 className="text-[20px] font-serif text-slate-dark font-bold mb-3 tracking-wide">
              Sesi Berakhir
            </h3>
            
            {/* Explanation with muted text */}
            <p className="text-[14px] text-slate-dark/70 mb-6 leading-relaxed">
              Sesi Anda telah dinonaktifkan karena akun ini telah masuk di perangkat lain, atau waktu sesi Anda telah habis.
            </p>
            
            {/* CTA Button */}
            <button
              type="button"
              onClick={() => {
                clearAuth();
              }}
              className="w-full bg-deep-orange text-white font-semibold text-[15px] h-[52px] rounded-xl shadow-md shadow-deep-orange/20 active:scale-[0.98] hover:bg-deep-orange/90 transition-all duration-200"
            >
              Login Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

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
