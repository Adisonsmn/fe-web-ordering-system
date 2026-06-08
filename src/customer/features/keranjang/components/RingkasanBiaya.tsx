import { formatRupiah } from '@shared/utils/currency';
import type { FC } from 'react';

interface RingkasanBiayaProps {
  subtotal: number;
  diskonPoin: number;
}

const RingkasanBiaya: FC<RingkasanBiayaProps> = ({ subtotal, diskonPoin }) => {
  // Asumsi: pajak & layanan 10% dari subtotal (sebelum diskon poin) - sesuaikan jika beda
  const pajak = subtotal * 0.1;
  const total = subtotal + pajak - diskonPoin;

  return (
    <div className="mt-8 border-t border-[#e4beb4] pt-6 pb-24">
      <h3 className="font-serif font-bold text-[18px] text-slate-dark mb-4">Ringkasan Biaya</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center font-sans text-[15px]">
          <span className="text-[#5d656f]">Subtotal</span>
          <span className="text-[#1a1c1c] font-medium">{formatRupiah(subtotal)}</span>
        </div>

        {diskonPoin > 0 && (
          <div className="flex justify-between items-center font-sans text-[15px] text-[#316669]">
            <span>Loyalty Points</span>
            <span className="font-medium">-{formatRupiah(diskonPoin)}</span>
          </div>
        )}

        <div className="flex justify-between items-center font-sans text-[15px]">
          <span className="text-[#5d656f]">Pajak & Layanan (10%)</span>
          <span className="text-[#1a1c1c] font-medium">{formatRupiah(pajak)}</span>
        </div>

        <div className="border-t border-dashed border-slate-300 my-4" />

        <div className="flex justify-between items-center">
          <span className="font-serif font-semibold text-[20px] text-slate-dark">
            Total Pembayaran
          </span>
          <span className="font-sans font-bold text-[20px] text-deep-orange">
            {formatRupiah(total > 0 ? total : 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RingkasanBiaya;
