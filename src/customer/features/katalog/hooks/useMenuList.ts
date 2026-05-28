import { useQuery } from '@tanstack/react-query';
import { getMenuList } from '../api/menu.api';

export const menuKeys = {
  all: ['menu'] as const,
  list: (params?: { category?: string; search?: string; available?: boolean }) =>
    [...menuKeys.all, 'list', params] as const,
};

export const useMenuList = (params?: {
  category?: string;
  search?: string;
  available?: boolean;
}) => {
  return useQuery({
    queryKey: menuKeys.list(params),
    queryFn: () => getMenuList(params),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
