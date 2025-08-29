import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuthStore } from "@/store/authStore";

// Route imports
import Login from "./routes/auth/Login";
import Signup from "./routes/auth/Signup";
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
import Parking from "./routes/Requests/Parking";
import Events from "./routes/Requests/Events";
import Environment from "./routes/Requests/Environment";

// Admin routes
import AdminPage from "./routes/Admin/AdminPage";

// Settings route
import Settings from "./routes/Settings";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Auth Route Component (redirect if already logged in)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  return !user ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Layout>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Booking Routes */}
        <Route path="/booking" element={
          <ProtectedRoute>
            <BookingSelect />
          </ProtectedRoute>
        } />
        <Route path="/booking/dashboard" element={
          <ProtectedRoute>
            <MeetingRoomDashboard />
          </ProtectedRoute>
        } />
        <Route path="/booking/smart-office" element={
          <ProtectedRoute>
            <SmartOfficeBooking />
          </ProtectedRoute>
        } />
        <Route path="/booking/meeting-room" element={
          <ProtectedRoute>
            <MeetingRoomBooking />
          </ProtectedRoute>
        } />
        <Route path="/booking/quick-meeting" element={
          <ProtectedRoute>
            <QuickMeetingRoom />
          </ProtectedRoute>
        } />
        <Route path="/booking/quick-office" element={
          <ProtectedRoute>
            <QuickSmartOffice />
          </ProtectedRoute>
        } />

        {/* Request Routes */}
        <Route path="/requests" element={
          <ProtectedRoute>
            <RequestStatus />
          </ProtectedRoute>
        } />
        <Route path="/requests/business-card" element={
          <ProtectedRoute>
            <BusinessCard />
          </ProtectedRoute>
        } />
        <Route path="/requests/parking" element={
          <ProtectedRoute>
            <Parking />
          </ProtectedRoute>
        } />
        <Route path="/requests/events" element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } />
        <Route path="/requests/environment" element={
          <ProtectedRoute>
            <Environment />
          </ProtectedRoute>
        } />

        {/* Settings Route */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />

        {/* Google Auth Callback */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
