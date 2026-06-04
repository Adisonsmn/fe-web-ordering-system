import { useRestoStore } from '@shared/stores/restoStore';
import { useQuery } from '@tanstack/react-query';
import { getRestoConfig } from '../api/splash.api';

export const restoConfigKeys = {
  all: ['restoConfig'] as const,
};

export const useRestoConfig = () => {
  const setRestoConfig = useRestoStore((state) => state.setRestoConfig);

  return useQuery({
    queryKey: restoConfigKeys.all,
    queryFn: async () => {
      const data = await getRestoConfig();
      setRestoConfig(data.isOpen, data.namaRestoran, data.alamat);
      return data;
    },
    staleTime: 1000 * 60 * 1, // 1 menit - agar perubahan status dari dashboard cepat terdeteksi
  });
};
