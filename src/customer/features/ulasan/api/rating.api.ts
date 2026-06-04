import { apiClient } from '@shared/lib/axios';
import type { CreateRatingRequest, RatingResponse } from '@shared/types/rating.types';

export const submitRating = async (payload: CreateRatingRequest): Promise<RatingResponse> => {
  const data = await apiClient.post<unknown, RatingResponse>('/rating', payload);
  return data;
};
