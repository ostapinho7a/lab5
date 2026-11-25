import { httpClient } from '@/api/httpClient';
import type { Game, NewGame } from '@/types';

export const gamesService = {
  async getAll(genre?: string) {
    const { data } = await httpClient.get<Game[]>('/games', { params: genre ? { genre } : {} });
    return data;
  },

  async getById(id: string) {
    const { data } = await httpClient.get<Game>(`/games/${id}`);
    return data;
  },

  async create(game: NewGame) {
    const { data } = await httpClient.post<Game>('/games', game);
    return data;
  },

  async setDiscount(id: string, discount: number) {
    const { data } = await httpClient.patch<Game>(`/games/${id}/discount`, { discount });
    return data;
  },

  async remove(id: string) {
    await httpClient.delete(`/games/${id}`);
  },
};
