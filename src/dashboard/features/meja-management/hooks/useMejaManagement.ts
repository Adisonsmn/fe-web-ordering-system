import { useWebSocket } from '@shared/hooks/useWebSocket';
import type { MejaResponse, MejaStatusWsPayload } from '@shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createMeja, deleteMeja, getAllMeja, updateMejaStatus } from '../api/meja.api';

export const mejaKeys = {
  all: ['meja-management'] as const,
  list: () => [...mejaKeys.all, 'list'] as const,
};

export const useMejaAdmin = () => {
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();

  const query = useQuery({
    queryKey: mejaKeys.list(),
    queryFn: getAllMeja,
  });

  useEffect(() => {
    // Subscribe to realtime status update
    const unsub = subscribe('/topic/admin/meja-status', (payload: MejaStatusWsPayload) => {
      // Optimistic update
      queryClient.setQueryData<MejaResponse[]>(mejaKeys.list(), (old) => {
        if (!old) return old;
        return old.map((m) =>
          m.mejaId === payload.mejaId ? { ...m, isOccupied: payload.isOccupied } : m,
        );
      });
      // We also might want to invalidate overview's meja list if it's currently rendered,
      // but usually React Query will handle it if the keys are aligned.
      // Wait, Overview uses ['dashboard', 'meja'], we should probably invalidate that too
      // just in case we navigate back to dashboard.
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'meja'] });
    });

    return () => {
      unsub();
    };
  }, [queryClient, subscribe]);

  return query;
};

export const useCreateMeja = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mejaKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'meja'] });
    },
  });
};

export const useDeleteMeja = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMeja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mejaKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'meja'] });
    },
  });
};

export const useUpdateMejaStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMejaStatus,
    onSuccess: () => {
      // Invalidate to make sure we have the latest data
      queryClient.invalidateQueries({ queryKey: mejaKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'meja'] });
    },
  });
};
