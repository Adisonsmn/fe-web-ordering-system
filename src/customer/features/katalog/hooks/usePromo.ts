import { useQuery } from '@tanstack/react-query';
import { getPromoList } from '../api/menu.api';

export const promoKeys = {
  all: ['promo'] as const,
  list: () => [...promoKeys.all, 'list'] as const,
};

export const usePromoList = () => {
  return useQuery({
    queryKey: promoKeys.list(),
    queryFn: getPromoList,
    staleTime: 1000 * 60 * 10, // 10 menit
  });
};
