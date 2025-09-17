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

// Add your Clerk publishable key here - get this from your Clerk dashboard
const CLERK_PUBLISHABLE_KEY = "pk_test_your_clerk_key_here";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key - Please add your Clerk key in App.tsx");
}

const App = () => (
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

export default App;
