import api from './api';

export interface Staff {
  _id: string;
  name: string;
  email: string;
  contact: string;
  gender: 'Male' | 'Female';
  nic: string;
  age: number;
  accessLevel: 'Staff' | 'Admin' | 'Manager';
  status: 'Block' | 'Unblock';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffDto {
  name: string;
  email: string;
  contact: string;
  gender: 'Male' | 'Female';
  nic: string;
  age: number;
  accessLevel: 'Staff' | 'Admin' | 'Manager';
  status: 'Block' | 'Unblock';
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {}

export interface StaffListResponse {
  staffs: Staff[];
  total: number;
  page: number;
  limit: number;
}

class StaffService {
  /**
   * Get all staff members with pagination and filters
   */
  async getAllStaff(params?: {
    page?: number;
    limit?: number;
    search?: string;
    gender?: string;
    status?: string;
    accessLevel?: string;
  }): Promise<StaffListResponse> {
    const response = await api.get('/staff', { params });

    // Map backend data to frontend format
    const backendData = response.data;

    // Handle different possible response structures
    let staffArray;
    if (backendData.data && Array.isArray(backendData.data)) {
      staffArray = backendData.data;
    } else if (backendData.staffs && Array.isArray(backendData.staffs)) {
      staffArray = backendData.staffs;
    } else if (Array.isArray(backendData)) {
      staffArray = backendData;
    } else {
      console.warn('Unexpected response structure:', backendData);
      staffArray = [];
    }

    const mappedStaffs = staffArray.map((staff: any) => ({
      _id: staff.id || staff._id,
      name: staff.firstName && staff.lastName ? `${staff.firstName} ${staff.lastName}` : staff.name || 'Unknown',
      email: staff.email,
      contact: staff.phone || staff.contact,
      gender: staff.gender,
      nic: staff.nationalId || staff.nic,
      age: staff.age,
      accessLevel: staff.accessLevel,
      status: staff.status === 'active' ? 'Unblock' : 'Block',
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    }));

    return {
      staffs: mappedStaffs,
      total: backendData.total || backendData.count || mappedStaffs.length,
      page: backendData.page || params?.page || 1,
      limit: backendData.limit || params?.limit || 10,
    };
  }

  /**
   * Get a single staff member by ID
   */
  async getStaffById(id: string): Promise<Staff> {
    const response = await api.get(`/staff/${id}`);
    const staff = response.data;

    // Map backend data to frontend format
    return {
      _id: staff.id || staff._id,
      name: staff.firstName && staff.lastName ? `${staff.firstName} ${staff.lastName}` : staff.name,
      email: staff.email,
      contact: staff.phone || staff.contact,
      gender: staff.gender,
      nic: staff.nationalId || staff.nic,
      age: staff.age,
      accessLevel: staff.accessLevel,
      status: staff.status === 'active' ? 'Unblock' : 'Block',
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }

  /**
   * Create a new staff member
   */
  async createStaff(data: CreateStaffDto): Promise<Staff> {
    // Split name into firstName and lastName
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    // Map frontend data to backend format
    const backendData = {
      firstName,
      lastName: lastName || firstName, // Use firstName if lastName is empty
      email: data.email,
      phone: data.contact,
      nationalId: data.nic,
      gender: data.gender,
      age: data.age,
      accessLevel: data.accessLevel, // Backend expects: Staff, Admin, Manager
      status: data.status === 'Unblock' ? 'active' : 'inactive',
      password: 'Staff@123', // Default password - should be changed on first login
    };

    const response = await api.post('/staff', backendData);
    return response.data;
  }

  /**
   * Update an existing staff member
   */
  async updateStaff(id: string, data: UpdateStaffDto): Promise<Staff> {
    // Map frontend data to backend format
    const backendData: any = {};

    if (data.name) {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ');
      backendData.firstName = firstName;
      backendData.lastName = lastName || firstName; // Use firstName if lastName is empty
    }

    if (data.email) backendData.email = data.email;
    if (data.contact) backendData.phone = data.contact;
    if (data.nic) backendData.nationalId = data.nic;
    if (data.gender) backendData.gender = data.gender;
    if (data.age) backendData.age = data.age;
    if (data.accessLevel) backendData.accessLevel = data.accessLevel; // Backend expects: Staff, Admin, Manager
    if (data.status) backendData.status = data.status === 'Unblock' ? 'active' : 'inactive';
    if ((data as any).password) backendData.password = (data as any).password;

    const response = await api.put(`/staff/${id}`, backendData);
    return response.data;
  }

  /**
   * Delete a staff member
   */
  async deleteStaff(id: string): Promise<void> {
    await api.delete(`/staff/${id}`);
  }

  /**
   * Toggle staff status (Block/Unblock)
   */
  async toggleStaffStatus(id: string, status: 'Block' | 'Unblock'): Promise<Staff> {
    const response = await api.patch(`/staff/${id}/status`, { status });
    return response.data;
  }

  /**
   * Get admin users (users with role='admin')
   */
  async getAdminUsers(): Promise<Staff[]> {
    try {
      // Try fetching from /users endpoint with role filter
      const response = await api.get('/users', {
        params: { role: 'admin' }
      });

      console.log('Admin users API response:', response.data);

      let users = response.data;

      // Handle different response structures
      if (users.data && Array.isArray(users.data)) {
        users = users.data;
      } else if (users.users && Array.isArray(users.users)) {
        users = users.users;
      } else if (!Array.isArray(users)) {
        console.warn('Unexpected admin users response:', users);
        return [];
      }

      // Map admin users to staff format
      return users.map((user: any) => ({
        _id: user.id || user._id,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'Unknown',
        email: user.email,
        contact: user.phone || user.contact || '',
        gender: user.gender || 'Male',
        nic: user.nationalId || user.nic || '',
        age: user.age || 0,
        accessLevel: user.accessLevel || 'Admin',
        status: user.status === 'active' ? 'Unblock' : 'Block',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      return [];
    }
  }
}

export default new StaffService();
