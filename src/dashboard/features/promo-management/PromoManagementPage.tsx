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
import { usePatchMenuPromo, useMenuAdminList } from '../menu-management/hooks/useMenuAdmin';

export const PromoManagementPage: FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoResponse | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<PromoResponse | null>(null);

  const { data: promos = [], isLoading } = usePromoList(statusFilter);
  const { data: allMenus = [] } = useMenuAdminList();
  const createPromoMutation = useCreatePromo();
  const updatePromoMutation = useUpdatePromo();
  const deletePromoMutation = useDeletePromo();
  const patchMenuPromoMutation = usePatchMenuPromo();

  // Hitung KPI
  const kpiData = useMemo(() => {
    const activePromos = promos.filter((p) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Append T00:00:00 agar diparsing sebagai local time, bukan UTC midnight
      const startDate = new Date(p.tanggalMulai + 'T00:00:00');
      const endDate = new Date(p.tanggalSelesai + 'T00:00:00');
      return p.isActive && today >= startDate && today <= endDate;
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

  const handleCreateOrUpdate = (data: CreatePromoRequest, selectedMenuIds: string[]) => {
    /**
     * Tentukan menu mana yang akan di-assign promo:
     * 1. Jika ada menu spesifik dipilih → gunakan itu
     * 2. Jika tidak ada menu spesifik tapi ada targetCategory → cari semua menu di kategori itu
     * 3. Jika keduanya kosong → tidak ada menu yang di-assign (promo tanpa target spesifik)
     */
    const resolveMenuIds = (promoId: string) => {
      let menuIdsToAssign = selectedMenuIds;
      if (menuIdsToAssign.length === 0 && data.targetCategory) {
        menuIdsToAssign = allMenus
          .filter((m) => m.category === data.targetCategory)
          .map((m) => m.menuId);
      }
      menuIdsToAssign.forEach((menuId) => {
        patchMenuPromoMutation.mutate({ menuId, promoId });
      });
    };

    if (selectedPromo) {
      updatePromoMutation.mutate(
        { promoId: selectedPromo.promoId, request: data },
        {
          onSuccess: (updatedPromo) => {
            resolveMenuIds(updatedPromo.promoId);
            setIsFormModalOpen(false);
            setSelectedPromo(null);
          },
        },
      );
    } else {
      createPromoMutation.mutate(data, {
        onSuccess: (newPromo) => {
          resolveMenuIds(newPromo.promoId);
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
            Kelola Promo
          </h1>
          <p className="text-[14px] text-slate-dark/60">
            Pantau dan kelola semua promosi dan diskon aktif.
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
          label="Promo Berjalan"
          value={kpiData.activeCount}
          subValue={kpiData.activeCount > 0 ? '+ Aktif saat ini' : 'Tidak ada promo aktif'}
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
        title="Hapus Promo"
        message={`Apakah Anda yakin ingin menghapus promo "${promoToDelete?.namaPromo}" secara permanen? Promo ini akan dihapus dari database dan tidak bisa dikembalikan. Semua menu yang menggunakan promo ini juga akan kehilangan promo tersebut.`}
        confirmText="Ya, Hapus Permanen"
        isDestructive
        isLoading={deletePromoMutation.isPending}
      />
    </div>
  );
};
