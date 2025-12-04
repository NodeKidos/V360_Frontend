import api from './api';

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalDrivers: number;
  totalAdmins: number;
  totalBookings: number;
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

export default adminService;
