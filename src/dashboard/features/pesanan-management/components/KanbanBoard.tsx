import { Spinner } from '@shared/components/ui';
import type { PesananResponse } from '@shared/types';
import { type FC, useMemo, useState } from 'react';
import {
  useKanbanPesanan,
  useSelesaikanPesanan,
  useUpdateStatusPesanan,
} from '../hooks/usePesananAdmin';
import { usePesananAdminStore } from '../store/pesananAdminStore';
import EstimasiModal from './EstimasiModal';
import KanbanColumn from './KanbanColumn';
import PesananCard from './PesananCard';

const KanbanBoard: FC = () => {
  const { data: kanbanData, isLoading, isError } = useKanbanPesanan();
  const { mutate: updateStatus } = useUpdateStatusPesanan();
  const { mutate: selesaikanPesanan } = useSelesaikanPesanan();

  const searchQuery = usePesananAdminStore((state) => state.searchQuery);

  const [selectedPesananId, setSelectedPesananId] = useState<string | null>(null);
  const [selectedKodePesanan, setSelectedKodePesanan] = useState<string>('');
  const [isEstimasiModalOpen, setIsEstimasiModalOpen] = useState(false);

  // Filter functionality based on search query
  const filteredData = useMemo(() => {
    if (!kanbanData) return { newOrders: [], preparingOrders: [], readyOrders: [] };

    if (!searchQuery) return kanbanData;

    const lowerQuery = searchQuery.toLowerCase();
    const filterFn = (p: PesananResponse) =>
      p.kodePesanan.toLowerCase().includes(lowerQuery) ||
      (p.nomorMeja && String(p.nomorMeja).includes(lowerQuery));

    return {
      newOrders: kanbanData.newOrders.filter(filterFn),
      preparingOrders: kanbanData.preparingOrders.filter(filterFn),
      readyOrders: kanbanData.readyOrders.filter(filterFn),
    };
  }, [kanbanData, searchQuery]);

  const handleTerimaPesanan = (pesananId: string, kodePesanan: string) => {
    setSelectedPesananId(pesananId);
    setSelectedKodePesanan(kodePesanan);
    setIsEstimasiModalOpen(true);
  };

  const handleSubmitEstimasi = (estimasiMenit: number) => {
    if (selectedPesananId) {
      updateStatus({
        pesananId: selectedPesananId,
        status: 'PREPARING',
        estimasiMenit,
      });
      setIsEstimasiModalOpen(false);
      setSelectedPesananId(null);
    }
  };

  const handleSelesaiMemasak = (pesananId: string) => {
    updateStatus({
      pesananId,
      status: 'READY',
    });
  };

  const handleSelesaiKonfirmasi = (pesananId: string) => {
    selesaikanPesanan(pesananId);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Gagal memuat data kanban pesanan.
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full w-full gap-6 overflow-x-auto overflow-y-hidden px-1 pb-4">
        {/* NEW Orders */}
        <KanbanColumn
          title="Pesanan Baru"
          count={filteredData.newOrders.length}
          colorHex="#FF5722" // deep-orange
          bgColorClass="bg-white border-deep-orange/20"
        >
          {filteredData.newOrders.map((pesanan) => (
            <PesananCard
              key={pesanan.pesananId}
              pesanan={pesanan}
              onTerima={() => handleTerimaPesanan(pesanan.pesananId, pesanan.kodePesanan)}
            />
          ))}
        </KanbanColumn>

        {/* PREPARING Orders */}
        <KanbanColumn
          title="Sedang Diproses"
          count={filteredData.preparingOrders.length}
          colorHex="#76ABAE" // teal-muted
          bgColorClass="bg-teal-50/30 border-teal-muted/20"
        >
          {filteredData.preparingOrders.map((pesanan) => (
            <PesananCard
              key={pesanan.pesananId}
              pesanan={pesanan}
              onPerbarui={() => handleSelesaiMemasak(pesanan.pesananId)}
            />
          ))}
        </KanbanColumn>

        {/* READY Orders */}
        <KanbanColumn
          title="Siap Disajikan"
          count={filteredData.readyOrders.length}
          colorHex="#144e51" // dark teal
          bgColorClass="bg-[#144e51]/5 border-[#144e51]/20"
        >
          {filteredData.readyOrders.map((pesanan) => (
            <PesananCard
              key={pesanan.pesananId}
              pesanan={pesanan}
              onSelesai={() => handleSelesaiKonfirmasi(pesanan.pesananId)}
            />
          ))}
        </KanbanColumn>
      </div>

      <EstimasiModal
        isOpen={isEstimasiModalOpen}
        onClose={() => setIsEstimasiModalOpen(false)}
        onSubmit={handleSubmitEstimasi}
        kodePesanan={selectedKodePesanan}
      />
    </>
  );
};

export default KanbanBoard;
