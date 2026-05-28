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
          <div className="font-serif font-semibold text-[#1a1c1c] text-[20px] leading-[28px]">
            {label}
          </div>
        </div>

        {required ? (
          <div className="bg-[#ff5722] rounded-[4px] px-[8px] py-[4px]">
            <span className="font-sans font-normal text-white text-[10px] tracking-[0.5px] uppercase">
              WAJIB DIPILIH
            </span>
          </div>
        ) : (
          <div className="bg-[#76abae] rounded-[4px] px-[8px] py-[4px]">
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
              ? 'border-2 border-dashed border-[#ff5722] rounded-[16px] p-2 -ml-2 -mt-2'
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
                  ? 'bg-[#ff5722] border-[#ff5722] text-white'
                  : 'bg-[#76abae] border-[#76abae] text-white',
              );
            } else {
              chipClasses = cn(
                chipClasses,
                isSpice
                  ? 'border-[#e4beb4] text-[rgba(26,28,28,0.7)] bg-white'
                  : 'border-[rgba(118,171,174,0.4)] text-[rgba(26,28,28,0.7)] bg-white',
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
          <div className="flex items-center gap-1 mt-2 text-[#ff5722] text-[12px] font-sans">
            <span className="text-[14px]">⚠️</span>
            <span>Silakan pilih tingkat kepedasan terlebih dahulu</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionChipGroup;
