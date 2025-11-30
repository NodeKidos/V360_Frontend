import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { UserRole } from "../types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn || !user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but doesn't have the required role
    // Redirect to home or show unauthorized page
    return <Navigate to="/home" replace />;
  }

  // Authorized, render the protected component
  return <>{children}</>;
};
