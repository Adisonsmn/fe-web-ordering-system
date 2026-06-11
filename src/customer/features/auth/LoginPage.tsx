import { ChevronLeft } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';

// Placeholder for Google Icon SVG
const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Google Icon"
  >
    <path
      d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.0545H15.3818C15.1545 13.3091 14.4455 14.3727 13.3818 15.0818V17.5909H16.6091C18.5 15.8545 19.6 13.2818 19.6 10.2273Z"
      fill="#4285F4"
    />
    <path
      d="M10 20C12.7 20 15 19.1 16.6091 17.5909L13.3818 15.0818C12.4818 15.6818 11.3364 16.0455 10 16.0455C7.41818 16.0455 5.22727 14.3 4.42727 11.9545H1.09091V14.5455C2.73636 17.8182 6.11818 20 10 20Z"
      fill="#34A853"
    />
    <path
      d="M4.42727 11.9545C4.22727 11.3545 4.10909 10.6909 4.10909 10C4.10909 9.30909 4.22727 8.64545 4.42727 8.04545V5.45455H1.09091C0.390909 6.83636 0 8.37273 0 10C0 11.6273 0.390909 13.1636 1.09091 14.5455L4.42727 11.9545Z"
      fill="#FBBC05"
    />
    <path
      d="M10 3.95455C11.4727 3.95455 12.7909 4.46364 13.8273 5.45455L16.6818 2.59091C14.9909 1.01818 12.7 0 10 0C6.11818 0 2.73636 2.18182 1.09091 5.45455L4.42727 8.04545C5.22727 5.7 7.41818 3.95455 10 3.95455Z"
      fill="#EA4335"
    />
  </svg>
);

const LoginPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-off-white select-none overflow-hidden flex flex-col font-sans z-0">
      {/* Visual Atmosphere: Subtle Gradient Blur */}
      <div className="absolute top-0 left-0 w-[390px] h-[709px] opacity-40 pointer-events-none -z-10">
        <div className="absolute top-[-96px] right-[-96px] size-[256px] rounded-full bg-[#ffb5a0] blur-[50px]" />
        <div className="absolute bottom-[177px] left-[-128px] size-[320px] rounded-full bg-[#9ad0d3] blur-[60px]" />
      </div>

      {/* Header Top Bar */}
      <div className="absolute top-0 left-0 w-[390px] h-[64px] px-[20px] flex items-center z-20">
        <button
          type="button"
          onClick={() => navigate('/customer/auth-choice')}
          className="flex items-center gap-[8px] cursor-pointer active:scale-95 transition-transform"
        >
          <ChevronLeft size={16} className="text-[#5b4039]" />
          <span className="text-[16px] font-sans font-normal text-[#5b4039]">Kembali</span>
        </button>
      </div>

      {/* Main Content Canvas */}
      <div className="flex-1 w-full flex flex-col gap-[32px] pt-[96px] pb-[48px] px-[20px] z-10 max-w-[430px] self-center">
        {/* Header Section */}
        <div className="w-full flex flex-col gap-[8px] items-start">
          <h1 className="text-[24px] font-serif font-bold text-[#303841] leading-[32px]">
            Masuk ke Akun
          </h1>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Divider */}
        <div className="w-full flex items-center py-[8px]">
          <div className="flex-1 h-px border-t border-[#e4beb4]" />
          <span className="px-[16px] text-[12px] font-sans font-normal text-[#5b4039] leading-[18px]">
            atau
          </span>
          <div className="flex-1 h-px border-t border-[#e4beb4]" />
        </div>

        {/* Social Login Button */}
        <button
          type="button"
          disabled
          className="w-full h-[52px] bg-white border border-[#e4beb4] rounded-[8px] flex items-center justify-center gap-[12px] opacity-70 cursor-not-allowed"
          title="Fitur ini belum tersedia"
        >
          <div className="size-[20px] flex items-center justify-center">
            <GoogleIcon />
          </div>
          <span className="text-[16px] font-sans font-bold text-[#5b4039] leading-[24px]">
            Masuk dengan Google
          </span>
        </button>

        {/* Footer Link */}
        <div className="w-full flex justify-center mt-auto">
          <p className="text-[16px] font-sans font-normal text-[#5b4039] leading-[24px]">
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={() => navigate('/customer/register')}
              className="text-[#316669] hover:underline transition-all cursor-pointer"
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
