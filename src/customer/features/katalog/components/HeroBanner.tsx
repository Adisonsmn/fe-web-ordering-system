import type { FC } from 'react';

// Using a placeholder gradient since we don't have the actual image asset
// from the Figma locally, but it closely resembles the dark atmospheric banner
const HeroBanner: FC = () => {
  return (
    <div className="absolute content-stretch flex flex-col h-[180px] items-start justify-center left-0 overflow-clip right-0 top-[64px]">
      <div className="flex-[1_0_0] min-h-px relative w-full bg-slate-dark">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute h-[216.67%] left-0 max-w-none top-[-58.33%] w-full bg-slate-dark/50" />
        </div>
      </div>
      <div className="absolute bg-gradient-to-t content-stretch flex flex-col from-[#303841] inset-0 items-start justify-end p-[20px] to-[rgba(48,56,65,0)] via-1/2 via-[rgba(48,56,65,0.4)]">
        <div className="content-stretch flex flex-col items-start opacity-90 relative shrink-0 w-full">
          <div className="flex flex-col font-sans font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-white w-full">
            <p className="leading-[24px]">Selamat siang, selamat menikmati!</p>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <div className="flex flex-col font-serif font-bold justify-center leading-[0] relative shrink-0 text-[24px] text-white w-full">
            <p className="leading-[32px]">Pilih menu favoritmu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
