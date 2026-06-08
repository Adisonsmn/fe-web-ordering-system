import { useAuthStore } from '@shared/stores/authStore';
import type { StrukPesananResponse } from '@shared/types/pesanan.types';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { formatJam, formatTanggal } from '@shared/utils/date';
import { Award } from 'lucide-react';
import type { FC } from 'react';

interface StrukCardProps {
  data: StrukPesananResponse;
  className?: string;
}

const StrukCard: FC<StrukCardProps> = ({ data, className }) => {
  const { isGuest } = useAuthStore();

  // Mathematically consistent tax calculation (tax-inclusive breakdown)
  const baseAmount = Math.round(data.totalAkhir / 1.1);
  const pajak = data.totalAkhir - baseAmount;
  const displaySubtotal = baseAmount + data.diskonPromo + data.diskonPoin;

  // Calculate earned points: earn 1 point for every Rp 1.000 paid
  const earnedPoints = Math.floor(data.totalAkhir / 1000);

  return (
    <div
      className={cn(
        'w-full bg-[#f5f5f5] relative rounded-tl-xl rounded-tr-xl shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] flex flex-col',
        className,
      )}
    >
      {/* Header / Logo Section */}
      <div className="flex flex-col items-center pt-8 pb-4 border-b-2 border-dashed border-deep-orange/25 relative z-10 rounded-tl-xl rounded-tr-xl">
        <h2 className="font-serif font-bold text-[26px] text-slate-dark">Aroma Senja</h2>
        <p className="font-sans text-[12px] text-slate-dark/60 tracking-[0.6px] mt-1 font-bold">
          EST. 2024 • JAKARTA SELATAN
        </p>
      </div>

      {/* Meta Info */}
      <div className="flex flex-col gap-2 px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[12px] text-slate-dark/70 tracking-[0.6px] font-bold uppercase">
            Order ID
          </p>
          <p className="font-sans text-[16px] text-slate-dark font-bold">#{data.kodePesanan}</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[12px] text-slate-dark/70 tracking-[0.6px] font-bold uppercase">
            Lokasi
          </p>
          <p className="font-sans text-[16px] text-slate-dark font-bold">
            {data.nomorMeja ? `Meja ${data.nomorMeja}` : 'Takeaway'}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[12px] text-slate-dark/70 tracking-[0.6px] font-bold uppercase">
            Tanggal
          </p>
          <p className="font-sans text-[16px] text-slate-dark">
            {formatTanggal(data.tanggalPesanan)}, {formatJam(data.tanggalPesanan)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-2">
        <div className="w-full h-px border-t border-dashed border-deep-orange/30"></div>
      </div>

      {/* Itemized List */}
      <div className="flex flex-col gap-4 px-6 py-4">
        {data.items.map((item, index) => (
          <div key={index} className="flex justify-between items-start w-full">
            <div className="flex flex-col flex-1">
              <p className="font-sans text-[16px] text-slate-dark font-bold line-clamp-2">
                {item.menuName}
              </p>
              {item.catatan && (
                <p className="font-sans text-[12px] text-slate-dark/65 mt-1 italic">
                  {item.catatan}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end shrink-0 ml-4">
              <p className="font-sans text-[16px] text-slate-dark">
                {item.quantity} x {formatRupiah(item.hargaSetelahDiskon)}
              </p>
              <p className="font-sans text-[18px] text-slate-dark font-bold mt-0.5">
                {formatRupiah(item.subTotal)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="flex flex-col gap-2 px-6 py-4 bg-slate-dark/5 border-t border-b border-dashed border-deep-orange/30 relative z-10">
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[16px] text-slate-dark/80">Subtotal</p>
          <p className="font-sans text-[16px] text-slate-dark">{formatRupiah(displaySubtotal)}</p>
        </div>
        {data.diskonPromo > 0 && (
          <div className="flex justify-between items-center w-full">
            <p className="font-sans text-[16px] text-teal-muted font-medium">Diskon Promo</p>
            <p className="font-sans text-[16px] text-teal-muted font-medium">
              -{formatRupiah(data.diskonPromo)}
            </p>
          </div>
        )}
        {data.diskonPoin > 0 && (
          <div className="flex justify-between items-center w-full">
            <p className="font-sans text-[16px] text-teal-muted font-medium">Potongan Poin</p>
            <p className="font-sans text-[16px] text-teal-muted font-medium">
              -{formatRupiah(data.diskonPoin)}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[16px] text-slate-dark/80">Pajak (10%)</p>
          <p className="font-sans text-[16px] text-slate-dark">{formatRupiah(pajak)}</p>
        </div>
      </div>

      {/* Total Section */}
      <div className="flex flex-col gap-3 p-6 relative z-10">
        <div className="flex justify-between items-center w-full">
          <p className="font-serif text-[20px] text-slate-dark font-semibold">Total Bayar</p>
          <p className="font-serif text-[24px] text-deep-orange font-bold">
            {formatRupiah(data.totalAkhir)}
          </p>
        </div>

        {/* Loyalty Badge - Hanya untuk Member dan jika poin yang didapat > 0 */}
        {!isGuest && earnedPoints > 0 && (
          <div className="bg-[#b6ecef] flex gap-2 items-center justify-center py-[12px] rounded-[12px] shrink-0 w-full mt-2">
            <Award className="w-5 h-5 text-[#144e51]" />
            <p className="font-sans font-bold text-[#144e51] text-[12px] tracking-[0.6px]">
              KAMU MENDAPATKAN +{earnedPoints} POIN
            </p>
          </div>
        )}
      </div>

      {/* Footer Decorative */}
      <div className="flex flex-col items-center pt-3 pb-8 relative z-10">
        <p className="font-sans text-[12px] text-slate-dark/60 italic mb-3">
          Screenshot untuk menyimpan struk ini
        </p>
        <div className="flex items-center gap-3">
          <span className="text-deep-orange opacity-50 text-[16px]">✦</span>
          <span className="font-serif text-[14px] text-slate-dark/80 tracking-[1.4px] uppercase">
            Aroma Senja
          </span>
          <span className="text-deep-orange opacity-50 text-[16px]">✦</span>
        </div>
      </div>

      {/* Zigzag Paper Edge (CSS implementation) */}
      <div className="absolute -bottom-2 left-0 right-0 h-4 overflow-hidden" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #f5f5f5 25%, transparent 25%), linear-gradient(225deg, #f5f5f5 25%, transparent 25%)',
            backgroundPosition: 'left top, left top',
            backgroundSize: '16px 16px',
            backgroundRepeat: 'repeat-x',
          }}
        />
      </div>
    </div>
  );
};

export default StrukCard;
