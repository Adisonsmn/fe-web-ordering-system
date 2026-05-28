import { Eye, EyeOff, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { type FC, useState } from 'react';
import { useRegister } from '../hooks/useAuth';

const RegisterForm: FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { mutate: register, isPending, error: apiError } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name || name.length < 2) {
      setValidationError('Nama lengkap minimal 2 karakter');
      return;
    }

    if (phone && !/^[0-9]{8,13}$/.test(phone)) {
      setValidationError('Format nomor telepon tidak valid');
      return;
    }

    if (!email) {
      setValidationError('Email tidak boleh kosong');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Format email tidak valid');
      return;
    }

    if (!password || password.length < 8) {
      setValidationError('Kata sandi minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Konfirmasi kata sandi tidak cocok');
      return;
    }

    if (!agreeTerms) {
      setValidationError('Anda harus menyetujui Syarat & Ketentuan');
      return;
    }

    // Format phone with +62 prefix if provided
    const formattedPhone = phone ? `+62${phone}` : undefined;

    register({ name, email, password, phone: formattedPhone });
  };

  const errorMessage = apiError?.response?.data?.message || apiError?.message || validationError;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[16px]">
      {/* Nama Lengkap */}
      <div className="w-full flex flex-col gap-[8px]">
        <label
          htmlFor="name"
          className="text-[#575f69] text-[12px] font-bold tracking-[0.6px] font-sans"
        >
          NAMA LENGKAP
        </label>
        <div className="w-full bg-[#f3f3f3] border border-[#e4beb4] rounded-[8px] h-[50px] flex items-center focus-within:border-[#316669] focus-within:ring-1 focus-within:ring-[#316669] transition-all overflow-hidden relative">
          <div className="absolute left-[12px] flex items-center justify-center text-[#5b4039] pointer-events-none">
            <User size={16} />
          </div>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={isPending}
            className="w-full h-full bg-transparent border-none outline-none pl-[38px] pr-[16px] text-[#5b4039] placeholder-[#6b7280] text-[16px] font-sans"
          />
        </div>
      </div>

      {/* Nomor Telepon */}
      <div className="w-full flex flex-col gap-[8px]">
        <label
          htmlFor="phone"
          className="text-[#575f69] text-[12px] font-bold tracking-[0.6px] font-sans"
        >
          NOMOR TELEPON
        </label>
        <div className="w-full h-[50px] flex rounded-[8px] focus-within:ring-1 focus-within:ring-[#316669] transition-all">
          <div className="bg-[#e2e2e2] border-y border-l border-[#e4beb4] rounded-l-[8px] flex items-center px-[12px]">
            <span className="text-[#5b4039] text-[16px] font-medium font-sans">+62</span>
          </div>
          <div className="flex-1 bg-[#f3f3f3] border border-[#e4beb4] rounded-r-[8px] flex items-center overflow-hidden">
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} // only allow numbers
              placeholder="812 3456 7890"
              disabled={isPending}
              className="w-full h-full bg-transparent border-none outline-none px-[16px] text-[#5b4039] placeholder-[#6b7280] text-[16px] font-sans"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="w-full flex flex-col gap-[8px]">
        <label
          htmlFor="email"
          className="text-[#575f69] text-[12px] font-bold tracking-[0.6px] font-sans"
        >
          EMAIL
        </label>
        <div className="w-full bg-[#f3f3f3] border border-[#e4beb4] rounded-[8px] h-[50px] flex items-center focus-within:border-[#316669] focus-within:ring-1 focus-within:ring-[#316669] transition-all overflow-hidden relative">
          <div className="absolute left-[12px] flex items-center justify-center text-[#5b4039] pointer-events-none">
            <Mail size={16} />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@email.com"
            disabled={isPending}
            className="w-full h-full bg-transparent border-none outline-none pl-[38px] pr-[16px] text-[#5b4039] placeholder-[#6b7280] text-[16px] font-sans"
          />
        </div>
      </div>

      {/* Kata Sandi */}
      <div className="w-full flex flex-col gap-[8px]">
        <label
          htmlFor="password"
          className="text-[#575f69] text-[12px] font-bold tracking-[0.6px] font-sans"
        >
          KATA SANDI
        </label>
        <div className="w-full bg-[#f3f3f3] border border-[#e4beb4] rounded-[8px] h-[50px] flex items-center focus-within:border-[#316669] focus-within:ring-1 focus-within:ring-[#316669] transition-all overflow-hidden relative">
          <div className="absolute left-[12px] flex items-center justify-center text-[#5b4039] pointer-events-none">
            <Lock size={16} />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isPending}
            className="flex-1 h-full bg-transparent border-none outline-none pl-[38px] text-[#5b4039] placeholder-[#6b7280] text-[16px] font-sans"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-[12px] h-full flex items-center justify-center text-[#5b4039]/60 hover:text-[#5b4039] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Konfirmasi Kata Sandi */}
      <div className="w-full flex flex-col gap-[8px]">
        <label
          htmlFor="confirmPassword"
          className="text-[#575f69] text-[12px] font-bold tracking-[0.6px] font-sans"
        >
          KONFIRMASI KATA SANDI
        </label>
        <div className="w-full bg-[#f3f3f3] border border-[#e4beb4] rounded-[8px] h-[50px] flex items-center focus-within:border-[#316669] focus-within:ring-1 focus-within:ring-[#316669] transition-all overflow-hidden relative">
          <div className="absolute left-[12px] flex items-center justify-center text-[#5b4039] pointer-events-none">
            <ShieldCheck size={16} />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isPending}
            className="flex-1 h-full bg-transparent border-none outline-none pl-[38px] text-[#5b4039] placeholder-[#6b7280] text-[16px] font-sans"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="px-[12px] h-full flex items-center justify-center text-[#5b4039]/60 hover:text-[#5b4039] transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* T&C Checkbox */}
      <div className="flex items-start gap-[12px] pt-[8px]">
        <div className="pt-[2px]">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={isPending}
            className="w-[20px] h-[20px] bg-white border border-[#e4beb4] rounded-[4px] cursor-pointer text-[#76abae] focus:ring-[#76abae]"
          />
        </div>
        <label
          htmlFor="agreeTerms"
          className="text-[16px] font-sans font-normal text-[#5b4039] leading-[24px] cursor-pointer select-none"
        >
          Saya setuju dengan{' '}
          <span className="text-[#76abae] font-bold underline">Syarat & Ketentuan</span> yang
          berlaku.
        </label>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 text-[14px] font-sans bg-red-50 p-3 rounded-[8px] border border-red-100 animate-fade-in mt-1">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-deep-orange text-white h-[56px] mt-[8px] rounded-[12px] font-sans font-bold text-[16px] shadow-[0px_4px_7.5px_rgba(255,87,34,0.3)] hover:bg-deep-orange/95 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Buat Akun'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
