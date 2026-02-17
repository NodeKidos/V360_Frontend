import api from './api';

export interface Package {
    id: string;
    title: string;
    description: string;
    image?: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export const packageService = {
    getAll: async (onlyActive: boolean = false): Promise<Package[]> => {
        const response = await api.get(`/packages${onlyActive ? '?onlyActive=true' : ''}`);
        return response.data;
    },

    getById: async (id: string): Promise<Package> => {
        const response = await api.get(`/packages/${id}`);
        return response.data;
    },

    create: async (data: any): Promise<Package> => {
        const response = await api.post('/packages', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    update: async (id: string, data: any): Promise<Package> => {
        const response = await api.patch(`/packages/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/packages/${id}`);
    },
};
