import type { FC } from 'react';
import { AdminProfileForm } from './components/AdminProfileForm';
import { OperationalHoursForm } from './components/OperationalHoursForm';
import { RestoProfileForm } from './components/RestoProfileForm';

const PengaturanPage: FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-[26px] font-bold text-slate-dark">Pengaturan</h1>
        <p className="text-[14px] text-slate-dark/60">
          Kelola informasi restoran, status operasional, jam buka-tutup, dan akun profil Anda.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Resto Config & Operating Hours */}
        <div className="lg:col-span-2 space-y-6">
          <RestoProfileForm />
          <OperationalHoursForm />
        </div>

        {/* Right Side: Admin Profile Settings */}
        <div className="lg:col-span-1">
          <AdminProfileForm />
        </div>
      </div>
    </div>
  );
};

export default PengaturanPage;
