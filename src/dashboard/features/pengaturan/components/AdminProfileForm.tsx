import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Spinner } from '@shared/components/ui/Spinner';
import { type FC, useEffect, useRef, useState } from 'react';
import { uploadAvatar } from '../api/upload.api';
import { useAdminProfile, useUpdateAdminProfile } from '../hooks/useAdminProfile';
import { ChangePasswordModal } from './ChangePasswordModal';

export const AdminProfileForm: FC = () => {
  const { data: profile, isLoading, isError } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatarUrl || '');
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        <Spinner />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="text-center p-6 text-red-500 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        Gagal memuat profil admin. Silakan coba lagi.
      </div>
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal adalah 2MB.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload to Supabase bucket 'avatar-images'
      const uploadedUrl = await uploadAvatar(file);
      setAvatarUrl(uploadedUrl);

      // 2. Automatically save profile with the new avatar URL
      await updateProfileMutation.mutateAsync({
        name,
        phone,
        avatarUrl: uploadedUrl,
      });
      alert('Foto profil berhasil diperbarui!');
    } catch (err: unknown) {
      console.error(err);
      const errorObject = err as { message?: string };
      alert(errorObject.message || 'Gagal mengunggah foto profil.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama tidak boleh kosong.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name,
        phone,
        avatarUrl: avatarUrl || undefined,
      });
      alert('Profil berhasil diperbarui!');
    } catch (_err) {
      alert('Gagal memperbarui profil.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
      <h3 className="font-serif text-[18px] font-semibold text-slate-dark border-b border-slate-dark/10 pb-4 mb-6">
        Profil Pengguna
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center sm:flex-row gap-6 mb-6">
          <button
            type="button"
            className="relative group cursor-pointer border-none bg-transparent p-0 outline-none rounded-full"
            onClick={handleAvatarClick}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-muted/20 bg-slate-100 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-[32px] font-bold text-slate-dark/40">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Spinner />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white text-[12px] font-semibold">
              Ganti Foto
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-semibold text-slate-dark text-[15px]">Foto Profil</h4>
            <p className="text-[13px] text-slate-dark/60">
              Format JPG, PNG, atau WebP. Maksimal 2MB.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="mt-2 text-[12px] h-[34px] px-3 rounded-lg"
            >
              Pilih Gambar
            </Button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="adminEmail" className="text-[13px] font-semibold text-slate-dark/70">
              Email (Username)
            </label>
            <Input
              id="adminEmail"
              type="email"
              value={profile.email}
              disabled
              className="bg-slate-50 cursor-not-allowed border-slate-dark/10"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adminRole" className="text-[13px] font-semibold text-slate-dark/70">
              Peran / Role
            </label>
            <Input
              id="adminRole"
              type="text"
              value={profile.role}
              disabled
              className="bg-slate-50 cursor-not-allowed border-slate-dark/10"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adminName" className="text-[13px] font-semibold text-slate-dark/70">
              Nama Lengkap
            </label>
            <Input
              id="adminName"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updateProfileMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adminPhone" className="text-[13px] font-semibold text-slate-dark/70">
              Nomor Telepon
            </label>
            <Input
              id="adminPhone"
              type="text"
              placeholder="Contoh: 08123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={updateProfileMutation.isPending}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-dark/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
            className="border-deep-orange/40 text-deep-orange hover:bg-deep-orange/5"
          >
            Ubah Kata Sandi
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={updateProfileMutation.isPending}
            className="px-8"
          >
            {updateProfileMutation.isPending ? 'Menyimpan...' : 'Simpan Profil'}
          </Button>
        </div>
      </form>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
