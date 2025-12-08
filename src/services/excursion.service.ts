import { publicApi } from './api';

export interface Excursion {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  bestTime?: string;
  category?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  difficulty?: string;
  minParticipants?: number;
  maxParticipants?: number;
  included?: string[];
  excluded?: string[];
  meetingPoint?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive?: boolean;
  destination?: {
    id: string;
    name: string;
    location?: string;
  };
  createdAt?: string;
  updatedAt?: string;
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

export default excursionService;
