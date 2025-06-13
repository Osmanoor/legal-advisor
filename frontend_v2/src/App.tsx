// File: src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import { ToastProvider } from './providers/ToastProvider';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'; // Added Outlet
import { AppLayout } from './components/layouts/AppLayout'; // This is now the DashboardLayout
import { queryClient } from './lib/Client';
import { usePageTracking } from './hooks/usePageTracking';

import './styles/base.css';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import CorrectionPage from './pages/CorrectionPage';
import CalculatorPage from './pages/CalculatorPage';
import TemplatesPage from './pages/TemplatesPage';
import JourneyPage from './pages/JourneyPage';
import TenderMappingPage from './pages/TenderMappingPage';

function GaPageTracker() {
  usePageTracking();
  return null;
}

// New component for dashboard routes that use AppLayout
const DashboardRoutes = () => (
  <AppLayout>
    <Outlet /> {/* Child routes will render here */}
  </AppLayout>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <GaPageTracker />
            <ToastProvider />
            <Routes>
              <Route path="/" element={<LandingPage />} /> {/* Landing page uses its own layout */}
              
              {/* All other routes use the Dashboard Layout (AppLayout) */}
              <Route element={<DashboardRoutes />}>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/correction" element={<CorrectionPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/journey" element={<JourneyPage />} />
                <Route path="/journey/:levelId" element={<JourneyPage />} />
                <Route path="/tender-mapping" element={<TenderMappingPage />} />
                {/* Add other dashboard routes here */}
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