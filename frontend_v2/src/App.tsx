// File: src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import { ToastProvider } from './providers/ToastProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layouts/AppLayout';
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

// Helper component to call the hook within the Router context
function GaPageTracker() {
  usePageTracking(); // <-- Call the hook here
  return null; // This component renders nothing itself
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          {/* BrowserRouter MUST wrap the component using the hook */}
          <BrowserRouter>
            <GaPageTracker /> {/* Place the tracker component inside Router */}
            <ToastProvider />
            <AppLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
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
                {/* Add other routes as needed */}
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;