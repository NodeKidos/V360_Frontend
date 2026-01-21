import { publicApi, api } from './api';

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
  seasonalNote?: string;
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

  getAllAdmin: async (): Promise<Excursion[]> => {
    const response = await api.get<Excursion[]>('/excursions/admin/all');
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

  toggleVisibility: async (id: string, isActive: boolean, seasonalNote?: string): Promise<Excursion> => {
    const response = await api.patch<Excursion>(`/excursions/${id}/toggle-visibility`, {
      isActive,
      seasonalNote
    });
    return response.data;
  },

  create: async (data: FormData): Promise<Excursion> => {
    const response = await api.post<Excursion>('/excursions', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: FormData): Promise<Excursion> => {
    const response = await api.put<Excursion>(`/excursions/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/excursions/${id}`);
  },
};

export default excursionService;
