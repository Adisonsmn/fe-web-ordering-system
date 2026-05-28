import type { MenuResponse } from '@shared/types';
import { formatRupiah } from '@shared/utils/currency';
import { Plus } from 'lucide-react';
import type { FC } from 'react';

interface MenuCardProps {
  menu: MenuResponse;
  onAddToCart: (menuId: string) => void;
  isAddingToCart: boolean;
}

const MenuCard: FC<MenuCardProps> = ({ menu, onAddToCart, isAddingToCart }) => {
  const isAvailable = menu.isAvailable;

  return (
    <div
      className={`bg-white rounded-[12px] p-[13px] flex gap-3 relative overflow-hidden ${
        isAvailable
          ? 'shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]'
          : 'border border-dashed border-[#e4beb4]'
      }`}
    >
      {!isAvailable && <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none" />}

      {/* Image Section */}
      <div className="relative w-[76px] h-[76px] rounded-[8px] bg-slate-200 overflow-hidden shrink-0">
        {menu.imageUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.menuName}
            className={`w-full h-full object-cover ${!isAvailable && 'grayscale'}`}
          />
        ) : (
          <div className="w-full h-full bg-[#f3f4f6]" />
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-[11px] font-bold tracking-wider">HABIS</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 min-w-0 justify-between">
        <div>
          <h3
            className={`font-sans font-bold text-[16px] truncate ${
              isAvailable ? 'text-[#303841]' : 'text-[#303841]/60'
            }`}
          >
            {menu.menuName}
          </h3>
          <p className="font-sans font-normal text-[12px] text-[#5b4039] line-clamp-2 mt-0.5 opacity-80">
            {menu.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            {menu.promo && (
              <span className="text-[11px] text-[#ff5722] font-semibold line-through">
                {formatRupiah(menu.price)}
              </span>
            )}
            <span
              className={`font-sans font-semibold text-[18px] ${
                isAvailable ? (menu.promo ? 'text-[#b02f00]' : 'text-[#303841]') : 'text-[#303841]'
              }`}
            >
              {formatRupiah(
                menu.promo
                  ? menu.promo.tipeDiskon === 'NOMINAL'
                    ? menu.price - menu.promo.nilaiDiskon
                    : menu.price - menu.price * (menu.promo.nilaiDiskon / 100)
                  : menu.price,
              )}
            </span>
          </div>

          <button
            type="button"
            disabled={!isAvailable || isAddingToCart}
            onClick={() => onAddToCart(menu.menuId)}
            className={`flex items-center justify-center h-[28px] px-3 rounded-[8px] transition-all active:scale-95 ${
              isAvailable
                ? 'bg-[#ff5722] text-white hover:bg-[#b02f00] shadow-[0_4px_10px_rgba(255,87,34,0.3)]'
                : 'bg-[#e2e2e2] text-[#5b4039] opacity-80 cursor-not-allowed'
            }`}
          >
            {isAvailable ? (
              <span className="font-sans font-semibold text-[11px] tracking-wide flex items-center gap-1">
                <Plus size={12} strokeWidth={3} />
                TAMBAH
              </span>
            ) : (
              <span className="font-sans font-semibold text-[11px] tracking-wide">
                TERSEDIA NANTI
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
