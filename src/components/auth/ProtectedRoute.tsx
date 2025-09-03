import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "./AuthForm";
import { Loader2 } from "lucide-react";
import { useLocation, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If we're on the landing page and user is authenticated, redirect to dashboard
  if (location.pathname === "/" && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // For dashboard routes, require authentication
  if (requireAuth && !user) {
    return <AuthForm />;
  }

  // For landing page when not authenticated, show the landing page
  if (!requireAuth && !user) {
    return <>{children}</>;
  }

  return <>{children}</>;
}