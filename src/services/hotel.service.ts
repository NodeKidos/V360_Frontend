import { publicApi, api } from './api';

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  address?: string;
  type?: string;
  pricePerNight?: number;
  images?: string[];
  rating?: number;
  starRating?: number;
  reviewCount?: number;
  amenities?: string[];
  roomTypes?: string[];
  bedTypes?: string[];
  dietPlans?: string[];
  totalRooms?: number;
  contactNumber?: string;
  email?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive?: boolean;
  isFlagged?: boolean;
  flagReason?: string;
  flaggedAt?: string;
  flaggedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  destination?: {
    id: string;
    name: string;
    location?: string;
  };
  createdAt?: string;
  updatedAt?: string;
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

  flagHotel: async (id: string, reason: string): Promise<Hotel> => {
    const response = await api.patch<Hotel>(`/hotels/${id}/flag`, { reason });
    return response.data;
  },

  unflagHotel: async (id: string): Promise<Hotel> => {
    const response = await api.patch<Hotel>(`/hotels/${id}/unflag`);
    return response.data;
  },
};

export default hotelService;
