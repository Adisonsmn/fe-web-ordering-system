import type { StrukPesananResponse } from '@shared/types/pesanan.types';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { formatJam, formatTanggal } from '@shared/utils/date';
import type { FC } from 'react';

interface StrukCardProps {
  data: StrukPesananResponse;
  className?: string;
}

const StrukCard: FC<StrukCardProps> = ({ data, className }) => {
  return (
    <div
      className={cn(
        'w-full bg-white relative rounded-tl-xl rounded-tr-xl shadow-[0px_10px_30px_0px_rgba(0,0,0,0.15)] flex flex-col',
        className,
      )}
    >
      {/* Header / Logo Section */}
      <div className="flex flex-col items-center pt-8 pb-4 border-b-2 border-dashed border-deep-orange/20 relative z-10 bg-white rounded-tl-xl rounded-tr-xl">
        <h2 className="font-serif font-bold text-[24px] text-deep-orange">Aroma Senja</h2>
        <p className="font-sans text-[12px] text-slate-dark/60 tracking-wider mt-1 font-bold">
          EST. 2024 • JAKARTA SELATAN
        </p>
      </div>

      {/* Meta Info */}
      <div className="flex flex-col gap-2 px-6 py-4 bg-white">
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[12px] text-slate-dark/70 tracking-wider font-bold uppercase">
            Order ID
          </p>
          <p className="font-sans text-[16px] text-slate-dark font-bold">#{data.kodePesanan}</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[12px] text-slate-dark/70 tracking-wider font-bold uppercase">
            Lokasi
          </p>
          <p className="font-sans text-[16px] text-slate-dark font-bold">
            {data.nomorMeja ? `Meja ${data.nomorMeja}` : 'Takeaway'}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="font-sans text-[12px] text-slate-dark/70 tracking-wider font-bold uppercase">
            Tanggal
          </p>
          <p className="font-sans text-[16px] text-slate-dark">
            {formatTanggal(data.tanggalPesanan)}, {formatJam(data.tanggalPesanan)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-2 bg-white">
        <div className="w-full h-px border-t border-dashed border-deep-orange/30"></div>
      </div>

      {/* Itemized List */}
      <div className="flex flex-col gap-4 px-6 py-4 bg-white">
        {data.items.map((item, index) => (
          <div key={index} className="flex justify-between items-start w-full">
            <div className="flex flex-col flex-1">
              <p className="font-sans text-[16px] text-slate-dark font-bold line-clamp-2">
                {item.menuName}
              </p>
            </div>
            <div className="flex flex-col items-end shrink-0 ml-4">
              <p className="font-sans text-[14px] text-slate-dark">
                {item.quantity} x {formatRupiah(item.hargaSetelahDiskon)}
              </p>
              <p className="font-sans text-[16px] text-slate-dark font-semibold mt-0.5">
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
          <p className="font-sans text-[16px] text-slate-dark">{formatRupiah(data.subtotal)}</p>
        </div>
        {data.diskonPromo > 0 && (
          <div className="flex justify-between items-center w-full">
            <p className="font-sans text-[16px] text-teal-muted">Diskon Promo</p>
            <p className="font-sans text-[16px] text-teal-muted">
              -{formatRupiah(data.diskonPromo)}
            </p>
          </div>
        )}
        {data.diskonPoin > 0 && (
          <div className="flex justify-between items-center w-full">
            <p className="font-sans text-[16px] text-teal-muted">Potongan Poin</p>
            <p className="font-sans text-[16px] text-teal-muted">
              -{formatRupiah(data.diskonPoin)}
            </p>
          </div>
        )}
      </div>

      {/* Total Section */}
      <div className="flex flex-col gap-3 p-6 bg-white relative z-10">
        <div className="flex justify-between items-center w-full">
          <p className="font-serif text-[20px] text-slate-dark font-semibold">Total Bayar</p>
          <p className="font-serif text-[24px] text-deep-orange font-bold">
            {formatRupiah(data.totalAkhir)}
          </p>
        </div>
      </div>

      {/* Footer Decorative */}
      <div className="flex flex-col items-center pt-3 pb-8 bg-white relative z-10">
        <p className="font-sans text-[12px] text-slate-dark/60 italic mb-3">
          Screenshot untuk menyimpan struk ini
        </p>
        <div className="flex items-center gap-3">
          <span className="text-deep-orange opacity-50 text-lg">✦</span>
          <span className="font-serif text-[14px] text-slate-dark/80 tracking-[0.1em] uppercase">
            Aroma Senja
          </span>
          <span className="text-deep-orange opacity-50 text-lg">✦</span>
        </div>
      </div>

      {/* Zigzag Paper Edge (CSS implementation) */}
      <div className="absolute -bottom-2 left-0 right-0 h-4 overflow-hidden" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(135deg, white 25%, transparent 25%), linear-gradient(225deg, white 25%, transparent 25%)',
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
