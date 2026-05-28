import { useRestoStore } from '@shared/stores/restoStore';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowSkip from '@/assets/arrow_skip.svg';
import authDecor from '@/assets/auth_decor.png';
import heroCoffee from '@/assets/hero_coffee.svg';
import heroStar from '@/assets/hero_star.svg';
import { useGuestLogin } from '../auth/hooks/useAuth';

const AuthChoicePage: FC = () => {
  const navigate = useNavigate();
  const restoName = useRestoStore((state) => state.restoName);
  const { mutate: guestLogin, isPending: isGuestLoggingIn } = useGuestLogin();

  return (
    <div className="relative w-full min-h-screen bg-off-white select-none overflow-hidden flex flex-col font-sans">
      {/* Visual Atmospheric Decoration (opacity 5%) */}
      <div className="absolute bottom-0 right-0 w-[256px] h-[256px] opacity-5 pointer-events-none z-0">
        <img alt="" className="w-full h-full object-contain" src={authDecor} />
      </div>

      {/* Top App Bar (Header) */}
      <div className="h-[64px] px-[20px] flex items-center justify-between relative z-10 w-full">
        {/* Left: Resto Name */}
        <h1 className="text-[20px] font-serif font-semibold text-[#b02f00] tracking-wide">
          {restoName}
        </h1>

        {/* Right: Lewati Button */}
        <button
          type="button"
          onClick={() => navigate('/customer/katalog')}
          className="flex items-center gap-[8px] cursor-pointer active:scale-95 transition-transform py-2"
        >
          <img alt="" src={arrowSkip} className="w-[10.5px] h-[10.5px] object-contain" />
          <span className="text-[16px] font-sans font-normal text-[#3f4851]">Lewati</span>
        </button>
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center px-[20px] pt-[40px] pb-[48px] relative z-10 justify-between">
        {/* Upper Content (Hero, Title, Subtitle, Bento Cards) */}
        <div className="w-full flex flex-col items-center">
          {/* Illustration/Icon Hero */}
          <div className="relative w-[128px] h-[128px] flex items-center justify-center">
            {/* Overlay circle */}
            <div className="w-[128px] h-[128px] rounded-full bg-[#76ABAE]/10 flex items-center justify-center relative overflow-hidden">
              <img
                alt=""
                src={heroCoffee}
                className="w-[42.667px] h-[42.667px] object-contain relative z-10"
              />
              {/* Radial gradient background accent matching Figma */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at center, rgba(101, 154, 157, 1) 0%, rgba(101, 154, 157, 0) 70%)`,
                }}
              />
            </div>

            {/* Floating Badge (Star) */}
            <div className="absolute bottom-[-12.46px] right-[-12.46px] rotate-12 w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-dark/5">
              <img alt="" src={heroStar} className="w-[20px] h-[20px] object-contain" />
            </div>
          </div>

          {/* Heading 2 - Title */}
          <h2 className="text-[22px] font-sans font-bold text-slate-dark text-center leading-[28px] mt-[32px] max-w-[280px]">
            Dapatkan Lebih Banyak Keuntungan
          </h2>

          {/* Subtitle */}
          <p className="text-[16px] font-sans font-normal text-slate-dark/70 text-center leading-[24px] max-w-[320px] mt-[12px] mb-[32px]">
            Masuk atau daftar untuk mengumpulkan poin loyalitas dan melihat riwayat pesanan kamu.
          </p>

          {/* Benefit Row (Asymmetric Bento Cards) */}
          <div className="grid grid-cols-3 gap-[12px] w-full">
            {/* Bento Card 1: Poin */}
            <div className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[8px] items-center justify-center drop-shadow-[0_4px_10px_rgba(48,56,65,0.08)] border border-slate-dark/5">
              <span className="text-[18px] leading-[28px] filter saturate-[0.85]">🎁</span>
              <span className="text-[12px] font-sans font-bold text-slate-dark/80 tracking-[0.6px] leading-[16px]">
                Poin
              </span>
            </div>

            {/* Bento Card 2: Riwayat */}
            <div className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[8px] items-center justify-center drop-shadow-[0_4px_10px_rgba(48,56,65,0.08)] border border-slate-dark/5">
              <span className="text-[18px] leading-[28px] filter saturate-[0.85]">📋</span>
              <span className="text-[12px] font-sans font-bold text-slate-dark/80 tracking-[0.6px] leading-[16px]">
                Riwayat
              </span>
            </div>

            {/* Bento Card 3: Promo */}
            <div className="bg-white rounded-[12px] p-[12px] flex flex-col gap-[8px] items-center justify-center drop-shadow-[0_4px_10px_rgba(48,56,65,0.08)] border border-slate-dark/5">
              <span className="text-[18px] leading-[28px] filter saturate-[0.85]">🏷️</span>
              <span className="text-[12px] font-sans font-bold text-slate-dark/80 tracking-[0.6px] leading-[16px]">
                Promo
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-[16px] mt-[48px]">
          {/* Button 1: Masuk */}
          <button
            type="button"
            onClick={() => navigate('/customer/login')}
            className="w-full bg-deep-orange text-white font-sans font-bold text-[16px] py-[16px] rounded-[12px] active:scale-[0.98] transition-all duration-200 text-center shadow-lg shadow-deep-orange/25 cursor-pointer hover:bg-deep-orange/95"
          >
            Masuk
          </button>

          {/* Button 2: Daftar Akun Baru */}
          <button
            type="button"
            onClick={() => navigate('/customer/register')}
            className="w-full border-2 border-slate-dark text-slate-dark font-sans font-bold text-[16px] py-[14px] rounded-[12px] active:scale-[0.98] transition-all duration-200 text-center cursor-pointer hover:bg-slate-dark hover:text-white"
          >
            Daftar Akun Baru
          </button>

          {/* Button 3: Lanjut sebagai Tamu */}
          <button
            type="button"
            onClick={() => guestLogin({ tableId: '00000000-0000-0000-0000-000000000000' })}
            disabled={isGuestLoggingIn}
            className="w-full text-teal-muted font-sans font-bold text-[16px] py-[12px] active:scale-[0.98] transition-all duration-200 text-center cursor-pointer hover:opacity-80 disabled:opacity-50"
          >
            {isGuestLoggingIn ? 'Memproses...' : 'Lanjut sebagai Tamu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthChoicePage;
