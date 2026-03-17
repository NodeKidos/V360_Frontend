import api from './api';

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
  contact?: string; // Mapped from phone in backend
  profileImage?: string;
  status?: string; // 'Active' | 'Inactive'
  licenseNumber?: string;
  licenseInfo?: string; // URL to license image
  dateOfBirth?: string | Date;
  bloodGroup?: string;
  nic?: string;
  joinDate?: string | Date;
  assignedVehicle?: string | {
    registrationNumber: string;
    make: string;
    model: string;
    type?: string;
    id?: string;
  };
}

export const adminDriverService = {
  getAllDrivers: async (): Promise<{ drivers: Driver[] }> => {
    const response = await api.get('/drivers');
    console.log('📥 Drivers API response:', response.data);
    return response.data;
  },

  getDriverById: async (id: string): Promise<any> => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },

  createDriver: async (data: any): Promise<any> => {
    const formData = new FormData();
    
    // Convert object to FormData
    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null) return;
      
      if (key === 'licenseImage' && Array.isArray(data[key])) {
        data[key].forEach((file: any) => {
          formData.append('licenseImage', file);
        });
      } else if (key === 'languages' && Array.isArray(data[key])) {
        data[key].forEach((lang: string) => {
          formData.append('languages', lang);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await api.post('/drivers', formData);
    return response.data;
  },

  updateDriver: async (id: string, data: any): Promise<any> => {
    const formData = new FormData();
    
    // Convert object to FormData
    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null) return;
      
      if (key === 'licenseImage' && Array.isArray(data[key])) {
        data[key].forEach((item: any) => {
          formData.append('licenseImage', item);
        });
      } else if (key === 'languages' && Array.isArray(data[key])) {
        // Handle array of strings for languages
        data[key].forEach((lang: string) => {
          formData.append('languages', lang);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await api.put(`/drivers/${id}`, formData);
    return response.data;
  },

  deleteDriver: async (id: string): Promise<any> => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  },

  uploadLicenseImage: async (driverId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('licenseImage', file);

    const response = await api.put(`/drivers/${driverId}`, formData);
    return response.data;
  },

  uploadLicenseDocuments: async (driverId: string, files: File[]): Promise<any> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('licenseImage', file);
    });

    const response = await api.put(`/drivers/${driverId}`, formData);
    return response.data;
  },
};

export default adminService;
