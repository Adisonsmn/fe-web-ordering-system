import { cn } from '@shared/utils/cn';
import { Minus, Plus } from 'lucide-react';
import type { FC } from 'react';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

const QuantityStepper: FC<QuantityStepperProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-[#f3f3f3] border border-[rgba(228,190,180,0.3)] rounded-xl shrink-0',
        className,
      )}
    >
      <div className="flex items-center gap-[16px] px-[17px] py-[11px]">
        <button
          type="button"
          onClick={onDecrease}
          disabled={quantity <= 1}
          className="w-[24px] h-[24px] flex items-center justify-center text-slate-dark disabled:opacity-30 disabled:cursor-not-allowed transition-opacity active:scale-90"
          aria-label="Kurangi kuantitas"
        >
          <Minus size={18} />
        </button>

        <div className="min-w-[20px] flex items-center justify-center">
          <span className="font-serif font-semibold text-[20px] leading-[28px] text-black">
            {quantity}
          </span>
        </div>

        <button
          type="button"
          onClick={onIncrease}
          disabled={quantity >= 99}
          className="w-[24px] h-[24px] flex items-center justify-center text-slate-dark disabled:opacity-30 disabled:cursor-not-allowed transition-opacity active:scale-90"
          aria-label="Tambah kuantitas"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default QuantityStepper;
