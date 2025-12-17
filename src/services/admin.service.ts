import api from './api';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalDrivers: number;
  totalAdmins: number;
  totalBookings: number;
  totalItineraries: number;
  totalHotels: number;
  totalTours: number;
  totalDestinations: number;
  totalVehicles: number;
  recentBookings: any[];
  destinations: any[];
  revenueStats?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
}

export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/admin/dashboard');
    return response.data;
  },
};

// Admin Driver Management Service
export interface Driver {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export const adminDriverService = {
  getAllDrivers: async (): Promise<{ drivers: Driver[] }> => {
    const response = await axios.get(`${API_URL}/admin/drivers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    // Backend returns array directly, wrap in drivers object for frontend compatibility
    return { drivers: Array.isArray(response.data) ? response.data : [] };
  },

  getDriverById: async (id: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/admin/drivers/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  },

  createDriver: async (data: any): Promise<any> => {
    const response = await axios.post(`${API_URL}/admin/drivers`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  },

  updateDriver: async (id: string, data: any): Promise<any> => {
    const response = await axios.put(`${API_URL}/admin/drivers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  },

  deleteDriver: async (id: string): Promise<any> => {
    const response = await axios.delete(`${API_URL}/admin/drivers/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  },
};

export default adminService;
