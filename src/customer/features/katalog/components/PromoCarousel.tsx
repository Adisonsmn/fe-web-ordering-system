import type { PromoResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { Percent, Tag } from 'lucide-react';
import type { FC } from 'react';

interface PromoCarouselProps {
  promos: PromoResponse[];
}

const PromoCarousel: FC<PromoCarouselProps> = ({ promos }) => {
  if (!promos || promos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-[42px] mb-4">
      <div className="px-5">
        <h2 className="text-[20px] font-serif font-bold text-[#303841]">Promo Spesial</h2>
      </div>

      <div className="flex overflow-x-auto gap-4 px-5 pb-4 scrollbar-none">
        {promos.map((promo, index) => {
          // Alternating colors for promos
          const isOrange = index % 2 === 0;

          return (
            <div
              key={promo.promoId}
              className={cn(
                'min-w-[280px] h-[140px] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-md shrink-0',
                isOrange
                  ? 'bg-gradient-to-br from-[#ff5722] to-[#b02f00]'
                  : 'bg-gradient-to-br from-[#76abae] to-[#316669]',
              )}
            >
              <div className="absolute right-[-20px] top-[-20px] opacity-20">
                {isOrange ? (
                  <Percent size={120} className="text-white transform rotate-12" />
                ) : (
                  <Tag size={120} className="text-white transform -rotate-12" />
                )}
              </div>

              <div className="relative z-10">
                {promo.tag && (
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[11px] font-semibold mb-2">
                    {promo.tag}
                  </span>
                )}
                <h3 className="text-white font-serif font-bold text-[18px] leading-tight mb-1">
                  {promo.namaPromo}
                </h3>
                <p className="text-white/80 text-[13px] line-clamp-2">
                  {promo.description ||
                    `Diskon ${
                      promo.tipeDiskon === 'PERSEN'
                        ? promo.nilaiDiskon + '%'
                        : 'Rp ' + promo.nilaiDiskon
                    }`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromoCarousel;
