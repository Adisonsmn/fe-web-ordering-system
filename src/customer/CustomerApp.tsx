import { type FC, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@shared/hooks/usePageTitle';
import { useRestoConfig } from './features/splash/hooks/useRestoConfig';

// Halaman yang tetap bisa diakses meskipun restoran tutup
const ALLOWED_WHEN_CLOSED = ['/customer', '/customer/register'];

const CustomerApp: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: restoConfig, isLoading } = useRestoConfig();

  // Set judul tab browser
  usePageTitle('Customer');

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
      <div className="w-full max-w-[390px] min-h-screen bg-off-white shadow-2xl relative flex flex-col pb-[34px]">
        {/* Content Outlet */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerApp;
