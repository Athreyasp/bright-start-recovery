import { useAuth } from "@clerk/clerk-react";
import { ClerkAuthForm } from "./ClerkAuthForm";
import { Loader2 } from "lucide-react";
import { useLocation, Navigate } from "react-router-dom";

interface ClerkProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ClerkProtectedRoute({ children, requireAuth = true }: ClerkProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
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
  if (location.pathname === "/" && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // For dashboard routes, require authentication
  if (requireAuth && !isSignedIn) {
    return <ClerkAuthForm />;
  }

  // For landing page when not authenticated, show the landing page
  if (!requireAuth && !isSignedIn) {
    return <>{children}</>;
  }

  return <>{children}</>;
}