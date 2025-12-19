import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user, isInitialized } = useAuthStore();

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B749DB]"></div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but doesn't have the required role
    // Redirect to their appropriate dashboard based on role
    const dashboardRoute = user.role === UserRole.ADMIN || user.role === UserRole.STAFF
      ? '/admin-dashboard'
      : user.role === UserRole.DRIVER
        ? '/driver-dashboard'
        : '/user-dashboard';

    return <Navigate to={dashboardRoute} replace />;
  }

  // Authorized, render the protected component
  return <>{children}</>;
};
