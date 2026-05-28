import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

const DashboardApp: FC = () => {
  return (
    <div className="min-h-screen bg-off-white flex text-slate-dark font-sans">
      {/* Sidebar Panel */}
      <aside className="w-[280px] bg-slate-dark text-white flex flex-col justify-between shrink-0 shadow-lg">
        <div className="flex flex-col gap-8 p-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-deep-orange rounded-lg flex items-center justify-center font-bold text-[18px] text-white font-serif">
              AS
            </span>
            <h1 className="text-[20px] font-serif font-bold tracking-wide">Aroma Senja</h1>
          </div>
          <nav className="flex flex-col gap-2">
            <div className="px-4 py-3 bg-teal-muted text-white rounded-xl text-[14px] font-semibold flex items-center gap-3 shadow-md">
              <span>Overview Dasbor</span>
            </div>
          </nav>
        </div>
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold">Admin Panel</span>
            <span className="text-[11px] text-white/50">Restoran Mode</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-teal-muted animate-pulse" />
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[70px] bg-white border-b border-slate-dark/5 flex items-center justify-between px-8 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold text-slate-dark/60">Selamat Bekerja,</span>
            <span className="text-[16px] font-bold text-slate-dark">Administrator</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] bg-slate-dark/5 px-3 py-1.5 rounded-full font-semibold">
              Koneksi Server: Aman
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardApp;
