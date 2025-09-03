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
import ChatBot from "./components/ChatBot";
import UserProfile from "./components/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute requireAuth={false}>
                <LandingPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/risk-calculator" element={
              <ProtectedRoute>
                <RiskCalculator />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/appointments" element={
              <ProtectedRoute>
                <AppointmentBooking />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/daily-checkin" element={
              <ProtectedRoute>
                <DailyCheckIn />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/consent-forms" element={
              <ProtectedRoute>
                <ConsentForms />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/chatbot" element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
