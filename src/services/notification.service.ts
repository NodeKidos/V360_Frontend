import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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
        const response = await axios.get(`${API_URL}/notifications`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await axios.get(`${API_URL}/notifications/unread-count`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data.count;
    },

    markAsRead: async (id: string): Promise<Notification> => {
        const response = await axios.patch(
            `${API_URL}/notifications/${id}/read`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    },

    markAllAsRead: async (): Promise<void> => {
        await axios.patch(
            `${API_URL}/notifications/read-all`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/notifications/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },
};
