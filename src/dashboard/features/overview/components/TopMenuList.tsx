import type { MenuTerlarisResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopMenuListProps {
  data?: MenuTerlarisResponse[];
  isLoading?: boolean;
}

export const TopMenuList: FC<TopMenuListProps> = ({ data = [], isLoading }) => {
  const navigate = useNavigate();
  // Find the maximum sold quantity to calculate relative percentages for the progress bars
  const maxSold = data.length > 0 ? Math.max(...data.map((item) => item.totalTerjual)) : 1;

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 flex flex-col h-[380px]">
      <h3 className="text-[16px] font-serif font-semibold text-slate-dark mb-6">Item Terlaris</h3>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-5">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 5 }).map((_, i) => (
            <div key={`skel-top-${i}`} className="animate-pulse flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="h-4 bg-slate-dark/10 rounded w-1/2"></div>
                <div className="h-4 bg-slate-dark/10 rounded w-16"></div>
              </div>
              <div className="h-2 bg-slate-dark/10 rounded-full w-full"></div>
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-dark/50 text-[14px]">
            Belum ada data menu terlaris
          </div>
        ) : (
          data.map((item, index) => {
            const percentage = Math.max(5, Math.round((item.totalTerjual / maxSold) * 100));
            // Top 1 gets teal color, others get darker slate
            const isTop = index === 0;

            return (
              <div key={item.menuId} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-[14px] text-slate-dark font-medium line-clamp-1">
                    {item.menuName}
                  </span>
                  <span className="text-[13px] text-teal-muted font-semibold whitespace-nowrap ml-4">
                    {item.totalTerjual} porsi
                  </span>
                </div>
                {/* Background bar */}
                <div className="h-1.5 w-full bg-slate-dark/5 rounded-full overflow-hidden">
                  {/* Progress bar */}
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isTop ? 'bg-teal-muted' : 'bg-slate-dark/80',
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-4 mt-auto">
        <button
          type="button"
          onClick={() => navigate('/dashboard/laporan')}
          className="w-full py-2.5 rounded-lg border border-slate-dark/10 text-[13px] font-semibold text-slate-dark hover:bg-slate-dark/5 transition-colors"
        >
          Lihat Semua Laporan
        </button>
      </div>
    </div>
  );
};
