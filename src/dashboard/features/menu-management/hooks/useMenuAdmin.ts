import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  createMenu,
  deleteMenu,
  getMenuListAdmin,
  patchMenuPromo,
  toggleMenuAvailability,
  updateMenu,
} from '../api/menuAdmin.api';

export const menuAdminKeys = {
  all: ['menu-admin'] as const,
  list: (params?: object) => [...menuAdminKeys.all, 'list', params] as const,
  stats: () => [...menuAdminKeys.all, 'stats'] as const,
};

export const useMenuAdminList = (params?: { category?: string; search?: string }) => {
  const query = useQuery({
    queryKey: menuAdminKeys.list(params),
    queryFn: () => getMenuListAdmin(params),
  });

  const stats = useMemo(() => {
    if (!query.data) {
      return {
        total: 0,
        tersedia: 0,
        habis: 0,
        promoAktif: 0,
      };
    }
    const menus = query.data;
    return {
      total: menus.length,
      tersedia: menus.filter((m) => m.isAvailable).length,
      habis: menus.filter((m) => !m.isAvailable).length,
      promoAktif: menus.filter((m) => m.promo !== null).length,
    };
  }, [query.data]);

  return { ...query, stats };
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuAdminKeys.all });
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuAdminKeys.all });
    },
  });
};

export const useToggleMenuAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleMenuAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuAdminKeys.all });
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuAdminKeys.all });
    },
  });
};

export const usePatchMenuPromo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchMenuPromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuAdminKeys.all });
    },
  });
};
