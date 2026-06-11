import type { ApiError } from '@customer/features/auth/hooks/useAuth';
import type { CreateRatingRequest, RatingResponse } from '@shared/types/rating.types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { submitRating } from '../api/rating.api';

export const useSubmitUlasan = () => {
  const navigate = useNavigate();

  return useMutation<RatingResponse, ApiError, CreateRatingRequest>({
    mutationFn: (payload: CreateRatingRequest) => submitRating(payload),
    onSuccess: () => {
      // Navigate to success page
      navigate('/customer/ulasan-sukses');
    },
    onError: (error: ApiError) => {
      console.error('Gagal mengirim ulasan:', error.message || error.response?.data?.message);
    },
  });
};
