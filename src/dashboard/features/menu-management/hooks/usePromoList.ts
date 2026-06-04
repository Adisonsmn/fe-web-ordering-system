import { useQuery } from '@tanstack/react-query';
import { getPromoListAdmin } from '../api/promoAdmin.api';

export const promoKeys = {
  all: ['promo-admin'] as const,
  list: (status?: string) => [...promoKeys.all, 'list', status] as const,
};

export const usePromoList = (status?: string) => {
  return useQuery({
    queryKey: promoKeys.list(status),
    queryFn: () => getPromoListAdmin(status),
    staleTime: 1000 * 60 * 5,
  });
};
