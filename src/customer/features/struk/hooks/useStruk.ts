import { useQuery } from '@tanstack/react-query';
import { getStruk } from '../api/struk.api';

export const useStruk = (pesananId: string) => {
  return useQuery({
    queryKey: ['struk', pesananId],
    queryFn: () => getStruk(pesananId),
    enabled: !!pesananId,
    staleTime: 1000 * 60 * 60, // 1 hour, receipt data doesn't change
  });
};
