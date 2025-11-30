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
  },
};

export default authService;
