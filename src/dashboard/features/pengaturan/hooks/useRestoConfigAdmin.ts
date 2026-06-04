import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getRestoConfigAdmin,
  type UpdateRestoConfigRequest,
  updateRestoConfig,
} from '../api/config.api';

export const restoConfigAdminKeys = {
  all: ['restoConfigAdmin'] as const,
};

export const useRestoConfigAdmin = () => {
  return useQuery({
    queryKey: restoConfigAdminKeys.all,
    queryFn: getRestoConfigAdmin,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateRestoConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateRestoConfigRequest) => {
      console.log(
        '[useUpdateRestoConfig] Sending PUT /config with:',
        JSON.stringify(request, null, 2),
      );
      return updateRestoConfig(request);
    },
    onSuccess: (data) => {
      console.log('[useUpdateRestoConfig] Success:', data);
      queryClient.invalidateQueries({ queryKey: restoConfigAdminKeys.all });
      queryClient.invalidateQueries({ queryKey: ['restoConfig'] });
    },
    onError: (error: unknown) => {
      console.error('[useUpdateRestoConfig] Error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error('[useUpdateRestoConfig] Response data:', axiosError.response?.data);
        console.error('[useUpdateRestoConfig] Response status:', axiosError.response?.status);
      }
    },
  });
};
