// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layouts/AppLayout';
import { queryClient } from './lib/Client';
import './styles/base.css';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import CorrectionPage from './pages/CorrectionPage';
import CalculatorPage from './pages/CalculatorPage';



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/correction" element={<CorrectionPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
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

