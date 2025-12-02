import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@/stores/authStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    // user is authenticated
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
