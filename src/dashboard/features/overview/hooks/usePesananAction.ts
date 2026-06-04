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
      apiClient.patch<unknown, { success: boolean; data: PesananResponse }>(
        `/pesanan/${pesananId}/status`,
        { status, estimasiMenit },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.meja() });
    },
  });
};
