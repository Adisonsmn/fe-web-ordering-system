import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

const CustomerApp: FC = () => {
  return (
    <div className="min-h-screen bg-slate-dark flex justify-center items-stretch sm:py-8">
      {/* Container simulating a mobile phone viewport on desktop screen */}
      <div className="w-full max-w-[390px] min-h-screen bg-off-white shadow-2xl relative flex flex-col pt-[44px] pb-[34px]">
        {/* Safe Area Top bar spacer */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[44px] bg-white border-b border-slate-dark/5 flex items-center justify-between px-6 z-50">
          <span className="text-[12px] font-semibold text-slate-dark font-serif">Aroma Senja</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-muted animate-pulse" />
            <span className="text-[11px] text-slate-dark/60 font-mono">Terhubung</span>
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
