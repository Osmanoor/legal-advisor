// src/App.tsx

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import { ToastProvider } from './providers/ToastProvider';
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { usePageTracking } from './hooks/usePageTracking';
import { useAuthStore } from './stores/authStore';
import { queryClient } from './lib/Client';

// Layouts
import { AppLayout } from './components/layouts/AppLayout';
import { AdminProtectedRoute } from './routes/AdminProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import ChatPage from './pages/ChatPage';
import CorrectionPage from './pages/CorrectionPage';
import CalculatorPage from './pages/CalculatorPage';
import TemplatesPage from './pages/TemplatesPage';
import JourneyPage from './pages/JourneyPage';
import TenderMappingPage from './pages/TenderMappingPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
// import ConfirmAccountPage from './pages/ConfirmAccountPage'; // No longer a separate page
// import AdditionalInfoPage from './pages/AdditionalInfoPage'; // No longer a separate page

// Admin Pages
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import FeedbackManagementPage from './pages/admin/FeedbackManagementPage';
import ContactManagementPage from './pages/admin/ContactManagementPage';


import './styles/base.css';
import LoadingSpinner from './components/ui/loading-spinner';
import PasswordResetPage from './pages/PasswordResetPage';

function GaPageTracker() {
  usePageTracking();
  return null;
}

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <AppLayout><Outlet /></AppLayout> : <Navigate to="/login" replace />;
};

// FIX: Update the AuthRoutes guard logic to check the onboarding status
const AuthRoutes = () => {
   const { isAuthenticated, isOnboarding } = useAuthStore();
   // Redirect ONLY if authenticated AND NOT in the middle of the onboarding flow.
   return isAuthenticated && !isOnboarding ? window.location.href = '/chat' : <Outlet />;
};

function App() {
  const { isLoading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background-body">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <GaPageTracker />
            <ToastProvider />
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Authentication Routes (for logged-out users) */}
              <Route element={<AuthRoutes />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />
              </Route>
              
              {/* Protected User Dashboard Routes */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/correction" element={<CorrectionPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/journey" element={<JourneyPage />} />
                <Route path="/journey/:levelId" element={<JourneyPage />} />
                <Route path="/tender-mapping" element={<TenderMappingPage />} />
                <Route path="/settings" element={<SettingsPage />} /> 
              </Route>
              
              {/* Protected Admin Dashboard Routes */}
              <Route path="/admin" element={<AdminProtectedRoute />}>
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="feedback" element={<FeedbackManagementPage />} />
                <Route path="contacts" element={<ContactManagementPage />} />
                <Route index element={<Navigate to="analytics" replace />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;