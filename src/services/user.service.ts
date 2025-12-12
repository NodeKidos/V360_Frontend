import api from './api';

export interface Customer {
    id: string;
    country?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    nationality?: string;
    medicalNotes?: string;
    allergies?: string;
    specialConditions?: string;
    dietaryRequirements?: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    isActive: boolean;
    profileImage?: string;
    createdAt?: string;
    // Legacy fields for backwards compatibility (to be deprecated)
    contact?: string;
    country?: string;
    passportNumber?: string;
    gender?: string;
    age?: number;
    // Customer relation when role is 'customer'
    customer?: Customer;
}

export interface UserListResponse {
    users: User[];
    total: number;
}

class UserService {
    /**
     * Get all users
     */
    async getAllUsers(role?: string): Promise<User[]> {
        const params = role ? { role } : {};
        const response = await api.get('/users', { params });
        return response.data;
    }

    /**
     * Get a single user by ID
     */
    async getUserById(id: string): Promise<User> {
        const response = await api.get(`/users/${id}`);
        return response.data;
    }

    /**
     * Create a new user/customer
     */
    async createUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        passportNumber?: string;
        country?: string;
        gender?: string;
        dateOfBirth?: string;
        isActive?: boolean;
    }): Promise<User> {
        const response = await api.post('/admin/users', userData);
        return response.data;
    }

    /**
     * Update an existing user
     */
    async updateUser(id: string, userData: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        passportNumber?: string;
        country?: string;
        gender?: string;
        dateOfBirth?: string;
        isActive?: boolean;
    }): Promise<User> {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    }

    /**
     * Delete a user
     */
    async deleteUser(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    }
}

export default new UserService();
