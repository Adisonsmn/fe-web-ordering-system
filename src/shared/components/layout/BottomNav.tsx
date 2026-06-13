import { useAuthStore } from '@shared/stores/authStore';
import { cn } from '@shared/utils/cn';
import { Award, Receipt, User, Utensils } from 'lucide-react';
import type { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isGuest = useAuthStore((s) => s.isGuest);

  const activePesananId = localStorage.getItem('activePesananId');

  const isMenuRoute = currentPath.includes('/customer/katalog');
  const isOrdersRoute =
    currentPath.includes('/customer/pesanan/tracking') ||
    currentPath.includes('/customer/pesanan-sukses');
  const isLoyaltyRoute = currentPath.includes('/customer/loyalty');

  const handleOrdersClick = () => {
    if (activePesananId) {
      navigate(`/customer/pesanan/tracking/${activePesananId}`);
    } else {
      alert('Belum ada pesanan aktif');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#f9f9f9] border-t border-[#e4beb4] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] h-[80px] max-w-[390px] mx-auto w-full pb-safe">
      <div className="flex items-center justify-around h-full px-2">
        {/* Tab Menu */}
        <button
          type="button"
          onClick={() => navigate('/customer/katalog')}
          className="flex flex-col items-center justify-center flex-1 h-full py-2 group cursor-pointer"
        >
          <div
            className={cn(
              'px-5 py-1.5 rounded-full flex items-center justify-center transition-all duration-200',
              isMenuRoute
                ? 'bg-deep-orange text-[#541200]'
                : 'text-[#5d656f] group-hover:bg-slate-100',
            )}
          >
            <Utensils size={20} strokeWidth={isMenuRoute ? 2.5 : 2} />
          </div>
          <span
            className={cn(
              'text-[12px] font-sans mt-1 transition-colors duration-200',
              isMenuRoute ? 'font-bold text-[#303841]' : 'text-[#5d656f] font-semibold',
            )}
          >
            Menu
          </span>
        </button>

        {/* Tab Orders */}
        <button
          type="button"
          onClick={handleOrdersClick}
          className="flex flex-col items-center justify-center flex-1 h-full py-2 group cursor-pointer"
        >
          <div
            className={cn(
              'px-5 py-1.5 rounded-full flex items-center justify-center transition-all duration-200',
              isOrdersRoute
                ? 'bg-deep-orange text-[#541200]'
                : 'text-[#5d656f] group-hover:bg-slate-100',
            )}
          >
            <Receipt size={20} strokeWidth={isOrdersRoute ? 2.5 : 2} />
          </div>
          <span
            className={cn(
              'text-[12px] font-sans mt-1 transition-colors duration-200',
              isOrdersRoute ? 'font-bold text-[#303841]' : 'text-[#5d656f] font-semibold',
            )}
          >
            Orders
          </span>
        </button>

        {/* Tab Loyalty — aktif hanya jika bukan guest */}
        {isGuest ? (
          <button
            type="button"
            disabled
            className="flex flex-col items-center justify-center flex-1 h-full py-2 opacity-35 cursor-not-allowed"
          >
            <div className="px-5 py-1.5 rounded-full flex items-center justify-center text-[#5d656f]">
              <Award size={20} strokeWidth={2} />
            </div>
            <span className="text-[12px] font-sans mt-1 font-semibold text-[#5d656f]">Loyalty</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/customer/loyalty')}
            className="flex flex-col items-center justify-center flex-1 h-full py-2 group cursor-pointer"
          >
            <div
              className={cn(
                'px-5 py-1.5 rounded-full flex items-center justify-center transition-all duration-200',
                isLoyaltyRoute
                  ? 'bg-deep-orange text-[#541200]'
                  : 'text-[#5d656f] group-hover:bg-slate-100',
              )}
            >
              <Award size={20} strokeWidth={isLoyaltyRoute ? 2.5 : 2} />
            </div>
            <span
              className={cn(
                'text-[12px] font-sans mt-1 transition-colors duration-200',
                isLoyaltyRoute ? 'font-bold text-[#303841]' : 'text-[#5d656f] font-semibold',
              )}
            >
              Loyalty
            </span>
          </button>
        )}

        {/* Tab Account — disabled saat guest */}
        {isGuest ? (
          <button
            type="button"
            disabled
            className="flex flex-col items-center justify-center flex-1 h-full py-2 opacity-35 cursor-not-allowed"
          >
            <div className="px-5 py-1.5 rounded-full flex items-center justify-center text-[#5d656f]">
              <User size={20} strokeWidth={2} />
            </div>
            <span className="text-[12px] font-sans mt-1 font-semibold text-[#5d656f]">Account</span>
          </button>
        ) : (
          <button
            type="button"
            id="bottom-nav-account"
            onClick={() => navigate('/customer/account')}
            className="flex flex-col items-center justify-center flex-1 h-full py-2 group cursor-pointer"
          >
            <div
              className={cn(
                'px-5 py-1.5 rounded-full flex items-center justify-center transition-all duration-200',
                currentPath.includes('/customer/account')
                  ? 'bg-deep-orange text-[#541200]'
                  : 'text-[#5d656f] group-hover:bg-slate-100',
              )}
            >
              <User size={20} strokeWidth={currentPath.includes('/customer/account') ? 2.5 : 2} />
            </div>
            <span
              className={cn(
                'text-[12px] font-sans mt-1 transition-colors duration-200',
                currentPath.includes('/customer/account')
                  ? 'font-bold text-[#303841]'
                  : 'text-[#5d656f] font-semibold',
              )}
            >
              Account
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomNav;
