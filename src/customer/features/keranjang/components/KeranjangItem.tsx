import QuantityStepper from '@customer/features/menu-detail/components/QuantityStepper';
import type { DetailKeranjangResponse } from '@shared/types';
import { formatRupiah } from '@shared/utils/currency';
import { Trash2 } from 'lucide-react';
import type { FC } from 'react';
import { useRemoveItem, useUpdateItem } from '../hooks/useKeranjang';

interface KeranjangItemProps {
  item: DetailKeranjangResponse;
}

const KeranjangItem: FC<KeranjangItemProps> = ({ item }) => {
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveItem();

  const handleIncrease = () => {
    updateItem({ detailId: item.detailKeranjangId, payload: { quantity: item.quantity + 1 } });
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateItem({ detailId: item.detailKeranjangId, payload: { quantity: item.quantity - 1 } });
    }
  };

  const handleRemove = () => {
    removeItem(item.detailKeranjangId);
  };

  const isPending = isUpdating || isRemoving;

  return (
    <div
      className={`flex gap-4 py-[24px] border-b border-slate-200/60 relative transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Gambar */}
      <div className="w-[96px] h-[96px] rounded-lg bg-slate-200 overflow-hidden shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.menuName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#f3f4f6]" />
        )}
      </div>

      {/* Detail info */}
      <div className="flex flex-col flex-1 min-w-0 pr-8">
        <h3 className="font-serif font-semibold text-[18px] text-slate-dark leading-[24px] truncate">
          {item.menuName}
        </h3>

        {item.catatan && (
          <p className="font-sans italic text-[14px] text-[#5d656f] line-clamp-1 mt-1">
            "{item.catatan}"
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <QuantityStepper
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            className="scale-75 origin-left -ml-2"
          />
          <span className="font-sans font-normal text-[16px] text-deep-orange">
            {formatRupiah(item.subtotal)}
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-[24px] right-0 text-slate-dark/40 hover:text-red-500 transition-colors p-1"
        aria-label="Hapus item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default KeranjangItem;
