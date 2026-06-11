import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Modal } from '@shared/components/ui/Modal';
import { type FC, useState } from 'react';
import { useChangePassword } from '../hooks/useAdminProfile';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const changePasswordMutation = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Kata sandi baru minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword,
        newPassword,
      });
      alert('Kata sandi berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errMsg =
        axiosError?.response?.data?.message ||
        'Gagal mengubah kata sandi. Pastikan kata sandi lama benar.';
      setErrorMsg(errMsg);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ubah Kata Sandi" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="oldPassword"
            className="text-[12px] font-semibold text-slate-dark/60 block"
          >
            Kata Sandi Lama
          </label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="Masukkan kata sandi saat ini"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={changePasswordMutation.isPending}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="newPassword"
            className="text-[12px] font-semibold text-slate-dark/60 block"
          >
            Kata Sandi Baru
          </label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Minimal 8 karakter"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={changePasswordMutation.isPending}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="text-[12px] font-semibold text-slate-dark/60 block"
          >
            Konfirmasi Kata Sandi Baru
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Ulangi kata sandi baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={changePasswordMutation.isPending}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={changePasswordMutation.isPending}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
