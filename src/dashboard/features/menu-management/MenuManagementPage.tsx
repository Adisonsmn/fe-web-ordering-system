import { ConfirmDialog, Input } from '@shared/components/ui';
import { useDebounce } from '@shared/hooks/useDebounce';
import type { MenuResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { PackageX, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { MenuFormModal } from './components/MenuFormModal';
import { MenuGrid, MenuGridSkeleton } from './components/MenuGrid';
import { MenuStatsBar } from './components/MenuStatsBar';
import { useDeleteMenu, useMenuAdminList, useToggleMenuAvailability } from './hooks/useMenuAdmin';

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Dessert'];

const MenuManagementPage = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuResponse | null>(null);
  const [deletingMenu, setDeletingMenu] = useState<MenuResponse | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const {
    data: menus,
    stats,
    isLoading,
    isError,
    refetch,
  } = useMenuAdminList({
    category: activeCategory !== 'Semua' ? activeCategory : undefined,
    search: debouncedSearch || undefined,
  });

  const { mutate: toggleAvailability } = useToggleMenuAvailability();
  const { mutate: deleteMenu, isPending: isDeleting } = useDeleteMenu();

  const handleCreate = () => {
    setEditingMenu(null);
    setIsFormOpen(true);
  };

  const handleEdit = (menu: MenuResponse) => {
    setEditingMenu(menu);
    setIsFormOpen(true);
  };

  const handleDelete = (menu: MenuResponse) => {
    setDeletingMenu(menu);
  };

  const handleConfirmDelete = () => {
    if (!deletingMenu) return;
    deleteMenu(deletingMenu.menuId, {
      onSuccess: () => {
        setDeletingMenu(null);
      },
    });
  };

  const handleToggleAvailability = (menuId: string, newValue: boolean) => {
    setTogglingId(menuId);
    toggleAvailability(
      { menuId, isAvailable: newValue },
      {
        onSettled: () => {
          setTogglingId(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-[32px] items-start max-w-[1440px] w-full">
      {/* 1. Stats Bar (Bento Grid Style) */}
      <MenuStatsBar stats={stats} />

      {/* 2. Action Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Categories */}
        <div className="flex gap-[8px] items-center overflow-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex flex-col items-center justify-center px-[25px] py-[9px] rounded-[9999px] transition-colors',
                activeCategory === cat
                  ? 'bg-deep-orange text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
                  : 'bg-white border border-deep-orange/20 text-slate-dark hover:bg-slate-50',
              )}
            >
              <span className="font-['DM_Sans'] text-[14px] leading-[20px] whitespace-nowrap">
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* Right side Actions (Search + Add) */}
        <div className="flex items-center gap-[16px]">
          {/* Search Bar - Custom addition because global search is disabled */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-dark/40 pointer-events-none"
            />
            <Input
              id="menu-search"
              placeholder="Cari menu..."
              className="pl-10 h-[44px] min-h-[44px] w-[200px] bg-white border-deep-orange/20 rounded-[12px] text-[14px] font-['DM_Sans']"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="bg-deep-orange flex gap-[8px] items-center px-[24px] py-[12px] rounded-[12px] hover:bg-deep-orange/90 transition-colors relative"
          >
            <div className="absolute inset-[0_-0.02px_0_0] rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] pointer-events-none" />
            <img
              src="/assets/afc78793c4a512305070547bfac78051bda5064a.svg"
              alt="+"
              className="w-[14px] h-[14px]"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span className="font-['DM_Sans'] text-[16px] text-white leading-[24px] whitespace-nowrap z-10">
              Tambah Item Baru
            </span>
          </button>
        </div>
      </div>

      {/* 3. Grid Menu */}
      <div className="w-full">
        {isLoading ? (
          <MenuGridSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
            <div className="w-16 h-16 rounded-full bg-deep-orange/10 flex items-center justify-center">
              <PackageX size={28} className="text-deep-orange" />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold text-slate-dark">Gagal memuat data menu</p>
              <p className="text-[13px] text-slate-dark/50 mt-1">
                Terjadi kesalahan saat mengambil data dari server.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-white border border-deep-orange/20 text-slate-dark px-4 py-2 rounded-[12px] flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Coba Lagi
            </button>
          </div>
        ) : !menus || menus.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
            <div className="w-20 h-20 rounded-full bg-slate-dark/5 flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold text-slate-dark">
                {debouncedSearch || activeCategory !== 'Semua'
                  ? 'Tidak ada menu yang cocok'
                  : 'Belum ada menu'}
              </p>
              <p className="text-[13px] text-slate-dark/50 mt-1">
                {debouncedSearch || activeCategory !== 'Semua'
                  ? 'Coba ubah filter atau kata kunci pencarian.'
                  : 'Mulai tambahkan item menu pertama Anda.'}
              </p>
            </div>
          </div>
        ) : (
          <MenuGrid
            menus={menus}
            onEdit={handleEdit}
            onToggleAvailability={handleToggleAvailability}
            isTogglingId={togglingId}
          />
        )}
      </div>

      {/* Form Modal (Create / Edit) */}
      <MenuFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        menu={editingMenu}
        onDelete={handleDelete}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deletingMenu !== null}
        onClose={() => setDeletingMenu(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Item Menu?"
        message={`Item "${deletingMenu?.menuName}" akan dihapus secara permanen dan tidak akan muncul di katalog pelanggan. Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Menu"
        cancelText="Batal"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MenuManagementPage;
