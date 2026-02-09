import api from './api';

export interface Notification {
    id: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    entityType?: 'itinerary' | 'quote' | 'booking' | 'payment';
    title: string;
    message: string;
    isRead: boolean;
    relatedEntityId?: string;
    actionUrl?: string;
    createdAt: string;
}

export const notificationService = {
    getAll: async (): Promise<Notification[]> => {
        const response = await api.get<Notification[]>('/notifications');
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ count: number }>('/notifications/unread-count');
        return response.data.count;
    },

    markAsRead: async (id: string): Promise<Notification> => {
        const response = await api.patch<Notification>(`/notifications/${id}/read`, {});
        return response.data;
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch('/notifications/read-all', {});
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    },
};
