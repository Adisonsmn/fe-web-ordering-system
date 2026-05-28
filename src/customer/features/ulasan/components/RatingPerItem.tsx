import { formatRupiah } from '@shared/utils/currency';
import type { FC } from 'react';
import StarRating from './StarRating';

interface RatingPerItemProps {
  menuId: string;
  menuName: string;
  price: number;
  imageUrl?: string | null;
  rating: number;
  onChangeRating: (menuId: string, rating: number) => void;
}

const RatingPerItem: FC<RatingPerItemProps> = ({
  menuId,
  menuName,
  price,
  imageUrl,
  rating,
  onChangeRating,
}) => {
  return (
    <div className="w-full bg-[#f3f3f3] rounded-lg p-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-lg bg-slate-dark/10 overflow-hidden shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={menuName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-dark/30 text-[10px] uppercase font-bold text-center p-1">
              No Img
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-sans font-bold text-[16px] text-slate-dark leading-tight line-clamp-2">
            {menuName}
          </p>
          <p className="font-sans font-bold text-[12px] text-slate-dark/60 tracking-wider mt-1">
            {formatRupiah(price)}
          </p>
        </div>
      </div>

      <div className="shrink-0 ml-2">
        <StarRating value={rating} onChange={(val) => onChangeRating(menuId, val)} size="sm" />
      </div>
    </div>
  );
};

export default RatingPerItem;
