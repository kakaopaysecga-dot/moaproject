import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Route imports
import Login from "./routes/auth/Login";
import GoogleCallback from "./routes/auth/GoogleCallback";
import Home from "./routes/Home";
import NotFound from "./pages/NotFound";

// Booking routes
import BookingSelect from "./routes/Booking/BookingSelect";
import SmartOfficeBooking from "./routes/Booking/SmartOfficeBooking";
import MeetingRoomBooking from "./routes/Booking/MeetingRoomBooking";
import MeetingRoomDashboard from "./routes/Booking/MeetingRoomDashboard";
import QuickMeetingRoom from "./routes/Booking/QuickMeetingRoom";
import QuickSmartOffice from "./routes/Booking/QuickSmartOffice";

// Request routes
import RequestStatus from "./routes/Requests/RequestStatus";
import BusinessCard from "./routes/Requests/BusinessCard";
import BusinessCardSteps from "./routes/Requests/BusinessCardSteps";
import Parking from "./routes/Requests/Parking";
import Events from "./routes/Requests/Events";
import Environment from "./routes/Requests/Environment";

// Admin routes
import AdminPage from "./routes/Admin/AdminPage";

// Settings route
import Settings from "./routes/Settings";

// Lunch Roulette route
import LunchRoulette from "./routes/LunchRoulette";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Auth Route Component (redirect if already logged in)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return !user ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      } />

      {/* Protected Routes with Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Booking Routes */}
      <Route path="/booking" element={
        <ProtectedRoute>
          <Layout>
            <BookingSelect />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/booking/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <MeetingRoomDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/booking/smart-office" element={
        <ProtectedRoute>
          <Layout>
            <SmartOfficeBooking />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/booking/meeting-room" element={
        <ProtectedRoute>
          <Layout>
            <MeetingRoomBooking />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/booking/quick-meeting" element={
        <ProtectedRoute>
          <Layout>
            <QuickMeetingRoom />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/booking/quick-office" element={
        <ProtectedRoute>
          <Layout>
            <QuickSmartOffice />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Request Routes */}
      <Route path="/requests" element={
        <ProtectedRoute>
          <Layout>
            <RequestStatus />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/requests/business-card" element={
        <ProtectedRoute>
          <Layout>
            <BusinessCardSteps />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/requests/parking" element={
        <ProtectedRoute>
          <Layout>
            <Parking />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/requests/events" element={
        <ProtectedRoute>
          <Layout>
            <Events />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/requests/environment" element={
        <ProtectedRoute>
          <Layout>
            <Environment />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Settings Route */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Lunch Roulette Route */}
      <Route path="/roulette" element={
        <ProtectedRoute>
          <Layout>
            <LunchRoulette />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <Layout>
            <AdminPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Google Auth Callback */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
