import { publicApi } from './api';

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  starRating?: number;
  address?: string;
  images?: string[];
  amenities?: string[];
  priceRange?: string;
  destinationId?: string;
}

export const hotelService = {
  getAll: async (): Promise<Hotel[]> => {
    const response = await publicApi.get<Hotel[]>('/hotels');
    return response.data;
  },

  getByDestination: async (destinationId: string): Promise<Hotel[]> => {
    const response = await publicApi.get<Hotel[]>(`/hotels?destinationId=${destinationId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Hotel> => {
    const response = await publicApi.get<Hotel>(`/hotels/${id}`);
    return response.data;
  },
};
