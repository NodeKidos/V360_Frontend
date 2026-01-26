import api from './api';

export interface Reward {
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    image?: string;
    isActive: boolean;
    validUntil?: string;
}

export interface RewardStats {
    availablePoints: number;
    streakCount: number;
    todayPoints: number;
    balancePoints: number;
}

export const rewardService = {
    // Customer methods
    getAvailableRewards: async (): Promise<Reward[]> => {
        const response = await api.get<Reward[]>('/rewards');
        return response.data;
    },

    getStats: async (): Promise<RewardStats> => {
        const response = await api.get<RewardStats>('/rewards/stats');
        return response.data;
    },

    claimReward: async (id: string): Promise<any> => {
        const response = await api.post(`/rewards/claim/${id}`);
        return response.data;
    },

    // Admin methods
    getAllRewards: async (): Promise<Reward[]> => {
        const response = await api.get<Reward[]>('/admin/rewards');
        return response.data;
    },

    createReward: async (data: any): Promise<Reward> => {
        const response = await api.post<Reward>('/admin/rewards', data);
        return response.data;
    },

    updateReward: async (id: string, data: any): Promise<Reward> => {
        const response = await api.put<Reward>(`/admin/rewards/${id}`, data);
        return response.data;
    },

    deleteReward: async (id: string): Promise<void> => {
        await api.delete(`/admin/rewards/${id}`);
    },

    getAllTransactions: async (): Promise<any[]> => {
        const response = await api.get<any[]>('/admin/rewards/transactions');
        return response.data;
    },

    allocatePoints: async (data: { customerId: string; amount: number; type: string; description: string }): Promise<any> => {
        const response = await api.post('/admin/rewards/allocate-points', data);
        return response.data;
    },
};

export default rewardService;
