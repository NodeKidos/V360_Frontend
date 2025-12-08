import { publicApi } from './api';

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
};

export default hotelService;
