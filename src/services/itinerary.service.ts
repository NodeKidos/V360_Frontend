import api, { publicApi } from './api';
import type {
  Itinerary,
  CreateItineraryDto,
  UpdateItineraryDto,
  ItineraryStatus,
} from '../types/itinerary.types';

export const itineraryService = {
  // Create new itinerary (supports both authenticated and guest users)
  create: async (data: CreateItineraryDto): Promise<Itinerary> => {
    // Use publicApi if user is not logged in (guest user)
    const token = localStorage.getItem('accessToken');
    const apiInstance = token ? api : publicApi;
    const response = await apiInstance.post<Itinerary>('/itineraries', data);
    return response.data;
  },

  // Get all my itineraries
  getMyItineraries: async (): Promise<Itinerary[]> => {
    const response = await api.get<Itinerary[]>('/itineraries/my-itineraries');
    return response.data;
  },

  // Get itinerary by ID
  getById: async (id: string): Promise<Itinerary> => {
    const response = await api.get<Itinerary>(`/itineraries/${id}`);
    return response.data;
  },

  // Update itinerary (draft only)
  update: async (id: string, data: UpdateItineraryDto): Promise<Itinerary> => {
    const response = await api.put<Itinerary>(`/itineraries/${id}`, data);
    return response.data;
  },

  // Delete itinerary (draft only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/itineraries/${id}`);
  },

  // Submit itinerary for quote
  submitForQuote: async (id: string): Promise<Itinerary> => {
    const response = await api.patch<Itinerary>(`/itineraries/${id}/submit`);
    return response.data;
  },

  // Accept quote
  acceptQuote: async (id: string): Promise<Itinerary> => {
    const response = await api.patch<Itinerary>(`/itineraries/${id}/accept`);
    return response.data;
  },

  // Reject quote
  rejectQuote: async (id: string, reason?: string): Promise<Itinerary> => {
    const response = await api.patch<Itinerary>(`/itineraries/${id}/reject`, { reason });
    return response.data;
  },

  // Get all itineraries (admin) - Paginated & Searched
  getAll: async (params?: {
    status?: ItineraryStatus | string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: Itinerary[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    const response = await api.get<{ data: Itinerary[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/itineraries', { params });
    return response.data;
  },

  // Create quote (admin)
  createQuote: async (id: string, quoteData: any): Promise<Itinerary> => {
    const response = await api.post<Itinerary>(`/itineraries/${id}/quote`, quoteData);
    return response.data;
  },

  // Add negotiation message
  addNegotiation: async (id: string, type: string, message: string, proposedPrice?: number): Promise<any> => {
    const response = await api.post(`/itineraries/${id}/negotiations`, {
      type,
      message,
      proposedPrice,
    });
    return response.data;
  },

  // Get negotiations
  getNegotiations: async (id: string): Promise<any[]> => {
    const response = await api.get(`/itineraries/${id}/negotiations`);
    return response.data;
  },

  // Get issues
  getIssues: async (id: string): Promise<any[]> => {
    const response = await api.get(`/itineraries/${id}/issues`);
    return response.data;
  },

  // Status transitions (admin)
  startItinerary: async (id: string): Promise<any> => {
    const response = await api.patch(`/itineraries/${id}/start`);
    return response.data;
  },

  holdItinerary: async (id: string, reason?: string): Promise<any> => {
    const response = await api.patch(`/itineraries/${id}/hold`, { reason });
    return response.data;
  },

  resumeItinerary: async (id: string): Promise<any> => {
    const response = await api.patch(`/itineraries/${id}/resume`);
    return response.data;
  },

  completeItinerary: async (id: string): Promise<any> => {
    const response = await api.patch(`/itineraries/${id}/complete`);
    return response.data;
  },

  cancelItinerary: async (id: string, reason?: string): Promise<any> => {
    const response = await api.patch(`/itineraries/${id}/cancel`, { reason });
    return response.data;
  },

  // Assign driver to itinerary (admin)
  assignDriver: async (id: string, driverId: string): Promise<Itinerary> => {
    const response = await api.patch<Itinerary>(`/itineraries/${id}/assign-driver`, { driverId });
    return response.data;
  },

  // Unassign driver from itinerary (admin)
  unassignDriver: async (id: string): Promise<Itinerary> => {
    const response = await api.patch<Itinerary>(`/itineraries/${id}/unassign-driver`);
    return response.data;
  },

  // Update itinerary status (admin)
  updateStatus: async (id: string, status: ItineraryStatus): Promise<Itinerary> => {
    const response = await api.patch<Itinerary>(`/itineraries/${id}/status`, { status });
    return response.data;
  },

  // Reschedule a day plan (admin/staff)
  rescheduleDay: async (id: string, dayNumber: number, reason: string): Promise<Itinerary> => {
    const response = await api.patch<Itinerary>(`/itineraries/${id}/days/${dayNumber}/reschedule`, { reason });
    return response.data;
  },

  // Get itinerary progress
  getProgress: async (id: string): Promise<any[]> => {
    const response = await api.get<any[]>(`/itineraries/${id}/progress`);
    return response.data;
  },
};

export default itineraryService;
