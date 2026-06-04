import { useAuthStore } from '@shared/stores/authStore';
import { UtensilsCrossed } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from './components/AdminLoginForm';

const AdminLoginPage: FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      navigate('/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center font-sans px-4 py-8 overflow-y-auto">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop"
          alt="Fine Dining Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[440px] flex flex-col items-center gap-8 relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-1.5">
          <UtensilsCrossed className="text-deep-orange w-8 h-8 mb-1" strokeWidth={1.5} />
          <h1 className="font-serif italic font-semibold text-white text-[24px] leading-tight">
            Aroma Senja
          </h1>
          <p className="font-sans font-bold text-white/80 text-[12px] tracking-[1.2px]">
            FINE DINING MERCHANT
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-[12px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] p-[32px] sm:px-[41px] sm:pt-[41px] sm:pb-[57px] flex flex-col gap-[32px]">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="font-serif font-bold text-slate-dark text-[32px] leading-tight">
              Selamat Datang
              <br />
              Kembali
            </h2>
            <p className="font-sans text-slate-dark/80 text-[16px]">
              Silakan masuk untuk mengelola restoran Anda.
            </p>
          </div>

          {/* Form */}
          <AdminLoginForm />
        </div>

        {/* Footer Actions */}
        <div className="w-full flex items-center justify-center gap-4 mt-2">
          <button className="font-sans font-bold text-white/60 hover:text-white transition-colors text-[12px] tracking-[0.6px]">
            Lupa Kata Sandi?
          </button>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <button className="font-sans font-bold text-white/60 hover:text-white transition-colors text-[12px] tracking-[0.6px]">
            Hubungi Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
