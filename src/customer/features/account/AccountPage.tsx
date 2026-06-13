import BottomNav from '@shared/components/layout/BottomNav';
import { useAuthStore } from '@shared/stores/authStore';
import { Camera, Check, ChevronLeft, LogOut, Medal, Pencil, X } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAvatarCustomer } from './api/upload.api';
import { useLogout, useMyProfile, useUpdateProfile } from './hooks/useAccount';

/* ─── Skeleton ───────────────────────────────────────────── */
const SkeletonProfile: FC = () => (
  <div className="flex flex-col items-center gap-3 animate-pulse">
    <div className="w-[100px] h-[100px] rounded-full bg-slate-300/50" />
    <div className="h-[22px] w-[140px] bg-slate-300/50 rounded-md" />
    <div className="h-[14px] w-[180px] bg-slate-200/60 rounded-md" />
    <div className="h-[28px] w-[90px] bg-slate-200/60 rounded-full" />
  </div>
);

/* ─── Info Field Row ─────────────────────────────────────── */
interface InfoFieldProps {
  label: string;
  value: string | null | undefined;
}

const InfoField: FC<InfoFieldProps> = ({ label, value }) => (
  <div className="py-[14px] px-[20px]">
    <p className="font-sans font-semibold text-[11px] tracking-[0.8px] uppercase text-[#303841]/50 mb-[4px]">
      {label}
    </p>
    <p className="font-sans text-[15px] text-[#303841]">{value || '—'}</p>
  </div>
);

/* ─── Edit Profile Modal ─────────────────────────────────── */
interface EditProfileModalProps {
  initialName: string;
  initialPhone: string | null;
  initialAvatar: string | null;
  onClose: () => void;
  onSave: (data: { name: string; phone: string | null; avatarUrl: string | null }) => void;
  isSaving: boolean;
}

const EditProfileModal: FC<EditProfileModalProps> = ({
  initialName,
  initialPhone,
  initialAvatar,
  onClose,
  onSave,
  isSaving,
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setUploadError('Hanya file gambar yang diizinkan');
      return;
    }
    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran foto maksimal 5 MB');
      return;
    }

    setUploadError(null);
    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Nama tidak boleh kosong');
      return;
    }
    if (name.trim().length < 2) {
      setNameError('Nama minimal 2 karakter');
      return;
    }
    setNameError(null);

    let finalAvatarUrl = initialAvatar;

    if (avatarFile) {
      setIsUploading(true);
      try {
        finalAvatarUrl = await uploadAvatarCustomer(avatarFile);
      } catch {
        setUploadError('Gagal mengunggah foto. Silakan coba lagi.');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    onSave({
      name: name.trim(),
      phone: phone.trim() || null,
      avatarUrl: finalAvatarUrl,
    });
  };

  // Cleanup object URL saat unmount
  useEffect(() => {
    return () => {
      if (avatarFile && avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarFile, avatarPreview]);

  const isLoading = isUploading || isSaving;
  const initials = initialName.charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[3px]"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="w-full max-w-[390px] bg-white rounded-t-[28px] pb-[40px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-[40px] h-[4px] bg-[#303841]/20 rounded-full mx-auto mt-[14px] mb-[20px]" />

        {/* Header */}
        <div className="flex items-center justify-between px-[24px] mb-[24px]">
          <h2 className="font-serif font-bold text-[20px] text-[#303841]">Edit Profil</h2>
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#303841]/8 hover:bg-[#303841]/15 transition-colors disabled:opacity-40"
          >
            <X size={16} strokeWidth={2.5} className="text-[#303841]" />
          </button>
        </div>

        {/* Avatar upload */}
        <div className="flex flex-col items-center mb-[28px]">
          <div className="relative">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-[#f5f5f5] shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#303841] flex items-center justify-center">
                  <span className="font-serif font-bold text-[32px] text-white">{initials}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="absolute bottom-0 right-0 w-[28px] h-[28px] bg-[#FF5722] rounded-full flex items-center justify-center shadow-md hover:bg-[#FF5722]/90 transition-colors disabled:opacity-50"
            >
              <Camera size={13} strokeWidth={2.5} className="text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="mt-[10px] text-[13px] font-sans font-semibold text-[#FF5722] disabled:opacity-50"
          >
            Ganti Foto
          </button>
          {uploadError && (
            <p className="mt-[6px] text-[12px] font-sans text-red-500">{uploadError}</p>
          )}
        </div>

        {/* Form */}
        <div className="px-[24px] flex flex-col gap-[16px]">
          {/* Nama Lengkap */}
          <div>
            <label className="font-sans font-semibold text-[11px] tracking-[0.8px] uppercase text-[#303841]/50 mb-[6px] block">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              disabled={isLoading}
              placeholder="Nama lengkap kamu"
              className="w-full h-[48px] bg-[#f5f5f5] border border-[#303841]/12 rounded-[12px] px-[16px] font-sans text-[15px] text-[#303841] focus:outline-none focus:border-[#76ABAE] focus:ring-1 focus:ring-[#76ABAE] placeholder:text-[#303841]/30 disabled:opacity-60 transition-colors"
            />
            {nameError && (
              <p className="mt-[4px] text-[12px] font-sans text-red-500">{nameError}</p>
            )}
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="font-sans font-semibold text-[11px] tracking-[0.8px] uppercase text-[#303841]/50 mb-[6px] block">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              placeholder="08xxxxxxxxxx (opsional)"
              className="w-full h-[48px] bg-[#f5f5f5] border border-[#303841]/12 rounded-[12px] px-[16px] font-sans text-[15px] text-[#303841] focus:outline-none focus:border-[#76ABAE] focus:ring-1 focus:ring-[#76ABAE] placeholder:text-[#303841]/30 disabled:opacity-60 transition-colors"
            />
          </div>

          {/* Tombol Simpan */}
          <button
            type="button"
            id="edit-profile-save-btn"
            onClick={handleSave}
            disabled={isLoading}
            className="w-full h-[52px] bg-[#FF5722] text-white font-sans font-semibold text-[15px] rounded-[14px] flex items-center justify-center gap-[8px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 mt-[4px]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {isUploading ? 'Mengunggah foto...' : 'Menyimpan...'}
              </span>
            ) : (
              <>
                <Check size={16} strokeWidth={2.5} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const AccountPage: FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const { data: profile } = useMyProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect guest ke welcome page
  useEffect(() => {
    if (isGuest || (!user && !isGuest)) {
      navigate('/customer/welcome', { replace: true });
    }
  }, [isGuest, user, navigate]);

  // Pakai data dari server jika ada, fallback ke authStore
  const displayName = profile?.name ?? user?.name ?? '—';
  const displayEmail = profile?.email ?? user?.email ?? '—';
  const displayPhone = profile?.phone ?? user?.phone ?? null;
  const displayAvatar = profile?.avatarUrl ?? user?.avatarUrl ?? null;
  const displayStatus = profile?.statusMember ?? user?.statusMember ?? null;

  const handleLogoutClick = () => setShowConfirm(true);
  const handleConfirmLogout = () => {
    setShowConfirm(false);
    logout();
  };

  const handleSaveProfile = (data: {
    name: string;
    phone: string | null;
    avatarUrl: string | null;
  }) => {
    updateProfile(
      {
        name: data.name,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
      },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setSuccessMessage('Profil berhasil diperbarui');
          setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: () => {
          // Error ditangani di dalam modal (bisa dikembangkan lebih lanjut)
        },
      },
    );
  };

  // Jangan render jika guest — sudah di-redirect
  if (isGuest) return null;

  return (
    <div className="relative w-full min-h-screen bg-[#f5f5f5] font-sans pb-[100px]">
      {/* ── Top App Bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-[#f5f5f5] h-[64px] px-[20px] flex items-center gap-[12px] border-b border-[#FF5722]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center text-[#303841] active:opacity-60 transition-opacity"
          aria-label="Kembali"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="font-serif font-bold text-[22px] text-[#303841]">Profil Saya</h1>
      </header>

      {/* ── Success Toast ─────────────────────────────── */}
      {successMessage && (
        <div className="mx-[20px] mt-[12px] px-[16px] py-[12px] bg-green-50 border border-green-200 rounded-[12px] flex items-center gap-[10px]">
          <Check size={16} strokeWidth={2.5} className="text-green-600 shrink-0" />
          <p className="font-sans text-[14px] text-green-700 font-semibold">{successMessage}</p>
        </div>
      )}

      {/* ── Avatar & Info User ────────────────────────── */}
      <div className="flex flex-col items-center pt-[20px] pb-[24px] px-[20px]">
        {user === null ? (
          <SkeletonProfile />
        ) : (
          <>
            {/* Avatar with pencil edit button */}
            <div className="relative mb-[14px]">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[3px] border-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#303841] flex items-center justify-center">
                    <span className="font-serif font-bold text-[36px] text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {/* Edit badge — membuka modal edit profil */}
              <button
                type="button"
                id="account-edit-avatar-btn"
                aria-label="Edit profil"
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-[2px] right-[2px] w-[28px] h-[28px] bg-[#FF5722] rounded-full flex items-center justify-center shadow-md hover:bg-[#FF5722]/90 active:scale-95 transition-all"
              >
                <Pencil size={13} strokeWidth={2.5} className="text-white" />
              </button>
            </div>

            {/* Nama */}
            <h1 className="font-serif font-bold text-[22px] text-[#303841] leading-[28px]">
              {displayName}
            </h1>

            {/* Email */}
            <p className="font-sans text-[14px] text-[#303841]/60 mt-[2px]">{displayEmail}</p>

            {/* Badge Member */}
            {displayStatus && (
              <div className="flex items-center gap-[6px] mt-[10px] px-[14px] py-[5px] rounded-full border border-[#303841]/20 bg-white">
                <Medal size={13} strokeWidth={2} className="text-[#303841]/70" />
                <span className="font-sans font-semibold text-[12px] text-[#303841]/80 capitalize">
                  {displayStatus === 'PREMIUM' ? 'Premium' : 'Member'}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Informasi Pribadi ────────────────────────────── */}
      <div className="px-[20px]">
        <p className="font-sans font-bold text-[11px] tracking-[1.2px] uppercase text-[#303841]/50 mb-[10px]">
          Informasi Pribadi
        </p>

        <div className="bg-white rounded-[16px] shadow-[0_1px_6px_rgba(0,0,0,0.06)] overflow-hidden">
          <InfoField label="Nama Lengkap" value={displayName} />
          <div className="h-px bg-[#303841]/8 mx-[20px]" />
          <InfoField label="Nomor Telepon" value={displayPhone} />
          <div className="h-px bg-[#303841]/8 mx-[20px]" />
          <InfoField label="Email" value={displayEmail} />
        </div>
      </div>

      {/* ── Tombol Keluar ────────────────────────────────── */}
      <div className="px-[20px] mt-[24px]">
        <button
          id="account-logout-btn"
          type="button"
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="w-full h-[54px] flex items-center justify-center gap-[10px] rounded-[14px] border border-[#303841]/25 bg-white text-[#303841] font-sans font-semibold text-[15px] hover:bg-[#303841]/5 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
        >
          <LogOut size={18} strokeWidth={2} />
          {isLoggingOut ? 'Sedang keluar...' : 'Keluar'}
        </button>
      </div>

      {/* ── Versi Aplikasi ───────────────────────────────── */}
      <p className="text-center font-sans text-[12px] text-[#303841]/40 mt-[20px]">
        Versi Aplikasi 2.4.0 (Build 120)
      </p>

      {/* ── Confirm Logout Dialog ────────────────────────── */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-[390px] bg-white rounded-t-[24px] px-[24px] pt-[24px] pb-[40px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[40px] h-[4px] bg-[#303841]/20 rounded-full mx-auto mb-[24px]" />
            <h2 className="font-serif font-bold text-[20px] text-[#303841] text-center mb-[8px]">
              Yakin ingin keluar?
            </h2>
            <p className="font-sans text-[14px] text-[#303841]/60 text-center mb-[24px]">
              Kamu perlu login kembali untuk memesan.
            </p>
            <div className="flex flex-col gap-[10px]">
              <button
                id="account-confirm-logout-btn"
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="w-full h-[52px] bg-[#FF5722] text-white font-sans font-semibold text-[15px] rounded-[14px] active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                Ya, Keluar
              </button>
              <button
                id="account-cancel-logout-btn"
                type="button"
                onClick={() => setShowConfirm(false)}
                className="w-full h-[52px] border border-[#303841]/20 text-[#303841] font-sans font-semibold text-[15px] rounded-[14px] active:scale-[0.98] transition-transform"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ────────────────────────────── */}
      {showEditModal && (
        <EditProfileModal
          initialName={displayName === '—' ? '' : displayName}
          initialPhone={displayPhone}
          initialAvatar={displayAvatar}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
          isSaving={isUpdatingProfile}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default AccountPage;
