import type { KeranjangResponse } from '@shared/types';
import { formatRupiah } from '@shared/utils/currency';
import { ShoppingBag } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartMiniBarProps {
  keranjang?: KeranjangResponse;
}

const CartMiniBar: FC<CartMiniBarProps> = ({ keranjang }) => {
  const navigate = useNavigate();

  // If no keranjang or no items, don't show the bar
  if (!keranjang || !keranjang.items || keranjang.items.length === 0) {
    return null;
  }

  const totalItems = keranjang.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] p-[20px] z-50">
      <button
        type="button"
        onClick={() => navigate('/customer/keranjang')}
        className="w-full bg-[#303841]/95 backdrop-blur-md shadow-[0_10px_25px_rgba(48,56,65,0.4)] rounded-[16px] p-[16px] flex items-center justify-between transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-full bg-[#ff5722] flex items-center justify-center shrink-0">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-sans font-bold text-[12px] text-[#76abae] tracking-wider">
              {totalItems} ITEM TERPILIH
            </span>
            <span className="font-serif font-bold text-[16px] text-white">Lihat Pesanan</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-sans font-normal text-[11px] text-[#ffb5a0] tracking-wider">
            TOTAL ESTIMASI
          </span>
          <span className="font-sans font-semibold text-[18px] text-[#ffb5a0]">
            {formatRupiah(keranjang.totalHarga)}
          </span>
        </div>
      </button>
    </div>
  );
};

export default CartMiniBar;
