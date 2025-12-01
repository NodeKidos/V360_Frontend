import { publicApi } from './api';

export interface Excursion {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: string;
  images?: string[];
  rating?: number;
  difficulty?: string;
  destinationId?: string;
}

export const excursionService = {
  getAll: async (): Promise<Excursion[]> => {
    const response = await publicApi.get<Excursion[]>('/excursions');
    return response.data;
  },

  getByDestination: async (destinationId: string): Promise<Excursion[]> => {
    const response = await publicApi.get<Excursion[]>(`/excursions?destinationId=${destinationId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Excursion> => {
    const response = await publicApi.get<Excursion>(`/excursions/${id}`);
    return response.data;
  },
};
