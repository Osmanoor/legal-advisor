// File: src/App.tsx
// @updated
// Final update for Phase 2: Adding protected admin routes.

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

// Route Guards
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
import ConfirmAccountPage from './pages/ConfirmAccountPage';
import AdditionalInfoPage from './pages/AdditionalInfoPage';
// import PasswordResetPage from './pages/PasswordResetPage';

// Admin Pages
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import FeedbackManagementPage from './pages/admin/FeedbackManagementPage';

import './styles/base.css';

function GaPageTracker() {
  usePageTracking();
  return null;
}

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <AppLayout><Outlet /></AppLayout> : <Navigate to="/login" replace />;
};

const AuthRoutes = () => {
   const { isAuthenticated } = useAuthStore();
   return isAuthenticated ? <Navigate to="/chat" replace /> : <Outlet />;
};

function App() {
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
              
              {/* Authentication Routes */}
              <Route element={<AuthRoutes />}>
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/password-reset" element={<PasswordResetPage />} /> */}
              </Route>
              <Route path="/confirm-account" element={<ConfirmAccountPage />} />
              <Route path="/additional-info" element={<AdditionalInfoPage />} />

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
              </Route>
              
              {/* Protected Admin Dashboard Routes */}
              <Route path="/admin" element={<AdminProtectedRoute />}>
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="feedback" element={<FeedbackManagementPage />} />
                {/* Redirect /admin to /admin/analytics by default */}
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