import { httpClient } from '@/api/httpClient';
import type { NewReview, Review } from '@/types';

export const reviewsService = {
  async getForGame(gameId: string) {
    const { data } = await httpClient.get<Review[]>(`/games/${gameId}/reviews`);
    return data;
  },

  async create(gameId: string, review: NewReview) {
    const { data } = await httpClient.post<Review>(`/games/${gameId}/reviews`, review);
    return data;
  },

  async remove(reviewId: string) {
    await httpClient.delete(`/reviews/${reviewId}`);
  },
};
