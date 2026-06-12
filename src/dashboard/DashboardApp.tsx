import { useAuthStore } from '@shared/stores/authStore';
import { cn } from '@shared/utils/cn';
import {
  BarChart3,
  Bell,
  BookOpen,
  LayoutDashboard,
  LayoutGrid,
  Loader2,
  LogOut,
  ReceiptText,
  Settings,
  Ticket,
} from 'lucide-react';
import { type FC, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { buildToggleRequest } from './features/pengaturan/api/config.api';
import {
  useRestoConfigAdmin,
  useUpdateRestoConfig,
} from './features/pengaturan/hooks/useRestoConfigAdmin';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Pesanan', path: '/dashboard/pesanan', icon: ReceiptText },
  { label: 'Laporan', path: '/dashboard/laporan', icon: BarChart3 },
  { label: 'Menu', path: '/dashboard/menu', icon: BookOpen },
  { label: 'Promosi', path: '/dashboard/promo', icon: Ticket },
  { label: 'Meja', path: '/dashboard/meja', icon: LayoutGrid },
  { label: 'Pengaturan', path: '/dashboard/pengaturan', icon: Settings },
];

const DashboardApp: FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const [showConfirmOpenModal, setShowConfirmOpenModal] = useState(false);

  const { data: restoConfig, isLoading: isLoadingConfig } = useRestoConfigAdmin();
  const { mutate: updateConfig, isPending: isUpdatingConfig } = useUpdateRestoConfig();

  const isRestoOpen = restoConfig?.isOpen ?? true;

  const handleLogout = () => {
    clearAuth();
    navigate('/dashboard/login');
  };

  const getPageTitle = (pathname: string) => {
    // Cari match persis dulu, lalu fallback ke prefix match untuk sub-route
    const exact = NAV_ITEMS.find((i) => i.path === pathname);
    if (exact) return exact.label;
    const prefix = NAV_ITEMS.find((i) => i.path !== '/dashboard' && pathname.startsWith(i.path));
    return prefix ? prefix.label : 'Dasbor Utama';
  };

  return (
    <div className="h-screen w-full bg-off-white flex text-slate-dark font-sans overflow-hidden">
      {/* Sidebar Panel */}
      <aside className="w-[240px] h-full bg-[#141c25] text-white flex flex-col shrink-0 shadow-lg relative z-20">
        <div className="p-6 mb-4 flex flex-col gap-1 border-b border-white/5 pb-8">
          <h1 className="text-[24px] font-serif font-bold tracking-wide leading-tight">
            Aroma Senja
          </h1>
          <span className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">
            Fine Dining Merchant
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto mt-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 py-3 text-[12px] font-bold tracking-[0.6px] transition-colors duration-200',
                  isActive
                    ? 'border-l-4 border-l-deep-orange text-white font-bold pl-[28px]'
                    : 'text-[rgba(226,226,226,0.7)] hover:text-white px-6',
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 flex flex-col gap-4 border-t border-white/5 mt-auto">
          {/* Restoran Buka/Tutup Button */}
          <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/10 relative">
            {(isLoadingConfig || isUpdatingConfig) && (
              <div className="absolute inset-0 bg-[#141c25]/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <Loader2 className="animate-spin text-white w-5 h-5" />
              </div>
            )}
            <span className="text-[12px] font-semibold text-white/50 uppercase tracking-wider">
              Status Operasional
            </span>

            <button
              type="button"
              onClick={() => {
                if (isRestoOpen) {
                  setShowConfirmCloseModal(true);
                } else {
                  setShowConfirmOpenModal(true);
                }
              }}
              className={cn(
                'w-full h-10 rounded-lg flex items-center justify-center gap-2 text-[14px] font-semibold transition-all duration-200',
                isRestoOpen
                  ? 'bg-deep-orange text-white'
                  : 'bg-white/5 border border-deep-orange/30 text-white/60 hover:text-white',
              )}
            >
              <span
                className={cn('w-2 h-2 rounded-full', isRestoOpen ? 'bg-white' : 'bg-deep-orange')}
              />
              {isRestoOpen ? 'Restoran Buka' : 'Restoran Tutup'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-deep-orange text-[14px] font-semibold hover:opacity-80 transition-opacity mt-4"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-[64px] bg-white border-b border-slate-dark/5 flex items-center justify-between px-8 z-10 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center">
            <h2 className="text-[22px] font-serif font-bold text-slate-dark">
              {getPageTitle(location.pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              disabled
              className="relative text-slate-dark/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bell size={20} />
              {/* <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-deep-orange border-2 border-white"></span> */}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-dark/10">
              <div className="flex flex-col items-end">
                <span className="text-[13px] font-bold text-slate-dark">
                  {user?.name || 'Admin'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-dark/10 overflow-hidden border border-slate-dark/5">
                <img
                  src={
                    user?.avatarUrl ||
                    `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Admin'}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-[28px] relative">
          <Outlet />
        </main>
      </div>

      {/* Confirmation Modal untuk Tutup Restoran */}
      {showConfirmCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-dark mb-2">Tutup Restoran?</h3>
            <p className="text-slate-dark/70 text-[14px] mb-6 leading-relaxed">
              Pelanggan baru tidak akan bisa melakukan *scan* meja dan membuat pesanan. Apakah Anda
              yakin ingin menutup restoran sekarang?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmCloseModal(false)}
                className="px-4 py-2.5 rounded-lg font-semibold text-[14px] text-slate-dark bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (restoConfig) {
                    updateConfig(buildToggleRequest(restoConfig, false));
                  }
                  setShowConfirmCloseModal(false);
                }}
                disabled={isUpdatingConfig}
                className="px-4 py-2.5 rounded-lg font-semibold text-[14px] text-white bg-deep-orange hover:bg-deep-orange/90 transition-colors shadow-sm"
              >
                Ya, Tutup Restoran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal untuk Buka Restoran */}
      {showConfirmOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-dark mb-2">Buka Restoran?</h3>
            <p className="text-slate-dark/70 text-[14px] mb-6 leading-relaxed">
              Pelanggan akan dapat kembali memindai kode QR meja dan membuat pesanan. Buka restoran
              sekarang?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmOpenModal(false)}
                className="px-4 py-2.5 rounded-lg font-semibold text-[14px] text-slate-dark bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (restoConfig) {
                    updateConfig(buildToggleRequest(restoConfig, true));
                  }
                  setShowConfirmOpenModal(false);
                }}
                disabled={isUpdatingConfig}
                className="px-4 py-2.5 rounded-lg font-semibold text-[14px] text-white bg-teal-muted hover:bg-teal-muted/90 transition-colors shadow-sm"
              >
                Ya, Buka Restoran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardApp;
