import { publicApi } from './api';

export interface Destination {
    id: string;
    name: string;
    description?: string;
    location?: string;
    category?: string;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
    latitude?: number;
    longitude?: number;
    highlights?: string;
    bestTimeToVisit?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const destinationService = {
    getAll: async (): Promise<Destination[]> => {
        const response = await publicApi.get<Destination[]>('/destinations');
        return response.data;
    },

    getById: async (id: string): Promise<Destination> => {
        const response = await publicApi.get<Destination>(`/destinations/${id}`);
        return response.data;
    },
};

export default destinationService;
