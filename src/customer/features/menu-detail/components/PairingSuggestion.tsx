import type { MenuResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { getOptimizedImageUrl } from '@shared/utils/image';
import { Plus } from 'lucide-react';
import type { FC } from 'react';

interface PairingSuggestionProps {
  pairings: MenuResponse[];
  onAdd: (menuId: string) => void;
  className?: string;
}

const PairingSuggestion: FC<PairingSuggestionProps> = ({ pairings, onAdd, className }) => {
  if (!pairings || pairings.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-[16px] w-full', className)}>
      <div className="px-[20px]">
        <h2 className="font-serif font-semibold text-[#1a1c1c] text-[20px] leading-[28px]">
          Sering Dipesan Bersama
        </h2>
      </div>

      <div className="w-full relative px-[20px]">
        <div className="flex gap-[12px] overflow-x-auto no-scrollbar pb-[16px]">
          {pairings.map((menu) => (
            <div
              key={menu.menuId}
              className="bg-white border border-[rgba(228,190,180,0.1)] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[12px] p-[13px] min-w-[200px] flex items-center gap-[12px] shrink-0"
            >
              <div className="w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 bg-[#f5f5f5]">
                {menu.imageUrl ? (
                  <img
                    src={getOptimizedImageUrl(menu.imageUrl, { width: 88, height: 88 })}
                    alt={menu.menuName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-dark/30 text-[10px]">
                    No Img
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-sans font-normal text-[#1a1c1c] text-[11px] leading-[16.5px] uppercase truncate">
                  {menu.menuName}
                </span>
                <span className="font-sans font-bold text-[#ff5722] text-[12px] leading-[18px]">
                  {formatRupiah(menu.price)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAdd(menu.menuId)}
                className="w-[28px] h-[28px] rounded-full bg-[#b02f00] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                aria-label={`Tambah ${menu.menuName}`}
              >
                <Plus size={16} className="text-white" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PairingSuggestion;
