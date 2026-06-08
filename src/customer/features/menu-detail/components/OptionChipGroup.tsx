import { cn } from '@shared/utils/cn';
import { Check } from 'lucide-react';
import type { FC } from 'react';

interface OptionChipGroupProps {
  label: string;
  emoji: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  required?: boolean;
  hasError?: boolean;
  variant?: 'spice' | 'doneness';
  className?: string;
}

const OptionChipGroup: FC<OptionChipGroupProps> = ({
  label,
  emoji,
  options,
  selected,
  onSelect,
  required = false,
  hasError = false,
  variant = 'spice',
  className,
}) => {
  if (!options || options.length === 0) return null;

  const isSpice = variant === 'spice';

  return (
    <div className={cn('flex flex-col gap-[16px] w-full', className)}>
      <div className="flex items-center justify-between w-full px-[20px]">
        <div className="flex items-center gap-[8px]">
          <div className="text-[20px] leading-[30px]">{emoji}</div>
          <div className="font-serif font-semibold text-slate-dark text-[18px] leading-[26px]">
            {label}
          </div>
        </div>

        {required ? (
          <div className="bg-deep-orange rounded-[4px] px-[8px] py-[4px]">
            <span className="font-sans font-normal text-white text-[10px] tracking-[0.5px] uppercase">
              WAJIB DIPILIH
            </span>
          </div>
        ) : (
          <div className="bg-teal-muted rounded-[4px] px-[8px] py-[4px]">
            <span className="font-sans font-normal text-white text-[10px] tracking-[0.5px] uppercase">
              OPSIONAL
            </span>
          </div>
        )}
      </div>

      <div className="w-full relative px-[20px]">
        <div
          className={cn(
            'flex flex-wrap gap-[12px] pb-2',
            hasError
              ? 'border-2 border-dashed border-deep-orange rounded-[16px] p-2 -ml-2 -mt-2'
              : '',
          )}
        >
          {options.map((option) => {
            const isSelected = selected === option;

            let chipClasses =
              'shrink-0 flex items-center justify-center px-[17px] py-[9px] rounded-[12px] font-sans font-normal text-[14px] transition-colors border border-solid';

            if (isSelected) {
              chipClasses = cn(
                chipClasses,
                isSpice
                  ? 'bg-deep-orange border-deep-orange text-white'
                  : 'bg-teal-muted border-teal-muted text-white',
              );
            } else {
              chipClasses = cn(
                chipClasses,
                isSpice
                  ? 'border-deep-orange/30 text-slate-dark/70 bg-white'
                  : 'border-teal-muted/40 text-slate-dark/70 bg-white',
              );
            }

            return (
              <button
                key={option}
                type="button"
                className={chipClasses}
                onClick={() => onSelect(option)}
              >
                <div className="flex items-center gap-[8px]">
                  {isSelected && <Check size={16} strokeWidth={3} />}
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {hasError && (
          <div className="flex items-center gap-1 mt-2 text-deep-orange text-[12px] font-sans">
            <span className="text-[14px]">⚠️</span>
            <span>Silakan pilih tingkat kepedasan terlebih dahulu</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionChipGroup;
