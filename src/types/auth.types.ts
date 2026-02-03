export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  DRIVER = 'driver',
  CUSTOMER = 'customer',
  LEAD = 'lead',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum OtpType {
  EMAIL = 'email',
  PHONE = 'phone',
}

export enum OtpPurpose {
  VERIFICATION = 'verification',
  LOGIN = 'login',
  PASSWORD_RESET = 'password_reset',
}

export type User = {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type GenerateOtpRequest = {
  type: OtpType;
  email?: string;
  phone?: string;
  purpose?: OtpPurpose;
}

export type GenerateOtpResponse = {
  message: string;
  identifier: string;
  code?: string; // Only in development mode
}

export type VerifyOtpRequest = {
  type: OtpType;
  email?: string;
  phone?: string;
  code: string;
}

export type VerifyOtpResponse = {
  message: string;
  verified?: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export type RegisterRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
