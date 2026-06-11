import { useWebSocket } from '@shared/hooks/useWebSocket';
import type { PesananResponse, StatusPesanan } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getPesananDetail } from '../api/pesanan.api';
import { pesananKeys } from './useBuatPesanan';

interface PesananStatusWsPayload {
  pesananId: string;
  status: StatusPesanan;
  estimasiMenit: number | null;
  updatedAt: string;
}

export const usePesananStatus = (pesananId: string) => {
  const queryClient = useQueryClient();

  // Initial data dari REST dengan fallback polling
  const query = useQuery({
    queryKey: pesananKeys.detail(pesananId),
    queryFn: () => getPesananDetail(pesananId),
    enabled: !!pesananId,
    refetchInterval: 30000, // Fallback polling every 30s
  });

  // Real-time update via WebSocket
  const { subscribe } = useWebSocket();

  useEffect(() => {
    if (!pesananId) return;

    const unsubscribe = subscribe<PesananStatusWsPayload>(
      `/topic/pesanan/${pesananId}`,
      (payload) => {
        // Update React Query cache langsung
        queryClient.setQueryData<PesananResponse | undefined>(
          pesananKeys.detail(pesananId),
          (old) => {
            if (!old) return old;

            return {
              ...old,
              status: payload.status.toUpperCase() as StatusPesanan,
              estimasiMenit: payload.estimasiMenit,
            };
          },
        );
      },
    );

    return () => unsubscribe();
  }, [pesananId, queryClient, subscribe]);

  return query;
};
