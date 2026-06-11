import type { MejaResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import type { FC } from 'react';

interface MejaGridProps {
  mejaList?: MejaResponse[];
  isLoading?: boolean;
}

export const MejaGrid: FC<MejaGridProps> = ({ mejaList = [], isLoading }) => {
  // Sort by table number to ensure they appear in order 1..20
  const sortedMeja = [...mejaList].sort((a, b) => a.nomorMeja - b.nomorMeja);

  const getMejaStatus = (meja: MejaResponse) => {
    if (meja.mejaStatus) return meja.mejaStatus;
    if (!meja.isOccupied) return 'AVAILABLE';
    return 'OCCUPIED';
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-serif font-semibold text-slate-dark">Status Meja</h3>

        {/* Legend */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-deep-orange" />
            <span className="text-[11px] font-semibold text-slate-dark/70 uppercase">Terisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#e2e2e2]" />
            <span className="text-[11px] font-semibold text-slate-dark/70 uppercase">Kosong</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {isLoading ? (
          // Skeleton
          Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`skel-grid-${i}`}
              className="aspect-square rounded-xl bg-slate-dark/5 animate-pulse"
            ></div>
          ))
        ) : sortedMeja.length === 0 ? (
          <div className="col-span-5 py-12 text-center text-slate-dark/50 text-[14px]">
            Data meja tidak tersedia
          </div>
        ) : (
          sortedMeja.map((meja) => {
            const status = getMejaStatus(meja);
            const statusClass = {
              AVAILABLE: 'bg-[#f3f3f3] text-[#5b4039] border border-transparent',
              OCCUPIED:
                'bg-deep-orange text-white border border-deep-orange shadow-md shadow-deep-orange/20',
            }[status];

            return (
              <div
                key={meja.mejaId}
                className={cn(
                  'aspect-square rounded-xl flex flex-col items-center justify-center transition-all',
                  statusClass,
                )}
              >
                <span className="text-[18px] font-serif font-bold mb-1">
                  {String(meja.nomorMeja).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-wider opacity-85">
                  {status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
