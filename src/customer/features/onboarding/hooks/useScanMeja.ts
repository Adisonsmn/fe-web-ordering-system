import { useQuery } from '@tanstack/react-query';
import { scanMeja } from '../api/onboarding.api';

export const onboardingKeys = {
  all: ['onboarding'] as const,
  scan: (mejaId: string) => [...onboardingKeys.all, 'scan', mejaId] as const,
};

export const useScanMeja = (mejaId: string) => {
  return useQuery({
    queryKey: onboardingKeys.scan(mejaId),
    queryFn: () => scanMeja(mejaId),
    enabled: !!mejaId,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
