import api from './api';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: string;
  make: string;
  model: string;
}

export interface Driver {
  id: string; // Add id for frontend compatibility
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  contact: string;
  dateOfBirth: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  nic: string;
  assignedVehicle: string | Vehicle;
  status: 'Active' | 'Inactive';
  joinDate: string;
  profileImage?: string;
  licenseInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDriverDto {
  name: string;
  email: string;
  contact: string;
  dateOfBirth: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  nic: string;
  assignedVehicle: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  profileImage?: File | string;
  licenseInfo?: File | string;
}

export interface UpdateDriverDto extends Partial<CreateDriverDto> { }

export interface DriverListResponse {
  drivers: Driver[];
  total: number;
  page: number;
  limit: number;
}

class DriverService {
  /**
   * Get all drivers with pagination and filters
   */
  async getAllDrivers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    bloodGroup?: string;
    status?: string;
    assignedVehicle?: string;
  }): Promise<DriverListResponse> {
    const response = await api.get('/drivers', { params });
    return response.data;
  }

  /**
   * Get a single driver by ID
   */
  async getDriverById(id: string): Promise<Driver> {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  }

  /**
   * Create a new driver
   */
  async createDriver(data: CreateDriverDto): Promise<Driver> {
    // Split name into firstName and lastName
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    const formData = new FormData();

    // Map frontend fields to backend fields
    formData.append('firstName', firstName);
    formData.append('lastName', lastName || firstName); // Use firstName if lastName is empty
    formData.append('email', data.email);
    formData.append('phone', data.contact);
    formData.append('nationalId', data.nic);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('bloodGroup', data.bloodGroup);
    formData.append('status', data.status === 'Active' ? 'active' : 'inactive');
    formData.append('password', 'Driver@123'); // Default password

    if (data.assignedVehicle) {
      formData.append('assignedVehicleId', data.assignedVehicle);
    }

    if (data.joinDate) {
      formData.append('joinDate', data.joinDate);
    }

    if (data.profileImage instanceof File) {
      formData.append('profileImage', data.profileImage);
    }

    if (data.licenseInfo instanceof File) {
      formData.append('licenseImage', data.licenseInfo);
    }

    const response = await api.post('/drivers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Update an existing driver
   */
  async updateDriver(id: string, data: UpdateDriverDto): Promise<Driver> {
    const formData = new FormData();

    // Map frontend fields to backend fields
    if (data.name) {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ');
      formData.append('firstName', firstName);
      formData.append('lastName', lastName || firstName); // Use firstName if lastName is empty
    }

    if (data.email) formData.append('email', data.email);
    if (data.contact) formData.append('phone', data.contact);
    if (data.nic) formData.append('nationalId', data.nic);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.bloodGroup) formData.append('bloodGroup', data.bloodGroup);
    if (data.status) formData.append('status', data.status === 'Active' ? 'active' : 'inactive');
    if (data.assignedVehicle) formData.append('assignedVehicleId', data.assignedVehicle);
    if (data.joinDate) formData.append('joinDate', data.joinDate);

    if (data.profileImage instanceof File) {
      formData.append('profileImage', data.profileImage);
    }

    if (data.licenseInfo instanceof File) {
      formData.append('licenseImage', data.licenseInfo);
    }

    const response = await api.put(`/drivers/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Delete a driver
   */
  async deleteDriver(id: string): Promise<void> {
    await api.delete(`/drivers/${id}`);
  }

  /**
   * Toggle driver status (Active/Inactive)
   */
  async toggleDriverStatus(id: string, status: 'Active' | 'Inactive'): Promise<Driver> {
    const response = await api.patch(`/drivers/${id}/status`, { status });
    return response.data;
  }

  /**
   * Upload driver profile image
   */
  async uploadProfileImage(id: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await api.post(`/drivers/${id}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Upload driver license info
   */
  async uploadLicenseInfo(id: string, file: File): Promise<{ licenseUrl: string }> {
    const formData = new FormData();
    formData.append('licenseInfo', file);

    const response = await api.post(`/drivers/${id}/license`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new DriverService();
