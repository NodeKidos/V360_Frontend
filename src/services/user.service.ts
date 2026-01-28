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

export interface Driver {
    id: string;
    licenseNumber: string;
    licenseExpiry: string;
    licenseImage?: string;
    dateOfBirth: string;
    bloodGroup: string;
    nationalId: string;
    // Personal Information
    gender?: string;
    address?: string;
    city?: string;
    country?: string;
    nationality?: string;
    passportNumber?: string;
    languages: string[];
    rating: number;
    totalTrips: number;
    driverStatus: string;
    currentLocation?: string;
    experienceYears: number;
    joinDate?: string;
}

export interface Admin {
    id: string;
    permissions: string[];
    isSuperAdmin: boolean;
    department?: string;
    address?: string;
    city?: string;
    country?: string;
    nationality?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
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
    // Admin relation when role is 'admin'
    admin?: Admin;
    // Driver relation when role is 'driver'
    driver?: Driver;
}

export interface UserListResponse {
    users: User[];
    total: number;
}

export interface CustomerDashboardStats {
    totalItineraries: number;
    draftItineraries: number;
    pendingQuotes: number;
    quotedItineraries: number;
    acceptedItineraries: number;
    completedItineraries: number;
    upcomingTrips: number;
    loyaltyPoints: number;
    recentItineraries: any[];
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

    /**
     * Get current user's profile
     */
    async getCurrentUser(): Promise<User> {
        const response = await api.get('/users/me');
        return response.data;
    }

    /**
     * Get customer dashboard statistics
     */
    async getCustomerDashboardStats(): Promise<CustomerDashboardStats> {
        const response = await api.get('/users/dashboard-stats');
        return response.data;
    }

    /**
     * Update current user's profile
     */
    async updateCurrentUser(userData: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        country?: string;
        city?: string;
        nationality?: string;
        passportNumber?: string;
        gender?: string;
        dateOfBirth?: string;
        address?: string;
    }): Promise<User> {
        const response = await api.put('/users/me', userData);
        return response.data;
    }

    /**
     * Get user dependencies
     */
    async getUserDependencies(id: string): Promise<{ itineraries: number; bookings: number }> {
        const response = await api.get(`/users/${id}/dependencies`);
        return response.data;
    }

    /**
     * Change password
     */
    async changePassword(data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{ message: string }> {
        const response = await api.put('/users/me/password', data);
        return response.data;
    }
}

export default new UserService();
