import { create } from "zustand";

interface UserData {
  username: string;
  email: string;
  phone: string;
  password: string;
  country: string;
}

interface AuthState {
  user: UserData | null;
  isLoggedIn: boolean;
  otp?: string;
  otpMode?: "email" | "phone";
  otpTarget?: string;
  register: (data: UserData) => void;
  login: (id: string, pass: string) => boolean;
  generateOtp: (mode: "email" | "phone", target: string) => string;
  verifyOtp: (code: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("userData") || "null"),
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",

  register: (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    set({ user: data });
  },

  login: (id, pass) => {
    const u = get().user;
    if (!u) return false;
    if ((id === u.email || id === u.phone) && pass === u.password) {
      localStorage.setItem("isLoggedIn", "true");
      set({ isLoggedIn: true });
      return true;
    }
    return false;
  },

  generateOtp: (mode, target) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem("otp", otp);
    set({ otp, otpMode: mode, otpTarget: target });
    return otp;
  },

  verifyOtp: (code) => {
    const valid = code === get().otp;
    if (valid) {
      localStorage.removeItem("otp");
      set({ otp: undefined });
    }
    return valid;
  },

  logout: () => {
    localStorage.removeItem("isLoggedIn");
    set({ isLoggedIn: false });
  },
}));
