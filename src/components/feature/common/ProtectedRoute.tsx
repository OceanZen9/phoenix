import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    // user is not authenticated
    return <Navigate to="/auth" />;
  }
  return <>{children}</>;
};
