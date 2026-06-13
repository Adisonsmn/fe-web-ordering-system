import { apiClient } from '@shared/lib/axios';
import type { PesananResponse } from '@shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from './useDashboardStats';

export const useUpdatePesananStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pesananId,
      status,
      estimasiMenit,
    }: {
      pesananId: string;
      status: string;
      estimasiMenit?: number;
    }) =>
      apiClient.patch<unknown, PesananResponse>(`/pesanan/${pesananId}/status`, {
        status,
        estimasiMenit,
      }),
    onSuccess: () => {
      // Hanya invalidate stats dashboard — JANGAN invalidate mejaKeys
      // Status meja dikelola via WebSocket /topic/admin/meja-status
      // bukan dari event update status pesanan
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
  });
};
