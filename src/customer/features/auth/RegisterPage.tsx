import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';

const RegisterPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-off-white select-none overflow-hidden flex flex-col items-center font-sans z-0 pt-[32px] pb-[32px]">
      {/* Header / Brand Section */}
      <div className="w-full flex flex-col items-center px-[20px] pb-[24px] shrink-0 z-20">
        <h1 className="text-[32px] font-serif font-bold text-[#b02f00] leading-[40px] tracking-[-0.64px] pb-[12px]">
          Aroma Senja
        </h1>
        <div className="flex flex-col items-center gap-[4px]">
          <h2 className="text-[20px] font-sans font-bold text-[#303841] leading-[28px]">
            Buat Akun Baru
          </h2>
          <p className="text-[16px] font-sans font-normal text-[#575f69] leading-[24px]">
            Gratis & hanya butuh 1 menit
          </p>
        </div>
      </div>

      {/* Main - Signup Form Canvas */}
      <div className="w-full max-w-[350px] bg-white rounded-[12px] shadow-[0px_4px_10px_rgba(48,56,65,0.08)] p-[24px] flex flex-col gap-[24px] z-20 shrink-0">
        {/* Form Component */}
        <RegisterForm />

        {/* Login Link */}
        <div className="w-full flex items-center justify-center">
          <p className="text-[16px] font-sans font-normal text-[#5b4039] leading-[24px]">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => navigate('/customer/login')}
              className="text-[#76abae] hover:underline transition-all cursor-pointer font-normal"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>

      {/* Visual Decoration (Atmospheric) */}
      <div className="absolute bottom-[-8px] right-[-40px] opacity-10 pointer-events-none z-10">
        <div className="w-[256px] h-[256px] rounded-full overflow-hidden">
          {/* Fallback color if image is not there, or actual image if available */}
          {/* I will use a simple color circle as placeholder since image is from localhost on Figma */}
          <div className="w-full h-full bg-[#303841] rounded-full blur-md mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
