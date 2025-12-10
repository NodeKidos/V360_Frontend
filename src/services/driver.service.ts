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
  licenseNumber?: string;
  licenseExpiry?: string;
  languages?: string[] | string;
  experienceYears?: number;
  assignedVehicle: string | Vehicle;
  status: 'Active' | 'Inactive';
  joinDate: string;
  profileImage?: string;
  licenseInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDriverDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  nationalId?: string;
  languages?: string[];
  experienceYears?: number;
  assignedVehicleId?: string;
  status?: string;
  joinDate?: string;
  profileImage?: File | string;
  licenseImage?: File | string;
}

export interface UpdateDriverDto extends Partial<CreateDriverDto> {
  // Frontend convenience fields
  name?: string;
  contact?: string;
  nic?: string;
  assignedVehicle?: string;
  licenseInfo?: File | string;
}

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
    const formData = new FormData();

    // Required fields
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone);
    formData.append('licenseNumber', data.licenseNumber);
    formData.append('licenseExpiry', data.licenseExpiry);

    // Optional fields
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.bloodGroup) formData.append('bloodGroup', data.bloodGroup);
    if (data.nationalId) formData.append('nationalId', data.nationalId);

    // Append array items individually
    if (data.languages && data.languages.length > 0) {
      data.languages.forEach((language) => {
        formData.append('languages[]', language);
      });
    }

    if (data.experienceYears !== undefined) formData.append('experienceYears', data.experienceYears.toString());
    if (data.assignedVehicleId) formData.append('assignedVehicleId', data.assignedVehicleId);
    if (data.status) formData.append('status', data.status);
    if (data.joinDate) formData.append('joinDate', data.joinDate);

    if (data.profileImage instanceof File) {
      formData.append('profileImage', data.profileImage);
    }

    if (data.licenseImage instanceof File) {
      formData.append('licenseImage', data.licenseImage);
    }

    // Debug: Log all form data entries
    console.log('=== Creating Driver - Form Data ===');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await api.post('/drivers', formData);
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
    if (data.licenseNumber) formData.append('licenseNumber', data.licenseNumber);
    if (data.licenseExpiry) formData.append('licenseExpiry', data.licenseExpiry);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.bloodGroup) formData.append('bloodGroup', data.bloodGroup);

    // Append array items individually
    if (data.languages && data.languages.length > 0) {
      data.languages.forEach((language) => {
        formData.append('languages[]', language);
      });
    }

    if (data.experienceYears !== undefined) formData.append('experienceYears', data.experienceYears.toString());
    if (data.status) formData.append('status', data.status === 'Active' ? 'active' : 'inactive');
    if (data.assignedVehicle) formData.append('assignedVehicleId', data.assignedVehicle);
    if (data.joinDate) formData.append('joinDate', data.joinDate);

    if (data.profileImage instanceof File) {
      formData.append('profileImage', data.profileImage);
    }

    if (data.licenseInfo instanceof File) {
      formData.append('licenseImage', data.licenseInfo);
    }

    const response = await api.put(`/drivers/${id}`, formData);
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

    const response = await api.post(`/drivers/${id}/profile-image`, formData);
    return response.data;
  }

  /**
   * Upload driver license info
   */
  async uploadLicenseInfo(id: string, file: File): Promise<{ licenseUrl: string }> {
    const formData = new FormData();
    formData.append('licenseInfo', file);

    const response = await api.post(`/drivers/${id}/license`, formData);
    return response.data;
  }
}

export default new DriverService();
