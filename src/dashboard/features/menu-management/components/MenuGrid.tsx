import type { MenuResponse } from '@shared/types';
import type { FC } from 'react';
import { MenuCard } from './MenuCard';

interface MenuGridProps {
  menus: MenuResponse[];
  onEdit: (menu: MenuResponse) => void;
  onToggleAvailability: (menuId: string, isAvailable: boolean) => void;
  isTogglingId?: string | null;
}

// Loading skeleton for a menu card
const MenuCardSkeleton: FC = () => (
  <div className="bg-white rounded-[12px] border border-deep-orange/20 flex flex-col overflow-hidden animate-pulse shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
    <div className="w-full h-[192px] bg-slate-200" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mt-1" />
      <div className="h-4 bg-slate-200 rounded w-full mt-2" />
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200">
        <div className="h-4 bg-slate-200 rounded-full w-20" />
        <div className="h-6 w-10 bg-slate-200 rounded-full" />
      </div>
    </div>
  </div>
);

export const MenuGridSkeleton: FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px]">
    {Array.from({ length: 8 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
      <MenuCardSkeleton key={i} />
    ))}
  </div>
);

export const MenuGrid: FC<MenuGridProps> = ({
  menus,
  onEdit,
  onToggleAvailability,
  isTogglingId,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px]">
      {menus.map((menu) => (
        <MenuCard
          key={menu.menuId}
          menu={menu}
          onEdit={onEdit}
          onToggleAvailability={onToggleAvailability}
          isToggling={isTogglingId === menu.menuId}
        />
      ))}
    </div>
  );
};
