import { api } from './api';

export interface ActivityLog {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    description: string;
    details: Record<string, any>;
    timestamp: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    } | null;
}

export interface ActivityLogFilters {
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
}

export interface ActivityLogResponse {
    logs: ActivityLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const activityLogService = {
    /**
     * Get all activity logs with pagination and filters
     */
    getAll: async (
        page: number = 1,
        limit: number = 50,
        filters?: ActivityLogFilters
    ): Promise<ActivityLogResponse> => {
        const params = {
            page,
            limit,
            ...filters,
        };
        const response = await api.get<ActivityLogResponse>('/admin/activity-logs', { params });
        return response.data;
    },

    /**
     * Get activity logs for a specific user
     */
    getByUser: async (userId: string, page: number = 1, limit: number = 50) => {
        const response = await api.get<ActivityLogResponse>(`/admin/activity-logs/user/${userId}`, {
            params: { page, limit },
        });
        return response.data;
    },

    /**
     * Get complete activity timeline for an itinerary
     * Returns chronological list of all actions performed on the itinerary
     */
    getByItinerary: async (itineraryId: string): Promise<ActivityLog[]> => {
        const response = await api.get<ActivityLog[]>(`/admin/activity-logs/itinerary/${itineraryId}`);
        return response.data;
    },

    /**
     * Generate activity report
     */
    getReport: async (startDate?: string, endDate?: string) => {
        const params = { startDate, endDate };
        const response = await api.get('/admin/activity-logs/report', { params });
        return response.data;
    },
};

export default activityLogService;
