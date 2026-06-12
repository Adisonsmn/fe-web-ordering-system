import { cn } from '@shared/utils/cn';
import type { FC } from 'react';

interface KategoriTabProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const KategoriTab: FC<KategoriTabProps> = ({ categories, selected, onSelect }) => {
  return (
    <div className="absolute h-[42px] left-0 overflow-x-auto right-0 top-[318px] flex items-center px-[20px] gap-2 scrollbar-none">
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={cn(
              'content-stretch flex flex-col items-center justify-center px-[24px] h-[34px] rounded-[9999px] shrink-0 transition-colors',
              isActive
                ? 'bg-[#76abae] text-white border border-[#76abae]'
                : 'bg-[#eee] border border-[#e4beb4] text-[#5b4039] hover:bg-[#e4beb4]/20',
            )}
          >
            <span className="font-sans font-normal text-[14px] whitespace-nowrap">{category}</span>
          </button>
        );
      })}
    </div>
  );
};

export default KategoriTab;
