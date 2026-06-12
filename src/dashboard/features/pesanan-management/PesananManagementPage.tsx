import { Button, Input } from '@shared/components/ui';
import { Search } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from './components/KanbanBoard';
import { usePesananAdminStore } from './store/pesananAdminStore';

const PesananManagementPage: FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = usePesananAdminStore();

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-off-white p-6">
      {/* Header Area */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-serif text-[26px] font-bold text-slate-dark">Manajemen Pesanan</h1>
          <p className="text-[14px] text-slate-dark/70">Kelola pesanan pelanggan dari dapur</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Search bar untuk filter kanban */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dark/40" />
            <Input
              type="text"
              placeholder="Cari ID / No. Meja / Menu"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 h-10"
            />
          </div>

          {/* Navigation to Riwayat Pesanan */}
          <Button
            variant="primary"
            className="h-10 px-6 font-semibold"
            onClick={() => navigate('/dashboard/pesanan/riwayat')}
          >
            RIWAYAT PESANAN
          </Button>
        </div>

      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default PesananManagementPage;
