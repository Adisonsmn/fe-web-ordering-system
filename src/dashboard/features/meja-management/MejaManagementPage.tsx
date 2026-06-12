import { ConfirmDialog } from '@shared/components/ui';
import type { CreateMejaRequest, MejaResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { Plus } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { MejaCard } from './components/MejaCard';
import { MejaFormModal } from './components/MejaFormModal';
import { MejaStatsBar } from './components/MejaStatsBar';
import { QrPreviewModal } from './components/QrPreviewModal';
import {
  useCreateMeja,
  useDeleteMeja,
  useMejaAdmin,
  useUpdateMejaStatus,
} from './hooks/useMejaManagement';

const MejaManagementPage: FC = () => {
  const { data: mejaList = [], isLoading } = useMejaAdmin();
  const { mutate: createMeja, isPending: isCreating } = useCreateMeja();
  const { mutate: deleteMeja, isPending: isDeleting } = useDeleteMeja();
  const { mutate: updateStatus } = useUpdateMejaStatus();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'INDOOR' | 'OUTDOOR'>('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mejaToPreview, setMejaToPreview] = useState<MejaResponse | null>(null);
  const [mejaToDelete, setMejaToDelete] = useState<MejaResponse | null>(null);

  // Derived stats
  const stats = useMemo(() => {
    return {
      total: mejaList.length,
      terisi: mejaList.filter((m) => m.isOccupied).length,
      kosong: mejaList.filter((m) => !m.isOccupied).length,
      indoor: mejaList.filter((m) => m.zone === 'INDOOR').length,
      outdoor: mejaList.filter((m) => m.zone === 'OUTDOOR').length,
    };
  }, [mejaList]);

  // Filtered list
  const filteredMeja = useMemo(() => {
    let result = mejaList;
    if (activeFilter !== 'ALL') {
      result = result.filter((m) => m.zone === activeFilter);
    }
    // Sort by meja number
    return [...result].sort((a, b) => a.nomorMeja - b.nomorMeja);
  }, [mejaList, activeFilter]);

  // Handlers
  const handleCreate = (data: CreateMejaRequest) => {
    createMeja(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleDelete = () => {
    if (!mejaToDelete) return;
    deleteMeja(mejaToDelete.mejaId, {
      onSuccess: () => {
        setMejaToDelete(null);
      },
    });
  };

  const handleToggleStatus = (meja: MejaResponse, newStatus: boolean) => {
    updateStatus({ mejaId: meja.mejaId, isOccupied: newStatus });
  };

  return (
    <div className="flex flex-col gap-[32px] w-full max-w-[1200px] mx-auto animate-fade-in-up">
      {/* Stats Bar */}
      <MejaStatsBar stats={stats} />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-6">
        {/* Actions Header */}
        <div className="flex justify-between items-center">
          {/* Tabs Filter */}
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-dark/10">
            {(['ALL', 'INDOOR', 'OUTDOOR'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all',
                  activeFilter === filter
                    ? 'bg-white text-slate-dark shadow-sm border border-slate-dark/5'
                    : 'text-slate-dark/50 hover:text-slate-dark/80',
                )}
              >
                {filter === 'ALL' ? 'Semua' : filter === 'INDOOR' ? 'Indoor' : 'Outdoor'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="h-10 px-4 bg-teal-muted text-white rounded-lg flex items-center gap-2 text-[14px] font-semibold hover:bg-teal-muted/90 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Tambah Meja Baru
          </button>
        </div>

        {/* Grid Meja */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`skel-meja-${i}`}
                className="h-[180px] bg-slate-50 rounded-xl animate-pulse border border-slate-dark/5"
              ></div>
            ))}
          </div>
        ) : filteredMeja.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <p className="text-slate-dark/50 text-[15px] font-medium">Belum ada data meja.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMeja.map((meja) => (
              <MejaCard
                key={meja.mejaId}
                meja={meja}
                onDelete={() => setMejaToDelete(meja)}
                onPreviewQr={() => setMejaToPreview(meja)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <MejaFormModal
        isOpen={isFormOpen}
        onClose={() => !isCreating && setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      <QrPreviewModal
        isOpen={!!mejaToPreview}
        onClose={() => setMejaToPreview(null)}
        meja={mejaToPreview}
      />

      <ConfirmDialog
        isOpen={!!mejaToDelete}
        title="Hapus Meja"
        message={`Apakah Anda yakin ingin menghapus Meja ${mejaToDelete?.nomorMeja}? Aksi ini tidak dapat dibatalkan.`}
        confirmText="Hapus Meja"
        cancelText="Batal"
        onConfirm={handleDelete}
        onClose={() => !isDeleting && setMejaToDelete(null)}
        isLoading={isDeleting}
        isDestructive={true}
      />
    </div>
  );
};

export default MejaManagementPage;
