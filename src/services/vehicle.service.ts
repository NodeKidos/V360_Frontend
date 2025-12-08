import api from './api';

export interface Vehicle {
  id: string;
  _id?: string;
  registrationNumber: string;
  type: string;
  make: string;
  model: string;
  year?: number;
  capacity?: number;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
}

class VehicleService {
  /**
   * Get all vehicles with pagination and filters
   */
  async getAllVehicles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  }): Promise<VehicleListResponse> {
    const response = await api.get('/vehicles', { params });

    // Handle different possible response structures
    const data = response.data;
    let vehicles = [];

    if (data.data && Array.isArray(data.data)) {
      vehicles = data.data;
    } else if (data.vehicles && Array.isArray(data.vehicles)) {
      vehicles = data.vehicles;
    } else if (Array.isArray(data)) {
      vehicles = data;
    }

    // Ensure each vehicle has both id and _id for compatibility
    vehicles = vehicles.map((v: any) => ({
      ...v,
      id: v.id || v._id,
      _id: v._id || v.id,
    }));

    return {
      vehicles,
      total: data.total || data.count || vehicles.length,
      page: data.page || params?.page || 1,
      limit: data.limit || params?.limit || 10,
    };
  }

  /**
   * Get a single vehicle by ID
   */
  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await api.get(`/vehicles/${id}`);
    const vehicle = response.data;
    return {
      ...vehicle,
      id: vehicle.id || vehicle._id,
      _id: vehicle._id || vehicle.id,
    };
  }

  /**
   * Get vehicles for dropdown (simplified list)
   */
  async getVehiclesForDropdown(): Promise<Vehicle[]> {
    try {
      const response = await this.getAllVehicles({ limit: 1000 }); // Get all vehicles
      return response.vehicles;
    } catch (error) {
      console.error('Failed to fetch vehicles for dropdown:', error);
      return [];
    }
  }
}

export default new VehicleService();
