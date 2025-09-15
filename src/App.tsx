import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthForm } from "@/components/auth/AuthForm";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import RiskCalculator from "./components/RiskCalculator";
import AppointmentBooking from "./components/AppointmentBooking";
import DailyCheckIn from "./components/DailyCheckIn";
import ConsentForms from "./components/ConsentForms";
import PsychologyProfessionals from "./components/PsychologyProfessionals";
import UserProfile from "./components/UserProfile";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/auth" element={<AuthForm />} />
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
);

export default App;
