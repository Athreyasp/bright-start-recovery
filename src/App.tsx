import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from "@/contexts/ClerkAuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClerkAuthForm } from "@/components/auth/ClerkAuthForm";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import RiskCalculator from "./components/RiskCalculator";
import StressCalculator from "./components/StressCalculator";
import AppointmentBooking from "./components/AppointmentBooking";
import DailyCheckIn from "./components/DailyCheckIn";
import ConsentForms from "./components/ConsentForms";
import PsychologyProfessionals from "./components/PsychologyProfessionals";
import UserProfile from "./components/UserProfile";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get Clerk publishable key from environment or use placeholder
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

// Simple component to show setup instructions
const ClerkSetupMessage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="max-w-md text-center space-y-4">
      <h1 className="text-2xl font-bold text-primary">QuitBuddy</h1>
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-3">Setup Required</h2>
        <p className="text-sm text-muted-foreground mb-4">
          To use authentication, please add your Clerk publishable key:
        </p>
        <ol className="text-sm text-left space-y-2 text-muted-foreground">
          <li>1. Go to <a href="https://dashboard.clerk.com" target="_blank" className="text-primary underline">Clerk Dashboard</a></li>
          <li>2. Copy your publishable key</li>
          <li>3. Replace CLERK_PUBLISHABLE_KEY in App.tsx</li>
        </ol>
      </div>
    </div>
  </div>
);

const App = () => {
  // Show setup message if Clerk key is not configured
  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === "pk_test_placeholder") {
    return <ClerkSetupMessage />;
  }

  return (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute requireAuth={false}>
                <LandingPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/risk-calculator" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RiskCalculator />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/appointments" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AppointmentBooking />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/daily-checkin" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DailyCheckIn />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/stress-calculator" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StressCalculator />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/consent-forms" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ConsentForms />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/psychology-professionals" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PsychologyProfessionals />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<ClerkAuthForm />} />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserProfile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
</ClerkProvider>
  );
};

export default App;
