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
import { PermissionProtectedRoute } from './routes/PermissionProtectedRoute';

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
import FeedbackPage from './pages/FeedbackPage';
import PasswordResetPage from './pages/PasswordResetPage';

// Admin Pages
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import FeedbackManagementPage from './pages/admin/FeedbackManagementPage';
import ContactManagementPage from './pages/admin/ContactManagementPage';
import AdminSettingsPage from './pages/admin/SettingsPage'; 

import './styles/base.css';
import LoadingSpinner from './components/ui/loading-spinner';


function GaPageTracker() {
  usePageTracking();
  return null;
}

const AuthRoutes = () => {
   const { isAuthenticated, isOnboarding } = useAuthStore();
   return isAuthenticated && !isOnboarding ? <Navigate to="/chat" replace /> : <Outlet />;
};

// New guard specifically for routes that require authentication, like Settings.
const AuthenticatedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

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
              {/* Public & Authentication Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route element={<AuthRoutes />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />
              </Route>
              
              {/* User & Guest Dashboard Routes */}
              <Route element={<AppLayout><Outlet /></AppLayout>}>
                <Route element={<PermissionProtectedRoute permission="access_chat" />}>
                  <Route path="/chat" element={<ChatPage />} />
                </Route>
                <Route element={<PermissionProtectedRoute permission="access_search_tool" />}>
                  <Route path="/search" element={<SearchPage />} />
                </Route>
                {/* Note: Library does not have a permission yet, so it's open to all signed-in users but not guests. We'll wrap it in AuthenticatedRoute for now. */}
                 <Route element={<AuthenticatedRoute />}>
                    <Route path="/library" element={<LibraryPage />} />
                </Route>
                <Route element={<PermissionProtectedRoute permission="access_text_corrector" />}>
                  <Route path="/correction" element={<CorrectionPage />} />
                </Route>
                <Route element={<PermissionProtectedRoute permission="access_calculator" />}>
                  <Route path="/calculator" element={<CalculatorPage />} />
                </Route>
                {/* Note: Templates & Journey are currently open to authenticated users only. */}
                <Route element={<AuthenticatedRoute />}>
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/journey" element={<JourneyPage />} />
                    <Route path="/journey/:levelId" element={<JourneyPage />} />
                </Route>
                <Route element={<PermissionProtectedRoute permission="access_report_generator" />}>
                  <Route path="/tender-mapping" element={<TenderMappingPage />} />
                </Route>
                <Route element={<PermissionProtectedRoute permission="access_feedback" />}>
                  <Route path="/feedback" element={<FeedbackPage />} />
                </Route>
                
                {/* Settings page is always available but ONLY to logged-in users */}
                <Route element={<AuthenticatedRoute />}>
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Redirect from dashboard root to chat page */}
                <Route path="/dashboard" element={<Navigate to="/chat" replace />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminProtectedRoute />}>
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="feedback" element={<FeedbackManagementPage />} />
                <Route path="contacts" element={<ContactManagementPage />} />
                <Route path="settings" element={<AdminSettingsPage />} /> 
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