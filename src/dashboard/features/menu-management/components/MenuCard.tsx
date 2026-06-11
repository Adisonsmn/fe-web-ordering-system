import type { MenuResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import type { FC } from 'react';
import { AvailabilityToggle } from './AvailabilityToggle';

interface MenuCardProps {
  menu: MenuResponse;
  onEdit: (menu: MenuResponse) => void;
  onToggleAvailability: (menuId: string, isAvailable: boolean) => void;
  isToggling?: boolean;
}

export const MenuCard: FC<MenuCardProps> = ({
  menu,
  onEdit,
  onToggleAvailability,
  isToggling = false,
}) => {
  const hasPromo = menu.promo !== null;
  const activePromo = menu.promo;

  const originalPrice = menu.price;
  let finalPrice = originalPrice;

  if (activePromo) {
    if (activePromo.tipeDiskon === 'NOMINAL') {
      finalPrice = Math.max(0, originalPrice - activePromo.nilaiDiskon);
    } else if (activePromo.tipeDiskon === 'PERSEN') {
      const discountAmount = originalPrice * (activePromo.nilaiDiskon / 100);
      finalPrice = Math.max(0, originalPrice - discountAmount);
    }
  }

  const isHabis = !menu.isAvailable;

  return (
    <div
      onClick={() => onEdit(menu)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(menu);
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        'bg-white border border-deep-orange/20 border-solid flex flex-col items-start justify-self-stretch overflow-clip pb-[6px] pt-px px-px relative rounded-[12px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.07)] shrink-0 transition-transform duration-200 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-1',
      )}
    >
      {/* Jika Habis, tambahkan efek overlay putih transparan sesuai Figma (Card Item 3) */}
      {isHabis && (
        <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[12px] z-20">
          <div className="absolute bg-white inset-0 rounded-[12px] opacity-50" />
          <div className="absolute bg-[rgba(255,255,255,0.5)] inset-0 mix-blend-saturation rounded-[12px]" />
        </div>
      )}

      {/* Container Gambar */}
      <div className="h-[192px] relative shrink-0 w-full overflow-hidden rounded-t-[11px]">
        {menu.imageUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.menuName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {/* Overlay Stok Habis di Gambar */}
        {isHabis && (
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-10">
            <div className="bg-red-600 px-[16px] py-[8px] rounded-[9999px]">
              <p className="text-[12px] font-['DM_Sans'] text-white tracking-[0.6px] leading-[16px] m-0">
                STOK HABIS
              </p>
            </div>
          </div>
        )}

        {/* Badge Kategori / Promo (di Kiri Atas) */}
        {!isHabis &&
          (hasPromo ? (
            <div className="absolute bg-deep-orange flex flex-col items-start left-[12px] px-[12px] py-[4px] rounded-[9999px] top-[12px] z-10">
              <p className="text-[12px] font-['DM_Sans'] text-white tracking-[0.6px] leading-[16px] m-0">
                {menu.category}
              </p>
            </div>
          ) : (
            <div className="absolute backdrop-blur-[4px] bg-[rgba(255,255,255,0.9)] border border-deep-orange/20 border-solid flex flex-col items-start left-[12px] px-[13px] py-[5px] rounded-[9999px] top-[12px] z-10">
              <p className="text-slate-dark text-[12px] font-['DM_Sans'] tracking-[0.6px] leading-[16px] m-0">
                {menu.category}
              </p>
            </div>
          ))}
      </div>

      {/* Konten Card */}
      <div className="bg-clip-padding flex flex-col gap-[8px] items-start p-[20px] relative w-full h-full">
        {/* Title & Price Row */}
        <div className="flex items-start justify-between relative shrink-0 w-full">
          <div className="flex flex-col items-start pr-2 relative shrink-0 flex-1">
            <h3 className="font-['DM_Sans'] text-slate-dark text-[20px] leading-[25px] m-0 line-clamp-2">
              {menu.menuName}
            </h3>
          </div>
          <div className="flex flex-col items-end relative shrink-0">
            <div className="flex flex-col items-start relative shrink-0">
              <p className="font-['DM_Sans'] text-deep-orange text-[14px] tracking-[-0.14px] leading-[20px] m-0">
                Rp {Math.round(finalPrice / 1000)}k
              </p>
            </div>
            {hasPromo && (
              <div className="flex flex-col items-start relative shrink-0">
                <p className="font-['DM_Sans'] text-[10px] text-[rgba(91,64,57,0.4)] leading-[15px] line-through m-0">
                  Rp {Math.round(originalPrice / 1000)}k
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col items-start overflow-clip pb-[8px] relative shrink-0 w-full flex-1">
          <p className="font-['DM_Sans'] text-slate-dark text-[14px] leading-[20px] m-0 line-clamp-2">
            {menu.description || 'Tidak ada deskripsi'}
          </p>
        </div>

        {/* Status & Toggle (Bottom Border) */}
        <div className="border-deep-orange/20 border-solid border-t flex items-center justify-between pt-[17px] relative shrink-0 w-full mt-auto">
          <div className="flex gap-[8px] items-center relative">
            <div
              className={cn(
                'rounded-[9999px] shrink-0 size-[12px]',
                menu.isAvailable ? 'bg-teal-muted' : 'bg-red-600',
              )}
            />
            <div className="flex flex-col items-start relative shrink-0">
              <p
                className={cn(
                  "font-['DM_Sans'] text-[12px] tracking-[0.6px] uppercase leading-[16px] m-0",
                  menu.isAvailable ? 'text-teal-muted' : 'text-red-600',
                )}
              >
                {menu.isAvailable ? 'TERSEDIA' : 'HABIS'}
              </p>
            </div>
          </div>

          <div className="relative shrink-0 z-30">
            <AvailabilityToggle
              menuId={menu.menuId}
              isAvailable={menu.isAvailable}
              onToggle={onToggleAvailability}
              isLoading={isToggling}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
