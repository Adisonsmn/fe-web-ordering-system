import { useWebSocket } from '@shared/hooks/useWebSocket';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getKanbanPesanan, selesaikanPesanan, updateStatusPesanan } from '../api/pesananAdmin.api';

export const pesananAdminKeys = {
  all: ['pesanan-admin'] as const,
  kanban: () => [...pesananAdminKeys.all, 'kanban'] as const,
};

export const useKanbanPesanan = () => {
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();

  const query = useQuery({
    queryKey: pesananAdminKeys.kanban(),
    queryFn: getKanbanPesanan,
  });

  useEffect(() => {
    // When a new order arrives
    const unsubNewOrder = subscribe('/topic/admin/pesanan-baru', () => {
      queryClient.invalidateQueries({ queryKey: pesananAdminKeys.kanban() });
    });

    // When an order status changes (if we want to refresh on other updates)
    // The exact topic depends on the backend implementation, but we can just invalidate
    // when any order status changes globally, though currently the backend publishes to /topic/pesanan/{id}
    // and not a global admin topic for status changes.
    // For now, refreshing on pesanan-baru is a good start.

    return () => {
      unsubNewOrder();
    };
  }, [queryClient, subscribe]);

  return query;
};

export const useUpdateStatusPesanan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatusPesanan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pesananAdminKeys.kanban() });
    },
  });
};

export const useSelesaikanPesanan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: selesaikanPesanan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pesananAdminKeys.kanban() });
    },
  });
};
