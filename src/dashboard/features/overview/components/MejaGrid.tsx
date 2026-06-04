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

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-serif font-semibold text-slate-dark">Status Meja</h3>

        {/* Legend */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-teal-muted"></div>
            <span className="text-[11px] font-semibold text-slate-dark/70 uppercase">Terisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-dark/10"></div>
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
            // For now, mapping OCCUPIED to teal, AVAILABLE to light grey.
            // "BILLING" status is not explicitly in the backend boolean yet (isOccupied only),
            // but we'll prepare the styling for it.
            const statusClass = meja.isOccupied
              ? 'bg-teal-muted text-white shadow-md shadow-teal-muted/20 border border-teal-muted'
              : 'bg-slate-dark/5 text-slate-dark/50 border border-transparent';

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
                <span className="text-[8px] font-semibold uppercase tracking-wider opacity-80">
                  {meja.isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
