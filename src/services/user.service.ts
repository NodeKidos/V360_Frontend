import api from './api';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    contact?: string; // Optional as it might not be in all responses or entities yet
    country?: string;
    passportNumber?: string;
    gender?: string;
    age?: number;
    profileImage?: string;
    createdAt?: string;
}

export interface UserListResponse {
    users: User[];
    total: number;
}

class UserService {
    /**
     * Get all users
     */
    async getAllUsers(): Promise<User[]> {
        const response = await api.get('/users');
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
     * Delete a user
     */
    async deleteUser(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    }
}

export default new UserService();
