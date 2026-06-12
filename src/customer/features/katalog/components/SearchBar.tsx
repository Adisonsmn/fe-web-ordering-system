import { Search } from 'lucide-react';
import type { ChangeEvent, FC } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="absolute bg-white border border-[rgba(228,190,180,0.3)] border-solid content-stretch flex items-center left-[20px] px-[17px] py-[13px] right-[20px] rounded-[9999px] top-[256px] z-10 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
      <div className="relative shrink-0 flex items-center justify-center mr-2 text-[#5b4039]/60">
        <Search size={18} />
      </div>
      <div className="flex-[1_0_0] min-w-px relative">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip py-px relative rounded-[inherit] size-full">
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Cari makanan atau minuman..."
            className="w-full bg-transparent border-none outline-none font-sans font-normal text-[14px] text-[#5b4039] placeholder-[#5b4039]/60"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
