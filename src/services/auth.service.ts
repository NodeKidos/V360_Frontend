import api from './api';
import type {
  GenerateOtpRequest,
  GenerateOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginResponse,
  RegisterRequest,
} from '../types/auth.types';

export const authService = {
  // Generate OTP for email or phone
  generateOtp: async (data: GenerateOtpRequest): Promise<GenerateOtpResponse> => {
    const response = await api.post<GenerateOtpResponse>('/auth/generate-otp', data);
    return response.data;
  },

  // Verify OTP (for login or verification)
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', data);
    return response.data;
  },

  // Traditional email/password login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  // Register new user
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  // Resend OTP
  resendOtp: async (data: GenerateOtpRequest): Promise<GenerateOtpResponse> => {
    const response = await api.post<GenerateOtpResponse>('/auth/resend-otp', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout (clear local storage)
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  },

  // Get current user info from JWT token
  getCurrentUser: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      // Decode JWT token (simple base64 decode of payload)
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        accessLevel: decoded.accessLevel,
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  // Check if current user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin' || user?.accessLevel === 'Admin';
  },
};

export default authService;
