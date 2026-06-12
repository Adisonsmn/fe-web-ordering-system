import type { RatingSentimenResponse } from '@shared/types';
import { Star } from 'lucide-react';
import type { FC } from 'react';

interface RatingChartProps {
  data?: RatingSentimenResponse[];
  isLoading?: boolean;
}

export const RatingChart: FC<RatingChartProps> = ({ data = [], isLoading }) => {
  // Hitung total ulasan dari semua bintang
  const totalReviews = data.reduce((acc, curr) => acc + curr.count, 0);

  // Hitung rata-rata berbobot
  const avgRating =
    totalReviews > 0
      ? (data.reduce((acc, curr) => acc + curr.bintang * curr.count, 0) / totalReviews).toFixed(1)
      : '0.0';

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 animate-pulse min-h-[300px] flex flex-col justify-between">
        <div className="h-6 bg-slate-dark/10 rounded w-1/3 mb-4" />
        <div className="flex-1 flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-slate-dark/10 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 flex flex-col min-h-[300px]">
      <h3 className="text-[16px] font-serif font-semibold text-slate-dark mb-6">
        Distribusi Ulasan &amp; Rating
      </h3>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-between flex-1">
        {/* Average Rating Big Display */}
        <div className="flex flex-col items-center justify-center p-4 border-r border-slate-dark/10 pr-8">
          <span className="text-[48px] font-serif font-bold text-slate-dark leading-none">
            {avgRating}
          </span>
          <div className="flex gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= Math.round(Number(avgRating))
                    ? 'fill-deep-orange text-deep-orange'
                    : 'text-slate-dark/20'
                }
              />
            ))}
          </div>
          <span className="text-[12px] text-slate-dark/50">{totalReviews} Total Ulasan</span>
        </div>

        {/* Breakdown Progress Bars — 5 down to 1 */}
        <div className="flex-1 w-full flex flex-col gap-2.5">
          {[5, 4, 3, 2, 1].map((ratingVal) => {
            // Cari data dari API; jika tidak ada, default count = 0
            const item = data.find((d) => d.bintang === ratingVal);
            const count = item?.count ?? 0;
            // Hitung persentase di sini (bukan dari backend)
            const persentase = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={ratingVal} className="flex items-center gap-3 w-full">
                <span className="text-[12px] font-bold text-slate-dark w-3 text-right">
                  {ratingVal}
                </span>
                <Star size={12} className="fill-slate-dark/40 text-slate-dark/40" />
                <div className="flex-1 h-2.5 bg-off-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-deep-orange rounded-full transition-all duration-300"
                    style={{ width: `${persentase}%` }}
                  />
                </div>
                <span className="text-[12px] text-slate-dark/50 w-8 text-right">
                  {persentase.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
