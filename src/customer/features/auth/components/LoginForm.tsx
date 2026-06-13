import { Eye, EyeOff } from 'lucide-react';
import { type FC, useState } from 'react';
import { useLogin } from '../hooks/useAuth';

const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { mutate: login, isPending, error: apiError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Basic client-side validation
    if (!email) {
      setValidationError('Email tidak boleh kosong');
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Format email tidak valid');
      return;
    }

    if (!password) {
      setValidationError('Kata sandi tidak boleh kosong');
      return;
    }

    // Call API
    login({ email, password });
  };

  // Determine error message to show (prefer API error over validation if both exist)
  const errorMessage = apiError?.response?.data?.message || apiError?.message || validationError;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[24px]">
      {/* Email Input */}
      <div className="w-full flex flex-col gap-[8.5px]">
        <label htmlFor="email" className="text-[#5b4039] text-[16px] leading-[24px] font-sans">
          Email
        </label>
        <div className="w-full bg-white border border-[#e4beb4] rounded-[8px] h-[56px] focus-within:border-[#316669] focus-within:ring-1 focus-within:ring-[#316669] transition-all">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@email.com"
            disabled={isPending}
            className="w-full h-full bg-transparent border-none outline-none px-[16px] text-[#5b4039] placeholder-[#5b4039]/40 text-[16px] font-sans rounded-[8px]"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="w-full flex flex-col gap-[8px]">
        <label htmlFor="password" className="text-[#5b4039] text-[16px] leading-[24px] font-sans">
          Kata Sandi
        </label>
        <div className="w-full bg-white border border-[#e4beb4] rounded-[8px] h-[56px] flex items-center focus-within:border-[#316669] focus-within:ring-1 focus-within:ring-[#316669] transition-all overflow-hidden">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isPending}
            className="flex-1 h-full bg-transparent border-none outline-none pl-[16px] text-[#5b4039] placeholder-[#5b4039]/40 text-[16px] font-sans"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-[16px] h-full flex items-center justify-center text-[#5b4039]/60 hover:text-[#5b4039] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 text-[14px] font-sans bg-red-50 p-3 rounded-[8px] border border-red-100 animate-fade-in">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-deep-orange text-white h-[52px] rounded-[8px] font-sans font-bold text-[16px] shadow-[0px_8px_8px_rgba(255,87,34,0.3)] hover:bg-deep-orange/95 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Masuk'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
