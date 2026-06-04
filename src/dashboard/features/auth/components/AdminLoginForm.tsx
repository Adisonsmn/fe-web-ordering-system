import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { type FC, useState } from 'react';
import { useAdminLogin } from '../hooks/useAdminAuth';

const AdminLoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { mutate: login, isPending, error: apiError } = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email) {
      setValidationError('Email tidak boleh kosong');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Format email tidak valid');
      return;
    }

    if (!password) {
      setValidationError('Kata sandi tidak boleh kosong');
      return;
    }

    // Call API (passing email & password; rememberMe could be saved to localStorage if needed later)
    login({ email, password });
  };

  const errorMessage = apiError?.response?.data?.message || apiError?.message || validationError;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[24px]">
      {/* Email Input */}
      <div className="w-full flex flex-col gap-[6px]">
        <label
          htmlFor="email"
          className="font-sans font-bold text-slate-dark text-[12px] tracking-[0.6px] uppercase"
        >
          EMAIL ATAU USERNAME
        </label>
        <div className="w-full relative bg-white border border-slate-dark/20 rounded-[8px] h-[52px] focus-within:border-teal-muted focus-within:ring-1 focus-within:ring-teal-muted transition-all">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-dark/40">
            <User size={20} />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@aromasenja.com"
            disabled={isPending}
            className="w-full h-full bg-transparent border-none outline-none pl-[44px] pr-4 text-slate-dark placeholder:text-slate-dark/40 text-[15px] font-sans rounded-[8px]"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="w-full flex flex-col gap-[6px]">
        <label
          htmlFor="password"
          className="font-sans font-bold text-slate-dark text-[12px] tracking-[0.6px] uppercase"
        >
          KATA SANDI
        </label>
        <div className="w-full relative bg-white border border-slate-dark/20 rounded-[8px] h-[52px] flex items-center focus-within:border-teal-muted focus-within:ring-1 focus-within:ring-teal-muted transition-all overflow-hidden">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-dark/40">
            <Lock size={20} />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isPending}
            className="flex-1 h-full bg-transparent border-none outline-none pl-[44px] pr-[44px] text-slate-dark placeholder:text-slate-dark/40 text-[15px] font-sans"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 px-4 h-full flex items-center justify-center text-slate-dark/40 hover:text-slate-dark transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setRememberMe(!rememberMe)}
      >
        <div
          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${rememberMe ? 'bg-teal-muted border-teal-muted' : 'border-[#907067] bg-white'}`}
        >
          {rememberMe && (
            <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white">
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="font-sans text-[15px] text-[#5b4039] select-none">
          Ingat perangkat ini
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 text-[14px] font-sans bg-red-50 p-3 rounded-[8px] border border-red-100 animate-fade-in -mt-2">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-deep-orange text-white h-[56px] rounded-[8px] font-sans font-bold text-[16px] shadow-[0_10px_15px_-3px_rgba(255,87,34,0.2),0_4px_6px_-4px_rgba(255,87,34,0.2)] hover:bg-deep-orange/90 active:scale-[0.98] transition-all disabled:bg-slate-dark/30 disabled:shadow-none disabled:active:scale-100 flex items-center justify-center mt-2"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Masuk ke Dashboard'
        )}
      </button>
    </form>
  );
};

export default AdminLoginForm;
