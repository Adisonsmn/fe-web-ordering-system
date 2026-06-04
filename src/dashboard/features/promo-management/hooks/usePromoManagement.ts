import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPromo, deletePromo, getPromoList, updatePromo } from '../api/promo.api';

export const promoKeys = {
  all: ['promo'] as const,
  list: (status?: string) => [...promoKeys.all, 'list', status] as const,
};

export const usePromoList = (status?: string) => {
  return useQuery({
    queryKey: promoKeys.list(status),
    queryFn: () => getPromoList(status),
  });
};

export const useCreatePromo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promoKeys.all });
    },
  });
};

export const useUpdatePromo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promoKeys.all });
    },
  });
};

export const useDeletePromo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promoKeys.all });
    },
  });
};
