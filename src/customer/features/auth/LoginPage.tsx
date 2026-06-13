import { ChevronLeft } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';

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
