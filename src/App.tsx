import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProtectedRoute } from "@/components/auth/ClerkProtectedRoute";
import { ClerkAuthForm } from "@/components/auth/ClerkAuthForm";
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
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={
            <ClerkProtectedRoute requireAuth={false}>
              <LandingPage />
            </ClerkProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ClerkProtectedRoute>
              <Dashboard />
            </ClerkProtectedRoute>
          } />
          <Route path="/dashboard/risk-calculator" element={
            <ClerkProtectedRoute>
              <RiskCalculator />
            </ClerkProtectedRoute>
          } />
          <Route path="/dashboard/appointments" element={
            <ClerkProtectedRoute>
              <AppointmentBooking />
            </ClerkProtectedRoute>
          } />
          <Route path="/dashboard/daily-checkin" element={
            <ClerkProtectedRoute>
              <DailyCheckIn />
            </ClerkProtectedRoute>
          } />
          <Route path="/dashboard/consent-forms" element={
            <ClerkProtectedRoute>
              <ConsentForms />
            </ClerkProtectedRoute>
          } />
          <Route path="/dashboard/chatbot" element={
            <ClerkProtectedRoute>
              <ChatBot />
            </ClerkProtectedRoute>
          } />
          <Route path="/auth" element={<ClerkAuthForm />} />
          <Route path="/dashboard/profile" element={
            <ClerkProtectedRoute>
              <UserProfile />
            </ClerkProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
