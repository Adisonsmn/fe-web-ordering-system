import { useRestoStore } from '@shared/stores/restoStore';
import { type FC, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRestoConfig } from './features/splash/hooks/useRestoConfig';

// Halaman yang tetap bisa diakses meskipun restoran tutup
const ALLOWED_WHEN_CLOSED = ['/customer', '/customer/register'];

const CustomerApp: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: restoConfig, isLoading } = useRestoConfig();
  const isOpen = useRestoStore((s) => s.isOpen);

  useEffect(() => {
    // Jika data sudah dimuat dan restoran tutup
    if (!isLoading && restoConfig && !restoConfig.isOpen) {
      const currentPath = location.pathname;
      const isAllowed = ALLOWED_WHEN_CLOSED.some((path) => currentPath === path);

      if (!isAllowed) {
        // Redirect ke splash yang menampilkan "Restoran Sedang Tutup"
        navigate('/customer', { replace: true });
      }
    }
  }, [isLoading, restoConfig, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-slate-dark flex justify-center items-stretch sm:py-8">
      {/* Container simulating a mobile phone viewport on desktop screen */}
      <div className="w-full max-w-[390px] min-h-screen bg-off-white shadow-2xl relative flex flex-col pt-[44px] pb-[34px]">
        {/* Safe Area Top bar spacer */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[44px] bg-white border-b border-slate-dark/5 flex items-center justify-between px-6 z-50">
          <span className="text-[12px] font-semibold text-slate-dark font-serif">Aroma Senja</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${isOpen ? 'bg-teal-muted' : 'bg-deep-orange'} animate-pulse`}
            />
            <span className="text-[11px] text-slate-dark/60 font-mono">
              {isOpen ? 'Terhubung' : 'Tutup'}
            </span>
          </div>
        </div>

        {/* Content Outlet */}
        <main className="flex-1 flex flex-col p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerApp;
