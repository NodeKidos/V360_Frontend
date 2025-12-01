import { publicApi } from './api';

export interface Destination {
    id: string;
    name: string;
    description?: string;
    images?: string[];
    category?: string;
    latitude?: number;
    longitude?: number;
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
