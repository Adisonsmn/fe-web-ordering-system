import type { DetailPesananResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { getOptimizedImageUrl } from '@shared/utils/image';
import type { FC } from 'react';

interface OrderItemListProps {
  items: DetailPesananResponse[];
  totalHarga: number;
  showPriceBreakdown?: boolean;
  className?: string;
  isCompleted?: boolean;
}

const OrderItemList: FC<OrderItemListProps> = ({
  items,
  totalHarga,
  showPriceBreakdown = true,
  className,
  isCompleted = false,
}) => {
  // Mock tax calculation based on Figma: Pajak (10%)
  const tax = totalHarga * 0.1;
  const subtotal = totalHarga - tax;

  if (isCompleted) {
    return (
      <div className={cn('w-full grid grid-cols-2 gap-4', className)}>
        {/* Placeholder for 'Mungkin Anda Suka' as requested by User */}
        <div className="col-span-2 text-center py-8 text-slate-dark/60 font-sans border border-dashed border-slate-300 rounded-xl">
          <p>Ini masih demo, menu "Mungkin Anda Suka" belum dibuat API-nya</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-4 w-full">
        {items.map((item) => (
          <div
            key={item.detailPesananId}
            className="bg-white border border-[#e2e2e2] flex items-center gap-4 p-[13px] rounded-xl w-full"
          >
            {/* Image */}
            <div className="w-[80px] h-[80px] rounded-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
              {item.imageUrl ? (
                <img
                  src={getOptimizedImageUrl(item.imageUrl, { width: 160, height: 160 })}
                  alt={item.menuName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex justify-between items-start w-full">
                <h4 className="font-sans font-semibold text-slate-dark text-[16px] leading-[24px] truncate pr-2">
                  {item.menuName}
                </h4>
                <p className="font-sans text-[#b02f00] text-[16px] leading-[24px] whitespace-nowrap">
                  {formatRupiah(item.subTotal)}
                </p>
              </div>

              <div className="mt-1">
                <p className="font-sans text-[14px] text-[#5b4039] leading-[20px] truncate">
                  {item.quantity}x {item.catatan ? `• ${item.catatan}` : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPriceBreakdown && (
        <div className="border-t border-[#e4beb4] pt-4 mt-2 flex flex-col gap-3 w-full">
          <div className="flex justify-between items-center w-full">
            <span className="font-sans text-[#5b4039] text-[16px]">Subtotal</span>
            <span className="font-sans text-[#5b4039] text-[16px]">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center w-full">
            <span className="font-sans text-[#5b4039] text-[16px]">Pajak (10%)</span>
            <span className="font-sans text-[#5b4039] text-[16px]">{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between items-center w-full mt-1">
            <span className="font-serif font-bold text-slate-dark text-[16px]">Total</span>
            <span className="font-serif font-bold text-[#b02f00] text-[16px]">
              {formatRupiah(totalHarga)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItemList;
