import { create } from "zustand";
import { authService } from "../services/auth.service";
import type { User } from "../types/auth.types";
import { OtpType, OtpPurpose } from "../types/auth.types";
import { toast } from "react-toastify";
import { useNotificationStore } from "./useNotificationStore";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  otpMode: OtpType | null;
  otpTarget: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  generateOtp: (mode: OtpType, target: string, purpose?: OtpPurpose) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  loadUserFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  otpMode: null,
  otpTarget: null,

  // Load user from localStorage on app start
  loadUserFromStorage: () => {
    const userJson = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (userJson && accessToken) {
      try {
        const user = JSON.parse(userJson);
        // Also store userRole separately for sidebar
        localStorage.setItem("userRole", user.role);
        set({ user, isLoggedIn: true, isInitialized: true });

        // Connect WebSocket for notifications
        useNotificationStore.getState().connectWebSocket(accessToken);
        useNotificationStore.getState().fetchUnreadCount();
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        set({ isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },

  // Traditional email/password login
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);

      // Store tokens and user data
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("userRole", response.user.role);

      set({
        user: response.user,
        isLoggedIn: true,
        isLoading: false
      });

      // Connect WebSocket for real-time notifications
      useNotificationStore.getState().connectWebSocket(response.accessToken);
      useNotificationStore.getState().fetchUnreadCount();

      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Generate OTP for email or phone
  generateOtp: async (mode: OtpType, target: string, purpose: OtpPurpose = OtpPurpose.LOGIN) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.generateOtp({
        type: mode,
        email: mode === OtpType.EMAIL ? target : undefined,
        phone: mode === OtpType.PHONE ? target : undefined,
        purpose,
      });

      set({
        otpMode: mode,
        otpTarget: target,
        isLoading: false
      });

      // Show OTP code in development mode
      if (response.code) {
        toast.info(`OTP sent! (Dev mode: ${response.code})`);
      } else {
        toast.success(response.message);
      }

      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Verify OTP and login
  verifyOtp: async (code: string) => {
    const { otpMode, otpTarget } = get();

    if (!otpMode || !otpTarget) {
      toast.error("No OTP session found. Please request a new OTP.");
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await authService.verifyOtp({
        type: otpMode,
        email: otpMode === OtpType.EMAIL ? otpTarget : undefined,
        phone: otpMode === OtpType.PHONE ? otpTarget : undefined,
        code,
      });

      // If this was a login OTP, we'll get tokens and user data
      if (response.accessToken && response.refreshToken && response.user) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userRole", response.user.role);

        set({
          user: response.user,
          isLoggedIn: true,
          otpMode: null,
          otpTarget: null,
          isLoading: false
        });

        toast.success("Login successful!");
      } else {
        // Just verification, no login
        set({ isLoading: false });
        toast.success(response.message);
      }

      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid OTP";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Resend OTP
  resendOtp: async () => {
    const { otpMode, otpTarget } = get();

    if (!otpMode || !otpTarget) {
      toast.error("No OTP session found.");
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await authService.resendOtp({
        type: otpMode,
        email: otpMode === OtpType.EMAIL ? otpTarget : undefined,
        phone: otpMode === OtpType.PHONE ? otpTarget : undefined,
        purpose: OtpPurpose.LOGIN,
      });

      set({ isLoading: false });

      // Show OTP code in development mode
      if (response.code) {
        toast.info(`OTP resent! (Dev mode: ${response.code})`);
      } else {
        toast.success("OTP resent successfully!");
      }

      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Register new user
  register: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);

      // Store tokens and user data
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("userRole", response.user.role);

      set({
        user: response.user,
        isLoggedIn: true,
        isLoading: false
      });

      toast.success("Registration successful!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Logout
  logout: () => {
    // Clear all localStorage items
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    // Disconnect WebSocket
    useNotificationStore.getState().disconnectWebSocket();

    // Reset all state
    set({
      user: null,
      isLoggedIn: false,
      otpMode: null,
      otpTarget: null,
      error: null,
      isLoading: false
    });

    toast.info("Logged out successfully");
  },
}));
