import { useMutation } from '@tanstack/react-query';
import { scanMeja } from '../api/onboarding.api';

export const onboardingKeys = {
  all: ['onboarding'] as const,
  scan: (mejaId: string) => [...onboardingKeys.all, 'scan', mejaId] as const,
};

/**
 * useScanMeja menggunakan useMutation agar POST ke backend selalu dipanggil
 * setiap kali WelcomePage di-render — tidak di-cache.
 * Ini krusial agar isOccupied meja ter-update dan WebSocket dashboard ter-trigger.
 */
export const useScanMeja = () => {
  return useMutation({
    mutationFn: (mejaId: string) => scanMeja(mejaId),
    retry: false,
  });
};
