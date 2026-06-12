import { useQuery } from '@tanstack/react-query';
import { getMenuPopuler } from '../api/menu.api';

export const menuPopulerKeys = {
  all: ['menuPopuler'] as const,
};

/**
 * Hook untuk mengambil menu paling populer (all-time).
 * Digunakan di WelcomePage untuk card "Sajian Spesial Hari Ini".
 * staleTime 10 menit — data menu populer tidak sering berubah.
 */
export const useMenuPopuler = () => {
  return useQuery({
    queryKey: menuPopulerKeys.all,
    queryFn: getMenuPopuler,
    staleTime: 1000 * 60 * 10, // 10 menit
    retry: 1, // Cukup 1 retry jika gagal — jangan ganggu UX WelcomePage
  });
};
