import { useQuery } from '@tanstack/react-query';
import { getMenuDetail, getMenuPairings } from '../api/menu-detail.api';

export const menuDetailKeys = {
  all: ['menu'] as const,
  detail: (id: string) => [...menuDetailKeys.all, 'detail', id] as const,
  pairings: (id: string) => [...menuDetailKeys.all, 'pairings', id] as const,
};

export const useMenuDetail = (menuId: string | null) => {
  return useQuery({
    queryKey: menuDetailKeys.detail(menuId || ''),
    queryFn: () => getMenuDetail(menuId!),
    enabled: !!menuId,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

export const useMenuPairings = (menuId: string | null) => {
  return useQuery({
    queryKey: menuDetailKeys.pairings(menuId || ''),
    queryFn: () => getMenuPairings(menuId!),
    enabled: !!menuId,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
