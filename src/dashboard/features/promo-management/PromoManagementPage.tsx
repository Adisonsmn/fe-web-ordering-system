import { Button } from '@shared/components/ui/Button';
import { ConfirmDialog } from '@shared/components/ui/ConfirmDialog';
import type { CreatePromoRequest, PromoResponse } from '@shared/types';
import { Activity, History, Plus, Wallet } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PromoFormModal, PromoKpiCard, PromoTable } from './components';
import {
  useCreatePromo,
  useDeletePromo,
  usePromoList,
  useUpdatePromo,
} from './hooks/usePromoManagement';

export const PromoManagementPage: FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoResponse | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<PromoResponse | null>(null);

  const { data: promos = [], isLoading } = usePromoList(statusFilter);
  const createPromoMutation = useCreatePromo();
  const updatePromoMutation = useUpdatePromo();
  const deletePromoMutation = useDeletePromo();

  // Hitung KPI
  const kpiData = useMemo(() => {
    const activePromos = promos.filter((p) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return p.isActive && today >= new Date(p.tanggalMulai) && today <= new Date(p.tanggalSelesai);
    }).length;

    // Untuk saat ini karena backend belum menghitung total nilai ditukar dan konversi,
    // kita gunakan data placeholder atau perhitungan sederhana dari usageCount.
    const totalUsage = promos.reduce((sum, p) => sum + (p.usageCount || 0), 0);

    // Estimasi nilai (hanya placeholder visual jika tipe diskon nominal)
    const estimasiNilai = promos
      .filter((p) => p.tipeDiskon === 'NOMINAL')
      .reduce((sum, p) => sum + p.nilaiDiskon * (p.usageCount || 0), 0);

    return {
      activeCount: activePromos,
      totalUsage,
      estimasiNilai,
    };
  }, [promos]);

  const handleCreateOrUpdate = (data: CreatePromoRequest) => {
    if (selectedPromo) {
      updatePromoMutation.mutate(
        { promoId: selectedPromo.promoId, request: data },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
            setSelectedPromo(null);
          },
        },
      );
    } else {
      createPromoMutation.mutate(data, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (promoToDelete) {
      deletePromoMutation.mutate(promoToDelete.promoId, {
        onSuccess: () => {
          setPromoToDelete(null);
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[22px] font-serif font-bold text-slate-dark mb-1">
            Kelola Penawaran
          </h1>
          <p className="text-[14px] text-slate-dark/60">
            Pantau dan kelola semua promosi, diskon, dan kampanye aktif.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/promo/riwayat')}
            className="gap-2 border-[#e4beb4] text-[#5b4039] hover:bg-[#5b4039]/5 font-semibold h-[48px] px-6 rounded-xl"
          >
            <History size={18} />
            Riwayat Promosi
          </Button>
          <Button
            onClick={() => {
              setSelectedPromo(null);
              setIsFormModalOpen(true);
            }}
            className="gap-2 bg-deep-orange hover:bg-deep-orange/90 font-semibold h-[48px] px-6 rounded-xl shadow-lg shadow-deep-orange/20"
          >
            <Plus size={18} />
            Buat Promosi Baru
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromoKpiCard
          label="Kampanye Berjalan"
          value={kpiData.activeCount}
          subValue={kpiData.activeCount > 0 ? '+ Aktif saat ini' : 'Tidak ada kampanye aktif'}
          icon={<Activity size={24} />}
          isPositive={kpiData.activeCount > 0}
        />
        <PromoKpiCard
          label="Total Penggunaan"
          value={kpiData.totalUsage}
          subValue="Kali digunakan"
          icon={<Wallet size={24} />}
          isPositive={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        {/* Filter & Search Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E4BEB4]/50">
          <div className="flex gap-2">
            {['semua', 'aktif', 'terjadwal', 'selesai'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold capitalize transition-colors ${
                  statusFilter === filter
                    ? 'bg-teal-muted text-white'
                    : 'text-slate-dark/60 hover:bg-slate-dark/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel */}
        <PromoTable
          promos={promos}
          isLoading={isLoading}
          onEdit={(promo) => {
            setSelectedPromo(promo);
            setIsFormModalOpen(true);
          }}
          onDelete={(promo) => setPromoToDelete(promo)}
        />
      </div>

      {/* Modals */}
      <PromoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedPromo(null);
        }}
        onSubmit={handleCreateOrUpdate}
        isLoading={createPromoMutation.isPending || updatePromoMutation.isPending}
        initialData={selectedPromo}
      />

      <ConfirmDialog
        isOpen={!!promoToDelete}
        onClose={() => setPromoToDelete(null)}
        onConfirm={handleDelete}
        title="Hentikan Promosi"
        message={`Apakah Anda yakin ingin menghentikan promo "${promoToDelete?.namaPromo}"? Promo ini tidak akan bisa digunakan lagi oleh pelanggan.`}
        confirmText="Ya, Hentikan"
        isDestructive
        isLoading={deletePromoMutation.isPending}
      />
    </div>
  );
};
